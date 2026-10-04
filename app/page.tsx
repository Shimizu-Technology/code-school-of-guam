import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Code2, Quote } from "lucide-react"

const graduateStories = [
  { quote: "CSG matched the effort I gave it. Trust the process and keep showing up.", name: "Noah Peredo", role: "Cohort 1 graduate" },
  { quote: "Now I constantly think about ways I can improve daily life by creating apps.", name: "Jessica Fernandez", role: "Cohort 1 graduate" },
  { quote: "The support, guidance, and encouragement throughout the program were second to none.", name: "Junior O’Brien", role: "Cohort 2 graduate" },
]

export default function HomePage() {
  return (
    <div className="bg-[#faf7f0]">
      <section className="border-b border-[#ded7c9]">
        <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-8 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <p className="csg-label text-ruby-700">Learn to code · Taught from Guam</p>
            <h1 className="mt-5 max-w-xl font-serif text-[2.75rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]">Learn to build software that matters.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Start with a focused course and a useful project, or explore the full bootcamp for a longer path through software development.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/courses" className="csg-button">Explore courses <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/programs" className="csg-button-secondary">Full bootcamp <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">December&apos;s Python pilot is for invited adults. Public courses are being prepared.</p>
          </div>
          <aside className="overflow-hidden rounded-xl border border-[#ded7c9] bg-white" aria-labelledby="python-preview-title">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e7e1d6] px-6 py-4 text-sm"><strong>Python Fundamentals</strong><span className="rounded-full bg-[#f7eeeb] px-3 py-1 text-xs font-bold text-ruby-800">Invited pilot</span></div>
            <div className="p-6 sm:p-8">
              <h2 id="python-preview-title" className="font-serif text-3xl font-medium leading-tight sm:text-4xl">Start with Python.<br />Build something useful.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Learn the basics, practice in your browser, and build a program that summarizes expenses.</p>
              <div className="mt-5 rounded-lg bg-[#17202b] p-5 font-mono text-[13px] leading-7 text-slate-100" aria-label="Sample output from the Python expense-summary program">
                <p className="text-ruby-200">$ python expense_summary.py</p>
                <p>Total: $118</p><p>Food: $61 · Transport: $48 · Supplies: $9</p>
                <p className="text-emerald-200">Under budget by $2</p>
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-600"><li>3 guided weeks</li><li>Beginner course</li><li>Weekly private Zoom hour</li></ul>
              <Link href="/courses/python-fundamentals" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ruby-800 underline underline-offset-4">Explore Python Fundamentals <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
        <div className="container mx-auto px-4 pb-6 sm:px-8">
          <div className="flex flex-col gap-2 border-t border-[#ded7c9] pt-5 text-sm leading-6 text-slate-600 sm:flex-row sm:gap-6"><strong className="shrink-0 text-ruby-800">Current status</strong><p>December Python: invited pilot. Other courses: in development. March 2026 bootcamp: closed. Future bootcamp dates: unannounced.</p></div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div><p className="csg-label text-ruby-700">Graduate work</p><h2 className="mt-4 font-serif text-4xl font-medium leading-tight md:text-5xl">See what graduates built.</h2><Link href="/projects" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline underline-offset-4">Watch capstone presentations <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          <div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">Graduates present their own applications and explain the decisions behind them. Explore their capstones, an alumni team project, and the production systems students learn around.</p>
            <div className="mt-7 grid grid-cols-3 gap-3 border-y border-[#ded7c9] py-5">{[["11", "graduates"], ["100%", "completion"], ["2", "cohorts"]].map(([value, label]) => <div key={label}><strong className="text-3xl text-slate-950">{value}</strong><p className="mt-1 text-xs font-semibold text-slate-600">{label}</p></div>)}</div>
            <p className="mt-4 text-xs leading-6 text-slate-600">Results from the first two cohorts, completed in 2025: everyone who started those cohorts completed the program. The March 2026 cohort is not included.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ded7c9] bg-white py-14 md:py-20">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <figure className="overflow-hidden rounded-xl border border-[#ded7c9]"><Image src="/images/uog-intro-to-ai.webp" alt="University of Guam staff attending a practical AI workshop" width={1280} height={960} sizes="(min-width: 1024px) 600px, 100vw" className="aspect-[16/10] w-full object-cover" /><figcaption className="px-4 py-3 text-xs leading-5 text-slate-600">Leon teaching University of Guam staff at a July 2025 AI workshop.</figcaption></figure>
          <div><p className="csg-label text-ruby-700">Practice with guidance</p><h2 className="mt-4 font-serif text-4xl font-medium leading-tight md:text-5xl">Bring your questions.<br />Build your understanding.</h2><p className="mt-5 text-lg leading-8 text-slate-600">The school grew from Leon&apos;s experience learning with an instructor. Our guided offers make room for questions, feedback, and the practice it takes to understand what you build.</p><Link href="/about" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline underline-offset-4">Meet the school <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-700">Graduate stories</p><h2 className="mt-4 font-serif text-4xl font-medium leading-tight md:text-5xl">Learning, in their words.</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">{graduateStories.map((story) => <figure key={story.name} className="border-t border-[#ded7c9] pt-6"><Quote className="h-5 w-5 text-ruby-700" aria-hidden="true" /><blockquote className="mt-4 font-serif text-2xl leading-snug text-slate-950">“{story.quote}”</blockquote><figcaption className="mt-5 text-sm font-bold text-slate-950">{story.name}<span className="mt-1 block text-xs font-normal text-slate-600">{story.role}</span></figcaption></figure>)}</div>
        </div>
      </section>

      <section className="bg-[#17202b] py-14 text-white md:py-20">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><Code2 className="h-6 w-6 text-ruby-200" aria-hidden="true" /><h2 className="mt-4 font-serif text-4xl font-medium leading-tight md:text-5xl">Find your starting point.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">Explore the courses being prepared and tell us what you&apos;d like to learn. For the longer program, join the separate bootcamp updates list; dates and tuition are unannounced.</p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col"><Link href="/courses#course-interest" className="csg-button">Course updates <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link><Link href="/interest" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3 font-bold text-white hover:bg-white/10">Bootcamp updates <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div></div>
      </section>
    </div>
  )
}
