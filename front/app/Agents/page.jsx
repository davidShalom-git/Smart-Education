'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Mail,
  FileText,
  Mic,
  BarChart3,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  MessageSquare,
  PenTool,
  Volume2,
  TrendingUp
} from 'lucide-react';
import ProtectedRoute from '../Component/Protected';

function AIAgentsPage() {
  const router = useRouter();

  const aiAgents = [
    {
      id: 1,
      title: "Smart Contact Assistant",
      description: "AI-powered contact form that processes messages and generates intelligent responses",
      icon: Mail,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderGradient: "from-blue-500/30 to-cyan-500/30",
      route: "/Agents/Email",
      features: ["Email Processing", "AI Responses", "Multi-language Support"],
      status: "Active"
    },
    {
      id: 2,
      title: "Quiz Generator Pro",
      description: "Generate downloadable PDF quizzes from text using AI21 Jamba technology",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderGradient: "from-purple-500/30 to-pink-500/30",
      route: "/Agents/Quiz",
      features: ["AI21 Powered", "Smart Questions", "Instant Generation"],
      status: "Active"
    },
    {
      id: 3,
      title: "Voice AI Assistant",
      description: "Advanced speech-to-text with real-time AI conversation capabilities",
      icon: Mic,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderGradient: "from-green-500/30 to-emerald-500/30",
      route: "/Agents/Speech",
      features: ["Voice Recognition", "Live Processing", "Audio Visualization"],
      status: "Active"
    },
    {
      id: 4,
      title: "Smart Chart Generator",
      description: "Create beautiful, downloadable charts and diagrams from text descriptions",
      icon: BarChart3,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      borderGradient: "from-orange-500/30 to-red-500/30",
      route: "/Agents/Chart",
      features: ["Mermaid Charts", "PNG Export", "Flow Diagrams"],
      status: "Active"
    }
  ];

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden">


        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              AI Agents 🤖
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your personalized AI workforce ready to handle complex tasks with intelligence and precision
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex justify-center gap-8 text-center"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-white/60 text-sm">Active Agents</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-white/60 text-sm">Availability</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white">∞</div>
                <div className="text-white/60 text-sm">Possibilities</div>
              </div>
            </motion.div>
          </motion.div>

          {/* AI Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {aiAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
                className="group relative"
              >
                {/* Card Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${agent.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                {/* Main Card */}
                <div className={`relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-500 group-hover:scale-[1.02] h-full`}>

                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${agent.gradient} text-white`}>
                      {agent.status}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${agent.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <agent.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                        {agent.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="text-white/90 font-semibold text-sm uppercase tracking-wider">Key Features</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {agent.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${agent.gradient}`}></div>
                            <span className="text-white/70 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      onClick={() => handleNavigation(agent.route)}
                      className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r ${agent.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:scale-105`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Launch Agent</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${agent.gradient} blur-2xl`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-center mt-20"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Ready to Transform Your Workflow?</h3>
              </div>

              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                Each AI agent is designed to handle specific tasks with precision and intelligence.
                Choose an agent above to get started with your personalized AI assistance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { icon: MessageSquare, label: "Contact Processing" },
                  { icon: PenTool, label: "Content Generation" },
                  { icon: Volume2, label: "Voice Processing" },
                  { icon: TrendingUp, label: "Data Visualization" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/60 text-sm text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AIAgentsPage;
