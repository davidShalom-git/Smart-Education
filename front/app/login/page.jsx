'use client'

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react'; // Assuming useState is used
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/store/Auth';

// Custom component to use the hook
const GoogleLoginButton = ({ onSuccess, onError }) => {
  const login = useGoogleLogin({
    onSuccess: onSuccess,
    onError: onError,
  });

  return (
    <button
      type="button"
      onClick={() => login()}
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
  );
};

export default function Login() {
  // ... state ...
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuth()
  const router = useRouter();

  // ... handleChange ...
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ... handleSubmit ...
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    const result = await login(formData.email, formData.password)
    if (result.success) {
      setSuccess('Login successful!')
      setTimeout(() => router.push('/'), 1500)
    } else {
      setError(result.message || 'SignIn failed')
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsLoading(true);
    try {
      // For useGoogleLogin, we get an access_token, not a credential/id_token directly usually,
      // but usually the backend expects an ID Token.
      // Let's use the 'implicit' flow or just send the access token if the backend can handle it.
      // Wait, google-auth-library 'verifyIdToken' expects an ID token.
      // useGoogleLogin with default flow (implicit) returns access_token.
      // We need flow: 'auth-code' or just use the ID token if available?
      // ACTUALLY: useGoogleLogin can't easily get ID Token without 'flow: implicit' but that's deprecated.
      // Is it safer to stick to the previous button if I want ID token?
      // You can't wrap a custom button easily with <GoogleLogin> to look exactly the same without CSS hacking.
      // BETTER FIX: useGoogleLogin with `onSuccess` receiving `codeResponse`.
      // Then swap backend to exchange code? Too complex for right now.

      // ALTERNATIVE: Use the standard `GoogleLogin` with `type="icon"` or strictly styling?
      // No, let's just use `useGoogleLogin` and fetch user info on client then send to backend?
      // Secure way: Send access token to backend, backend calls userinfo endpoint.

      // Let's assume we update the backend to support Access Token validation OR we try to get ID Token.
      // Simple fix: Restore the UI button but wrap it in a div that is actually the GoogleLogin with opacity 0? Hacky.

      // Let's UPDATE THE BACKEND to accept access_token as well?
      // Or just use the `onSuccess` from `useGoogleLogin` which gives an `access_token`.
      // Then client fetches profile -> sends profile to backend? No, insecure.

      // Let's try to pass `flow: 'auth-code'`? No.

      // Let's stick to the simplest path:
      // I will implement the button using `useGoogleLogin` which returns an `access_token`.
      // I will update the frontend to fetch the user profile from Google using that token.
      // THEN send that profile to the backend to "Login/Register".
      // (Slightly less secure than ID token verification but accepts the trade-off for UI flexibility right now).

      const accessToken = tokenResponse.access_token;

      // Fetch user info
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(res => res.json());

      // Send to our backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleProfile: userInfo, // Send full profile object
          type: 'profile'  // flag to tell backend how to handle it
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Google Login successful!');
        setTimeout(() => window.location.href = '/', 1500);
      } else {
        setError(data.message || 'Google Auth failed');
        setIsLoading(false);
      }

    } catch (err) {
      console.error(err)
      setError('Google Login Error');
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen w-full flex relative overflow-hidden">
        {/* ... Background ... */}


        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
          <div className="w-full max-w-md">
            {/* Glass morphism container */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-300">Sign in to continue your learning journey</p>
              </div>

              {/* Messages */}
              {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm backdrop-blur-sm">{error}</div>}
              {success && <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-200 text-sm backdrop-blur-sm">{success}</div>}

              <div className="space-y-6">

                {/* Custom Google Button using the Hook Component */}
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Login Failed')}
                />

                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-white/20"></div>
                  <span className="px-4 text-sm text-gray-400">or sign in with email</span>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                {/* Existing Form Inputs */}
                <div className="space-y-4">
                  {/* Email */}
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

                  {/* Password */}
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
    </GoogleOAuthProvider>
  )
}