import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"

const graduatePaths = [
  {
    name: "Alanna Cruz",
    path: "Software work",
    story: "Alanna signed up the day before class began, unsure whether she could do it. After CSG, she continued building her software career and now works at DMR.",
  },
  {
    name: "Audreana Crane",
    path: "Teaching the next generation",
    story: "A graduate of CSG's first cohort, Audreana now introduces students at Father Dueñas Memorial School to coding.",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero relative overflow-hidden bg-[#faf7f0] py-16 text-slate-950 md:py-24">

        <div className="container relative mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <p className="csg-label text-ruby-700">Our story</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-tight md:text-7xl">A place to learn, build, and belong.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">Code School of Guam began with a simple gap: people here should be able to learn software development with real instruction and local context.</p>
            <Link href="/courses" className="mt-8 inline-flex items-center gap-2 rounded-md bg-ruby-600 px-6 py-3 font-semibold text-white hover:bg-ruby-500">Explore how to start <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <figure className="overflow-hidden border border-[#ded7c9] bg-white">
            <Image src="/images/uog-intro-to-ai.webp" alt="University of Guam staff attending an AI workshop" width={1280} height={960} priority className="aspect-[4/3] w-full object-cover" />
            <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-600">Leon teaching a University of Guam staff workshop, July 2025.</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><p className="csg-label text-ruby-700">Why we exist</p><h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Bringing opportunity home.</h2></div>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-slate-700">
            <p>Growing up in Guam, I did not know software engineering was something I could do. I discovered coding bootcamps after moving to the states, completed <a href="https://actualize.co/" className="font-semibold text-ruby-700 underline underline-offset-4">Actualize</a>, and found my first engineering job.</p>
            <p>When I looked back home, I could not find a comparable path. I founded Code School of Guam in 2024 so people on our island could learn with an instructor, practice consistently, and build applications they could explain.</p>
            <p>Our first class graduated in June 2025. Graduates have taken different paths, including software work and teaching. Their progress comes from their own effort, supported by a program grounded in real projects.</p>
            <blockquote className="border-l-2 border-ruby-600 pl-5 font-serif text-2xl leading-snug text-slate-950">“I want everyone to feel what I feel — that if there&apos;s something I want to build, I can just build it.”<footer className="mt-3 font-sans text-sm font-semibold text-slate-600">Leon Shimizu, founder</footer></blockquote>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-700">Graduate paths</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">What learning can lead to.</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">Every student brings a different goal. These are two paths graduates have taken after CSG.</p>
          <div className="mt-10 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-2">
            {graduatePaths.map((graduate) => (
              <article key={graduate.name} className="bg-white p-7 md:p-9">
                <p className="csg-label text-ruby-700">{graduate.path}</p>
                <h3 className="mt-4 font-serif text-3xl font-semibold text-slate-950">{graduate.name}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-slate-600">{graduate.story}</p>
              </article>
            ))}
          </div>
          <Link href="/projects" className="mt-8 inline-flex items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4">Watch graduate capstones <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><p className="csg-label text-ruby-700">The founder</p><h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Meet Leon.</h2></div>
          <div className="grid gap-7 sm:grid-cols-[11rem_1fr] sm:items-start">
            <Image src="/images/leon-shimizu.webp" alt="Leon Shimizu" width={500} height={500} className="aspect-square w-44 object-cover object-top" />
            <div className="space-y-4 leading-relaxed text-slate-600">
              <p><strong className="text-slate-950">Leon Shimizu</strong> was born and raised in Guam. He studied at Actualize Coding Bootcamp in 2021 and became a software engineer before graduating.</p>
              <p>He founded Code School of Guam in 2024 and also leads Shimizu Technology, where software is built for organizations in Guam and beyond. He has worked at Spectrio and taught at Actualize.</p>
              <p>The school and studio share a practical view of learning: understand the fundamentals, build useful things, explain your choices, and keep improving the work.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div><p className="csg-label text-ruby-700">Learning beyond class</p><h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Real context, clear expectations.</h2></div>
          <div className="max-w-2xl space-y-5 leading-relaxed text-slate-600">
            <p>Through <a href="https://shimizu-technology.com/" className="font-semibold text-ruby-700 underline underline-offset-4">Shimizu Technology</a>, students can see how professional teams handle users, data, delivery, and support. Some graduates have practiced on real projects when active work and their readiness aligned.</p>
            <p>Internships, contract work, and paid teaching roles depend on available projects and individual readiness. Completing a course or bootcamp does not guarantee any of them; a future opportunity will have its own eligibility and terms.</p>
            <Link href="/internship" className="inline-flex items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4">How the internship pathway works <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-ruby-700 py-16 text-white">
        <div className="container mx-auto flex flex-col gap-7 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="csg-label text-ruby-100">Find your path</p><h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold md:text-5xl">Start with a useful project.</h2><p className="mt-4 max-w-2xl text-ruby-100">Focused courses are being prepared. The March 2026 full bootcamp is closed to new students.</p></div>
          <Link href="/courses" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-ruby-800">Explore courses <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  )
}
