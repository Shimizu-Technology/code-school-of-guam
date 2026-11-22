import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code2, GraduationCap, Route } from "lucide-react"
import { UnifiedInquiryForm } from "@/components/unified-inquiry-form"
import { buildSocialMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Focused Coding Courses",
  description:
    "Explore Code School of Guam's focused coding classes — Python Fundamentals first (early 2027 invited pilot), followed by Python Automation, SQL, and project tracks.",
  alternates: { canonical: "/courses" },
  ...buildSocialMetadata({
    title: "Focused Coding Courses | Code School of Guam",
    description:
      "Start with Python Fundamentals, then build practical skills in Python Automation, SQL, and more. Public enrollment is not open yet; join the updates list.",
    url: "/courses",
  }),
}

const entryCourses = [
  {
    title: "Python Fundamentals",
    status: "Next · Early 2027 invited pilot",
    description: "Begin with variables, decisions, loops, and functions. Build an expense-summary program you can explain.",
    href: "/courses/python-fundamentals",
  },
  {
    title: "Ruby Fundamentals",
    status: "In development",
    description: "Learn the same beginner ideas in Ruby, with a small command-line project.",
  },
  {
    title: "JavaScript Fundamentals",
    status: "In development",
    description: "Learn programming basics in the language of the browser, then build an interactive project.",
  },
]

const nextCourses = [
  { title: "Python Automation", prerequisite: "Python fundamentals", project: "Automate a useful task with files and data." },
  { title: "SQL and Data Basics", prerequisite: "Basic computer and data confidence; SQL fundamentals are taught here", project: "Ask useful questions of a real data set." },
  { title: "Frontend with JavaScript", prerequisite: "JavaScript fundamentals or equivalent", project: "Build a responsive page with real interactions." },
  { title: "APIs with Ruby on Rails", prerequisite: "Ruby fundamentals or equivalent, plus basic HTTP", project: "Create an API that stores and returns useful data." },
  { title: "AI Engineering with Python", prerequisite: "Python, HTTP/API basics, and tests", project: "Build and evaluate a small application using a model API." },
  { title: "Agent Workflows for Developers", prerequisite: "Git, tests, and one programming language", project: "Use coding agents to plan, implement, review, and verify a real change." },
]

