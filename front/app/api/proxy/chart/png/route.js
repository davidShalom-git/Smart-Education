import { NextResponse } from 'next/server';
import { mermaidInkImageUrl } from '@/lib/proxyUtils';

/** Server-side PNG fetch so long diagram URLs are not loaded in the browser. */
export async function POST(request) {
    try {
        const body = await request.json();
        const mermaidCode = typeof body.mermaidCode === 'string' ? body.mermaidCode.trim() : '';
        if (!mermaidCode) {
            return NextResponse.json({ error: 'mermaidCode is required' }, { status: 400 });
        }

        const url = mermaidInkImageUrl(mermaidCode);
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 30000);
        const res = await fetch(url, { signal: ctrl.signal });
        clearTimeout(timer);

        if (!res.ok) {
            return NextResponse.json(
                { error: `mermaid.ink PNG failed (${res.status})` },
                { status: 502 }
            );
        }

        const buf = Buffer.from(await res.arrayBuffer());
        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'private, max-age=3600'
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || 'PNG export failed' },
            { status: 500 }
        );
    }
}
