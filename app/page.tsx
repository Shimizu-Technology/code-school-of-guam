"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  Code, 
  Rocket, 
  Users, 
  Briefcase, 
  Calendar,
  CheckCircle,
  Star,
  Brain,
  Zap,
  GraduationCap,
  Clock,
  Database,
  Quote,
  Target,
  Bot,
  UtensilsCrossed,
  PartyPopper
} from "lucide-react"

// Student testimonials
const testimonials = [
  {
    name: "Junior O'Brien",
    role: "Graduate - Cohort 2",
    initial: "J",
    quote: "I am extremely grateful to have been a part of the 2025 CSG cohort. Leon was flexible for me to join and continue to participate in the course despite some 'life' challenges that if not for his patience, I most likely would not have been able to begin or finish the course. I highly recommend CSG to anyone who is considering learning about coding. Leon and Alanna provided second to none support, guidance, and encouragement throughout my learning experience.",
    color: "bg-purple-500"
  },
  {
    name: "Ron Malu",
    role: "Graduate - Cohort 2",
    initial: "R",
    quote: "Hands down awesome four months of class!!",
    color: "bg-orange-500"
  },
  {
    name: "Noah Peredo",
    role: "Graduate - Cohort 1",
    initial: "N",
    quote: "Clear mind and trust the process. CSG will match the effort that you give it, so at the end of the day, how bad do you want it?",
    color: "bg-ruby-500"
  },
  {
    name: "Jessica Fernandez",
    role: "Graduate - Cohort 1",
    initial: "J",
    quote: "I am very very VERY glad I enrolled and finished it! Now, I constantly think about ways I could 'hack' my daily life by creating apps. Leon was extremely helpful in answering all my questions and providing valuable guidance.",
    color: "bg-green-500"
  },
  {
    name: "Alanna Cruz",
    role: "Software Engineer",
    initial: "A",
    quote: "The Code School of Guam provided me with a comprehensive curriculum covering Ruby, Rails, React, and now Python & AI Engineering. The expert guidance and hands-on projects prepared me perfectly for my software engineering career!",
    color: "bg-blue-500"
  }
]

