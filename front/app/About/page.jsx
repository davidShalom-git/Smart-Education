'use client'

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from "next/link";

const About = () => {
  const [text, setText] = useState('');
  const fullText = "Sai Karthick";
  const timeoutRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    let currentIndex = 0;
    const typeEffect = () => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeEffect, 120);
      } else {
        timeoutRef.current = setTimeout(() => {
          setText('');
          currentIndex = 0;
          typeEffect();
        }, 3000);
      }
    };

    typeEffect();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const skills = [
    {
      name: 'Embedded Systems',
      level: 90,
      gradient: 'from-cyan-400 to-blue-500',
      icon: '🔌',
      description: 'Microcontrollers & IoT'
    },
    {
      name: 'Circuit Design',
      level: 85,
      gradient: 'from-green-500 to-emerald-600',
      icon: '⚡',
      description: 'PCB & Analog circuits'
    },
    {
      name: 'Signal Processing',
      level: 80,
      gradient: 'from-purple-600 to-pink-600',
      icon: '📊',
      description: 'DSP fundamentals'
    },
    {
      name: 'MATLAB',
      level: 75,
      gradient: 'from-orange-500 to-red-500',
      icon: '📐',
      description: 'Simulation & analysis'
    },
    {
      name: 'Python',
      level: 70,
      gradient: 'from-yellow-400 to-green-500',
      icon: '🐍',
      description: 'Automation & scripting'
    },
    {
      name: 'Call of Duty Mobile',
      level: 99,
      gradient: 'from-red-600 to-orange-500',
      icon: '🎮',
      description: 'Legendary ranked player 🔥'
    }
  ];

  const projects = [
    {
      title: 'Smart Education Platform',
      description: 'AI-powered e-learning platform with speech-to-text, quiz generation, and smart analytics',
      tech: ['Next.js', 'MongoDB', 'AI/ML', 'n8n'],
      icon: '🎓',
      gradient: 'from-purple-500 to-pink-500',
      link: ''
    },
    {
      title: 'IoT Weather Station',
      description: 'Real-time weather monitoring system with ESP32 and cloud integration',
      tech: ['ESP32', 'Arduino', 'Firebase', 'Sensors'],
      icon: '🌡️',
      gradient: 'from-blue-500 to-cyan-500',
      link: ''
    },
    {
      title: 'Smart Home Automation',
      description: 'Voice-controlled home automation system with mobile app integration',
      tech: ['Raspberry Pi', 'Node.js', 'React Native'],
      icon: '🏠',
      gradient: 'from-green-500 to-teal-500',
      link: ''
    }
  ];

  const achievements = [
    { icon: '🏆', title: 'Legendary', description: 'COD Mobile Rank' },
    { icon: '⚡', title: 'ECE', description: 'Final Year Student' },
    { icon: '🎯', title: '100+', description: 'Clutch victories' }
  ];

  const codStats = [
    { label: 'K/D Ratio', value: '3.5+', icon: '💀' },
    { label: 'Win Rate', value: '70%', icon: '🏅' },
    { label: 'Nukes', value: '50+', icon: '☢️' },
    { label: 'Hours Played', value: '1000+', icon: '⏱️' }
  ];

  return (
    <div className="text-white relative overflow-hidden">


      {/* Hero Section */}
      <motion.div
        style={{ y }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 pt-20"
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-6xl mb-6 shadow-2xl border-4 border-orange-400/50 animate-pulse">
              🎮
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              {text}
            </span>
            <motion.span
              className="inline-block w-1 h-16 bg-gradient-to-b from-red-400 to-orange-400 ml-2 rounded-full"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            ECE Final Year Student | <span className="text-orange-400 font-bold">Legendary COD Mobile Player</span>
          </motion.p>

          <motion.p
            className="text-lg text-orange-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            "From circuits to clutch plays - Engineering precision in everything I do" 🔥
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="px-6 py-3 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-red-400/30 rounded-full">
              <span className="text-red-300">🎯 Sniper Main</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 backdrop-blur-sm border border-orange-400/30 rounded-full">
              <span className="text-orange-300">⚡ Electronics</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-yellow-600/20 to-green-600/20 backdrop-blur-sm border border-yellow-400/30 rounded-full">
              <span className="text-yellow-300">🔥 AI/ML</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/30 rounded-full">
              <span className="text-purple-300">🏆 Legendary</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* COD Mobile Stats Section - Gaming Theme */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                🎮 Gaming Stats
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Call of Duty: Mobile - Legendary Ranked</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {codStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 text-center overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-orange-400 mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-red-900/30 via-orange-900/30 to-yellow-900/30 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 text-center"
          >
            <div className="text-6xl mb-4">☢️</div>
            <p className="text-xl text-orange-300 font-bold mb-2">"Tactical Nuke Incoming!"</p>
            <p className="text-gray-400">The only thing more legendary than my K/D ratio is my circuit designs 😎</p>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* COD Mobile Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden border border-orange-500/30 group"
            >
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80"
                alt="Gaming Setup"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-orange-400">🎮 Pro Gamer Mode</h3>
                <p className="text-gray-300 text-sm">Legendary ranked in COD Mobile</p>
              </div>
              <div className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full text-sm font-bold">
                LIVE
              </div>
            </motion.div>

            {/* ECE Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden border border-cyan-500/30 group"
            >
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
                alt="Electronics Engineering"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-cyan-400">⚡ ECE Engineering</h3>
                <p className="text-gray-300 text-sm">Circuits, signals, and innovation</p>
              </div>
              <div className="absolute top-4 right-4 bg-cyan-500 px-3 py-1 rounded-full text-sm font-bold">
                TECH
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Me Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  About Me
                </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Hey! I'm <span className="text-orange-400 font-bold">Karthick</span>, a final year Electronics and Communication Engineering (ECE) student with a passion for embedded systems, IoT, and AI-powered solutions. 🚀
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                When I'm not designing circuits or debugging code, you'll find me dominating the battlefield in Call of Duty: Mobile. I've achieved <span className="text-red-400 font-bold">Legendary rank</span> multiple seasons and have a reputation for clutch plays that would make even the pros jealous! 🎯
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                I believe the same precision and strategy that wins games also creates great engineering solutions. This AI-powered E-Learning platform is my final year project - combining my love for technology with practical AI applications.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-2xl"
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-xl font-bold text-orange-300 mb-1">{achievement.title}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    My Mission
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    To merge my technical expertise in electronics with cutting-edge AI to create innovative solutions that make learning smarter and more accessible.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-orange-300">
                    <span className="text-xl">🔌</span>
                    <span>Embedded Systems & IoT</span>
                  </div>
                  <div className="flex items-center gap-3 text-orange-300">
                    <span className="text-xl">🤖</span>
                    <span>AI/ML Integration</span>
                  </div>
                  <div className="flex items-center gap-3 text-orange-300">
                    <span className="text-xl">📱</span>
                    <span>Full-Stack Development</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-400 font-bold">
                    <span className="text-xl">🎮</span>
                    <span>Legendary COD Mobile Player</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                My Skills
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Technical expertise meets gaming precision 🎮⚡
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{skill.name}</h3>
                    <p className="text-gray-400 text-sm">{skill.description}</p>
                  </div>
                  <div className="text-lg font-bold text-orange-300">{skill.level}%</div>
                </div>

                <div className="relative w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${skill.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Engineering projects with the same precision as a headshot 🎯
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group cursor-pointer"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 h-full hover:bg-white/10 transition-all duration-300 shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-br ${project.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {project.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-300">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-xs border border-orange-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-orange-400 group-hover:text-red-400 transition-colors duration-300">
                    <span className="mr-2">View Project</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Fun Quote Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-12 shadow-2xl"
          >
            <div className="text-6xl mb-6">🔥</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              "I don't camp in games, I camp in the library"
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              An ECE student by day, Legendary player by night. Got a project idea or want to squad up? Let's connect!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
              >
                <span className="relative z-10">🎮 Let's Play!</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default About;