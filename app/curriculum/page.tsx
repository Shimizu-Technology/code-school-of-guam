import Link from "next/link"
import { ArrowRight } from "lucide-react"

const foundations = [
  {
    number: "01",
    title: "Ruby & Rails",
    purpose: "Understand the server side of a complete application.",
    detail: "Programming fundamentals, data models, APIs, authentication, and database-backed workflows.",
  },
  {
    number: "02",
    title: "React & the browser",
    purpose: "Build interfaces people can use.",
    detail: "Components, state, responsive layouts, API integration, and deployment.",
  },
  {
    number: "03",
    title: "Python & AI engineering",
    purpose: "Apply AI after you understand the underlying software.",
    detail: "Python, model APIs, retrieval, prompts, evaluations, and careful review of generated work.",
  },
]

const phases = [
  { weeks: "Weeks 1–3", title: "Build a foundation", detail: "Terminal, Git, HTML, CSS, JavaScript, Ruby, and problem solving. Practice writing and explaining code before relying on AI assistance." },
  { weeks: "Weeks 4–5", title: "Add a backend", detail: "Ruby on Rails and PostgreSQL. Use AI to ask better questions while you learn to model data and reason through the code." },
  { weeks: "Weeks 6–7", title: "Connect the full stack", detail: "Rails APIs, React interfaces, state, authentication, and deployment. Debug with support while understanding each change." },
  { weeks: "Weeks 8–9", title: "Build with more independence", detail: "Create larger applications, write tests, review AI-assisted work, and make deliberate product decisions." },
  { weeks: "Weeks 10–12", title: "Study AI engineering", detail: "Python, model APIs, chatbots, retrieval, vector databases, agents, and evaluations." },
  { weeks: "Weeks 13–17", title: "Finish and present a capstone", detail: "Design, build, review, deploy, document, and present a complete project." },
]

export default function CurriculumPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero relative overflow-hidden bg-[#faf7f0] py-16 text-slate-950 md:py-24">

        <div className="container relative mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-700">The full bootcamp curriculum</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">Fundamentals first. Then the full stack.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">The March 2026 bootcamp connected programming, web development, and AI through projects that grew in scope. This is the original curriculum outline for that closed cohort; a future cohort will publish its own schedule and terms.</p>
          <Link href="/programs" className="mt-7 inline-flex items-center gap-2 font-semibold text-ruby-800 underline underline-offset-4">See the full bootcamp <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="csg-label text-ruby-700">What connects</p><h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Three parts of one working product.</h2></div>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600 lg:justify-self-end">Students learn to explain how the interface, server, database, and AI features work together. Tools are introduced because they help build something useful.</p>
          </div>
          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {foundations.map((item) => (
              <article key={item.number} className="grid gap-4 py-7 md:grid-cols-[5rem_0.8fr_1.2fr] md:gap-8 md:py-9">
                <span className="csg-label text-ruby-700">{item.number}</span>
                <div><h3 className="text-2xl font-bold text-slate-950">{item.title}</h3><p className="mt-2 font-medium text-slate-700">{item.purpose}</p></div>
                <p className="leading-relaxed text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-700">March 2026 sequence</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Capability built in stages.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">These week ranges describe the original teaching plan. Enrolled learners now follow individual completion or restart schedules, and a future cohort may use a different sequence.</p>
          <ol className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
            {phases.map((phase, index) => (
              <li key={phase.title} className="grid gap-3 py-6 sm:grid-cols-[2.5rem_8rem_1fr] sm:gap-6 md:py-8">
                <span className="csg-label text-slate-400">0{index + 1}</span>
                <span className="text-sm font-semibold text-ruby-700">{phase.weeks}</span>
                <div><h3 className="text-xl font-bold text-slate-950">{phase.title}</h3><p className="mt-2 max-w-3xl leading-relaxed text-slate-600">{phase.detail}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div><p className="csg-label text-ruby-700">How students learned</p><h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Instruction, practice, and review.</h2></div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            <p className="py-5 leading-relaxed text-slate-600"><strong className="text-slate-950">Live teaching.</strong> The March cohort began with Zoom sessions on Tuesday and Thursday evenings in Guam.</p>
            <p className="py-5 leading-relaxed text-slate-600"><strong className="text-slate-950">Structured practice.</strong> Exercises, recordings, and project work supported learning between meetings.</p>
            <p className="py-5 leading-relaxed text-slate-600"><strong className="text-slate-950">Individual support.</strong> Reviews and mentorship helped students identify a concrete next step.</p>
            <p className="py-5 leading-relaxed text-slate-600">Exact teaching, access, and support terms for any future cohort will be published with that offer.</p>
          </div>
        </div>
      </section>

      <section className="bg-ruby-700 py-16 text-white">
        <div className="container mx-auto flex flex-col gap-7 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="csg-label text-ruby-100">Future cohorts</p><h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold md:text-5xl">See what the next full program offers.</h2><p className="mt-4 max-w-2xl text-ruby-100">The March 2026 cohort is closed to new students. Join the update list for future dates and terms when they are ready.</p></div>
          <Link href="/interest" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-ruby-800">Join the update list <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  )
}
