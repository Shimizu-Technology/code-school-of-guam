import Link from "next/link"
import { ArrowRight, Code2, GraduationCap, Layers3, Users } from "lucide-react"

const differentiators = [
  { icon: Layers3, title: "Connected projects", copy: "Bring frontend, backend, databases, and AI together in applications that grow over time." },
  { icon: Code2, title: "Repeated practice and review", copy: "Return to the same engineering skills across larger problems, with instructor feedback and revision." },
  { icon: Users, title: "A staffed cohort", copy: "Learn alongside other students, collaborate, present your work, and prepare for professional development work." },
]

export default function ProgramsPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <div className="csg-grid absolute inset-0 opacity-30" />
        <div className="container relative mx-auto grid gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-28">
          <div>
            <p className="csg-label text-ruby-300">The full CSG bootcamp</p>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">Build software across the whole stack.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Our full program develops skill through sustained instruction, practice, integrated projects, collaboration, and review. It is a different commitment from a focused three-week course.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/curriculum" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ruby-600 px-6 py-3 font-bold text-white transition hover:bg-ruby-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Explore the curriculum <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
              <Link href="/interest" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Next cohort updates</Link>
            </div>
          </div>
          <aside className="border-l-2 border-ruby-500 bg-white/[0.045] p-6 sm:p-8">
            <p className="csg-label text-ruby-300">Enrollment status</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold">The March 2026 cohort is closed to new students.</h2>
            <p className="mt-4 leading-7 text-slate-300">Cohort 3 began March 2, 2026. Applications for that cohort are closed. We have not announced dates, tuition, or a staffed schedule for the next full bootcamp cohort.</p>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-3xl"><p className="csg-label text-ruby-700">Why the full program</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">More than a collection of short courses.</h2><p className="mt-5 text-lg leading-8 text-slate-600">The bootcamp connects skills over a longer period. You build, explain, revise, deploy, and work with others as the projects become more demanding.</p></div>
          <div className="mt-12 grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-3">
            {differentiators.map(({ icon: Icon, title, copy }) => <div key={title} className="border-l-2 border-ruby-700 pl-5"><Icon className="h-6 w-6 text-ruby-700" aria-hidden="true" /><h3 className="mt-4 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div><GraduationCap className="h-7 w-7 text-ruby-700" aria-hidden="true" /><p className="csg-label mt-5 text-ruby-700">The March 2026 cohort</p><h2 className="mt-3 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">How the current program was structured.</h2></div>
          <div className="divide-y divide-slate-200 border-y border-slate-200 text-slate-700">
            <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]"><strong className="text-slate-950">Duration</strong><p>Under six months, including prework and the live program.</p></div>
            <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]"><strong className="text-slate-950">Teaching</strong><p>Live Zoom instruction, structured online practice, and individual support.</p></div>
            <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]"><strong className="text-slate-950">Subjects</strong><p>Programming fundamentals, Ruby and Rails, frontend development, databases, Python, and AI engineering.</p></div>
            <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]"><strong className="text-slate-950">2026 tuition</strong><p>$7,500 for this cohort. Future cohort pricing and payment options will be published with its own terms.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1220] py-16 text-white md:py-20">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="csg-label text-ruby-300">Find your starting point</p><h2 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Stay informed about the next cohort.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">The next full bootcamp has no announced date. If you want to start sooner, explore the focused-course path and its December invited pilot.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row"><Link href="/interest" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ruby-600 px-6 py-3 font-bold text-white hover:bg-ruby-500">Bootcamp updates <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="/courses" className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">Focused courses</Link></div>
        </div>
      </section>
    </div>
  )
}
