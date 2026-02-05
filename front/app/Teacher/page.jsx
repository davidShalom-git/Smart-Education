'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/app/Component/Protected';
import { Upload, FileText, Video, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

import { useAuth } from '@/store/Auth';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('files'); // 'files' or 'videos'
    const [subject, setSubject] = useState('english');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null); // For files
    const [videoUrl, setVideoUrl] = useState(''); // For videos (assuming URL for now, or file upload)
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('subject', subject);
            formData.append('type', activeTab); // 'files' or 'videos'

            if (activeTab === 'files') {
                if (!file) throw new Error('Please select a file');
                formData.append('file', file);
            } else {
                // Assuming video upload might be a URL or file. 
                // For this demo, let's assume we implement URL input for video, or file if needed.
                // If it's a file upload for video:
                if (file) formData.append('file', file);
                // If it's a URL:
                // formData.append('url', videoUrl);
            }

            // NOTE: We need to create this API route
            const res = await fetch('/api/teacher/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                let error;
                try {
                    error = await res.json();
                } catch (err) {
                    error = { message: `Request failed with status ${res.status}: ${res.statusText}` };
                }
                throw new Error(error.message || 'Upload failed');
            }

            setStatus({ type: 'success', message: 'Content uploaded successfully!' });
            // Reset form
            setTitle('');
            setFile(null);
            setVideoUrl('');
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen text-white p-6 md:p-12">
                <div className="max-w-4xl mx-auto">

                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                            Teacher's Portal
                        </h1>
                        <p className="text-slate-400">Manage course materials and lecture videos</p>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">

                        {/* Tabs */}
                        <div className="flex border-b border-slate-700">
                            <button
                                onClick={() => setActiveTab('files')}
                                className={`flex-1 py-4 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'files'
                                    ? 'bg-slate-700/50 text-emerald-400 border-b-2 border-emerald-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <FileText className="w-5 h-5" />
                                Upload Notes
                            </button>
                            <button
                                onClick={() => setActiveTab('videos')}
                                className={`flex-1 py-4 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'videos'
                                    ? 'bg-slate-700/50 text-cyan-400 border-b-2 border-cyan-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <Video className="w-5 h-5" />
                                Upload Videos
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleUpload} className="space-y-6">

                                {/* Subject Select */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    >
                                        <option value="english">English</option>
                                        <option value="tamil">Tamil</option>
                                        <option value="social">Social Science</option>
                                        {/* Add other subjects as needed matching your models */}
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Chapter 1 Summary"
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    />
                                </div>

                                {/* File Upload */}
                                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        accept={activeTab === 'files' ? '.pdf,.doc,.docx' : 'video/*'}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                        </div>
                                        {file ? (
                                            <span className="text-emerald-400 font-medium">{file.name}</span>
                                        ) : (
                                            <>
                                                <span className="text-white text-lg font-medium">Click to upload {activeTab === 'files' ? 'document' : 'video'}</span>
                                                <span className="text-slate-500 text-sm mt-1">
                                                    {activeTab === 'files' ? 'PDF, DOCX, DOC' : 'MP4, MOV, WEBM'}
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {/* Video URL (Optional if we want link support) */}
                                {/* 
                {activeTab === 'videos' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Or Video URL</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                )}
                */}

                                {/* Status Message */}
                                <AnimatePresence>
                                    {status.message && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}
                                        >
                                            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                            {status.message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${activeTab === 'files'
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-500/20'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/20'
                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Uploading...
                                        </div>
                                    ) : (
                                        "Upload Content"
                                    )}
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
