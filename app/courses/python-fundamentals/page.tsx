import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowRight, CalendarDays, Check, Clock3, Code2, MessageCircle, Video } from "lucide-react"
import { PythonInterestForm } from "@/components/python-interest-form"

export const metadata: Metadata = {
  title: "Python Fundamentals Course",
  description: "A three-week beginner Python course from Code School of Guam, planned for January 2027. Short lessons, browser coding, a finished project, and three private Zoom hours with Leon Shimizu.",
  alternates: { canonical: "/courses/python-fundamentals" },
  openGraph: {
    title: "Python Fundamentals | Code School of Guam",
    description: "Learn Python from the beginning with short lessons, a practical project, and three private Zoom meetings. Join the January 2027 interest list.",
    url: "/courses/python-fundamentals",
  },
}

const weeks = [
  { number: "01", title: "Make a program decide", detail: "Run code, work with values, and use conditions to check a budget.", outcome: "A small budget decision program" },
  { number: "02", title: "Work with several items", detail: "Use lists, loops, dictionaries, and functions to summarize expenses.", outcome: "A data summary with reusable functions" },
  { number: "03", title: "Finish and explain it", detail: "Plan, test, and revise a complete expense-summary program.", outcome: "A working program and a code review" },
]

export default function PythonFundamentalsPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <div className="csg-grid absolute inset-0 opacity-30" />
        <div className="container relative mx-auto grid gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <p className="csg-label text-ruby-300">A focused course from Code School of Guam</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">Your first useful Python program starts here.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Three guided weeks, short lessons you can revisit, and a private hour with Leon each week. Write code in your browser and finish an expense-summary program you can explain yourself.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#interest" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ruby-600 px-6 py-3 font-bold text-white transition hover:bg-ruby-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get course updates <ArrowRight className="h-5 w-5" aria-hidden="true" /></a>
              <a href="#course-map" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">See what you&apos;ll build <ArrowDown className="h-5 w-5" aria-hidden="true" /></a>
            </div>
            <p className="mt-5 text-sm text-slate-400">Planning for January 2027 in Guam. Exact dates and enrollment will be announced after the course is tested.</p>
          </div>
          <div className="border border-white/15 bg-[#111c2c] p-5 shadow-[18px_18px_0_rgba(128,18,36,0.23)] sm:p-7" aria-label="Sample Python expense summary output">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400"><span className="font-mono">expense_summary.py</span><Code2 className="h-4 w-4 text-ruby-300" aria-hidden="true" /></div>
            <div className="mt-6 font-mono text-sm leading-8 text-slate-200 sm:text-base">
              <p><span className="text-ruby-300">$</span> python expense_summary.py</p>
              <p className="mt-4 text-white">Total: $118</p>
              <p>Food: $61</p><p>Transport: $48</p><p>Supplies: $9</p>
              <p>Largest: Groceries ($42)</p>
              <p className="mt-2 text-green-300">Under budget by $2</p>
            </div>
            <p className="mt-7 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">This is the sample program you&apos;ll build step by step. No prior coding experience required.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-0 px-4 sm:grid-cols-3 sm:px-8">
          {[
            [CalendarDays, "Three weeks", "Short lessons and practice"],
            [Video, "Three private hours", "One Zoom meeting each week"],
            [Code2, "One finished project", "Built and reviewed in Python"],
          ].map(([Icon, title, detail]) => {
            const ItemIcon = Icon as typeof CalendarDays
            return <div key={String(title)} className="flex gap-4 border-b border-slate-200 py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"><ItemIcon className="mt-1 h-6 w-6 shrink-0 text-ruby-700" aria-hidden="true" /><div><strong className="text-slate-950">{String(title)}</strong><p className="mt-1 text-sm text-slate-600">{String(detail)}</p></div></div>
          })}
        </div>
      </section>

      <section id="course-map" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div><p className="csg-label text-ruby-700">The course map</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">A clear next step every week.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">You&apos;ll predict what code does, run it, make a change, and explain the result. Each week ends with something you can show Leon in your private meeting.</p></div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {weeks.map((week) => <article key={week.number} className="grid gap-2 py-7 sm:grid-cols-[3rem_1fr] sm:gap-6"><span className="csg-label text-ruby-700">{week.number}</span><div><h3 className="text-2xl font-bold text-slate-950">{week.title}</h3><p className="mt-2 leading-7 text-slate-600">{week.detail}</p><p className="mt-3 text-sm font-bold text-ruby-700">You&apos;ll have: {week.outcome}</p></div></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div><p className="csg-label text-ruby-700">How you&apos;ll learn</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Learn on your schedule. Get help from a person.</h2><p className="mt-5 max-w-xl leading-7 text-slate-600">The lessons and code practice live in CSG Learn and Hafa Code. Leon works through your own code with you on Zoom each week, then gives you a concrete next step.</p></div>
          <div className="space-y-0 border-t border-slate-200">
            {[
              [Clock3, "Short, focused lessons", "Nine lessons across three weeks, with exercises and weekly checkpoints."],
              [Code2, "Code in your browser", "Hafa Code is the starting point. Local Python setup and GitHub are optional."],
              [Video, "One-to-one Zoom meetings", "One private 60-minute session each week, booked from available times in CSG Learn."],
              [MessageCircle, "Questions and feedback", "Ask course questions through CSG Learn and get a written review of your final project."],
            ].map(([Icon, title, detail]) => {
              const ItemIcon = Icon as typeof Clock3
              return <div key={String(title)} className="flex gap-4 border-b border-slate-200 py-5"><ItemIcon className="mt-1 h-5 w-5 shrink-0 text-ruby-700" aria-hidden="true" /><div><h3 className="font-bold text-slate-950">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{String(detail)}</p></div></div>
            })}
          </div>
        </div>
      </section>

      <section id="interest" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="csg-label text-ruby-700">January pilot interest</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Be first to see the finished course.</h2>
            <p className="mt-5 max-w-lg leading-7 text-slate-600">We&apos;re planning a small first run for up to four adult beginners. Join this course-specific list and we&apos;ll send you the confirmed dates, sample lesson, price, and enrollment details when they&apos;re ready. This form does not reserve a seat.</p>
            <ul className="mt-7 space-y-3 text-sm leading-6 text-slate-700">
              <li className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> Complete beginners are welcome.</li>
              <li className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> Python runs in your browser; no install is required to start.</li>
              <li className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" /> This focused course is separate from the full CSG bootcamp.</li>
            </ul>
            <p className="mt-8 text-sm text-slate-600">Looking for the full program? <Link href="/interest" className="font-bold text-ruby-700 underline underline-offset-4">Join the next cohort list</Link>.</p>
          </div>
          <div className="border-t-4 border-ruby-700 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <p className="csg-label text-ruby-700">Python Fundamentals updates</p>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-slate-950">Tell us where to send them.</h3>
            <div className="mt-7"><PythonInterestForm /></div>
          </div>
        </div>
      </section>
    </div>
  )
}
