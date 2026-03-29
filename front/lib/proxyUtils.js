/**
 * Pull Mermaid diagram source from a model response (strip markdown fences).
 */
export function extractMermaidCode(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let s = raw.trim();
    const fence = /```(?:mermaid)?\s*([\s\S]*?)```/i.exec(s);
    if (fence) s = fence[1].trim();
    return s.replace(/^\uFEFF/, '').trim();
}

/** Base64url path segment for mermaid.ink (shared by /img and /svg). */
export function mermaidInkEncodedPath(mermaidSource) {
    return Buffer.from(mermaidSource, 'utf8')
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/** Raster PNG — fixed pixel size; can look tiny in the UI for complex diagrams. */
export function mermaidInkImageUrl(mermaidSource) {
    return `https://mermaid.ink/img/${mermaidInkEncodedPath(mermaidSource)}`;
}

/** Vector SVG — scales cleanly to the preview width (preferred for on-screen preview). */
export function mermaidInkSvgUrl(mermaidSource) {
    return `https://mermaid.ink/svg/${mermaidInkEncodedPath(mermaidSource)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s) {
    return typeof s === 'string' && EMAIL_RE.test(s.trim());
}

/**
 * Parse a JSON object from model output (handles markdown fences + leading/trailing text).
 */
export function tryParseJsonObject(text) {
    if (!text || typeof text !== 'string') return null;
    let cleaned = text.trim().replace(/^\uFEFF/, '');
    const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(cleaned);
    if (fence) cleaned = fence[1].trim();

    try {
        const o = JSON.parse(cleaned);
        if (o && typeof o === 'object') return o;
    } catch {
        /* try substring */
    }

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
        try {
            const o = JSON.parse(cleaned.slice(start, end + 1));
            if (o && typeof o === 'object') return o;
        } catch {
            /* continue */
        }
    }
    const lb = cleaned.indexOf('[');
    const rb = cleaned.lastIndexOf(']');
    if (lb !== -1 && rb > lb) {
        try {
            const o = JSON.parse(cleaned.slice(lb, rb + 1));
            if (o && typeof o === 'object') return o;
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * Map common alternate keys to { subject, body }.
 */
export function normalizeEmailDraft(obj, depth = 0) {
    if (depth > 3 || obj == null) return null;
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const d = normalizeEmailDraft(item, depth + 1);
            if (d) return d;
        }
        return null;
    }
    if (typeof obj !== 'object') return null;
    const subject =
        obj.subject ??
        obj.Subject ??
        obj.emailSubject ??
        obj.title ??
        obj.email_title;
    const body =
        obj.body ??
        obj.Body ??
        obj.emailBody ??
        obj.message ??
        obj.content ??
        obj.text;
    const s = subject != null ? String(subject).trim() : '';
    const b = body != null ? String(body).trim() : '';
    if (!s || !b) return null;
    return { subject: s, body: b };
}

/**
 * Fallback: model returns SUBJECT: line then optional --- then body.
 */
export function parseEmailPlainBlocks(text) {
    if (!text || typeof text !== 'string') return null;
    const m = text.match(/SUBJECT:\s*([^\r\n]+)/i);
    if (!m) return null;
    const subject = m[1].trim();
    let rest = text.slice(text.indexOf(m[0]) + m[0].length).trim();
    rest = rest.replace(/^[\r\n]*---+[\s\r\n]*/, '').trim();
    if (!rest) return null;
    return { subject, body: rest };
}
