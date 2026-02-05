import { NextResponse } from 'next/server';
import ai21Service from '@/lib/ai21Service';

export async function POST(req) {
    try {
        const { fileUrl, text, type } = await req.json();

        let contentToAnalyze = text || "";

        if (fileUrl && !text) {
            try {
                console.log(`Fetching PDF from: ${fileUrl}`);
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

                const contentType = response.headers.get('content-type');
                console.log(`Content-Type: ${contentType}`);

                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                console.log(`Buffer size: ${buffer.length}`);

                // Dynamic import to avoid build-time DOMMatrix error
                const pdfParse = (await import('pdf-parse')).default;
                const data = await pdfParse(buffer);
                contentToAnalyze = data.text;
            } catch (error) {
                console.error("PDF Parse Error Details:", error);
                return NextResponse.json({ error: `Failed to parse PDF: ${error.message}` }, { status: 500 });
            }
        }

        if (!contentToAnalyze) {
            return NextResponse.json({ error: "No content provided" }, { status: 400 });
        }

        if (type === 'summary') {
            const summary = await ai21Service.analyzePDF(contentToAnalyze);
            return NextResponse.json({ summary });
        } else if (type === 'assignment') {
            // If passed raw text, summarize first then assign, or if passed summary use it.
            // Assuming we pass summary if available, otherwise analyze first.
            let summary = text;
            if (contentToAnalyze.length > 5000) {
                summary = await ai21Service.analyzePDF(contentToAnalyze);
            }
            const assignment = await ai21Service.generateAssignment(summary);
            return NextResponse.json({ assignment });
        } else {
            // Generic/Custom Prompt Handling
            // If text is provided, we use it as context.
            // We can pass a specific prompt via 'prompt' field in body if we want, or derive it from type.
            const { prompt } = await req.json().catch(() => ({}));

            let aiPrompt = "";

            if (type === 'email') {
                aiPrompt = `You are a professional email assistant. Draft a polite and professional email response to the following: "${text || prompt}"`;
            } else if (type === 'chat') {
                aiPrompt = `You are a helpful AI assistant. Respond to this message: "${text || prompt}"`;
            } else if (type === 'chart') {
                aiPrompt = `Generate a Mermaid.js chart definition for the following description. Return ONLY the Mermaid code (e.g. graph TD...). Do not include markdown code blocks. Description: "${text || prompt}"`;
            } else {
                // Fallback custom prompt
                aiPrompt = prompt || `Analyze the following text: ${contentToAnalyze}`;
            }

            const result = await ai21Service.generate(aiPrompt, type, false);
            // false for jsonMode unless we specifically want JSON. Jamba is good at following instructions.
            // For chart, we might want text.

            return NextResponse.json({ result, type });
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    } catch (error) {
        console.error("AI Analyze Error:", error);
        return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
    }
}
