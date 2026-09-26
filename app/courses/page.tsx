import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code2, GraduationCap, Route } from "lucide-react"

export const metadata: Metadata = {
  title: "Focused Coding Courses",
  description: "Explore focused coding courses from Code School of Guam and see how they relate to the full bootcamp. Python Fundamentals is being tested with an invited group in December 2026.",
  alternates: { canonical: "/courses" },
}

const nextCourses = [
  { title: "Python Automation", prerequisite: "After Python Fundamentals", project: "Automate a useful task with files and data." },
  { title: "SQL and Data Basics", prerequisite: "After a fundamentals course", project: "Ask useful questions of a real data set." },
  { title: "Ruby Fundamentals", prerequisite: "Beginner entry point", project: "Learn the same core ideas through Ruby." },
  { title: "JavaScript Fundamentals", prerequisite: "Beginner entry point", project: "Learn the same core ideas through JavaScript." },
]

export default function CoursesPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <div className="csg-grid absolute inset-0 opacity-30" />
        <div className="container relative mx-auto grid gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-28">
          <div>
            <p className="csg-label text-ruby-300">Code School of Guam courses</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">Learn one skill. Build something with it.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Our focused courses pair short lessons and practice with private instructor time. Start with a subject that fits your goals, then follow a recommended path as more courses become available.</p>
          </div>
          <div className="border-l-2 border-ruby-500 pl-6 text-sm leading-7 text-slate-300 sm:text-base">
            <p>We are preparing our first course with a small invited group in December 2026. Public enrollment and dates for later courses have not been announced.</p>
            <Link href="/programs" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-white underline decoration-ruby-400 underline-offset-4">Looking for the full bootcamp? <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="csg-label text-ruby-700">First course · invited pilot</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">Python Fundamentals</h2>
            <p className="mt-5 leading-7 text-slate-600">Three guided weeks for adults starting from zero. Write and run code in Hafa Code, get feedback in CSG Learn, and meet privately with Leon for one hour each week.</p>
          </div>
          <div className="border-t-4 border-ruby-700 bg-[#f4f0e9] p-7 sm:p-9">
            <div className="grid gap-7 sm:grid-cols-2">
              <div><p className="csg-label text-ruby-700">Build</p><p className="mt-2 text-lg font-bold text-slate-950">An expense-summary program you can explain</p></div>
              <div><p className="csg-label text-ruby-700">Availability</p><p className="mt-2 text-lg font-bold text-slate-950">December invited pilot; public updates list open</p></div>
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
              <p className="csg-label mt-5 text-ruby-700">A recommended path</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">See what could come next.</h2>
              <p className="mt-5 leading-7 text-slate-600">Python Fundamentals leads naturally into Python Automation, then SQL and Data Basics. These are recommendations, not required purchases or announced course dates. Experienced learners may enter later after a skills check.</p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {nextCourses.map((course, index) => <div key={course.title} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-5"><span className="csg-label text-ruby-700">0{index + 1}</span><div><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-xl font-bold text-slate-950">{course.title}</h3><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Planned</span></div><p className="mt-2 text-sm text-slate-500">{course.prerequisite}</p><p className="mt-2 leading-6 text-slate-600">{course.project}</p></div></div>)}
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-600">GitHub Essentials and Mac/Windows setup guides are being prepared as optional companions. Ruby with Rails APIs, JavaScript with frontend development, and later AI courses are part of the longer plan; their schedules are not set.</p>
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
