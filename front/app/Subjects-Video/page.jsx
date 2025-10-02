'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

function Subjects() {
  const [hoveredCard, setHoveredCard] = useState(null)
  const router = useRouter()

const subjects = [
  {
    id: 1,
    title: "Tamil Video",
    nativeTitle: "[translate:தமிழ்]",
    description: "Master the classical Tamil language through literature, grammar, and cultural heritage studies.",
    icon: "🏺",
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-900",
    route: "/VideoComponents/Tamil",
    stats: "250+ Lessons",
    topics: [
      {
        category: "Basic Tamil",
        items: [
          "Tamil Alphabets - [translate:தமிழ் எழுத்துக்கள்]",
          "Pronunciation Guide", 
          "Basic Vocabulary",
          "Simple Sentences",
          "Numbers and Colors"
        ]
      },
      {
        category: "Grammar",
        items: [
          "Noun Forms - [translate:பெயர்ச்சொல்]",
          "Verb Conjugation - [translate:வினைச்சொல்]",
          "Tenses - [translate:காலம்]",
          "Sentence Structure",
          "Prefixes and Suffixes"
        ]
      },
      {
        category: "Literature",
        items: [
          "Sangam Literature - [translate:சங்க இலக்கியம்]",
          "Thirukkural - [translate:திருக்குறள்]",
          "Classical Poetry",
          "Folk Tales - [translate:நாட்டுப்புறக் கதைகள்]",
          "Modern Tamil Writers"
        ]
      },
      {
        category: "Culture & Heritage",
        items: [
          "Tamil Festivals - [translate:தமிழ் பண்டிகைகள்]",
          "Traditional Arts",
          "Tamil Cinema - [translate:தமிழ் சினிமா]",
          "Cultural Traditions",
          "Heritage Sites"
        ]
      }
    ],
    difficulty: {
      beginner: "Tamil Script & Basic Words",
      intermediate: "Grammar & Simple Literature", 
      advanced: "Classical Literature & Poetry"
    }
  },
  
  {
    id: 2,
    title: "English Video",
    description: "Develop comprehensive English language skills including grammar, literature, and communication.",
    icon: "📖",
    gradient: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-50", 
    textColor: "text-blue-900",
    route: "/VideoComponents/English",
    stats: "300+ Lessons",
    topics: [
      {
        category: "Language Skills",
        items: [
          "Reading Comprehension",
          "Writing Skills",
          "Speaking & Pronunciation", 
          "Listening Skills",
          "Vocabulary Building"
        ]
      },
      {
        category: "Grammar",
        items: [
          "Parts of Speech",
          "Tenses & Verb Forms",
          "Sentence Structure",
          "Punctuation Rules",
          "Active & Passive Voice"
        ]
      },
      {
        category: "Literature", 
        items: [
          "Poetry Analysis",
          "Short Stories",
          "Drama & Plays",
          "Novel Studies",
          "Literary Devices"
        ]
      },
      {
        category: "Communication",
        items: [
          "Essay Writing",
          "Letter Writing",
          "Public Speaking",
          "Debate Skills",
          "Presentation Techniques"
        ]
      }
    ],
    difficulty: {
      beginner: "Basic Grammar & Vocabulary",
      intermediate: "Literature & Essay Writing",
      advanced: "Critical Analysis & Creative Writing"
    }
  },

  {
    id: 3,
    title: "Social Studies Video",
    description: "Explore history, geography, civics, and economics to understand society and the world around us.",
    icon: "🌍",
    gradient: "from-green-500 to-teal-600",
    bgColor: "bg-green-50",
    textColor: "text-green-900", 
    route: "/subjects/social-studies",
    stats: "180+ Topics",
    topics: [
      {
        category: "History",
        items: [
          "Ancient Indian History",
          "Medieval Period",
          "British Colonial Rule",
          "Independence Movement",
          "Modern India"
        ]
      },
      {
        category: "Geography",
        items: [
          "Physical Geography",
          "Climate & Weather",
          "Natural Resources",
          "Population Studies",
          "Economic Geography"
        ]
      },
      {
        category: "Civics",
        items: [
          "Indian Constitution",
          "Fundamental Rights",
          "Government Structure",
          "Democratic Process",
          "Judicial System"
        ]
      },
      {
        category: "Economics",
        items: [
          "Basic Economic Concepts",
          "Indian Economy",
          "Banking & Finance",
          "Trade & Commerce",
          "Economic Development"
        ]
      },
      {
        category: "Tamil Nadu Focus",
        items: [
          "History of Tamil Nadu - [translate:தமிழ்நாட்டின் வரலாறு]",
          "Tamil Culture & Traditions",
          "Geography of Tamil Nadu",
          "Government of Tamil Nadu",
          "Economic Development"
        ]
      }
    ],
    difficulty: {
      beginner: "Basic Concepts & Local History",
      intermediate: "National History & Geography",
      advanced: "Complex Economic & Political Systems"
    }
  }
]

  const handleCardClick = (route) => {
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className=' text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Pick Your Favorite Subjects 📖
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover a world of knowledge through our comprehensive subject library. Each course is designed to make learning engaging and effective.
          </p>
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
                hoveredCard === subject.id ? 'scale-105' : 'hover:scale-105'
              }`}
              onMouseEnter={() => setHoveredCard(subject.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(subject.route)}
            >
              {/* Gradient Header */}
              <div className={`relative h-48 bg-gradient-to-br ${subject.gradient} overflow-hidden`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute top-8 -left-8 w-16 h-16 bg-white rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="absolute bottom-4 right-8 w-12 h-12 bg-white rounded-full opacity-25 group-hover:scale-110 transition-transform duration-600"></div>
                </div>
                
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {subject.icon}
                  </span>
                </div>

                {/* Stats Badge */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">{subject.stats}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className={`text-2xl font-bold ${subject.textColor} group-hover:text-opacity-80 transition-colors`}>
                    {subject.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors">
                    {subject.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <button 
                    className={`w-full bg-gradient-to-r ${subject.gradient} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-blue-300`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(subject.route)
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Start Learning
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Hover Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
            <span className="animate-pulse">✨</span>
            <span className="font-medium">Can't find your subject? More courses coming soon!</span>
            <span className="animate-pulse">✨</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subjects
