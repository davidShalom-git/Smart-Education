'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Copy, 
  Check,
  Loader2,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react';

export default function SmartChartGenerator() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const WEBHOOK_URL = 'https://cse12345.app.n8n.cloud/webhook/chart';

  const generateChart = async () => {
    if (!description.trim()) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('description', description);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success && result.imageUrl) {
        setChartData({
          description: result.description || description,
          imageUrl: result.imageUrl,
          mermaidCode: result.mermaidCode,
          timestamp: new Date().toLocaleString()
        });
      } else {
        throw new Error('Failed to generate chart');
      }
    } catch (error) {
      console.error('Chart generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadChart = async () => {
    if (!chartData?.imageUrl) return;

    try {
      const response = await fetch(chartData.imageUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const copyMermaidCode = () => {
    if (chartData?.mermaidCode) {
      navigator.clipboard.writeText(chartData.mermaidCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">


      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Smart Chart Generator
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Describe your data visualization needs and get beautiful, downloadable charts instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Describe Your Chart</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Chart Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Step by step making a coffee"
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <motion.button
                onClick={generateChart}
                disabled={loading || !description.trim()}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  loading || !description.trim()
                    ? 'bg-gray-500/50 cursor-not-allowed text-white/50'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white hover:shadow-cyan-500/25'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Chart...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    Generate Chart
                  </div>
                )}
              </motion.button>

              {/* Chart Type Examples */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: BarChart3, label: 'Flow Charts' },
                  { icon: PieChart, label: 'Process Maps' },
                  { icon: TrendingUp, label: 'Diagrams' }
                ].map((type, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                    <type.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                    <span className="text-white/60 text-xs">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Chart Display Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Generated Chart</h2>
            </div>

            <AnimatePresence>
              {chartData ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Chart Image */}
                  <div className="relative group">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <img
                        src={chartData.imageUrl}
                        alt="Generated Chart"
                        className="w-full h-auto rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-chart.png';
                          e.target.alt = 'Chart failed to load';
                        }}
                      />
                    </div>
                    
                    {/* Overlay with download button */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                      <button
                        onClick={downloadChart}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white font-medium hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-4 h-4 inline mr-2" />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Chart Info */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Chart Details</h3>
                    <p className="text-white/70 text-sm mb-3">{chartData.description}</p>
                    <p className="text-white/50 text-xs">Generated on {chartData.timestamp}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={downloadChart}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300"
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Download PNG
                    </motion.button>

                    {chartData.mermaidCode && (
                      <motion.button
                        onClick={copyMermaidCode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 inline mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 inline mr-2" />
                            Copy Code
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10"
                  >
                    <BarChart3 className="w-10 h-10 text-white/70" />
                  </motion.div>
                  <p className="text-white/60 text-lg mb-2">No chart generated yet</p>
                  <p className="text-white/40 text-sm">Describe your chart to get started</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 text-center">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-white text-lg font-semibold mb-2">Generating your chart...</p>
              <p className="text-white/60 text-sm">This may take a few seconds</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
