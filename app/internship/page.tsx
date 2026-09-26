import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Code2, GraduationCap } from "lucide-react"

export default function InternshipPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <div className="csg-grid absolute inset-0 opacity-30" />
        <div className="container relative mx-auto px-4 py-16 sm:px-8 md:py-24 lg:py-28">
          <p className="csg-label text-ruby-300">Professional practice</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">Learn what it takes to work on real software.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">The full CSG bootcamp teaches collaboration, code review, deployment, and the judgment needed to maintain applications beyond a classroom exercise.</p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div><BriefcaseBusiness className="h-7 w-7 text-ruby-700" aria-hidden="true" /><h2 className="mt-5 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Experience depends on the project and the person.</h2></div>
          <div className="space-y-5 text-lg leading-8 text-slate-700"><p>Through Shimizu Technology, CSG has given some graduates opportunities to practice on real software. The work, supervision, and availability vary with active projects and each graduate&apos;s readiness.</p><p>An internship, contract, teaching role, or job is <strong>not guaranteed</strong> by completing a focused course or the full bootcamp. If a future cohort offers a defined internship, its eligibility, scope, compensation, supervision, and terms will be provided with that cohort&apos;s offer.</p></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-700">What you practice in the full program</p>
          <div className="mt-8 grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-3">
            <div className="border-l-2 border-ruby-700 pl-5"><Code2 className="h-6 w-6 text-ruby-700" aria-hidden="true" /><h3 className="mt-4 text-xl font-bold text-slate-950">Build and revise</h3><p className="mt-3 leading-7 text-slate-600">Turn a problem into a working application, test it, and improve it after review.</p></div>
            <div className="border-l-2 border-ruby-700 pl-5"><GraduationCap className="h-6 w-6 text-ruby-700" aria-hidden="true" /><h3 className="mt-4 text-xl font-bold text-slate-950">Explain your choices</h3><p className="mt-3 leading-7 text-slate-600">Present your work, discuss tradeoffs, and communicate with teammates and instructors.</p></div>
            <div className="border-l-2 border-ruby-700 pl-5"><BriefcaseBusiness className="h-6 w-6 text-ruby-700" aria-hidden="true" /><h3 className="mt-4 text-xl font-bold text-slate-950">Prepare for real work</h3><p className="mt-3 leading-7 text-slate-600">Use version control, deployment, feedback, and collaboration as part of the learning process.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1220] py-16 text-white md:py-20"><div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="csg-label text-ruby-300">Explore CSG</p><h2 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Choose the depth that fits your goals.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">Focused courses teach one skill at a time. The full bootcamp connects them across larger projects and a longer learning period.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/programs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ruby-600 px-6 py-3 font-bold text-white hover:bg-ruby-500">Full bootcamp <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="/courses" className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-6 py-3 font-bold text-white hover:bg-white/10">Focused courses</Link></div></div></section>
    </div>
  )
}
