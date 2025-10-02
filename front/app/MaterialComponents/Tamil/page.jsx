'use client'

import ProtectedRoute from '@/app/Component/Protected'
import React, { useState, useEffect } from 'react'

function Tamil({ token, refreshTrigger }) {
  const [getFiles, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [downloading, setDownloading] = useState({})

  useEffect(() => {
    fetchFiles()
  }, [refreshTrigger])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tamilfile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error('Error in Fetching Data...')
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      if (Array.isArray(data)) {
        setFiles(data)
      } else if (data.files && Array.isArray(data.files)) {
        setFiles(data.files)
      } else if (data.data && Array.isArray(data.data)) {
        setFiles(data.data)
      } else {
        console.error('API response is not an array:', data)
        setFiles([])
        setStatus('❌ Error: Invalid data format received')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setFiles([])
      setStatus('❌ Failed to fetch files')
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
  const handleFileAction = (item, action = 'download') => {
    const fileName = `${item.title}.pdf`
    
    if (action === 'download') {
      downloadFileAdvanced(item.url, fileName, item._id)
    } else {
      // Open in new tab
      window.open(item.url, '_blank')
    }
  }

  // Filter files based on search term
  const filteredFiles = getFiles.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className='min-h-screen p-4 md:p-8'>
        {/* Header Section */}
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
              📚 Study Materials
            </h1>
            <p className='text-gray-300 text-lg md:text-xl max-w-2xl mx-auto'>
              Download your learning resources and enhance your knowledge
            </p>
          </div>

          {/* Search and Stats Bar */}
          <div className=' rounded-2xl p-6 mb-8 border'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
              {/* Search Bar */}
              <div className='relative flex-1 max-w-md'>
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
                  placeholder="Search materials..."
                />
              </div>
              
              {/* Stats */}
              <div className='flex items-center gap-6 text-sm text-gray-300'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <span>{filteredFiles.length} Materials</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span>Ready to Download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {status && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              status.includes('❌') 
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
              <p className='text-white text-lg'>Loading materials...</p>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {filteredFiles.map((item, index) => {
                const isPdf = item.url && (
                  item.url.toLowerCase().includes('.pdf') || 
                  item.url.includes('document/upload') ||
                  item.url.includes('cloudinary.com')
                )
                const isDownloading = downloading[item._id]
                
                return (
                  <div
                    key={item._id || index}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
                  >
                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    {/* File Type Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      {isPdf ? (
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          PDF
                        </span>
                      ) : (
                        <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          DOC
                        </span>
                      )}
                    </div>

                    {/* File Number */}
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className="mt-8 mb-6 flex justify-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                        isPdf ? 'bg-gradient-to-br from-red-100 to-red-200' : 'bg-gradient-to-br from-blue-100 to-blue-200'
                      } group-hover:scale-110 transition-transform duration-300`}>
                        {isDownloading ? (
                          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                        ) : (
                          <svg 
                            className={`w-8 h-8 ${isPdf ? 'text-red-600' : 'text-blue-600'}`} 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            {isPdf ? (
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            ) : (
                              <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
                            )}
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center space-y-4">
                      <h3 className="font-bold text-gray-800 text-xl leading-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {isPdf ? "PDF Document ready for download" : "Document ready for download"}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-4">
                        <button
                          onClick={() => handleFileAction(item, 'download')}
                          disabled={isDownloading}
                          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            isDownloading
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                          }`}
                        >
                          {isDownloading ? (
                            <>
                              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500'></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download PDF
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleFileAction(item, 'open')}
                          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open in Browser
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
                {searchTerm ? 'No matching files found' : 'No materials uploaded yet'}
              </h3>
              <p className='text-gray-300 text-lg max-w-md mx-auto'>
                {searchTerm 
                  ? `Try adjusting your search term "${searchTerm}"`
                  : 'Upload your first study material to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Tamil
