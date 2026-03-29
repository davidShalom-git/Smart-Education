import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/ai21Service';
import {
    extractMermaidCode,
    mermaidInkImageUrl,
    mermaidInkSvgUrl
} from '@/lib/proxyUtils';

/**
 * Browsers limit <img src> URL length; long diagrams → blank preview.
 * Fetch SVG on the server and return inline markup. Fallback to URL for tiny diagrams.
 */
async function buildChartResponse(mermaidCode) {
    const pngUrl = mermaidInkImageUrl(mermaidCode);
    const svgUrl = mermaidInkSvgUrl(mermaidCode);

    let svgInline = null;
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 30000);
        const res = await fetch(svgUrl, { signal: ctrl.signal });
        clearTimeout(timer);
        if (res.ok) {
            const text = await res.text();
            if (/<svg[\s>]/i.test(text)) {
                svgInline = text;
            }
        }
    } catch (e) {
        console.warn('[chart] mermaid.ink SVG fetch:', e.message);
    }

    return {
        success: true,
        mermaidCode,
        pngUrl,
        ...(svgInline ? { svgInline } : { imageUrl: svgUrl })
    };
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const description = String(formData.get('description') || '').trim();

        if (!description) {
            return NextResponse.json(
                { success: false, error: 'description is required' },
                { status: 400 }
            );
        }

        const prompt = `You create Mermaid flowcharts and roadmaps.

User request (step-by-step roadmap, process, or diagram):
"""
${description}
"""

Output rules:
- Return ONLY valid Mermaid diagram syntax (e.g. flowchart TD, graph LR, or similar).
- Use clear, SHORT node labels (under ~40 characters each) so the diagram renders reliably.
- Show ordered steps suitable as a "roadmap"; prefer under 25 nodes.
- Do NOT wrap in markdown code fences.
- Do NOT add commentary before or after the diagram.
- Avoid special characters inside node text that break Mermaid (use quotes for labels with punctuation if needed).`;

        const raw = await callGemini(prompt, false);
        const mermaidCode = extractMermaidCode(raw);

        const mermaidStart =
            /^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey)\b/i;
        const firstLine = mermaidCode.split('\n').find((l) => l.trim())?.trim() || '';

        if (!mermaidCode || !mermaidStart.test(firstLine)) {
            if (!mermaidCode) {
                return NextResponse.json(
                    { success: false, error: 'Empty diagram from AI' },
                    { status: 502 }
                );
            }
            if (!mermaidStart.test(firstLine)) {
                const fixed = `flowchart TD\n${mermaidCode}`;
                return NextResponse.json(await buildChartResponse(fixed));
            }
        }

        return NextResponse.json(await buildChartResponse(mermaidCode));
    } catch (error) {
        console.error('Chart proxy error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}
