import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch('https://pointers.app.n8n.cloud/webhook/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status || 200 });

    } catch (error) {
        console.error('Email proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
