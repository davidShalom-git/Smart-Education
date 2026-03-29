import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { installPdfDomPolyfills } from '@/lib/pdfDomPolyfill';

/**
 * Path to pdf.worker.mjs for the pdfjs-dist copy pdf-parse uses.
 * Avoids import.meta.resolve / require.resolve — Turbopack cannot analyze those and production may lack .resolve.
 */
function getPdfWorkerHref() {
    const cwd = process.cwd();
    const nestedWorker = path.join(
        cwd,
        'node_modules',
        'pdf-parse',
        'node_modules',
        'pdfjs-dist',
        'legacy',
        'build',
        'pdf.worker.mjs'
    );
    const hoistedWorker = path.join(
        cwd,
        'node_modules',
        'pdfjs-dist',
        'legacy',
        'build',
        'pdf.worker.mjs'
    );
    const workerFile = existsSync(nestedWorker) ? nestedWorker : hoistedWorker;
    if (!existsSync(workerFile)) return undefined;
    return pathToFileURL(workerFile).href;
}

/**
 * pdf-parse v2+ — extract plain text from a PDF buffer (API routes only).
 * Must set worker on PDFParse before parsing (same pdfjs module pdf-parse imports).
 */
export async function extractPdfText(buffer) {
    installPdfDomPolyfills();

    const { PDFParse } = await import('pdf-parse');
    const workerHref = getPdfWorkerHref();
    if (workerHref) {
        PDFParse.setWorker(workerHref);
    }

    const parser = new PDFParse({ data: buffer });
    try {
        const result = await parser.getText();
        return (result?.text || '').trim();
    } finally {
        await parser.destroy();
    }
}
