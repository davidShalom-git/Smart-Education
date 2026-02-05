'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bot, FileText, Loader2, Wand2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewerPage() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const title = searchParams.get('title') || 'Document';

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [text, setText] = useState('');
    const [aiContent, setAiContent] = useState({ summary: '', assignment: null });
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [status, setStatus] = useState('');
    const [pdfDocument, setPdfDocument] = useState(null);

    // Standard format for AI Analysis to ensure consistent API handling
    const handleAnalyze = async (type) => {
        if (!text) {
            setStatus('❌ No text extracted yet. Wait for PDF to load.');
            return;
        }

        setAnalyzing(true);
        setStatus(`✨ Generating ${type}...`);

        try {
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text, // Send extracted text directly
                    type
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setAiContent(prev => ({
                ...prev,
                [type]: data[type]
            }));

            setStatus(`✅ ${type === 'summary' ? 'Summary' : 'Assignment'} generated!`);
        } catch (error) {
            console.error('AI Error:', error);
            setStatus(`❌ Failed to generate ${type}: ${error.message}`);
        } finally {
            setAnalyzing(false);
        }
    };

    function onDocumentLoadSuccess(pdf) {
        setNumPages(pdf.numPages);
        setPdfDocument(pdf);
        extractText(pdf);
    }

    async function extractText(pdf) {
        try {
            setStatus('Extracting text for AI...');
            let fullText = '';
            // Limit to first 5 pages to avoid massive payloads/slowness
            const maxPages = Math.min(pdf.numPages, 5);

            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }

            setText(fullText);
            setStatus('');
            console.log("Text extracted:", fullText.length, "chars");
        } catch (err) {
            console.error('Text extraction failed:', err);
            setStatus('❌ Failed to extract text from PDF');
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 pt-24 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[85vh]">

                {/* Left Column: PDF Viewer */}
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
                    {/* Toolbar */}
                    <div className="p-4 bg-slate-900 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
                        <h2 className="font-semibold truncate max-w-[200px]">{title}</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-slate-700 rounded-lg">
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-2 hover:bg-slate-700 rounded-lg">
                                <ZoomIn className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button disabled={pageNumber <= 1} onClick={() => setPageNumber(p => p - 1)} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-50">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm">
                                {pageNumber} / {numPages || '--'}
                            </span>
                            <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(p => p + 1)} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-50">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* PDF Canvas */}
                    <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-800/50">
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={(err) => setStatus(`Error loading PDF: ${err.message}`)}
                            loading={<div className="flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin" /> Loading PDF...</div>}
                            className="shadow-xl"
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderAnnotationLayer={false}
                                renderTextLayer={true}
                                className="shadow-2xl"
                            />
                        </Document>
                    </div>
                </div>

                {/* Right Column: AI Assistant */}
                <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700 flex flex-col">
                    <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-t-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Bot className="w-8 h-8 text-purple-400" />
                            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI Study Companion</h3>
                        </div>
                        <p className="text-sm text-slate-400">Generate summaries and quizzes instantly.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Status Bar */}
                        {status && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${status.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    status.includes('✨') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                {status}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleAnalyze('summary')}
                                disabled={analyzing || !text}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all group disabled:opacity-50"
                            >
                                <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold text-purple-200">Summarize</span>
                            </button>
                            <button
                                onClick={() => handleAnalyze('assignment')}
                                disabled={analyzing || !text}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all group disabled:opacity-50"
                            >
                                <Wand2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold text-cyan-200">Quiz Me</span>
                            </button>
                        </div>

                        {/* Results Area */}
                        {(aiContent.summary || aiContent.assignment) ? (
                            <div className="space-y-6">
                                {aiContent.summary && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">
                                            <FileText className="w-4 h-4" /> Summary
                                        </h4>
                                        <div className="bg-slate-900/50 rounded-xl p-4 text-slate-300 text-sm leading-relaxed border border-slate-700/50 shadow-inner">
                                            {aiContent.summary}
                                        </div>
                                    </div>
                                )}

                                {aiContent.assignment && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3">
                                            <Wand2 className="w-4 h-4" /> Assessment
                                        </h4>
                                        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 shadow-inner">
                                            <h5 className="font-bold text-white mb-4 text-center border-b border-slate-700 pb-2">
                                                {aiContent.assignment.title}
                                            </h5>
                                            <ul className="space-y-3">
                                                {aiContent.assignment.questions?.map((q, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
                                                            {i + 1}
                                                        </span>
                                                        <span>{q}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm border-2 border-dashed border-slate-700 rounded-xl">
                                <Bot className="w-10 h-10 mb-2 opacity-50" />
                                <p>Select an action to start learning</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
