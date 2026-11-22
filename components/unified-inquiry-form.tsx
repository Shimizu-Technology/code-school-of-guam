"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

export type InquiryMode = "course" | "bootcamp" | "partner"

type SubmitState = "idle" | "submitting" | "success" | "error"

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-950 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700"

const selectClass =
  "mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-normal text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700"

const MODE_CONFIG: Record<
  InquiryMode,
  {
    chipLabel: string
    formName: string
    ariaLabel: string
    heading: string
    intro: string
    submitLabel: string
    successHeading: string
    successBody: string
    consentText: string
    footerNote: string
  }
> = {
  course: {
    chipLabel: "Focused courses",
    formName: "focused-courses-interest",
    ariaLabel: "Focused-course updates list",
    heading: "Get focused-course updates",
    intro: "Python Fundamentals first, followed by Python Automation, SQL, and other focused classes.",
    submitLabel: "Get focused-course updates",
    successHeading: "We saved your course interest.",
    successBody:
      "We'll email you when there is a real course update. Joining this list is free and does not reserve a seat or charge you.",
    consentText: "I agree to receive email updates about Code School of Guam focused courses.",
    footerNote:
      "Free updates list — does not reserve a seat. Course dates, prices, and written terms will be published before enrollment opens.",
  },
  bootcamp: {
    chipLabel: "Full bootcamp",
    formName: "next-cohort-interest",
    ariaLabel: "Full bootcamp updates list",
    heading: "Get full bootcamp updates",
    intro: "For the longer full-stack & AI program (by request; next cohort dates unannounced).",
    submitLabel: "Join full bootcamp updates",
    successHeading: "You're on the bootcamp updates list.",
    successBody:
      "We'll email you if a future full bootcamp cohort is scheduled or when application details are ready.",
    consentText:
      "I agree to receive email updates about Code School of Guam's full bootcamp and related information sessions.",
    footerNote:
      "Interest list only, not an application or seat reservation. Future full bootcamp dates, schedule, and tuition have not been announced.",
  },
  partner: {
    chipLabel: "School / employer partner",
    formName: "partner-inquiry",
    ariaLabel: "Partner inquiry form",
    heading: "Start a partner conversation",
    intro: "For Guam schools, universities, employers, or workforce sponsors exploring training or partnerships.",
    submitLabel: "Send partner inquiry",
    successHeading: "We received your partnership inquiry.",
    successBody:
      "Leon reviews every partnership note personally and aims to reply within 1–2 business days (Guam time).",
    consentText: "I agree to be contacted by Code School of Guam about this partnership inquiry.",
    footerNote: "Direct reply from Leon within 1–2 business days (Guam time). Or email codeschoolofguam@gmail.com.",
  },
}

const MODES: readonly InquiryMode[] = ["course", "bootcamp", "partner"]

