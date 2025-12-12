"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  Code, 
  Database, 
  Smartphone,
  Brain,
  CheckCircle,
  Clock,
  BookOpen,
  Rocket,
  Users,
  GitBranch,
  Zap,
  Shield,
  Server
} from "lucide-react"

const phases = [
  {
    week: "Pre-Work (5 Weeks)",
    title: "Foundation Building",
    color: "bg-blue-500",
    borderColor: "border-blue-500",
    topics: [
      "Command line basics & Git",
      "HTML & CSS fundamentals",
      "JavaScript essentials",
      "Ruby programming basics",
      "Self-paced learning modules"
    ]
  },
  {
    week: "Weeks 1-5",
    title: "Backend Development",
    color: "bg-ruby-500",
    borderColor: "border-ruby-500",
    topics: [
      "Ruby deep dive",
      "Object-oriented programming",
      "Ruby on Rails framework",
      "MVC architecture",
      "Database design with PostgreSQL"
    ]
  },
  {
    week: "Weeks 6-10",
    title: "Frontend Development",
    color: "bg-green-500",
    borderColor: "border-green-500",
    topics: [
      "React.js fundamentals",
      "Component-based architecture",
      "State management",
      "API integration",
      "Full-stack applications"
    ]
  },
  {
    week: "Weeks 11-15",
    title: "Python & AI Engineering",
    color: "bg-purple-500",
    borderColor: "border-purple-500",
    topics: [
      "Python fundamentals",
      "FastAPI framework",
      "Machine learning basics",
      "Working with AI APIs (OpenAI, etc.)",
      "Capstone project"
    ]
  }
]

// Technologies with proper icons
const technologies = [
  { 
    name: "Ruby", 
    category: "Language",
    icon: "💎",
    color: "bg-red-50",
    borderColor: "border-red-200"
  },
  { 
    name: "Rails", 
    category: "Framework",
    icon: "🛤️",
    color: "bg-red-50",
    borderColor: "border-red-200"
  },
  { 
    name: "JavaScript", 
    category: "Language",
    iconComponent: Zap,
    iconColor: "text-yellow-500",
    color: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  { 
    name: "React", 
    category: "Framework",
    iconComponent: Code,
    iconColor: "text-blue-500",
    color: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  { 
    name: "Python", 
    category: "Language",
    icon: "🐍",
    color: "bg-green-50",
    borderColor: "border-green-200"
  },
  { 
    name: "FastAPI", 
    category: "Framework",
    iconComponent: Rocket,
    iconColor: "text-teal-500",
    color: "bg-teal-50",
    borderColor: "border-teal-200"
  },
  { 
    name: "PostgreSQL", 
    category: "Database",
    iconComponent: Database,
    iconColor: "text-blue-600",
    color: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  { 
    name: "Git", 
    category: "Tool",
    iconComponent: GitBranch,
    iconColor: "text-orange-500",
    color: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  { 
    name: "OpenAI", 
    category: "AI",
    iconComponent: Brain,
    iconColor: "text-purple-500",
    color: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  { 
    name: "Authentication", 
    category: "Security",
    iconComponent: Shield,
    iconColor: "text-green-600",
    color: "bg-green-50",
    borderColor: "border-green-200"
  },
]

export default function CurriculumPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-ruby-500/20 text-ruby-400 rounded-full text-sm font-medium mb-4">
            <Code className="w-4 h-4 mr-2" />
            20-Week Journey
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            What You&apos;ll Learn
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From complete beginner to job-ready full-stack developer. Our curriculum covers everything you need to build modern web applications.
          </p>
        </div>
        {/* Fade to next section - dark to light */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Tech Stack Cards */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You&apos;ll Learn & Why
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Master Ruby on Rails, React.js, and Python & AI - the comprehensive toolkit that opens doors to any tech career
            </p>
          </div>

          {/* Uniform tech stack cards with flexbox */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                <Code className="mr-3 h-6 w-6 text-red-500" />
                Ruby on Rails: Backend Mastery
              </h3>
              <ul className="space-y-3 text-gray-600 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Beginner-friendly, readable syntax
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Rapid prototyping & development
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Used by Airbnb, GitHub, Shopify
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Convention over configuration
                </li>
              </ul>
              <div className="bg-red-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-red-700 font-medium">
                  Perfect for building robust APIs and web applications
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                <Code className="mr-3 h-6 w-6 text-blue-500" />
                React.js: Frontend Excellence
              </h3>
              <ul className="space-y-3 text-gray-600 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Most in-demand frontend framework
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Component-based architecture
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Used by Meta, Netflix, Airbnb
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Gateway to React Native (mobile)
                </li>
              </ul>
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-700 font-medium">
                  Perfect pair with Rails APIs for full-stack development
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                <Brain className="mr-3 h-6 w-6 text-purple-500" />
                Python & AI: Future Skills
              </h3>
              <ul className="space-y-3 text-gray-600 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Build Chatbots & RAG Systems
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  LLMs & Prompt Engineering
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Agentic Systems & Evals
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  High-demand AI skillset
                </li>
              </ul>
              <div className="bg-purple-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-purple-700 font-medium">
                  Create intelligent applications with the power of AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - subtle background change, no fade needed */}
      <section className="py-16 md:py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your 20-Week Learning Journey
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {phases.map((phase, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                {/* Timeline line */}
                {index < phases.length - 1 && (
                  <div className="absolute left-[11px] top-8 w-0.5 h-full bg-gray-200" />
                )}
                
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${phase.color} flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>

                <div className={`bg-white rounded-xl p-6 border border-gray-100 shadow-md border-l-4 ${phase.borderColor}`}>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`px-3 py-1 ${phase.color} text-white text-sm font-medium rounded-full`}>
                      {phase.week}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{phase.title}</h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {phase.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies You'll Master - subtle background change, no fade needed */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technologies You&apos;ll Master
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Industry-standard tools used by companies like GitHub, Shopify, and Airbnb
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {technologies.map((tech, index) => (
                <div 
                  key={index}
                  className={`${tech.color} border ${tech.borderColor} rounded-xl p-4 text-center hover:shadow-md transition-all`}
                >
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    {tech.iconComponent ? (
                      <tech.iconComponent className={`w-8 h-8 ${tech.iconColor}`} />
                    ) : (
                      <span className="text-3xl">{tech.icon}</span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                  <p className="text-xs text-gray-600">{tech.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Class Format - subtle background change, no fade needed */}
      <section className="py-16 md:py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Class Format
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100">
                <Clock className="w-10 h-10 text-ruby-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-gray-900">Live Classes</h3>
                <p className="text-gray-600 text-sm">
                  Monday – Thursday, 5:30pm – 9:30pm (Guam time)
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100">
                <Smartphone className="w-10 h-10 text-ruby-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-gray-900">Fully Remote</h3>
                <p className="text-gray-600 text-sm">
                  Join from anywhere via Zoom with interactive sessions
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100">
                <BookOpen className="w-10 h-10 text-ruby-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-gray-900">Lifetime Access</h3>
                <p className="text-gray-600 text-sm">
                  All recordings and materials available forever
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fade to next section - light to dark */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* CTA - final section, no fade needed */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            No prior experience needed. We&apos;ll teach you everything from scratch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/8vNXoqxCimxjfXkU6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-ruby-500 hover:bg-ruby-600 text-white rounded-lg text-lg font-medium transition-all"
            >
              Apply Now
            </a>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg text-lg font-medium transition-all"
            >
              View Pricing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
