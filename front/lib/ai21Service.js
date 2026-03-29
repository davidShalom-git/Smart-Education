// Google Gemini via official SDK (replaces raw fetch + retired model IDs like gemini-2.0-flash-exp)
import { GoogleGenerativeAI } from '@google/generative-ai';

function getApiKey() {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
}

/** Tried in order until one works. Override with GEMINI_MODEL=.env first. */
function modelCandidates() {
    const fromEnv = process.env.GEMINI_MODEL?.trim();
    const defaults = [
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-2.5-flash-preview-05-20',
        'gemini-1.5-flash-8b',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
    ];
    const list = fromEnv ? [fromEnv, ...defaults] : defaults;
    return [...new Set(list)];
}

function isAuthOrKeyError(message) {
    return /API key|API_KEY|invalid|PERMISSION_DENIED|401|403/i.test(message || '');
}

async function generateWithSdk(genAI, modelName, requestPayload, jsonMode, temperature) {
    const generationConfig = {
        temperature,
        maxOutputTokens: 8192,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {})
    };
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig });
    const result = await model.generateContent(requestPayload);
    const text = result.response.text();
    if (!text || !String(text).trim()) {
        throw new Error('Empty response from Gemini');
    }
    return String(text).trim();
}

// ============================================
// GEMINI API CALL FUNCTION
// ============================================
export async function callGemini(prompt, jsonMode = false) {
    const key = getApiKey();
    if (!key) {
        throw new Error('GEMINI_API_KEY is missing in environment variables.');
    }

    const genAI = new GoogleGenerativeAI(key);
    let lastError = '';

    for (const modelName of modelCandidates()) {
        try {
            return await generateWithSdk(genAI, modelName, prompt, jsonMode, 0.4);
        } catch (e) {
            lastError = e?.message || String(e);
            if (isAuthOrKeyError(lastError)) {
                throw new Error(
                    'Gemini API key is invalid or not allowed. Create a key at https://aistudio.google.com/apikey and set GEMINI_API_KEY in .env.local (restart dev server).'
                );
            }
            console.warn(`[Gemini] model "${modelName}" failed:`, lastError);
        }
    }

    throw new Error(
        `No Gemini model responded. Last error: ${lastError}. In .env.local set GEMINI_MODEL to a name from https://ai.google.dev/gemini-api/docs/models`
    );
}

/**
 * Multimodal Gemini (e.g. audio + text). Used for speech agent.
 */
export async function callGeminiWithParts(parts, jsonMode = false) {
    const key = getApiKey();
    if (!key) {
        throw new Error('GEMINI_API_KEY is missing in environment variables.');
    }

    const genAI = new GoogleGenerativeAI(key);
    let lastError = '';

    for (const modelName of modelCandidates()) {
        try {
            return await generateWithSdk(genAI, modelName, parts, jsonMode, 0.5);
        } catch (e) {
            lastError = e?.message || String(e);
            if (isAuthOrKeyError(lastError)) {
                throw new Error(
                    'Gemini API key is invalid or not allowed. Create a key at https://aistudio.google.com/apikey and set GEMINI_API_KEY in .env.local (restart dev server).'
                );
            }
            console.warn(`[Gemini] multimodal "${modelName}" failed:`, lastError);
        }
    }

    throw new Error(`No Gemini model accepted audio. Last error: ${lastError}`);
}

// ============================================
// CACHING SYSTEM (Simple In-Memory)
// ============================================
const cache = new Map();
const CACHE_TTL = 1800000; // 30 minutes
const MAX_CACHE_SIZE = 500;

function getCacheKey(task, text) {
    return `${task}:${text.substring(0, 100)}`;
}

