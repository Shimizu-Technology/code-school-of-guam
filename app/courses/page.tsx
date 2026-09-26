import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code2, GraduationCap, Route } from "lucide-react"
import { CourseInterestForm } from "@/components/course-interest-form"

export const metadata: Metadata = {
  title: "Focused Coding Courses",
  description: "Explore Code School of Guam's beginner and project-based coding course plans. Python Fundamentals begins with a five-learner invited pilot in December 2026; public enrollment is not open.",
  alternates: { canonical: "/courses" },
}

const entryCourses = [
  { title: "Python Fundamentals", status: "Invited pilot", description: "Begin with variables, decisions, loops, and functions. Build an expense-summary program.", href: "/courses/python-fundamentals" },
  { title: "Ruby Fundamentals", status: "In development", description: "Learn the same beginner ideas in Ruby, with a small command-line project." },
  { title: "JavaScript Fundamentals", status: "In development", description: "Learn programming basics in the language of the browser, then build an interactive project." },
]

const nextCourses = [
  { title: "Python Automation", prerequisite: "Python fundamentals", project: "Automate a useful task with files and data." },
  { title: "SQL and Data Basics", prerequisite: "Any fundamentals course", project: "Ask useful questions of a real data set." },
  { title: "Frontend with JavaScript", prerequisite: "JavaScript fundamentals or equivalent", project: "Build a responsive page with real interactions." },
  { title: "APIs with Ruby on Rails", prerequisite: "Ruby fundamentals or equivalent", project: "Create an API that stores and returns useful data." },
  { title: "AI Engineering with Python", prerequisite: "Python and API basics", project: "Build and evaluate a small application using a model API." },
  { title: "Agent Workflows for Developers", prerequisite: "Experience building and testing software", project: "Use coding agents to plan, implement, review, and verify a real change." },
]

export default function CoursesPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <div className="csg-grid absolute inset-0 opacity-30" />
        <div className="container relative mx-auto grid gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-28">
          <div>
            <p className="csg-label text-ruby-300">Code School of Guam courses</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">Choose a starting point. Keep building from there.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Start with a language that interests you, then move into projects with data, interfaces, APIs, or AI. Each course is designed around something you can make and explain.</p>
          </div>
          <div className="border-l-2 border-ruby-500 pl-6 text-sm leading-7 text-slate-300 sm:text-base">
            <p>Our first guided course is a five-learner Python pilot by invitation in December 2026. The other courses below are in development. Join the interest list to help us decide what to build and offer next.</p>
            <Link href="/programs" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-white underline decoration-ruby-400 underline-offset-4">Looking for the full bootcamp? <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="csg-label text-ruby-700">First guided course · invited pilot</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Python Fundamentals</h2>
            <p className="mt-5 leading-7 text-slate-600">Three guided weeks for adults starting from zero. Write and run code in Hafa Code, get feedback in CSG Learn, and meet privately with Leon for one hour each week. The December invited run is capped at five learners because each person receives three private teaching hours.</p>
          </div>
          <div className="border-t-4 border-ruby-700 bg-[#f4f0e9] p-7 sm:p-9">
            <div className="grid gap-7 sm:grid-cols-2">
              <div><p className="csg-label text-ruby-700">Build</p><p className="mt-2 text-lg font-bold text-slate-950">An expense-summary program you can explain</p></div>
              <div><p className="csg-label text-ruby-700">Availability</p><p className="mt-2 text-lg font-bold text-slate-950">Five invited seats; public updates list open</p></div>
            </div>
            <Link href="/courses/python-fundamentals" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-ruby-700 px-5 py-3 font-bold text-white transition hover:bg-ruby-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700">See the course and join updates <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
            <div>
              <Route className="h-7 w-7 text-ruby-700" aria-hidden="true" />
              <p className="csg-label mt-5 text-ruby-700">Choose your first language</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Three ways to learn the fundamentals.</h2>
              <p className="mt-5 leading-7 text-slate-600">Python, Ruby, and JavaScript teach the same core ideas through different projects. You only need one starting language. Python is being tested first; the Ruby and JavaScript editions are being developed.</p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {entryCourses.map((course, index) => <div key={course.title} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-5"><span className="csg-label text-ruby-700">0{index + 1}</span><div><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-xl font-bold text-slate-950">{course.title}</h3><span className="text-xs font-bold uppercase tracking-wider text-ruby-700">{course.status}</span></div><p className="mt-2 leading-6 text-slate-600">{course.description}</p>{course.href && <Link href={course.href} className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700">View course <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}</div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <div><p className="csg-label text-ruby-700">Build on your foundation</p><h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Pick the next useful project.</h2><p className="mt-5 leading-7 text-slate-600">These courses are in development. Prerequisites are recommended skills, not a requirement to purchase another CSG course. We will announce dates, format, price, and support before any enrollment opens.</p></div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {nextCourses.map((course, index) => <div key={course.title} className="grid gap-3 py-5 sm:grid-cols-[3rem_1fr] sm:gap-5"><span className="csg-label text-ruby-700">{String(index + 4).padStart(2, "0")}</span><div><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-xl font-bold text-slate-950">{course.title}</h3><span className="text-xs font-bold uppercase tracking-wider text-slate-500">In development</span></div><p className="mt-2 text-sm text-slate-500">Recommended: {course.prerequisite}</p><p className="mt-2 leading-6 text-slate-600">{course.project}</p></div></div>)}
          </div>
        </div>
        <div className="container mx-auto mt-14 px-4 sm:px-8"><div className="border-l-4 border-ruby-700 bg-[#f4f0e9] p-7 sm:p-9"><p className="csg-label text-ruby-700">Free starting companions in preparation</p><h3 className="mt-3 font-serif text-3xl font-semibold text-slate-950">GitHub Essentials and development setup</h3><p className="mt-3 max-w-3xl leading-7 text-slate-700">We are preparing a GitHub guide and Mac and Windows/WSL setup routes as optional resources for learners. They are not paid prerequisites for Python Fundamentals.</p></div></div>
      </section>

      <section id="course-interest" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div><p className="csg-label text-ruby-700">Course updates</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Tell us what you would take.</h2><p className="mt-5 max-w-lg leading-7 text-slate-600">Choose the course you would want first. We will use interest and pilot feedback to decide what to finish and schedule next. Joining this list is free and does not reserve a seat. If you want the full bootcamp, use its separate <Link href="/interest" className="font-bold text-ruby-800 underline underline-offset-4">cohort interest list</Link>.</p></div>
          <div className="border-t-4 border-ruby-700 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8"><h3 className="font-serif text-3xl font-semibold text-slate-950">Get focused-course updates</h3><div className="mt-7"><CourseInterestForm /></div></div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f1ede5] py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div><Code2 className="h-7 w-7 text-ruby-700" aria-hidden="true" /><h2 className="mt-5 font-serif text-3xl font-semibold text-slate-950 md:text-4xl">Focused courses</h2><p className="mt-4 leading-7 text-slate-700">Practice one topic, finish a bounded project, and get private help and feedback during that course. A sequence can build your skills, but completing it does not equal graduating from the full program.</p></div>
          <div><GraduationCap className="h-7 w-7 text-ruby-700" aria-hidden="true" /><h2 className="mt-5 font-serif text-3xl font-semibold text-slate-950 md:text-4xl">Full bootcamp</h2><p className="mt-4 leading-7 text-slate-700">Learn across frontend, backend, databases, and AI over a longer staffed program with integrated projects, repeated reviews, collaboration, deployment, and career preparation.</p><Link href="/programs" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline underline-offset-4">Explore the full program <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        </div>
      </section>
    </div>
  )
}
