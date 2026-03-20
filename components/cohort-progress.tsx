"use client"

import { ArrowRight } from "lucide-react"

const COHORT_START = new Date("2026-03-02")
const TOTAL_WEEKS = 22

function getCurrentWeek(): number {
  const now = new Date()
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weeksPassed = Math.floor((now.getTime() - COHORT_START.getTime()) / msPerWeek)
  return Math.min(Math.max(weeksPassed + 1, 1), TOTAL_WEEKS)
}

export function CohortProgressSection() {
  const currentWeek = getCurrentWeek()
  const progressPercent = Math.round((currentWeek / TOTAL_WEEKS) * 100)

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
          Cohort 3 is in session
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Building the next generation of Guam&apos;s tech workforce
        </h2>
        <p className="text-slate-600 mb-10 max-w-2xl mx-auto">
          6 students are coding full-time right now. In {TOTAL_WEEKS - currentWeek} weeks,
          they&apos;ll be job-ready full-stack developers.
        </p>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-500">Progress</span>
            <span className="text-sm font-bold text-ruby-600">Week {currentWeek} of {TOTAL_WEEKS}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
            <div
              className="bg-ruby-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mt-6">
            <div>
              <div className="text-2xl font-bold text-slate-900">6</div>
              <div className="text-xs text-slate-500 mt-1">Students enrolled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ruby-600">Week {currentWeek}</div>
              <div className="text-xs text-slate-500 mt-1">Current week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{TOTAL_WEEKS - currentWeek}</div>
              <div className="text-xs text-slate-500 mt-1">Weeks remaining</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.instagram.com/codeschoolofguam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-ruby-500 hover:bg-ruby-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Follow our journey on Instagram
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-900 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Join Cohort 4 Waitlist
          </a>
        </div>
      </div>
    </section>
  )
}
