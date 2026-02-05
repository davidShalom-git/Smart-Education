// AI21 Labs Service - Fixed for Node.js CommonJS
const https = require('https');

const API_KEY = process.env.AI21_API_KEY;
const BASE_URL = 'api.ai21.com';

// Available AI21 models (correct names from official docs)
const MODEL_OPTIONS = [
    'jamba-1.5-large',          // Best quality (recommended)
    'jamba-1.5-mini',           // Faster and cheaper
];

let workingModel = null;
let modelName = null;
let consecutiveFailures = 0;
const MAX_FAILURES = 3;

function resetModelSelection() {
    workingModel = null;
    modelName = null;
    consecutiveFailures = 0;
    console.log('[AI21] Model reset');
}

async function getWorkingModel() {
    if (consecutiveFailures >= MAX_FAILURES) {
        console.log('[AI21] Too many failures, resetting...');
        resetModelSelection();
    }

    if (workingModel) return workingModel;

    for (const name of MODEL_OPTIONS) {
        try {
            console.log(`[AI21] Testing: ${name}`);

            // Test the model with a simple request
            const response = await callAI21(name, 'Hi');

            if (response) {
                console.log(`[AI21] ✓ Using: ${name}`);
                workingModel = name;
                modelName = name;
                consecutiveFailures = 0;
                return name;
            }
        } catch (e) {
            const errorMsg = e.message || String(e);
            console.log(`[AI21] ✗ ${name}:`, errorMsg.substring(0, 100));

            if (errorMsg.includes('429') || errorMsg.includes('quota')) {
                console.error('[AI21] Rate limit - trying next model');
                continue;
            }
        }
    }

    console.error('[AI21] ❌ No working models');
    return null;
}

// ============================================
// AI21 API CALL FUNCTION (Using native HTTPS)
// ============================================
async function callAI21(model, prompt, options = {}) {
    return new Promise((resolve, reject) => {
        const path = `/studio/v1/chat/completions`;

        const requestBody = JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Always respond in the exact format requested. Be concise and accurate.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: options.maxTokens || 150,  // Reduced for faster responses
            temperature: options.temperature || 0.4, // Lower for more consistent results
            top_p: 0.9,  // Slightly reduced for better quality
            n: 1
        });

        const requestOptions = {
            hostname: BASE_URL,
            path: path,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`AI21 API Error ${res.statusCode}: ${data}`));
                    return;
                }

                try {
                    const parsed = JSON.parse(data);
                    const text = parsed.choices?.[0]?.message?.content || '';
                    resolve(text);
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${e.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(requestBody);
        req.end();
    });
}

// ============================================
// CACHING SYSTEM
// ============================================
const cache = new Map();
const CACHE_TTL = 1800000; // 30 minutes
const MAX_CACHE_SIZE = 500;

function getCacheKey(task, text) {
    return `${task}:${text.toLowerCase().trim().substring(0, 100)}`;
}