export function UnifiedInquiryForm({
  defaultMode = "course",
  showHeading = true,
}: {
  defaultMode?: InquiryMode
  showHeading?: boolean
}) {
  const [mode, setMode] = useState<InquiryMode>(defaultMode)
  const [submitState, setSubmitState] = useState<SubmitState>("idle")

  const config = MODE_CONFIG[mode]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState("submitting")

    const form = event.currentTarget
    const body = new URLSearchParams()
    new FormData(form).forEach((value, key) => body.append(key, String(value)))

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      })
      if (!response.ok) throw new Error("Submission failed")
      form.reset()
      setSubmitState("success")
    } catch {
      setSubmitState("error")
    }
  }

  if (submitState === "success") {
    return (
      <div className="border-l-4 border-green-600 bg-green-50 p-7" role="status">
        <CheckCircle2 className="h-8 w-8 text-green-700" aria-hidden="true" />
        <h3 className="mt-4 font-serif text-3xl font-semibold text-slate-950">{config.successHeading}</h3>
        <p className="mt-3 text-slate-700">{config.successBody}</p>
        <button
          type="button"
          onClick={() => setSubmitState("idle")}
          className="mt-5 min-h-11 font-bold text-ruby-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700"
        >
          Submit another response
        </button>
      </div>
    )
  }

  return (
    <div>
      {showHeading ? (
        <div className="mb-5">
          <p className="csg-label text-ruby-700">I&apos;m interested in</p>
          <h3 className="mt-2 font-serif text-3xl font-semibold text-slate-950">{config.heading}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{config.intro}</p>
        </div>
      ) : null}

      <div role="group" aria-label="Choose inquiry topic" className="mb-6 flex flex-wrap gap-2">
        {MODES.map((item) => {
          const selected = mode === item
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setMode(item)
                setSubmitState("idle")
              }}
              className={`csg-press min-h-11 rounded-md border px-3.5 py-2 text-sm font-bold ${
                selected
                  ? "border-ruby-700 bg-[#f7eeeb] text-ruby-800"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-950"
              }`}
            >
              {MODE_CONFIG[item].chipLabel}
            </button>
          )
        })}
      </div>

      <form
        key={mode}
        name={config.formName}
        aria-label={config.ariaLabel}
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input type="hidden" name="form-name" value={config.formName} />
        <p className="hidden" aria-hidden="true">
          <label>
            Do not fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold text-slate-900">
            Name <span className="text-ruby-700">*</span>
            <input required name="name" autoComplete="name" className={inputClass} />
          </label>
          <label className="block text-sm font-bold text-slate-900">
            Email <span className="text-ruby-700">*</span>
            <input required type="email" name="email" autoComplete="email" className={inputClass} />
          </label>
        </div>

        {mode === "course" ? (
          <>
            <label className="block text-sm font-bold text-slate-900">
              Which course interests you first? <span className="font-normal text-slate-500">Optional</span>
              <select name="first_choice" defaultValue="Python Fundamentals" className={selectClass}>
                <option value="Python Fundamentals">Python Fundamentals (Next · Early 2027)</option>
                <option value="Python Automation">Python Automation</option>
                <option value="SQL and Data Basics">SQL and Data Basics</option>
                <option value="Ruby Fundamentals">Ruby Fundamentals</option>
                <option value="JavaScript Fundamentals">JavaScript Fundamentals</option>
                <option value="Frontend with JavaScript">Frontend with JavaScript</option>
                <option value="APIs with Ruby on Rails">APIs with Ruby on Rails</option>
                <option value="AI Engineering with Python">AI Engineering with Python</option>
                <option value="Agent Workflows for Developers">Agent Workflows for Developers</option>
              </select>
            </label>
            <label className="block text-sm font-bold text-slate-900">
              What would you like to build or learn? <span className="font-normal text-slate-500">Optional</span>
              <textarea
                name="goal"
                rows={3}
                className={`${inputClass} resize-y`}
                placeholder="Tell us about a project, another course you'd take, or where you're starting."
              />
            </label>
          </>
        ) : null}

        {mode === "bootcamp" ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-900">
                Usual meeting times <span className="font-normal text-slate-500">Optional</span>
                <select name="preferred_timing" defaultValue="" className={selectClass}>
                  <option value="">Select a preference</option>
                  <option value="Weekday daytime">Weekday daytime</option>
                  <option value="Weekday evenings">Weekday evenings</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Flexible">I&apos;m flexible</option>
                </select>
              </label>
              <label className="block text-sm font-bold text-slate-900">
                Coding experience <span className="font-normal text-slate-500">Optional</span>
                <select name="experience_level" defaultValue="" className={selectClass}>
                  <option value="">Select your experience</option>
                  <option value="Complete beginner">Complete beginner</option>
                  <option value="Some self-study">Some self-study</option>
                  <option value="Built a few projects">I&apos;ve built a few projects</option>
                  <option value="Professional experience">Professional experience</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-bold text-slate-900">
              Phone <span className="font-normal text-slate-500">Optional</span>
              <input type="tel" name="phone" autoComplete="tel" className={inputClass} />
            </label>
            <label className="block text-sm font-bold text-slate-900">
              What would you like to accomplish? <span className="font-normal text-slate-500">Optional</span>
              <textarea
                name="primary_goal"
                rows={3}
                className={`${inputClass} resize-y`}
                placeholder="For example: change careers, build a product, or request a future cohort."
              />
            </label>
          </>
        ) : null}

        {mode === "partner" ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-900">
                Organization or school <span className="font-normal text-slate-500">Optional</span>
                <input name="organization" autoComplete="organization" className={inputClass} placeholder="School, business, or agency name" />
              </label>
              <label className="block text-sm font-bold text-slate-900">
                Partnership track <span className="font-normal text-slate-500">Optional</span>
                <select name="partnership_type" defaultValue="Schools & Universities" className={selectClass}>
                  <option value="Schools & Universities">Schools &amp; Universities</option>
                  <option value="Guam Employers & Teams">Guam Employers &amp; Teams</option>
                  <option value="Workforce & Community Sponsors">Workforce &amp; Community Sponsors</option>
                  <option value="Other">Other partnership idea</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-bold text-slate-900">
              How can we work together? <span className="font-normal text-slate-500">Optional</span>
              <textarea
                name="goal"
                rows={3}
                className={`${inputClass} resize-y`}
                placeholder="Share a workshop idea, staff training goal, or sponsorship question."
              />
            </label>
          </>
        ) : null}

        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            required
            type="checkbox"
            name="update_consent"
            value="yes"
            className="mt-1 h-5 w-5 shrink-0 rounded border-slate-400 text-ruby-700 focus:ring-ruby-600"
          />
          <span>
            {config.consentText} <span className="text-ruby-700">*</span>
          </span>
        </label>

        {submitState === "error" ? (
          <div className="border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-800" role="alert">
            We couldn&apos;t save your response. Please try again or email{" "}
            <a className="font-bold underline" href="mailto:codeschoolofguam@gmail.com">
              codeschoolofguam@gmail.com
            </a>
            .
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="csg-press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ruby-700 px-5 py-3 font-bold text-white hover:bg-ruby-800 active:bg-ruby-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700 disabled:cursor-wait disabled:opacity-70"
        >
          {submitState === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Saving your note
            </>
          ) : (
            <>
              {config.submitLabel} <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-xs leading-5 text-slate-500">{config.footerNote}</p>
      </form>
    </div>
  )
}
