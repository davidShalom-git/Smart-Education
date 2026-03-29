import { NextResponse } from 'next/server';
import { callGeminiWithParts } from '@/lib/ai21Service';

const MAX_AUDIO_BYTES = 12 * 1024 * 1024; // 12 MB

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('data0');

        if (!file || typeof file === 'string' || !file.size) {
            return NextResponse.json(
                { error: 'Audio file (data0) is required' },
                { status: 400 }
            );
        }

        if (file.size > MAX_AUDIO_BYTES) {
            return NextResponse.json(
                { error: 'Audio file is too large' },
                { status: 400 }
            );
        }

        const buf = Buffer.from(await file.arrayBuffer());
        const base64 = buf.toString('base64');
        let mimeType = file.type || 'audio/webm';
        if (!mimeType || mimeType === 'application/octet-stream') {
            mimeType = 'audio/webm';
        }

        const instruction = `You are a friendly voice assistant for an e-learning app.

Listen to the user's audio. They may not be able to type.

1) Infer what they said (if unclear, politely say you could not understand and ask them to repeat).
2) Reply in the same language they used when possible.
3) Give a concise, helpful spoken-style answer (2–6 short sentences unless they ask for detail).
4) Do not mention that you are an AI unless they ask.`;

        const text = await callGeminiWithParts(
            [
                { inlineData: { mimeType, data: base64 } },
                { text: instruction }
            ],
            false
        );

        return NextResponse.json({ text: text.trim() }, { status: 200 });
    } catch (error) {
        console.error('Speech proxy error:', error);
        return NextResponse.json(
            { text: 'Sorry, I had trouble processing your audio. Please try again.', error: error.message },
            { status: 200 }
        );
    }
}
