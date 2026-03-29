'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from '@/app/Component/Protected';

export default function Email() {
  const [formData, setFormData] = useState({
    to: '',
    prompt: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [lastDraft, setLastDraft] = useState(null);

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
    setLastDraft(null);

    try {
      setDebugInfo('Generating email with AI...');

      const response = await fetch('/api/proxy/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.to.trim(),
          prompt: formData.prompt
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (result.message === 'Success' || result.status === 'success' || result.success === true) {
        if (result.sent === false && result.draft) {
          setLastDraft({
            to: result.to || formData.to.trim(),
            subject: result.draft.subject,
            body: result.draft.body
          });
          setDebugInfo(
            result.hint ||
              'SMTP is not set up — your email was generated below. Copy it into your mail app, or add SMTP_* vars to .env.local to send automatically.'
          );
          toast.info(
            'Email draft ready — SMTP not configured. Copy the text below or configure SMTP to send automatically.',
            { position: 'top-right', autoClose: 7000 }
          );
        } else {
          setDebugInfo('Email sent successfully! Your message has been delivered.');
          toast.success("🎉 Email sent successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setFormData({ to: '', prompt: '' });
          setLastDraft(null);
        }
      } else {
        throw new Error(result.error || result.errorMessage || 'Email processing failed');
      }

    } catch (error) {
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
    <ProtectedRoute>
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
              Enter the recipient and topic — Gemini writes the email. With <code className="text-purple-300">SMTP_*</code> and <code className="text-purple-300">EMAIL_FROM</code> in <code className="text-purple-300">.env.local</code> it sends automatically. Optional <code className="text-purple-300">EMAIL_FROM_NAME</code> sets the visible sender name (e.g. Sai Karthick).
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

          {lastDraft && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-amber-500/15 border border-amber-400/40 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-300">✉️</span> Generated email (copy & send manually)
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/50">To</span>
                  <p className="text-white font-mono break-all">{lastDraft.to}</p>
                </div>
                <div>
                  <span className="text-white/50">Subject</span>
                  <p className="text-white font-medium">{lastDraft.subject}</p>
                </div>
                <div>
                  <span className="text-white/50">Body</span>
                  <pre className="mt-1 p-4 bg-black/30 rounded-xl text-white/90 whitespace-pre-wrap font-sans text-sm max-h-64 overflow-y-auto border border-white/10">
                    {lastDraft.body}
                  </pre>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const blob = `To: ${lastDraft.to}\nSubject: ${lastDraft.subject}\n\n${lastDraft.body}`;
                      navigator.clipboard.writeText(blob);
                      toast.success('Full email copied to clipboard');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 text-white text-sm font-medium border border-amber-400/40"
                  >
                    Copy all
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(lastDraft.body);
                      toast.success('Body copied');
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20"
                  >
                    Copy body only
                  </button>
                </div>
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
                  <label htmlFor="to" className="block text-sm font-medium text-white/90 mb-3">
                    Recipient email *
                  </label>
                  <input
                    id="to"
                    name="to"
                    type="email"
                    required
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-white/90 mb-3">
                    Topic or instructions *
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={8}
                    required
                    value={formData.prompt}
                    onChange={handleInputChange}
                    placeholder="e.g. Write a concise email about the effects of war, or invite them to next week's study group..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    You don&apos;t need to write the full email — only who it goes to and what it should cover
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.prompt.trim() || !formData.to.trim()}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${isLoading || !formData.prompt.trim() || !formData.to.trim()
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
    </ProtectedRoute>
  );
}
