"use client"

import { FormEvent, useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

type SubmitState = "idle" | "submitting" | "success" | "error"

export function CohortInterestForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState("submitting")

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = new URLSearchParams()
    formData.forEach((value, key) => body.append(key, String(value)))

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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center" role="status">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
        <h2 className="mt-4 text-2xl font-bold text-slate-900">You&apos;re on the interest list.</h2>
        <p className="mt-3 text-slate-600">We&apos;ll email you when the next cohort timing, application process, and information sessions are confirmed.</p>
        <button type="button" onClick={() => setSubmitState("idle")} className="mt-6 text-sm font-semibold text-ruby-600 hover:text-ruby-700">Submit another response</button>
      </div>
    )
  }

  return (
    <form
      name="next-cohort-interest"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value="next-cohort-interest" />
      <p className="hidden" aria-hidden="true"><label>Do not fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-800">
          Name <span className="text-ruby-600">*</span>
          <input required name="name" autoComplete="name" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20" />
        </label>
        <label className="block text-sm font-semibold text-slate-800">
          Email <span className="text-ruby-600">*</span>
          <input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20" />
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-800">
        Phone <span className="font-normal text-slate-500">(optional)</span>
        <input type="tel" name="phone" autoComplete="tel" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20" />
      </label>

      <label className="block text-sm font-semibold text-slate-800">
        What timing would work best? <span className="text-ruby-600">*</span>
        <select required name="preferred_timing" defaultValue="" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20">
          <option value="" disabled>Select a preference</option>
          <option value="January 2027">January 2027</option>
          <option value="February 2027">February 2027</option>
          <option value="Later in 2027">Later in 2027</option>
          <option value="Flexible">I&apos;m flexible</option>
        </select>
      </label>

      <label className="block text-sm font-semibold text-slate-800">
        Current coding experience <span className="text-ruby-600">*</span>
        <select required name="experience_level" defaultValue="" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20">
          <option value="" disabled>Select your experience</option>
          <option value="Complete beginner">Complete beginner</option>
          <option value="Some self-study">Some self-study</option>
          <option value="Built a few projects">I&apos;ve built a few projects</option>
          <option value="Professional experience">Professional experience</option>
        </select>
      </label>

      <label className="block text-sm font-semibold text-slate-800">
        What would you most like to accomplish? <span className="text-ruby-600">*</span>
        <textarea required name="primary_goal" rows={4} className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20" placeholder="For example: change careers, build a product, or add AI skills..." />
      </label>

      <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
        <input required type="checkbox" name="update_consent" value="yes" className="mt-1 h-4 w-4 rounded border-slate-300 text-ruby-600 focus:ring-ruby-500" />
        <span>I agree to receive email updates about Code School of Guam&apos;s next cohort and related information sessions. <span className="text-ruby-600">*</span></span>
      </label>

      {submitState === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          We couldn&apos;t save your response. Please try again or email <a className="font-semibold underline" href="mailto:codeschoolofguam@gmail.com">codeschoolofguam@gmail.com</a>.
        </div>
      )}

      <button disabled={submitState === "submitting"} type="submit" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-ruby-600 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-ruby-700 disabled:cursor-wait disabled:opacity-70">
        {submitState === "submitting" ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving your interest</> : "Join the interest list"}
      </button>
      <p className="text-center text-xs leading-5 text-slate-500">This is an interest list, not an application. January and February 2027 are being considered, but no date has been announced.</p>
    </form>
  )
}
