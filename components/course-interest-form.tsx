"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

type SubmitState = "idle" | "submitting" | "success" | "error"

const inputClass = "mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-3 font-normal text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-600"

export function CourseInterestForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle")

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
        <h3 className="mt-4 font-serif text-3xl font-semibold text-slate-950">We saved your course interest.</h3>
        <p className="mt-3 text-slate-700">We&apos;ll email you when there is a real course update. This list does not reserve a seat or charge you.</p>
        <button type="button" onClick={() => setSubmitState("idle")} className="mt-5 min-h-11 font-bold text-ruby-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700">Submit another response</button>
      </div>
    )
  }

  return (
    <form name="focused-courses-interest" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="form-name" value="focused-courses-interest" />
      <p className="hidden" aria-hidden="true"><label>Do not fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-bold text-slate-900">Name <span className="text-ruby-700">*</span>
          <input required name="name" autoComplete="name" className={inputClass} />
        </label>
        <label className="block text-sm font-bold text-slate-900">Email <span className="text-ruby-700">*</span>
          <input required type="email" name="email" autoComplete="email" className={inputClass} />
        </label>
      </div>
      <label className="block text-sm font-bold text-slate-900">Which course interests you most? <span className="text-ruby-700">*</span>
        <select required name="first_choice" defaultValue="" className={inputClass}>
          <option value="" disabled>Choose one</option>
          <option value="Python Fundamentals">Python Fundamentals</option>
          <option value="Ruby Fundamentals">Ruby Fundamentals</option>
          <option value="JavaScript Fundamentals">JavaScript Fundamentals</option>
          <option value="Python Automation">Python Automation</option>
          <option value="SQL and Data Basics">SQL and Data Basics</option>
          <option value="Frontend with JavaScript">Frontend with JavaScript</option>
          <option value="APIs with Ruby on Rails">APIs with Ruby on Rails</option>
          <option value="AI Engineering with Python">AI Engineering with Python</option>
          <option value="Agent Workflows for Developers">Agent Workflows for Developers</option>
        </select>
      </label>
      <label className="block text-sm font-bold text-slate-900">What would you like to build or learn? <span className="font-normal text-slate-500">Optional</span>
        <textarea name="goal" rows={3} className={`${inputClass} resize-y`} placeholder="Tell us about a project, another course you would take, or where you are starting." />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
        <input required type="checkbox" name="update_consent" value="yes" className="mt-1 h-5 w-5 rounded border-slate-400 text-ruby-700 focus:ring-ruby-600" />
        <span>I agree to receive email updates about Code School of Guam focused courses. <span className="text-ruby-700">*</span></span>
      </label>
      {submitState === "error" && <div className="border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-800" role="alert">We couldn&apos;t save your response. Please try again or email <a className="font-bold underline" href="mailto:codeschoolofguam@gmail.com">codeschoolofguam@gmail.com</a>.</div>}
      <button type="submit" disabled={submitState === "submitting"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-ruby-700 px-5 py-3 font-bold text-white transition hover:bg-ruby-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700 disabled:cursor-wait disabled:opacity-70">
        {submitState === "submitting" ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Saving your interest</> : <>Get course updates <ArrowRight className="h-5 w-5" aria-hidden="true" /></>}
      </button>
      <p className="text-xs leading-5 text-slate-500">This is an updates list. Course dates, prices, and enrollment will be announced only when each course is ready.</p>
    </form>
  )
}
