'use client'

import React from "react";
import { motion } from 'framer-motion';
import Link from "next/link";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  BrainCircuit, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Learning",
      description: "Get personalized guidance and practice recommendations custom-fit for your pace and style.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "Dive deep into structured courses across multiple fields, complete with interactive notes and media.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Trophy,
      title: "Competitive Spirit",
      description: "Challenge your peers, climb the global leaderboards, and master subjects through friendly competition.",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: Target,
      title: "Active Learning Pathways",
      description: "Move away from passive video watching. Solve challenges, interact with smart agents, and build retention.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const statistics = [
    { number: "10K+", label: "Active Learners", icon: Users },
    { number: "500+", label: "Modules & Topics", icon: GraduationCap },
    { number: "95%", label: "Satisfaction Rate", icon: CheckCircle2 },
    { number: "24/7", label: "AI Support", icon: Zap }
  ];

  const values = [
    {
      title: "Access For All",
      description: "Democratizing world-class educational tools and knowledge bases for students everywhere, regardless of backgrounds."
    },
    {
      title: "Engagement First",
      description: "Learning shouldn't feel like a chore. We build gamification, competition, and rewards into the core learning loop."
    },
    {
      title: "Continuous Adaptability",
      description: "Our AI systems constantly analyze your performance, feeding you exact resources to fill in knowledge gaps."
    }
  ];

  return (
    <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto py-16 text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6"
        >
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            The Future of Learning is Here
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6"
        >
          Shaping Minds with{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Next-Generation Education
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Champion isn't just an e-learning tool. It's a smart learning ecosystem that pairs immersive curriculum, personalized AI agents, and a global student community to unleash academic mastery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/Subjects-File">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25">
              Explore Subjects <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link href="/Agents">
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              Meet AI-Agents
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Philosophy / Values Section */}
      <section className="py-16 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Pillars of <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Educational Growth</span>
            </h2>
            <p className="text-gray-400 leading-relaxed pr-4">
              We design our products around the fundamental truth that learning is an active, ongoing quest—not a one-way lecture.
            </p>
          </motion.div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{val.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for the{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Modern Student</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Everything needed to accelerate comprehension, retention, and performance, custom-built inside our interface.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feat.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300">
                    {feat.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Stats and Impact */}
      <section className="py-16 border-t border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400 font-semibold">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Marketing Action Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Elevate Your Knowledge Base Today
            </h2>
            <p className="text-gray-300 mb-8 text-sm md:text-base leading-relaxed">
              Explore a personalized roadmap, compete in the global ranks, and download curated material instantly. Let's champion education together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="w-full sm:w-auto px-8 py-3 bg-white text-purple-900 rounded-full font-bold text-md hover:bg-gray-100 transition-all duration-200">
                  Join Champion
                </button>
              </Link>
              <Link href="/Subjects-File">
                <button className="w-full sm:w-auto px-8 py-3 border border-white/30 hover:border-white rounded-full font-bold text-md text-white transition-all duration-200">
                  Browse Subjects
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default About;