'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/store/Auth'
import { useRouter } from 'next/navigation'

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const {login} = useAuth()
  const router = useRouter();

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

     const result = await login(formData.email, formData.password)
    
    if (result.success) {
      setSuccess('Account created successfully!')
      setTimeout(() => {
        router.push('/') // Redirect after successful signup
      }, 1500)
    } else {
      setError(result.message || 'SignIn failed')
    }
    
    // Simulate API call
    setTimeout(() => {
      setSuccess('Login successful!')
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden">
      {/* Animated background elements */}
     

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Glass morphism container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-300">Sign in to continue your learning journey</p>
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
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white group-hover:text-gray-200">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-4 text-sm text-gray-400">or sign in with email</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Form inputs */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
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
                    className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
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
                    className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-indigo-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md text-center space-y-6">
          <div className="relative">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
              Champion
            </h1>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
          </div>
          
          <p className="text-xl text-gray-300 leading-relaxed">
            Continue your learning adventure. Access your courses, track progress, and achieve your goals.
          </p>
          
          <div className="flex flex-col space-y-4 pt-8">
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold">Personalized Learning</div>
                <div className="text-gray-400 text-sm">AI-powered recommendations</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold">Progress Tracking</div>
                <div className="text-gray-400 text-sm">Monitor your achievements</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold">Community Learning</div>
                <div className="text-gray-400 text-sm">Connect with fellow learners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login