function getFromCache(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[AI21] Cache hit`);
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

// Clear old cache every 30 min
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            cache.delete(key);
        }
    }
}, 1800000);

// ============================================
// RATE LIMITING (Optimized)
// ============================================
let lastRequest = 0;
let requestCount = 0;
const MIN_GAP = 1000; // 1 second - AI21 has generous limits

async function rateLimit() {
    requestCount++;

    const gap = MIN_GAP * (1 + consecutiveFailures * 0.5);
    const wait = gap - (Date.now() - lastRequest);

    if (wait > 0) {
        await new Promise(r => setTimeout(r, wait));
    }
    lastRequest = Date.now();
}

// ============================================
// MAIN GENERATE FUNCTION
// ============================================
async function generate(prompt, task, useCache = true) {
    try {
        // Check cache
        if (useCache) {
            const cacheKey = getCacheKey(task, prompt);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;
        }

        await rateLimit();
        const model = await getWorkingModel();
        if (!model) {
            console.error('[AI21] No model available');
            return null;
        }

        console.log(`[AI21] ${task}...`);
        const text = await callAI21(model, prompt);
        console.log(`[AI21] ${task} ✓`);

        consecutiveFailures = 0;

        if (useCache) {
            const cacheKey = getCacheKey(task, prompt);
            saveToCache(cacheKey, text);
        }

        return text;
    } catch (e) {
        consecutiveFailures++;
        const errorMsg = e.message || String(e);
        console.error(`[AI21] ${task} FAILED:`, errorMsg.substring(0, 150));

        if (errorMsg.includes('quota') || errorMsg.includes('429')) {
            console.error('[AI21] Rate limit - resetting model');
            resetModelSelection();
        }

        return null;
    }
}

// ============================================
// JSON PARSING
// ============================================
function parseJSON(text, fallback) {
    if (!text) return fallback;

    try {
        let cleaned = text.trim();

        // Remove markdown code blocks (relaxed regex)
        cleaned = cleaned.replace(/```json/gi, '');
        cleaned = cleaned.replace(/```/g, '');
        cleaned = cleaned.trim();

        // Attempt to extract JSON object or array content
        const firstOpen = cleaned.search(/[\{\[]/);
        const lastClose = cleaned.search(/[\]\}][^\]\}]*$/);

        if (firstOpen !== -1 && lastClose !== -1) {
            cleaned = cleaned.substring(firstOpen, lastClose + 1);
        }

        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch (e) {
        console.log(`[AI21] JSON parse error: ${e.message} | Input: ${text.substring(0, 50)}...`);
        return fallback;
    }
}

// ============================================
// AI SERVICE FUNCTIONS
// ============================================
const ai21Service = {

    analyzePDF: async (pdfText) => {
        // Use generate function for consistency
        const prompt = `Analyze this course material and provide a concise summary (max 300 words).
        
        Text: "${pdfText.substring(0, 8000)}..."`;

        const result = await generate(prompt, 'summary', true);
        return result || "Unable to summarize document.";
    },

    generateAssignment: async (summary) => {
        const prompt = `Create a short assignment based on this summary.
        Return JSON format:
        {
            "title": "Assignment Title",
            "questions": ["Q1", "Q2", "Q3"]
        }
        
        Summary: "${summary.substring(0, 2000)}"`;

        const result = await generate(prompt, 'assignment', true);
        if (!result) return { title: "Error", questions: [] };

        return parseJSON(result, { title: "Error", questions: [] });
    },

    autocorrect: async (text) => {
        if (!text || text.length < 3) return [];

        const prompt = `Fix typos in: "${text}"

Return a JSON array with 2-3 corrections. No explanations.

Example format:
["the quick brown fox", "the quick fox", "a quick brown fox"]

Your JSON:`;

        const result = await generate(prompt, 'autocorrect', true);
        if (!result) return [];

        const parsed = parseJSON(result, []);

        if (Array.isArray(parsed)) {
            return parsed.filter(item => typeof item === 'string').slice(0, 3);
        }
        return [];
    },

    fixMessage: async (text) => {
        const prompt = `Improve grammar: "${text}"

Return JSON: {"fixed": "corrected text"}

Example:
Input: "me go store"
Output: {"fixed": "I'm going to the store"}

Your JSON:`;

        const result = await generate(prompt, 'fix', true);
        if (!result) return { fixed: text };

        const parsed = parseJSON(result, { fixed: text });

        return { fixed: parsed.fixed || text };
    },

    generateSuggestions: async (message) => {
        const prompt = `You are a smart reply assistant. Analyze this message (could be in ANY language) and generate 3 natural, contextual responses.

Message: "${message}"

IMPORTANT RULES:
1. Detect the language AND SCRIPT of the message.
2. If the message is in a transliterated language (e.g., Tanglish: Tamil in English script), REPLY IN THE SAME TRANSLITERATED STYLE. Do NOT use native script.
   - Input: "eppadi iruka?" (Tanglish) -> Reply: "naan nalla iruken", "neenga epdi?", "super ah iruken"
   - Input: "tum kaise ho?" (Hinglish) -> Reply: "main theek hoon", "bas badhiya", "tum sunao"
3. Keep replies short (max 8 words each).
4. Make them contextual and natural for a chat app.

Return ONLY a JSON array: ["reply1", "reply2", "reply3"]

Examples:
Message: "Want to grab lunch?"
Output: ["Sure, what time?", "Sounds good!", "Maybe tomorrow?"]

Message: "eppadi iruka?"
Output: ["naan nalla iruken", "neenga epdi?", "super ah iruken"]

Message: "tum kab aaoge?"
Output: ["bas aa raha hoon", "thodi der mein", "kal aaunga"]

Message: "Bonjour, comment ça va?"
Output: ["Très bien, merci!", "Ça va bien, et toi?", "Pas mal!"]

Your JSON:`;

        const result = await generate(prompt, 'suggestions', true);
        if (!result) return ["OK", "Thanks", "Got it"];

        const parsed = parseJSON(result, ["OK", "Thanks", "Got it"]);

        if (Array.isArray(parsed) && parsed.length >= 3) {
            return parsed.filter(item => typeof item === 'string' && item.length > 0).slice(0, 3);
        }
        return ["OK", "Thanks", "Got it"];
    },

    translateMessage: async (text, targetLang = 'English') => {
        const prompt = `Translate to ${targetLang}: "${text}"

Return ONLY the translation. No explanations or extra text.

Translation:`;

        const result = await generate(prompt, 'translate', true);

        // Clean up the response - remove any explanations
        if (result) {
            const cleaned = result.trim().split('\n')[0]; // Take only first line
            return cleaned || text;
        }
        return text;
    },

    summarizeThread: async (messages) => {
        const convo = messages.slice(-10).map(m => `${m.sender}: ${m.content}`).join('\n');
        const prompt = `Summarize this conversation in 3 short bullet points:

${convo}

Summary:`;

        const result = await generate(prompt, 'summarize', false);
        return result || 'Unable to summarize conversation.';
    },

    moderateContent: async (text) => {
        const prompt = `Is this toxic/harmful? "${text}"

Return JSON: {"isToxic": true/false, "reason": "brief explanation"}

Examples:
Input: "I hate you"
Output: {"isToxic": true, "reason": "Contains hostile language"}

Input: "Great work!"
Output: {"isToxic": false, "reason": "Positive encouragement"}

Your JSON:`;

        const result = await generate(prompt, 'moderate', true);
        if (!result) return { isToxic: false, reason: "" };

        const parsed = parseJSON(result, { isToxic: false, reason: "" });

        return {
            isToxic: parsed.isToxic === true,
            reason: parsed.reason || ""
        };
    },

    getStats: () => ({
        modelName: modelName || 'None',
        cacheSize: cache.size,
        requestCount,
        consecutiveFailures,
        isAvailable: workingModel !== null
    }),

    isAvailable: () => workingModel !== null || consecutiveFailures < MAX_FAILURES,

    clearCache: () => {
        cache.clear();
        console.log('[AI21] Cache cleared');
    },

    reset: () => {
        resetModelSelection();
        cache.clear();
        requestCount = 0;
        console.log('[AI21] Full reset');
    }
};

export default ai21Service;