// Testimonial Carousel Component
function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  
  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isSwipe = Math.abs(distance) > minSwipeDistance
    
    if (isSwipe) {
      if (distance > 0) {
        // Swiped left -> go to next
        nextSlide()
      } else {
        // Swiped right -> go to previous
        prevSlide()
      }
    }
    
    // Reset
    touchStartX.current = null
    touchEndX.current = null
  }

  const changeSlide = useCallback((newIndex: number, direction: 'left' | 'right') => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideDirection(direction)
    
    // After fade out, change slide
    setTimeout(() => {
      setCurrentIndex(newIndex)
      // After a brief moment, fade back in
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 300)
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % testimonials.length
    changeSlide(newIndex, 'right')
  }, [currentIndex, changeSlide])

  const prevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
    changeSlide(newIndex, 'left')
  }, [currentIndex, changeSlide])

  const goToSlide = (index: number) => {
    if (index === currentIndex) return
    const direction = index > currentIndex ? 'right' : 'left'
    changeSlide(index, direction)
  }

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (isPaused || isAnimating) return
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [isPaused, isAnimating, nextSlide])

  const current = testimonials[currentIndex]

  // Dynamic text size based on quote length
  const getQuoteStyle = (quote: string) => {
    const length = quote.length
    if (length < 80) {
      // Very short quotes - larger, more impactful
      return 'text-xl md:text-2xl'
    } else if (length < 200) {
      // Medium quotes - standard size
      return 'text-lg md:text-xl'
    } else {
      // Long quotes - slightly smaller for readability
      return 'text-base md:text-lg'
    }
  }

  return (
    <section 
      className="py-24 lg:py-32 bg-slate-50 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-ruby-500/10 border border-ruby-500/20 rounded-full text-ruby-700 text-sm font-medium mb-4">
            <Users className="h-4 w-4 mr-2" />
            Student Success
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Hear from Our <span className="text-ruby-500">Graduates</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            11 graduates across 2 cohorts with a 100% completion rate
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-ruby-500 hover:shadow-xl transition-all disabled:opacity-50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-ruby-500 hover:shadow-xl transition-all disabled:opacity-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Testimonial Card - with touch/swipe support */}
            <div 
              className="bg-white rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Quote icon decoration */}
              <Quote className="absolute top-4 right-4 w-12 h-12 text-ruby-100" />
              
              {/* Content with animation - min-height for consistency */}
              <div 
                className={`relative z-10 min-h-[280px] md:min-h-[240px] flex flex-col justify-center transition-all duration-300 ease-in-out ${
                  isAnimating 
                    ? `opacity-0 ${slideDirection === 'right' ? '-translate-x-4' : 'translate-x-4'}` 
                    : 'opacity-100 translate-x-0'
                }`}
              >
                {/* Stars */}
                <div className="flex text-yellow-400 mb-6 justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                {/* Quote - dynamic size based on length */}
                <blockquote className={`${getQuoteStyle(current.quote)} text-slate-700 text-center mb-8 leading-relaxed`}>
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center">
                  <div 
                    className={`w-14 h-14 ${current.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors duration-300`}
                  >
                    {current.initial}
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-bold text-slate-900 text-lg">{current.name}</h3>
                    <p className="text-slate-600">{current.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-ruby-500 w-8' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-600 mb-6">
            Ready to join our next success story?
          </p>
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-md">
            <p className="text-sm text-slate-700 mb-4">
              Join our March 2026 cohort and learn to build AI-powered applications with Ruby, Rails, React, Python & AI Engineering. <strong>Only 1 class in 2026!</strong>
            </p>
            <a
              href="https://forms.gle/nJv8nAfxsvvLSbbq7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-ruby-500 hover:bg-ruby-600 text-white rounded-md font-medium transition-colors"
            >
              Apply for March Cohort
              <Rocket className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ruby-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
              <Brain className="h-4 w-4 mr-2" />
              NEW: Learn to Build AI Chatbots &amp; RAG Systems
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Learn to Build AI-Powered
              <br />
              <span className="text-ruby-500">Applications</span>
            </h1>

            <p className="text-xl text-slate-300 mb-4">
              Guam&apos;s First Coding Bootcamp
            </p>
            
            <p className="text-2xl font-semibold text-green-400 mb-6">
              From Zero to AI-Capable Developer in Under 6 Months
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Next cohort: March 2, 2026</span>
              </div>
              <div className="flex items-center gap-2 text-ruby-400 font-semibold">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Only 1 class in 2026 — Limited spots!</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="https://forms.gle/nJv8nAfxsvvLSbbq7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-ruby-500 hover:bg-ruby-600 text-white rounded-lg text-lg font-medium transition-all hover:scale-105 shadow-lg"
              >
                Apply for March Cohort
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-lg font-medium transition-all"
              >
                View Pricing & Payment Plans
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <p className="text-slate-400">
              No coding experience required • From beginner to job-ready
            </p>
          </div>
        </div>
        
        {/* Fade to next section - dark to light transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* STUDENT SUCCESS STORIES - Carousel */}
      <TestimonialCarousel />

      {/* CURRICULUM PREVIEW - What You'll Learn (moved up before pricing) */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 bg-ruby-100 text-ruby-700 rounded-full text-sm font-medium mb-4">
                <Code className="w-4 h-4 mr-2" />
                Under 6 Months
              </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What You&apos;ll Learn & Why
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Master Ruby on Rails, React.js, and Python & AI - the comprehensive toolkit that opens doors to any tech career
            </p>
          </div>

          {/* Tech Stack Cards - Uniform with flexbox */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                <Code className="mr-3 h-6 w-6 text-red-500" />
                Ruby on Rails: Backend Mastery
              </h3>
              <ul className="space-y-3 text-slate-600 flex-grow">
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
              {/* Bottom aligned colored box */}
              <div className="bg-red-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-red-700 font-medium">
                  Perfect for building robust APIs and web applications
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                <Code className="mr-3 h-6 w-6 text-blue-500" />
                React.js: Frontend Excellence
              </h3>
              <ul className="space-y-3 text-slate-600 flex-grow">
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
              {/* Bottom aligned colored box */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-700 font-medium">
                  Perfect pair with Rails APIs for full-stack development
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all flex flex-col h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                <Brain className="mr-3 h-6 w-6 text-purple-500" />
                Python & AI: Future Skills
              </h3>
              <ul className="space-y-3 text-slate-600 flex-grow">
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
              {/* Bottom aligned colored box */}
              <div className="bg-purple-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-purple-700 font-medium">
                  Create intelligent applications with the power of AI
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack Visual */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-center mb-6 text-slate-900">Your Complete Tech Stack</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold text-lg">Rb</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">Ruby</h4>
                  <p className="text-xs text-slate-600">Programming Language</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold text-xs">Rails</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">Ruby on Rails</h4>
                  <p className="text-xs text-slate-600">Backend Framework</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold text-xs">React</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">React</h4>
                  <p className="text-xs text-slate-600">Frontend Framework</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">PostgreSQL</h4>
                  <p className="text-xs text-slate-600">Database</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Python & AI</h4>
                  <p className="text-xs text-slate-600">AI Engineering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
              <Link
                href="/curriculum"
                className="inline-flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
              >
                View Full Curriculum
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
          </div>
        </div>
      </section>

      {/* VALUE COMPARISON - What's Included (moved down after curriculum) */}
      <section className="py-24 lg:py-32 bg-slate-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-800 text-sm font-medium mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Package Value
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What&apos;s Included — <span className="text-green-600">No Hidden Fees</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-4">
              For $7,500, you get everything you need to become a junior full-stack developer — plus lifetime support and guaranteed opportunities
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-medium">
              <Star className="h-4 w-4 mr-1" />
              New lower tuition - 25% less than before!
            </div>
          </div>

          {/* Price Comparison Card */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-green-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">$7,500</div>
                  <div className="text-lg font-semibold text-slate-900 mb-1">Code School of Guam</div>
                  <div className="text-sm text-slate-600">New Lower Price • Was $10,000</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-slate-400 text-2xl font-bold">VS</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-red-500 mb-2">$16,000+</div>
                  <div className="text-lg font-semibold text-slate-900 mb-1">U.S. Bootcamps</div>
                  <div className="text-sm text-slate-600">Without internship guarantee</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-2">
                  <Target className="w-5 h-5 text-ruby-500 flex-shrink-0" /> <span className="text-green-600">Save over $8,500</span> while getting MORE value with our locally-focused program
                </p>
              </div>
            </div>
          </div>

          {/* What's Included Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Under 6 Months</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  From zero to AI-capable full-stack developer with live instruction and hands-on projects
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Lifetime Access</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Forever access to all recordings, resources, and future curriculum updates
                </p>
            </div>
            
              <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-ruby-100 rounded-lg flex items-center justify-center mr-3">
                    <Briefcase className="h-6 w-6 text-ruby-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Real Experience + Paid Roles</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Optional internship for real-world experience, plus paid TA and junior dev positions for top performers
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/programs"
              className="inline-flex items-center text-ruby-600 hover:text-ruby-700 font-medium"
            >
              View full pricing details
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
        
        {/* Fade to next section - light to dark transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </section>

      {/* INTERNSHIP HIGHLIGHT */}
      <section className="py-24 lg:py-32 bg-slate-900 text-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4 mr-2" />
              Real-World Experience
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience That Gets You Hired
            </h2>
            <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto">
              Employers want engineers with experience — but new engineers can&apos;t get experience if no one gives them a chance. We solved that problem.
            </p>
            <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto">
              We started{" "}
              <a 
                href="https://shimizu-technology.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-ruby-400 hover:text-ruby-300 font-semibold underline underline-offset-2"
              >
                Shimizu Technology
              </a>
              {" "}to be the company that gives them that chance — real production applications that build the portfolio employers want to see.
            </p>

            {/* Project examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                <Bot className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="font-semibold mb-1">HåfaGPT</h3>
                <p className="text-sm text-slate-400">AI-powered Chamorro language learning platform</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                <UtensilsCrossed className="w-8 h-8 text-orange-400 mb-2" />
                <h3 className="font-semibold mb-1">Håfa Recipes</h3>
                <p className="text-sm text-slate-400">iOS app with 4.9-star rating on App Store</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                <PartyPopper className="w-8 h-8 text-yellow-400 mb-2" />
                <h3 className="font-semibold mb-1">Hafaloha Orders</h3>
                <p className="text-sm text-slate-400">Handled 850+ VIP orders at live concert</p>
              </div>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-ruby-500 hover:bg-ruby-600 text-white rounded-lg font-medium transition-colors"
            >
              See Graduate Projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING CTA - final section, no fade needed */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-ruby-600 to-ruby-700 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            Tuition: $7,500 — Flexible payment plans available. Next cohort starts March 2, 2026.
          </p>
          <p className="text-lg text-yellow-300 font-semibold mb-8 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 fill-current" /> Only 1 class in 2026 — Don&apos;t miss it!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/nJv8nAfxsvvLSbbq7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-ruby-600 hover:bg-slate-100 rounded-lg text-lg font-medium transition-all"
            >
              Apply Now
              <ChevronRight className="ml-2 w-5 h-5" />
            </a>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg text-lg font-medium transition-all"
            >
              View Payment Options
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
