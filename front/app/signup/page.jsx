'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/store/Auth'
import { useRouter } from 'next/navigation'

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    const result = await register(formData.username, formData.email, formData.password)

    if (result.success) {
      setSuccess('Account created successfully!')
      setTimeout(() => {
        router.push('/') 
      }, 1500)
    } else {
      setError(result.message || 'Signup failed')
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess('Account created successfully!')
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 border border-white/20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 bg-yellow-400 transform rotate-45 animate-spin"></div>
      </div>

      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Champion
            </h1>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>

          <p className="text-xl text-gray-300 leading-relaxed">
            Unlock your potential with our cutting-edge learning platform. Join thousands of learners worldwide.
          </p>

          <div className="flex items-center justify-center space-x-8 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">50K+</div>
              <div className="text-sm text-gray-400">Students</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">1000+</div>
              <div className="text-sm text-gray-400">Courses</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Glass morphism container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Sign Up</h2>
              <p className="text-gray-300">Create your account to get started</p>
            </div>

            {/* Error/Success messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-200 text-sm backdrop-blur-sm">
                {success}
              </div>
            )}

            <div className="space-y-6">
              {/* Google button */}
              <button
                type="button"
                className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-white group-hover:text-gray-200">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-4 text-sm text-gray-400">or sign up with email</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Form inputs */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                    Terms & Conditions
                  </a>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Sign in link */}
            <div className="text-center mt-6">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup