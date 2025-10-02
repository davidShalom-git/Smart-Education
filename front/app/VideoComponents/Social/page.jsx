'use client'

import React, { useState, useEffect } from 'react'

function Social({ token, refreshTrigger }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)


  useEffect(() => {
    fetchVideos()
  }, [refreshTrigger])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/social', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error('Error in Fetching Videos...')
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      if (Array.isArray(data)) {
        setVideos(data)
      } else if (data.videos && Array.isArray(data.videos)) {
        setVideos(data.videos)
      } else if (data.data && Array.isArray(data.data)) {
        setVideos(data.data)
      } else {
        console.error('API response is not an array:', data)
        setVideos([])
        setStatus('❌ Error: Invalid data format received')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setVideos([])
      setStatus('❌ Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }



  const openVideoModal = (video) => {
    setSelectedVideo(video)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
  }

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='min-h-screen p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
            🎬 Tamil Video Gallery
          </h1>
          <p className='text-gray-300 text-lg md:text-xl max-w-2xl mx-auto'>
            Watch and your favorite Subject videos
          </p>
        </div>

        {/* Search and Stats Bar */}
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            {/* Search Bar */}
            <div className='relative flex-1 max-w-md'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200'
                placeholder="Search videos..."
              />
            </div>
            
            {/* Stats */}
            <div className='flex items-center gap-6 text-sm text-gray-300'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span>{filteredVideos.length} Videos</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span>Ready to Watch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            status.includes('❌') 
              ? 'bg-red-500/20 border border-red-500/30 text-red-200' 
              : status.includes('⏳')
              ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-200'
              : 'bg-green-500/20 border border-green-500/30 text-green-200'
          }`}>
            {status}
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div className='max-w-7xl mx-auto'>
        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4'></div>
            <p className='text-white text-lg'>Loading videos...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredVideos.map((video, index) => {
              
              
              return (
                <div
                  key={video._id || index}
                  className="group bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20"
                >
                  {/* Video Thumbnail/Player */}
                  <div className='relative aspect-video bg-black/50 overflow-hidden cursor-pointer'
                       onClick={() => openVideoModal(video)}>
                    <video
                      src={video.url}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      preload="metadata"
                    />
                    {/* Play Overlay */}
                    <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-2xl'>
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    {/* Video Number Badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      #{String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-white text-xl mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {video.author ? `By ${video.author}` : 'Tamil Video'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openVideoModal(video)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Watch Now
                      </button>
                  
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='text-center py-20'>
            <div className='w-32 h-32 mx-auto mb-8 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20'>
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-white mb-4'>
              {searchTerm ? 'No matching videos found' : 'No videos uploaded yet'}
            </h3>
            <p className='text-gray-300 text-lg max-w-md mx-auto'>
              {searchTerm 
                ? `Try adjusting your search term "${searchTerm}"`
                : 'Upload your first video to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={closeVideoModal}
        >
          <div 
            className='relative w-full max-w-5xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className='absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white transition-all duration-200 border border-white/20'
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className='aspect-video bg-black'>
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className='w-full h-full'
              />
            </div>

            {/* Video Info */}
            <div className='p-6 space-y-4'>
              <h2 className='text-2xl font-bold text-white'>
                {selectedVideo.title}
              </h2>
              {selectedVideo.author && (
                <p className='text-gray-400'>
                  By {selectedVideo.author}
                </p>
              )}
              <div className='flex gap-3'>
                <button
                  onClick={() => downloadVideo(selectedVideo.url, `${selectedVideo.title}.mp4`, selectedVideo._id)}
                  className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg'
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Social