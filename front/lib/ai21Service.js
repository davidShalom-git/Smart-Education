// Google Gemini Service (Replacing AI21)
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Model selection configuration
const MODEL = 'gemini-2.0-flash-exp'; // As requested by user
const FALLBACK_MODEL = 'gemini-1.5-flash';

// ============================================
// GEMINI API CALL FUNCTION
// ============================================
async function callGemini(prompt, jsonMode = false) {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    const url = `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`;

    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
            responseMimeType: jsonMode ? "application/json" : "text/plain"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();

            // If 2.0-flash fails (e.g. 404 not found or 400), try fallback to 1.5-flash
            if (response.status === 404 || response.status === 400) {
                console.warn(`[Gemini] ${MODEL} failed (${response.status}), trying fallback: ${FALLBACK_MODEL}`);
                return await callGeminiFallback(prompt, jsonMode);
            }

            throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        return text;
    } catch (error) {
        console.error("[Gemini] API Call Failed:", error.message);
        throw error;
    }
}

async function callGeminiFallback(prompt, jsonMode = false) {
    const url = `${BASE_URL}/${FALLBACK_MODEL}:generateContent?key=${API_KEY}`;
    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
            responseMimeType: jsonMode ? "application/json" : "text/plain"
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini Fallback API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
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
function parseJSON(text, fallback) {
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
