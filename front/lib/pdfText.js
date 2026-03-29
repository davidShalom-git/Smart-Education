import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

/**
 * pdf.js must load its worker from a real filesystem path. Next/Turbopack bundling
 * otherwise points at a missing chunk (fake worker error).
 */
async function ensurePdfWorker() {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const workerFile = path.join(
        process.cwd(),
        'node_modules',
        'pdfjs-dist',
        'legacy',
        'build',
        'pdf.worker.mjs'
    );
    if (existsSync(workerFile)) {
        pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerFile).href;
    }
}

/**
 * pdf-parse v2+ — extract plain text from a PDF buffer (API routes only).
 */
export async function extractPdfText(buffer) {
    await ensurePdfWorker();
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    try {
        const result = await parser.getText();
        return (result?.text || '').trim();
    } finally {
        await parser.destroy();
    }
}
