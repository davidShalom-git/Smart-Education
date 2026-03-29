'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecordRTC from 'recordrtc';
import { Mic, Square, Bot, Sparkles, Volume2 } from 'lucide-react';
import ProtectedRoute from '@/app/Component/Protected';
import { inferSpeechLang, selectVoiceForLang, primeSpeechVoices } from '@/lib/speechLang';

export default function BeautifulSpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const recorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const WEBHOOK_URL = '/api/proxy/speech';

  const speakText = useCallback((text) => {
    if (typeof window === 'undefined' || !text?.trim()) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      try {
        synth.resume();
      } catch {
        /* ignore */
      }

      const lang = inferSpeechLang(text);
      let spoke = false;

      const speakNow = () => {
        if (spoke) return;
        spoke = true;
        const voices = synth.getVoices();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = 0.92;
        u.pitch = 1;
        u.volume = 1;
        if (voices.length > 0) {
          const voice = selectVoiceForLang(voices, lang);
          if (voice) u.voice = voice;
        }
        u.onerror = (ev) => {
          console.warn('[TTS] utterance error:', ev.error, ev);
        };
        try {
          synth.resume();
        } catch {
          /* ignore */
        }
        synth.speak(u);
      };

      const tryWithVoices = () => {
        if (spoke) return;
        if (synth.getVoices().length > 0) speakNow();
      };

      tryWithVoices();
      const onVoices = () => tryWithVoices();
      synth.addEventListener('voiceschanged', onVoices);
      primeSpeechVoices();
      window.setTimeout(() => {
        synth.removeEventListener('voiceschanged', onVoices);
        if (!spoke) speakNow();
      }, 800);
    } catch (e) {
      console.warn('speechSynthesis:', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    primeSpeechVoices();
    const synth = window.speechSynthesis;
    const refresh = () => primeSpeechVoices();
    synth.addEventListener('voiceschanged', refresh);
    return () => synth.removeEventListener('voiceschanged', refresh);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!autoSpeak) {
      window.speechSynthesis.cancel();
      return;
    }
    if (!response.trim()) return;
    speakText(response);
    return () => window.speechSynthesis.cancel();
  }, [response, autoSpeak, speakText]);

  // Audio level monitoring for visual feedback
  const monitorAudioLevel = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    microphone.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      monitorAudioLevel(stream);
      primeSpeechVoices();

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/mp3",
        numberOfAudioChannels: 1,
        desiredSampRate: 16000
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
      setResponse(''); // Clear previous response
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(async () => {
        const blob = recorderRef.current.getBlob();
        await sendAudio(blob);
        setIsRecording(false);
        setAudioLevel(0);

        // Clean up audio monitoring
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      });
    }
  };

  const sendAudio = async (audioBlob) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('data0', audioBlob, 'recording.mp3');

      const result = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());

      setResponse(result.text || 'I received your message! 🎉');
    } catch (err) {
      setResponse('Sorry, I had trouble processing your audio. Please try again. 😅');
    } finally {
      setUploading(false);
    }
  };

  return (

    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden">

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] px-8 py-12">
          <div className="max-w-2xl w-full text-center">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                Voice AI
              </h1>
              <p className="text-xl text-white/70 mb-4">
                Speak naturally — Gemini replies in text; your browser reads it aloud when voice reply is on. For Tamil and other voices: Windows needs a <strong className="text-white">Speech</strong> voice, not only a keyboard language — open{' '}
                <span className="text-cyan-300">Settings → Time &amp; language → Speech → Add voices</span> and install <strong className="text-white">Tamil</strong>, then restart the browser.
              </p>
              <div className="flex justify-center mb-8">
                <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500"
                  />
                  Voice reply (read answer aloud)
                </label>
              </div>

              {/* Floating Elements */}
              <div className="flex justify-center gap-4 mb-8">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      y: [-10, 0, -10],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Voice Recording Interface */}
            <div className="relative">
              {/* Outer Glow Ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: isRecording
                    ? `0 0 0 ${20 + audioLevel * 40}px rgba(6, 182, 212, ${0.1 + audioLevel * 0.3})`
                    : "0 0 0 0px rgba(6, 182, 212, 0)"
                }}
                transition={{ duration: 0.1 }}
              />

              {/* Glass Morphism Container */}
              <motion.div
                className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Recording Button */}
                <div className="flex flex-col items-center space-y-8">
                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={uploading}
                    className={`relative w-32 h-32 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 disabled:opacity-50 overflow-hidden ${isRecording
                      ? 'bg-gradient-to-br from-red-500 via-pink-500 to-red-600'
                      : 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600'
                      }`}
                    whileHover={{ scale: uploading ? 1 : 1.1 }}
                    whileTap={{ scale: uploading ? 1 : 0.95 }}
                    animate={isRecording ? {
                      boxShadow: [
                        "0 0 0 0 rgba(6, 182, 212, 0.4)",
                        "0 0 0 20px rgba(6, 182, 212, 0)",
                        "0 0 0 0 rgba(6, 182, 212, 0.4)"
                      ]
                    } : {}}
                    transition={{ duration: 1.5, repeat: isRecording ? Infinity : 0 }}
                  >
                    {/* Animated Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Icon */}
                    <motion.div
                      animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.6, repeat: isRecording ? Infinity : 0 }}
                    >
                      {uploading ? (
                        <motion.div
                          className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : isRecording ? (
                        <Square className="w-10 h-10 relative z-10" />
                      ) : (
                        <Mic className="w-12 h-12 relative z-10" />
                      )}
                    </motion.div>
                  </motion.button>

                  {/* Status Text */}
                  <motion.div
                    className="text-center"
                    key={uploading ? 'processing' : isRecording ? 'recording' : 'ready'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-2xl font-semibold text-white mb-2">
                      {uploading ? 'Processing...' : isRecording ? 'Listening...' : 'Tap to speak'}
                    </p>
                    <p className="text-white/60 text-sm">
                      {uploading ? '🧠 AI is thinking' : isRecording ? '🎤 Speak clearly' : '✨ Voice-powered AI'}
                    </p>
                  </motion.div>

                  {/* Audio Level Visualizer */}
                  {isRecording && (
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-cyan-400 rounded-full"
                          animate={{
                            height: [8, 24 + audioLevel * 20, 8],
                          }}
                          transition={{
                            duration: 0.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* AI Response */}
            <AnimatePresence>
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="mt-12"
                >
                  <motion.div
                    className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                          AI Response
                        </h3>
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                          <Volume2 className="w-3 h-3" />
                          <span>Just now</span>
                        </div>
                      </div>
                    </div>

                    {/* Response Text */}
                    <motion.div
                      className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <p className="text-white text-lg leading-relaxed font-medium">
                        {response}
                      </p>
                      <button
                        type="button"
                        onClick={() => speakText(response)}
                        className="mt-4 text-sm font-medium text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline"
                      >
                        Play voice again
                      </button>
                    </motion.div>

                    {/* Decorative Elements */}
                    <div className="flex justify-center mt-6">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-1"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 text-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-white text-lg font-semibold">Processing your voice...</p>
                  <p className="text-white/60 text-sm mt-2">AI is analyzing and generating response</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
