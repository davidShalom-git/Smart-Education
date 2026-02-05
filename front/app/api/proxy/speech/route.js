import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();

        const response = await fetch('https://pointers.app.n8n.cloud/webhook/speech-to-text', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status || 200 });
    } catch (error) {
        console.error('Speech proxy error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
