'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Email() {
  const [formData, setFormData] = useState({
    prompt: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo('');

    try {
      console.log('🚀 Sending email request...');
      setDebugInfo('Sending your message to AI...');

      const response = await fetch('https://cse12345.app.n8n.cloud/webhook/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formData.prompt
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📄 N8N Response:', result);

      // ✅ FIXED: Correct success detection based on your console output
      // Your N8N returns { message: "Success" } for successful emails
      if (result.message === "Success" || 
          result.status === "success" || 
          result.success === true ||
          response.status === 200) {
        
        console.log('✅ Email sent successfully!');
        setDebugInfo('Email sent successfully! Your message has been delivered.');
        
        toast.success('🎉 Email sent successfully! We\'ll get back to you soon.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Clear form after successful submission
        setFormData({ prompt: '' });
        
      } else {
        // Handle N8N workflow errors
        console.log('❌ N8N workflow failed:', result);
        throw new Error(result.error || result.errorMessage || 'Email processing failed');
      }

    } catch (error) {
      console.error('💥 Email Error:', error);
      setDebugInfo(`Error: ${error.message}`);
      
      toast.error(`❌ Failed to send email: ${error.message}`, {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
   
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Smart Email Assistant
          </h1>
          <p className="text-xl text-white/70">
            AI-powered Email that processes messages and generates intelligent responses
          </p>
        </motion.div>

        {/* Debug Info */}
        {debugInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-4 mb-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">ℹ️</span>
              </div>
              <p className="text-blue-200 text-sm">{debugInfo}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Send Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-white/90 mb-3">
                  Your Message *
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={8}
                  required
                  value={formData.prompt}
                  onChange={handleInputChange}
                  placeholder="Enter your message, question, or inquiry here..."
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <p className="text-white/50 text-xs mt-1">
                  AI will process your message and generate an appropriate response
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.prompt.trim()}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isLoading || !formData.prompt.trim()
                    ? 'bg-gray-500/50 cursor-not-allowed text-white/50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    Sending Message...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">📧</span>
                    Send Message
                  </div>
                )}
              </button>
            </form>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">How It Works</h2>
            </div>

            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <svg className="w-10 h-10 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <p className="text-white/70 text-sm">
                  Your message is processed by AI and sent as an email
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">1</span>
                    AI Processing
                  </h3>
                  <p className="text-white/70 text-sm">Your message is analyzed and processed by AI</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">2</span>
                    Email Generation
                  </h3>
                  <p className="text-white/70 text-sm">AI generates an appropriate email response</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs">3</span>
                    Quick Response
                  </h3>
                  <p className="text-white/70 text-sm">You'll receive a response within 24 hours</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs">4</span>
                    Multi-language Support
                  </h3>
                  <p className="text-white/70 text-sm">Available in English, Tamil, and Hindi</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <style jsx>{`
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
