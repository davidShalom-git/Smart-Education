'use client'

import ProtectedRoute from '@/app/Component/Protected'
import React, { useState, useEffect } from 'react'

function English({ token, refreshTrigger }) {
  const [getFiles, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('files') // 'files' or 'videos'
  const [downloading, setDownloading] = useState({})

  const [analyzing, setAnalyzing] = useState({})
  const [aiContent, setAiContent] = useState({})

  const handleAnalyze = async (item, type) => {
    setAnalyzing(prev => ({ ...prev, [item._id]: type }))

    // Prepare payload based on item type
    const payload = { type };
    if (activeTab === 'files') {
      if (!item.url) return;
      payload.fileUrl = item.url;
    } else {
      // For videos, calculate assignment based on title since we can't generic assignment from video bytes easily
      if (type === 'summary') {
        // Mock summary for video based on title
        setAiContent(prev => ({
          ...prev,
          [item._id]: { ...prev[item._id], summary: `Video Lesson: ${item.title}. Watch the full video to understand the concepts.` }
        }));
        setAnalyzing(prev => ({ ...prev, [item._id]: false }));
        return;
      }
      payload.text = `Generate a quiz for a video lesson titled: "${item.title}". Assume general knowledge about this topic.`;
    }

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.error) {
        setStatus(`❌ Error: ${data.error}`);
        throw new Error(data.error); // Keep throw for catch block but UI will show status now if we managed it right, 
        // actually better to just throw to hit the catch block which sets status. 
        // Wait, the catch block sets status to "Failed to generate...".
        // Let's modify the catch block to use the error message.
      }

      setAiContent(prev => ({
        ...prev,
        [item._id]: {
          ...prev[item._id],
          summary: data.summary || prev[item._id]?.summary,
          assignment: data.assignment || prev[item._id]?.assignment
        }
      }));

      setStatus(`✅ ${type === 'summary' ? 'Summary' : 'Assignment'} generated!`);

    } catch (error) {
      console.error("AI Error:", error)
      setStatus(`❌ ${error.message}`)
    } finally {
      setAnalyzing(prev => ({ ...prev, [item._id]: false }))
      setTimeout(() => setStatus(''), 3000)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [refreshTrigger, activeTab])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const endpoint = activeTab === 'files' ? '/api/englishfile' : '/api/englishvideo';

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)

      const data = await response.json()

      let items = [];
      if (Array.isArray(data)) items = data;
      else if (data.data && Array.isArray(data.data)) items = data.data;
      else if (data.files && Array.isArray(data.files)) items = data.files;

      setFiles(items)
    } catch (error) {
      console.error('Fetch error:', error)
      setFiles([])
      setStatus('❌ Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  // Method 1: Simple download using anchor tag
  const downloadFileSimple = (url, filename) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'document.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Method 2: Download using fetch (better for CORS and headers)
  const downloadFileAdvanced = async (url, filename, itemId) => {
    try {
      setDownloading(prev => ({ ...prev, [itemId]: true }))
      setStatus('⏳ Downloading file...')

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'document.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL object
      window.URL.revokeObjectURL(downloadUrl)

      setStatus('✅ Download completed successfully!')
      setTimeout(() => setStatus(''), 3000)

    } catch (error) {
      console.error('Download error:', error)
      setStatus('❌ Download failed. Trying alternative method...')

      // Fallback to simple method
      downloadFileSimple(url, filename)

      setTimeout(() => setStatus(''), 3000)
    } finally {
      setDownloading(prev => ({ ...prev, [itemId]: false }))
    }
  }

  // Handle file action (download or open)
  const handleFileAction = (item, action = 'open') => {
    if (activeTab === 'videos') {
      window.open(item.url, '_blank');
      return;
    }

    if (action === 'download') {
      const fileName = `${item.title}.pdf`;
      downloadFileAdvanced(item.url, fileName, item._id);
    } else {
      // Open in our new Custom PDF Viewer
      // Encode params properly
      const targetUrl = `/view-pdf?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`;
      window.open(targetUrl, '_blank'); // Open in new tab but in our app
    }
  }

  // Filter files based on search term
  const filteredFiles = getFiles.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className='min-h-screen p-4 md:p-8'>
        {/* Header Section */}
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
              📚 English Class
            </h1>
            <p className='text-gray-300 text-lg md:text-xl'>
              Access your study materials and video lectures
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="bg-slate-800/50 p-1 rounded-2xl flex items-center">
              <button
                onClick={() => setActiveTab('files')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${activeTab === 'files'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'}`}
              >
                📄 Documents
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${activeTab === 'videos'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'}`}
              >
                🎥 Video Lessons
              </button>
            </div>
          </div>

          {/* Search and Stats Bar */}
          <div className='rounded-2xl p-6 mb-8 bg-slate-800/30 backdrop-blur-md'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
              {/* Search Bar */}
              <div className='relative flex-1 max-w-md w-full'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  placeholder={`Search ${activeTab}...`}
                />
              </div>

              {/* Stats */}
              <div className='flex items-center gap-6 text-sm text-gray-300'>
                <div className='flex items-center gap-2'>
                  <div className={`w-2 h-2 rounded-full ${activeTab === 'videos' ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                  <span>{filteredFiles.length} {activeTab === 'videos' ? 'Videos' : 'Documents'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {status && (
            <div className={`mb-6 p-4 rounded-lg text-center ${status.includes('❌')
              ? 'bg-red-900/20 border border-red-500/30 text-red-400'
              : status.includes('⏳')
                ? 'bg-yellow-900/20 border border-yellow-500/30 text-yellow-400'
                : 'bg-green-900/20 border border-green-500/30 text-green-400'
              }`}>
              {status}
            </div>
          )}
        </div>

        {/* Enhanced File Grid with Download Focus */}
        <div className='max-w-7xl mx-auto'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4'></div>
              <p className='text-white text-lg'>Loading content...</p>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {filteredFiles.map((item, index) => {
                const isVideo = activeTab === 'videos';
                const isDownloading = downloading[item._id]

                return (
                  <div
                    key={item._id || index}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
                  >
                    {/* Decorative Elements */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${isVideo ? 'from-pink-100 to-rose-100' : 'from-blue-100 to-purple-100'} rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>

                    {/* File Type Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg ${isVideo ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
                        {isVideo ? 'VIDEO' : 'PDF'}
                      </span>
                    </div>

                    {/* File Number */}
                    <div className={`absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br ${isVideo ? 'from-pink-500 to-rose-600' : 'from-blue-500 to-purple-600'} rounded-full flex items-center justify-center shadow-xl`}>
                      <span className="text-white font-bold text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mt-8 mb-6 flex justify-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isVideo ? 'bg-pink-100 text-pink-500' : 'bg-blue-100 text-blue-500'} group-hover:scale-110 transition-transform duration-300`}>
                        {isVideo ? (
                          <span className="text-4xl">🎬</span>
                        ) : (
                          <span className="text-4xl">📄</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-4">
                      <h3 className="font-bold text-gray-800 text-xl leading-tight line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed">
                        {isVideo ? "Watch full video lesson" : "PDF Document ready for download"}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-4">

                        {/* Primary View/Play Button */}
                        <button
                          onClick={() => handleFileAction(item, 'open')}
                          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${isVideo
                            ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
                            }`}
                        >
                          {isVideo ? '▶ Play Video' : '👀 View & AI Study'}
                        </button>

                        {/* Secondary Download Button */}
                        <button
                          onClick={() => handleFileAction(item, 'download')}
                          disabled={isDownloading}
                          className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {isDownloading ? 'Downloading...' : 'Download'}
                        </button>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='text-center py-20'>
              <div className='w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center'>
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-white mb-4'>
                No materials uploaded yet
              </h3>
              <p className='text-gray-300 text-lg max-w-md mx-auto'>
                Upload your first {activeTab} to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default English