export default function CoursesPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero relative overflow-hidden bg-[#faf7f0] text-slate-950">
        <div className="container relative mx-auto grid gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-28">
          <div>
            <p className="csg-label text-ruby-700">Code School of Guam · Focused classes</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">
              Start with one focused class. Build from there.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              We are focusing on short, practical classes — starting with Python Fundamentals, then Python Automation, SQL, and project tracks — taught online from Guam with instructor review of your project.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#course-interest" className="csg-button">
                Get course updates <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/courses/python-fundamentals" className="csg-button-secondary">
                See Python Fundamentals
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-ruby-500 pl-6 text-sm leading-7 text-slate-600 sm:text-base">
            <p>
              Our first guided class is a five-learner Python Fundamentals pilot by invitation in early 2027. The other focused classes below are in development. Public enrollment is not open yet.
            </p>
            <Link
              href="/programs"
              className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline decoration-ruby-400 underline-offset-4"
            >
              Looking for the full program (by request)? <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Course Path */}
      <section className="border-b border-slate-200 bg-white py-16 md:py-20" aria-labelledby="course-path-title">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="csg-label text-ruby-700">How the classes connect</p>
            <h2 id="course-path-title" className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              A clear path, without committing to six months upfront.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              You only need one starting language. Finish a bounded project first, then add focused skills like Python Automation or SQL when they fit your work.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="flex flex-col rounded-xl border border-[#ded7c9] bg-[#faf7f0] p-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ruby-700">Step 01 · Start here</span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-950">Fundamentals (Pick 1)</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Beginner-friendly, browser-first in Hafa Code, no prior coding required.</p>
              <div className="mt-5 space-y-2.5">
                <Link
                  href="/courses/python-fundamentals"
                  className="csg-press flex min-h-11 items-center justify-between gap-2 rounded-lg border border-ruby-700 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-950 hover:bg-[#fffaf9]"
                >
                  <span>Python Fundamentals</span>
                  <span className="rounded-full bg-[#f7eeeb] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-ruby-800">
                    Early 2027 pilot
                  </span>
                </Link>
                <div className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-[#ded7c9] bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700">
                  <span>Ruby Fundamentals</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">Planned</span>
                </div>
                <div className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-[#ded7c9] bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700">
                  <span>JavaScript Fundamentals</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">Planned</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-[#ded7c9] bg-[#faf7f0] p-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ruby-700">Step 02 · Next skills</span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-950">Focused Project Classes</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Apply your basics to automation, databases, web interfaces, APIs, or AI.</p>
              <div className="mt-5 space-y-2.5">
                <div className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-[#ded7c9] bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900">
                  <span>Python Automation</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">Next planned</span>
                </div>
                <div className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-[#ded7c9] bg-white px-3.5 py-2.5 text-sm font-bold text-slate-900">
                  <span>SQL &amp; Data Basics</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">Next planned</span>
                </div>
                <div className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-[#ded7c9] bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700">
                  <span>Frontend JS · Rails APIs · AI</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">Planned</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-[#ded7c9] bg-[#fffdf8] p-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600">Secondary path · By request</span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-slate-950">Full-Stack &amp; AI Bootcamp</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Our longer multi-month program across Ruby/Rails, React, Python, and AI with live capstone presentations.
              </p>
              <div className="mt-5 rounded-lg border border-[#ded7c9] bg-[#faf7f0] p-4 text-sm text-slate-700">
                <p className="font-bold text-slate-950">Offered by request · dates unannounced</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  The March 2026 cohort is closed (historical tuition: $7,500). Join updates if you want to be notified about a future full cohort.
                </p>
              </div>
              <Link
                href="/programs"
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-sm font-bold text-ruby-800 underline underline-offset-4"
              >
                Read about the full program <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f1ede5] py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="csg-label text-ruby-700">A format that can grow</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Practice independently. Get personal guidance when you need it.
            </h2>
          </div>
          <div className="space-y-5 leading-7 text-slate-700">
            <div className="grid gap-6 sm:grid-cols-2">
              <article className="border-t-2 border-[#c8bfb0] pt-4">
                <h3 className="text-lg font-bold text-slate-950">Self-paced · planned</h3>
                <p className="mt-2 text-sm leading-6">
                  Recordings, exercises, a project with instructor review, and a defined course-question messaging window. Enrollment is not open yet.
                </p>
              </article>
              <article className="border-t-2 border-ruby-700 pt-4">
                <h3 className="text-lg font-bold text-slate-950">Guided · invited pilot first</h3>
                <p className="mt-2 text-sm leading-6">
                  The same materials with private instructor meetings and live personal feedback. The early 2027 Python pilot tests this format with Leon; later runs are not open yet.
                </p>
              </article>
            </div>
            <p className="max-w-prose text-sm leading-6">
              Build a small project yourself before exploring an optional agent-assisted extension and testing its results. Guided capacity starts with five learners per instructor and depends on available meeting hours. Trained alumni may teach later runs as the school grows.
            </p>
            <p className="max-w-prose text-sm leading-6">
              The invited pilot is for adults. Future teen courses are being planned with guardian involvement and appropriate support; details for younger learners will be developed separately.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="csg-label text-ruby-700">First guided course · invited pilot</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Python Fundamentals</h2>
            <p className="mt-5 leading-7 text-slate-600">
              Three guided weeks for adults starting from zero. Write and run code in Hafa Code, get feedback in CSG Learn, and meet privately with Leon for one hour each week. The early 2027 invited run is capped at five learners because each person receives three private teaching hours.
            </p>
          </div>
          <div className="border-t-4 border-ruby-700 bg-[#f4f0e9] p-7 sm:p-9">
            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <p className="csg-label text-ruby-700">Build</p>
                <p className="mt-2 text-lg font-bold text-slate-950">An expense-summary program you can explain</p>
              </div>
              <div>
                <p className="csg-label text-ruby-700">Availability</p>
                <p className="mt-2 text-lg font-bold text-slate-950">Five invited seats; public updates list open</p>
              </div>
            </div>
            <Link
              href="/courses/python-fundamentals"
              className="csg-press mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-ruby-700 px-5 py-3 font-bold text-white hover:bg-ruby-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700"
            >
              See the course and join updates <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
            <div>
              <Route className="h-7 w-7 text-ruby-700" aria-hidden="true" />
              <p className="csg-label mt-5 text-ruby-700">Choose your first language</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
                Three ways to learn the fundamentals.
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                Python, Ruby, and JavaScript teach the same core ideas through different projects. You only need one starting language. Python is being tested first; the Ruby and JavaScript editions are being developed.
              </p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {entryCourses.map((course, index) => (
                <div key={course.title} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-5">
                  <span className="csg-label text-ruby-700">0{index + 1}</span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-xl font-bold text-slate-950">{course.title}</h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-ruby-700">{course.status}</span>
                    </div>
                    <p className="mt-2 leading-6 text-slate-600">{course.description}</p>
                    {course.href && (
                      <Link
                        href={course.href}
                        className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ruby-700"
                      >
                        View course <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <div>
            <p className="csg-label text-ruby-700">Build on your foundation</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Pick the next useful project.
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              These courses are in development, led by Python Automation and SQL and Data Basics. Prerequisites are recommended skills, not a requirement to purchase another CSG course. We will announce dates, format, price, and support before any enrollment opens.
            </p>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {nextCourses.map((course, index) => (
              <div key={course.title} className="grid gap-3 py-5 sm:grid-cols-[3rem_1fr] sm:gap-5">
                <span className="csg-label text-ruby-700">{String(index + 4).padStart(2, "0")}</span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold text-slate-950">{course.title}</h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In development</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Recommended: {course.prerequisite}</p>
                  <p className="mt-2 leading-6 text-slate-600">{course.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="container mx-auto mt-14 px-4 sm:px-8">
          <div className="border-l-4 border-ruby-700 bg-[#f4f0e9] p-7 sm:p-9">
            <p className="csg-label text-ruby-700">Free starting companions in preparation</p>
            <h3 className="mt-3 font-serif text-3xl font-semibold text-slate-950">GitHub Essentials and development setup</h3>
            <p className="mt-3 max-w-prose leading-7 text-slate-700">
              We are preparing a GitHub guide and Mac and Windows/WSL setup routes as optional resources for learners. They are not paid prerequisites for Python Fundamentals.
            </p>
          </div>
        </div>
      </section>

      <section id="course-interest" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="csg-label text-ruby-700">Course &amp; school updates</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Tell us what you want to learn next.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-slate-600">
              Pick the option that fits you — focused classes, the full bootcamp (by request), or a school/employer partnership. Joining an updates list is free and does not reserve a seat.
            </p>
          </div>
          <div className="border-t-4 border-ruby-700 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <UnifiedInquiryForm defaultMode="course" />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f1ede5] py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Code2 className="h-7 w-7 text-ruby-700" aria-hidden="true" />
            <h2 className="mt-5 font-serif text-3xl font-semibold text-slate-950 md:text-4xl">Focused courses (primary path)</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Practice one topic and finish a bounded project with instructor review. Planned self-paced study leaves the schedule to you; guided runs add private Zoom meetings and live coaching. A sequence builds your skills, though completing it does not equal graduating from the full bootcamp.
            </p>
          </div>
          <div>
            <GraduationCap className="h-7 w-7 text-ruby-700" aria-hidden="true" />
            <h2 className="mt-5 font-serif text-3xl font-semibold text-slate-950 md:text-4xl">Full program (by request)</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Learn across frontend, backend, databases, and AI over a longer staffed program with integrated projects, repeated reviews, collaboration, deployment, and career preparation. Future full cohorts are scheduled by demand and request.
            </p>
            <Link href="/programs" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline underline-offset-4">
              Explore the full program <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
