"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ChevronRight, 
  ArrowRight,
  Code, 
  Rocket, 
  Users, 
  Briefcase, 
  Calendar,
  CheckCircle,
  Star,
  Brain,
  ExternalLink,
  Zap,
  GraduationCap
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ruby-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-ruby-500/20 border border-ruby-500/30 rounded-full text-ruby-300 text-sm font-medium mb-6">
              <Brain className="h-4 w-4 mr-2" />
              Now including Python & AI Engineering
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Launch Your Tech Career
              <br />
              <span className="text-ruby-500">in Guam</span>
            </h1>

            <p className="text-xl text-gray-300 mb-4">
              Guam&apos;s First Coding Bootcamp
            </p>
            
            <p className="text-2xl font-semibold text-green-400 mb-6">
              5-Week Pre-work + 15-Week Live Classes
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Only 10 Students Per Cohort</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Next cohort: February 2nd, 2026</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="https://forms.gle/8vNXoqxCimxjfXkU6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-ruby-500 hover:bg-ruby-600 text-white rounded-lg text-lg font-medium transition-all hover:scale-105 shadow-lg"
              >
                Apply for February Cohort
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

            <p className="text-gray-400">
              No coding experience required • From beginner to job-ready
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Quick highlights */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We don&apos;t just teach coding — we launch careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-ruby-100 text-ruby-600 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Small Cohorts</h3>
              <p className="text-gray-600">
                Maximum 10 students ensures personalized attention and mentorship
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Guaranteed Opportunities</h3>
              <p className="text-gray-600">
                2-3 paid positions for top performers with Shimizu Technology
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lifetime Access</h3>
              <p className="text-gray-600">
                Forever access to recordings, resources, and future curriculum updates
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/about"
              className="inline-flex items-center text-ruby-600 hover:text-ruby-700 font-medium"
            >
              Learn more about our approach
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CURRICULUM PREVIEW */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 bg-ruby-100 text-ruby-700 rounded-full text-sm font-medium mb-4">
                <Code className="w-4 h-4 mr-2" />
                20-Week Journey
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                From Zero to Full-Stack Developer
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Ruby & Rails</strong> — Backend development with the framework trusted by GitHub & Shopify</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>React.js</strong> — Modern frontend development used by Netflix & Meta</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Python & AI</strong> — Machine learning, AI tools, and data engineering</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Real Projects</strong> — Build portfolio-worthy applications</span>
                </li>
              </ul>
              <Link
                href="/curriculum"
                className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                View Full Curriculum
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src="/images/Chamorro-Chips-In-Person.png"
                alt="Code School of Guam students learning together"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* INTERNSHIP HIGHLIGHT */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4 mr-2" />
              Real-World Experience
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Graduate Into a Real Job
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Our partnership with <span className="text-ruby-400 font-semibold">Shimizu Technology</span> means top graduates work on production applications used by real businesses — not toy projects.
            </p>

            {/* Project examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold mb-1">HåfaGPT</h3>
                <p className="text-sm text-gray-400">AI-powered Chamorro language learning platform</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-2">🍳</div>
                <h3 className="font-semibold mb-1">Håfa Recipes</h3>
                <p className="text-sm text-gray-400">iOS app with 4.9★ rating on App Store</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="font-semibold mb-1">Hafaloha Orders</h3>
                <p className="text-sm text-gray-400">Handled 850+ VIP orders at live concert</p>
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

      {/* TESTIMONIAL / SOCIAL PROOF */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 leading-relaxed">
              &ldquo;The Code School of Guam gave me the skills and confidence to transition into tech. The small class size meant I got real mentorship, not just lectures.&rdquo;
            </blockquote>
            <p className="text-gray-600">
              — Code School Graduate, now Software Engineer at Shimizu Technology
            </p>
          </div>
        </div>
      </section>

      {/* PRICING CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-ruby-600 to-ruby-700 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Tuition: $7,500 — Flexible payment plans available. Next cohort starts February 2nd, 2026.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/8vNXoqxCimxjfXkU6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-ruby-600 hover:bg-gray-100 rounded-lg text-lg font-medium transition-all"
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

