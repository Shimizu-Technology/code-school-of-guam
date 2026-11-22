import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, GraduationCap, Mail } from "lucide-react"
import { UnifiedInquiryForm } from "@/components/unified-inquiry-form"
import { buildSocialMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Next Cohort Interest List",
  description: "Get notified if Code School of Guam schedules a future full bootcamp cohort, or switch to focused-course updates or partnership inquiries.",
  alternates: { canonical: "/interest" },
  ...buildSocialMetadata({
    title: "Next Cohort Interest List | Code School of Guam",
    description: "Get notified if Code School of Guam schedules a future full bootcamp cohort.",
    url: "/interest",
  }),
}

export default function InterestPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero relative overflow-hidden bg-[#faf7f0] px-4 py-14 text-slate-950 md:py-24">
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="csg-label inline-flex items-center gap-2 text-ruby-700">
            <GraduationCap className="h-4 w-4" aria-hidden="true" /> Full program · by request
          </div>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl">
            Stay in the loop on future Code School of Guam cohorts.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            We are leading with focused classes (Python Fundamentals, Python Automation, SQL). Future full bootcamp dates have not been announced — leave your email to hear if a new full cohort is scheduled, or switch tabs below for focused courses or partnerships.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-5 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-ruby-700" aria-hidden="true" /> Full program dates unannounced</span>
            <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-ruby-700" aria-hidden="true" /> Updates by email</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-[0.75fr_1.25fr] md:px-6 md:py-20">
        <aside>
          <p className="csg-label text-ruby-700">Your interest matters</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950">Help shape what runs next.</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Only Name, Email, and Consent are required. Share your timing or goals if you&apos;d like to help us plan instructor capacity and future runs.
          </p>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">March 2026 cohort</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Cohort 3 began March 2, 2026. Enrollment is closed.</p>
            <Link href="/curriculum" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-ruby-700 underline underline-offset-4 hover:text-ruby-800">
              Explore the curriculum →
            </Link>
          </div>
        </aside>
        <div className="border-t-4 border-ruby-700 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
          <UnifiedInquiryForm defaultMode="bootcamp" />
        </div>
      </section>
    </div>
  )
}
