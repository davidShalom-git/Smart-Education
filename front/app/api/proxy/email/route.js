import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { callGemini } from '@/lib/ai21Service';
import {
    isValidEmail,
    tryParseJsonObject,
    normalizeEmailDraft,
    parseEmailPlainBlocks
} from '@/lib/proxyUtils';

function mailSignatureHint() {
    const name = process.env.EMAIL_FROM_NAME?.trim();
    if (!name) return '';
    return `\nSign the email as "${name}" (closing line, e.g. "Best regards, ${name}"). Do not use [Your Name] or placeholders.`;
}

async function buildEmailDraft(to, userPrompt) {
    const sign = mailSignatureHint();
    const jsonPrompt = `You write clear, professional emails.

The user wants to email ${JSON.stringify(to)} about the following topic or request (they may write loosely — infer intent):
"""
${userPrompt}
"""${sign}

Respond with ONLY a single JSON object (no markdown code fences, no commentary). Use exactly these keys:
{"subject":"one line subject","body":"full email body as plain text with newlines where needed"}`;

    const raw = await callGemini(jsonPrompt, true);
    let draft = normalizeEmailDraft(tryParseJsonObject(raw));

    if (!draft) {
        const plainPrompt = `Write a professional email to ${JSON.stringify(to)} about:
"""
${userPrompt}
"""${sign}

Reply in this exact format (first line must start with SUBJECT:):
SUBJECT: <single line subject>
---
<email body — multiple paragraphs allowed>`;

        const raw2 = await callGemini(plainPrompt, false);
        draft = parseEmailPlainBlocks(raw2);
        if (!draft) {
            draft = normalizeEmailDraft(tryParseJsonObject(raw2));
        }
    }

    return draft;
}

function smtpConfigured() {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
    return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && EMAIL_FROM);
}

/** Nodemailer "From:" with optional display name (EMAIL_FROM_NAME). */
function buildMailFrom() {
    const addr = process.env.EMAIL_FROM?.trim();
    if (!addr) return null;
    const name = process.env.EMAIL_FROM_NAME?.trim();
    if (addr.includes('<') && addr.includes('>')) {
        return addr;
    }
    if (name) {
        const esc = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return `"${esc}" <${addr}>`;
    }
    return addr;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const to = typeof body.to === 'string' ? body.to.trim() : '';
        const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

        if (!to || !isValidEmail(to)) {
            return NextResponse.json(
                { error: 'Valid recipient email (to) is required', message: 'Invalid recipient' },
                { status: 400 }
            );
        }
        if (!prompt) {
            return NextResponse.json(
                { error: 'Topic or instructions (prompt) are required', message: 'Missing prompt' },
                { status: 400 }
            );
        }

        const draft = await buildEmailDraft(to, prompt);
        if (!draft) {
            return NextResponse.json(
                {
                    error: 'AI did not return a usable email draft. Try a shorter topic or set GEMINI_MODEL in .env.local.',
                    message: 'Generation failed'
                },
                { status: 502 }
            );
        }

        const subject = draft.subject.slice(0, 200);
        const textBody = draft.body;

        if (!smtpConfigured()) {
            return NextResponse.json(
                {
                    message: 'Success',
                    sent: false,
                    to,
                    draft: { subject, body: textBody },
                    hint: 'SMTP not configured — add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM (and optional EMAIL_FROM_NAME) in .env.local, then restart the dev server.'
                },
                { status: 200 }
            );
        }

        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

        const fromHeader = buildMailFrom();
        if (!fromHeader) {
            return NextResponse.json(
                {
                    error: 'EMAIL_FROM is missing',
                    message: 'Server misconfiguration'
                },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: fromHeader,
            to,
            subject,
            text: textBody
        });

        return NextResponse.json({ message: 'Success', sent: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || 'Failed to process request', message: 'Failed' },
            { status: 500 }
        );
    }
}
