"use client"

import Link from "next/link"
import { 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Clock, 
  Users, 
  Briefcase, 
  GraduationCap,
  Calendar,
  CreditCard
} from "lucide-react"

export default function ProgramsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            Only 1 Class in 2026!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Next Cohort Starts <span className="text-ruby-500">March 2, 2026</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
            Comprehensive program (under 6 months) with <span className="text-white font-semibold">Ruby, Rails, React, Python & AI Engineering</span>
          </p>
          <div className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-1" />
            Enrollment now open — Limited spots
          </div>
        </div>
        {/* Fade to next section - dark to light */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Main Pricing Section */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Program Details */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-ruby-500" />
                Live Coding Bootcamp
              </h2>
              <p className="text-slate-600 mb-6">
                Under 6 months • Fully Remote • Max 10 Students • Ruby, Rails, React, Python & AI
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900">15-16</div>
                  <div className="text-sm text-slate-600">Hours/Week</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900">Max 10</div>
                  <div className="text-sm text-slate-600">Students</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="w-1 h-full bg-ruby-500 rounded mr-3 self-stretch"></div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Live Classes:</h4>
                    <p className="text-slate-600 text-sm">Monday – Thursday, 6:00pm – 9:00pm</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-1 h-full bg-slate-300 rounded mr-3 self-stretch"></div>
                  <div>
                    <h4 className="font-semibold text-slate-900">3-Day Weekend:</h4>
                    <p className="text-slate-600 text-sm">Homework & Deliberate Practice</p>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Live instruction via Zoom + optional in-person sessions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Lifetime access to all recordings & materials
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Optional internship + paid TA/dev opportunities
                </li>
              </ul>
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-ruby-500 to-ruby-600 rounded-2xl p-8 text-white">
              <h2 className="text-xl font-bold mb-6">New Lower Tuition</h2>
              <div className="mb-6">
                <div className="text-slate-200 line-through text-lg">$10,000</div>
                <div className="text-5xl font-bold mb-2">$7,500</div>
                <div className="text-ruby-200">March 2026 Cohort</div>
              </div>

              <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-8">
                <Star className="h-4 w-4 mr-1" />
                25% Lower Than Before!
              </div>

              <a
                href="https://forms.gle/nJv8nAfxsvvLSbbq7"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-4 bg-white text-ruby-600 hover:bg-slate-100 rounded-lg font-medium transition-colors mb-4"
              >
                Apply for March Cohort →
              </a>

              <button className="block w-full text-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-medium transition-colors text-sm">
                Questions? Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
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
                  <div className="text-sm text-slate-600">Without real-world experience</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-slate-900 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-600">Save over $8,500</span> while getting MORE value with our locally-focused program
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Flexible Payment Options
            </h2>
            <p className="text-slate-600">
              Choose the payment plan that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Pay in Full</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">$7,500</div>
              <p className="text-sm text-slate-600">One-time payment</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Monthly Plans</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">$950+</div>
              <p className="text-sm text-slate-600">4-8 month plans</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">PFC Financing</h3>
              <div className="text-2xl font-bold text-purple-600 mb-2">Apply</div>
              <p className="text-sm text-slate-600">Bank partnership</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-12 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Commitment to Accessibility</h3>
            <p className="text-slate-600">
              While comparable programs charge $15,000-$20,000, we&apos;ve set our tuition lower to make quality coding education accessible to motivated students in Guam and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions about payment?</h2>
          <p className="text-slate-300 mb-6">
            We&apos;re happy to discuss options that work for your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/nJv8nAfxsvvLSbbq7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-ruby-500 hover:bg-ruby-600 text-white rounded-lg font-medium transition-colors"
            >
              Apply Now
            </a>
            <Link
              href="/faq"
              className="inline-flex items-center text-slate-300 hover:text-white font-medium"
            >
              View FAQs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
