import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();

        // Note: Quiz webhook uses the standard webhook path
        const response = await fetch('https://pointers.app.n8n.cloud/webhook/quiz', {
            method: 'POST',
            body: formData,
        });

        const responseText = await response.text();
        console.log('N8N Response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse N8N response:', e);
            throw new Error(`Invalid response from AI: ${responseText.substring(0, 100)}`);
        }

        return NextResponse.json(data, { status: response.status || 200 });
    } catch (error) {
        console.error('Quiz proxy error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
