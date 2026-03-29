import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { installPdfDomPolyfills } from '@/lib/pdfDomPolyfill';

/**
 * Resolve pdf.worker.mjs for the same pdfjs-dist instance pdf-parse uses
 * (nested under pdf-parse or hoisted).
 */
function getPdfWorkerHref() {
    const pdfParsePkg = fileURLToPath(import.meta.resolve('pdf-parse/package.json'));
    const requireFromParse = createRequire(pdfParsePkg);
    let pdfJsRoot;
    try {
        pdfJsRoot = path.dirname(requireFromParse.resolve('pdfjs-dist/package.json'));
    } catch {
        return undefined;
    }
    const workerFile = path.join(pdfJsRoot, 'legacy', 'build', 'pdf.worker.mjs');
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