function getFromCache(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[Gemini] Cache hit for ${key.substring(0, 20)}...`);
        return cached.data;
    }
    if (cached) cache.delete(key);
    return null;
}

function saveToCache(key, data) {
    if (cache.size >= MAX_CACHE_SIZE) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
    cache.set(key, { data, timestamp: Date.now() });
}

// ============================================
// MAIN GENERATE FUNCTION
// ============================================
async function generate(prompt, task, jsonMode = false) {
    try {
        // Check cache
        const cacheKey = getCacheKey(task, prompt);
        const cached = getFromCache(cacheKey);
        if (cached) return cached;

        console.log(`[Gemini] Generating ${task}...`);
        const text = await callGemini(prompt, jsonMode);
        console.log(`[Gemini] ${task} ✓ Success`);

        saveToCache(cacheKey, text);
        return text;
    } catch (e) {
        console.error(`[Gemini] ${task} FAILED:`, e.message);
        return null; // Handle graceful failure
    }
}

// ============================================
// JSON PARSING HELPER
// ============================================
export function parseJSON(text, fallback) {
    if (!text) return fallback;
    try {
        let cleaned = text.trim();
        // Remove markdown formatting
        cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error(`[Gemini] JSON Parse Error:`, e.message);
        return fallback;
    }
}

// ============================================
// AI SERVICE FUNCTIONS
// ============================================
const ai21Service = {

    analyzePDF: async (pdfText) => {
        // Gemini handles large context well, so we can send more text
        const prompt = `Analyze the following document and provide a comprehensive summary (max 300 words).
        Focus on key concepts, definitions, and main takeaways.
        
        Document Content:
        "${pdfText.substring(0, 30000)}"`; // Limit to ~30k chars to be safe, but Flash can handle much more

        return await generate(prompt, 'summary', false) || "Unable to summarize document.";
    },

    generateAssignment: async (summary) => {
        const prompt = `Create a multiple-choice quiz based on the following summary.
        
        Return a JSON object with this exact schema:
        {
            "title": "Quiz Title",
            "questions": [
                "Question 1?",
                "Question 2?",
                "Question 3?",
                "Question 4?",
                "Question 5?"
            ]
        }
        
        Summary Content:
        "${summary.substring(0, 10000)}"`;

        const result = await generate(prompt, 'assignment', true);
        return parseJSON(result, { title: "Error Generating Quiz", questions: [] });
    },

    autocorrect: async (text) => {
        if (!text || text.length < 3) return [];
        const prompt = `Fix typos in: "${text}". Return ONLY a JSON array with 2-3 corrected versions. ["opt1", "opt2"]`;
        const result = await generate(prompt, 'autocorrect', true);
        return parseJSON(result, []);
    },

    fixMessage: async (text) => {
        const prompt = `Improve grammar: "${text}". Return JSON: {"fixed": "corrected text"}`;
        const result = await generate(prompt, 'fix', true);
        return parseJSON(result, { fixed: text });
    },

    generateSuggestions: async (message) => {
        const prompt = `Generate 3 natural, short chat replies to: "${message}". Detect language (e.g. Tanglish/Hinglish) and reply in same style. Return JSON array: ["reply1", "reply2", "reply3"]`;
        const result = await generate(prompt, 'suggestions', true);
        return parseJSON(result, ["OK", "Got it", "Thanks"]);
    },

    translateMessage: async (text, targetLang = 'English') => {
        const prompt = `Translate to ${targetLang}: "${text}". Return ONLY the translation text.`;
        return (await generate(prompt, 'translate', false))?.trim() || text;
    },

    summarizeThread: async (messages) => {
        const convo = messages.slice(-10).map(m => `${m.sender}: ${m.content}`).join('\n');
        const prompt = `Summarize this chat conversation in 3 bullet points:\n\n${convo}`;
        return await generate(prompt, 'summarize_thread', false) || "Unable to summarize.";
    },

    moderateContent: async (text) => {
        const prompt = `Is this toxic? "${text}". Return JSON: {"isToxic": boolean, "reason": "string"}`;
        const result = await generate(prompt, 'moderate', true);
        return parseJSON(result, { isToxic: false, reason: "" });
    },

    isAvailable: () => true // Gemini is generally highly available
};

export default ai21Service;
