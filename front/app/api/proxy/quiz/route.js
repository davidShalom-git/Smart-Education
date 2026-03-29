import { NextResponse } from 'next/server';
import { callGemini, parseJSON } from '@/lib/ai21Service';
import { extractPdfText } from '@/lib/pdfText';

const MAX_TEXT_CHARS = 32000;

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('data');
        const numQuestions = String(formData.get('numQuestions') || '5');
        const difficulty = String(formData.get('difficulty') || 'medium');

        if (!file || typeof file === 'string' || !file.size) {
            return NextResponse.json(
                { success: false, error: 'File (data) is required' },
                { status: 400 }
            );
        }

        const buf = Buffer.from(await file.arrayBuffer());
        const name = (file.name || '').toLowerCase();
        let text = '';

        if (name.endsWith('.txt') || file.type === 'text/plain') {
            text = buf.toString('utf8');
        } else if (name.endsWith('.pdf') || file.type === 'application/pdf') {
            text = await extractPdfText(buf);
        } else {
            return NextResponse.json(
                { success: false, error: 'Only PDF or TXT files are supported' },
                { status: 400 }
            );
        }

        text = text.replace(/\s+/g, ' ').trim();
        if (!text || text.length < 50) {
            return NextResponse.json(
                { success: false, error: 'Could not extract enough text from the document' },
                { status: 400 }
            );
        }

        if (text.length > MAX_TEXT_CHARS) {
            text = text.slice(0, MAX_TEXT_CHARS);
        }

        const n = Math.min(15, Math.max(1, parseInt(numQuestions, 10) || 5));

        const prompt = `You are an educator. Create exactly ${n} multiple-choice questions based ONLY on the document below.

Difficulty: ${difficulty} (easy = recall; medium = understanding; hard = analysis and inference).

Return ONLY valid JSON (no markdown) with this exact shape:
{
  "quiz": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1,
      "explanation": "short string why the answer is correct"
    }
  ]
}

Rules:
- Each question must have exactly 4 options.
- correctAnswer is 1-based index (1 = first option).
- Questions must be answerable from the document.
- explanations optional but preferred.

Document:
"""
${text}
"""`;

        const raw = await callGemini(prompt, true);
        const parsed = parseJSON(raw, null);
        const quiz = parsed?.quiz;

        if (!Array.isArray(quiz) || quiz.length === 0) {
            return NextResponse.json(
                { success: false, error: 'AI did not return a valid quiz' },
                { status: 502 }
            );
        }

        for (const q of quiz) {
            if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
                return NextResponse.json(
                    { success: false, error: 'Malformed quiz item from AI' },
                    { status: 502 }
                );
            }
            const ca = Number(q.correctAnswer);
            if (!Number.isInteger(ca) || ca < 1 || ca > q.options.length) {
                return NextResponse.json(
                    { success: false, error: 'Invalid correctAnswer in quiz' },
                    { status: 502 }
                );
            }
        }

        return NextResponse.json({ success: true, quiz }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}
