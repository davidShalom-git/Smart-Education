
const https = require('https');
const { createRequire } = require('module');
require('dotenv').config({ path: '.env.local' });

// Mock the AI21 Service for testing
const API_KEY = process.env.AI21_API_KEY;

async function testAI() {
    console.log('Testing AI21 Connection...');
    console.log('API Key present:', !!API_KEY);

    if (!API_KEY) {
        console.error('No API Key found!');
        return;
    }

    const options = {
        hostname: 'api.ai21.com',
        path: '/studio/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        model: 'jamba-instruct-preview',
        messages: [
            { role: 'user', content: 'Say hello!' }
        ],
        max_tokens: 100
    });

    const req = https.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Body:', data);
        });
    });

    req.on('error', (e) => {
        console.error('Request Error:', e);
    });

    req.write(body);
    req.end();
}

testAI();
