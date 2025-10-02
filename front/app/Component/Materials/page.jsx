'use client'

import { useAuth } from '@/store/Auth'
import React, { useState } from 'react'

function CardStyleVideoUploader() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')

  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const { token } = useAuth();

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm']

      if (!allowedTypes.includes(selectedFile.type)) {
        setStatus('❌ Only video files allowed')
        return
      }

      if (selectedFile.size > 100 * 1024 * 1024) {
        setStatus('❌ File must be under 100MB')
        return
      }

      setFile(selectedFile)
      setStatus('')
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !title) return

    setLoading(true)
    const formData = new FormData()
    formData.append('title', title)

    formData.append('file', file)

    try {
      const response = await fetch('/api/english', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`   
        },

        body: formData,
      })

      if (response.ok) {
        setStatus('✅ Video uploaded!')
        setTitle('')
        setFile(null)
        setPreview(null)
      } else {
        setStatus('❌ Upload failed')
      }
    } catch (error) {
      setStatus('❌ Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-white mb-4'>
            🎬 Tamil Video Upload
          </h1>
          <p className='text-gray-300 text-xl'>Share your creative content with the world</p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Upload Form Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20'>
            <h2 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
              <span className='w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center'>
                📝
              </span>
              Video Details
            </h2>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-gray-200 font-medium mb-2'>Video Title</label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500'
                  placeholder='Enter your video title...'
                  required
                />
              </div>



              <div>
                <label className='block text-gray-200 font-medium mb-2'>Video File</label>
                <input
                  type='file'
                  accept='video/*'
                  onChange={handleFileChange}
                  className='w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-500 file:text-white hover:file:bg-pink-600'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-pink-500/25'
              >
                {loading ? '🔄 Uploading...' : '🚀 Upload Video'}
              </button>
            </form>

            {status && (
              <div className={`mt-4 p-4 rounded-xl text-center ${status.includes('❌')
                  ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                  : 'bg-green-500/20 text-green-200 border border-green-500/30'
                }`}>
                {status}
              </div>
            )}
          </div>

          {/* Preview Card */}
          <div className='bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20'>
            <h2 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
              <span className='w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                🎥
              </span>
              Preview
            </h2>

            {preview ? (
              <div className='space-y-4'>
                <video
                  src={preview}
                  controls
                  className='w-full rounded-xl shadow-2xl'
                  style={{ maxHeight: '300px' }}
                />
                <div className='bg-white/5 rounded-xl p-4'>
                  <p className='text-gray-300 text-sm'>
                    <span className='text-white font-semibold'>File:</span> {file?.name}
                  </p>
                  <p className='text-gray-300 text-sm'>
                    <span className='text-white font-semibold'>Size:</span> {(file?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className='text-gray-300 text-sm'>
                    <span className='text-white font-semibold'>Type:</span> {file?.type}
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/20 rounded-xl'>
                <div className='text-6xl mb-4'>🎬</div>
                <p className='text-gray-400 text-center'>
                  Select a video file to see preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardStyleVideoUploader
