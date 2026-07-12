import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, GraduationCap, Mail } from "lucide-react"
import { CohortInterestForm } from "@/components/cohort-interest-form"

export const metadata: Metadata = {
  title: "Next Cohort Interest List",
  description: "Get notified when Code School of Guam confirms its next coding bootcamp cohort.",
  alternates: { canonical: "/interest" },
}

export default function InterestPage() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-900 px-4 py-16 text-white md:py-24">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-ruby-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ruby-400/30 bg-ruby-500/15 px-4 py-2 text-sm font-semibold text-ruby-300"><GraduationCap className="h-4 w-4" /> Next cohort planning</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">Be first to hear about the next Code School of Guam cohort.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">We&apos;re considering January or February 2027, but the schedule is not final. Join the interest list to receive confirmed dates and application details when they&apos;re ready.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-5 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-green-400" /> Timing still flexible</span>
            <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-blue-400" /> Updates by email</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-[0.75fr_1.25fr] md:px-6 md:py-20">
        <aside>
          <h2 className="text-2xl font-bold text-slate-900">Help shape the next class.</h2>
          <p className="mt-4 leading-7 text-slate-600">Your timing and goals help us understand demand while we plan instructor capacity, information sessions, and the next application window.</p>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">The current cohort</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Cohort 3 began March 2, 2026 and is underway. Late enrollment is closed.</p>
            <Link href="/curriculum" className="mt-4 inline-block text-sm font-semibold text-ruby-600 hover:text-ruby-700">Explore the curriculum →</Link>
          </div>
        </aside>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CohortInterestForm /></div>
      </section>
    </div>
  )
}
