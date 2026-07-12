import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Code2,
  GraduationCap,
  Laptop,
  Quote,
  Rocket,
  Users,
} from "lucide-react"

const graduateStories = [
  {
    quote: "CSG matched the effort I gave it. Trust the process and keep showing up.",
    name: "Noah Peredo",
    role: "Cohort 1 graduate",
    initial: "N",
  },
  {
    quote: "Now I constantly think about ways I can improve daily life by creating apps.",
    name: "Jessica Fernandez",
    role: "Cohort 1 graduate",
    initial: "J",
  },
  {
    quote: "The support, guidance, and encouragement throughout the program were second to none.",
    name: "Junior O’Brien",
    role: "Cohort 2 graduate",
    initial: "J",
  },
]

const curriculum = [
  {
    icon: Code2,
    label: "Full-stack foundation",
    title: "Ruby, Rails & React",
    copy: "Build responsive interfaces, production APIs, databases, authentication, and deployed applications.",
  },
  {
    icon: Brain,
    label: "AI engineering",
    title: "Python, RAG & Agents",
    copy: "Understand modern AI systems and build chatbots, retrieval workflows, prompts, evaluations, and agents.",
  },
  {
    icon: Rocket,
    label: "Professional practice",
    title: "Ship Real Products",
    copy: "Work with Git, code reviews, product constraints, deployment, presentations, and production-quality expectations.",
  },
]

const projects = [
  {
    title: "HåfaGPT",
    category: "Chamorro language learning",
    image: "/images/HafaGPT-icon1.png",
    href: "https://hafagpt.com",
    surface: "bg-[#f4ede1]",
  },
  {
    title: "Hafa Code",
    category: "Student coding playground",
    image: "/images/hafa-code-logo.png",
    href: "https://hafa-code.netlify.app",
    surface: "bg-[#f8efe0]",
  },
  {
    title: "CSG Learning Hub",
    category: "School learning platform",
    image: "/CSG-Logo.png",
    href: "https://learn.codeschoolofguam.com",
    surface: "bg-[#101827]",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <div className="csg-grid absolute inset-0 opacity-30" />
        <div className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-ruby-600/15 blur-[120px]" />
        <div className="container relative z-10 mx-auto grid gap-12 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-28">
          <div>
            <div className="csg-label flex items-center gap-3 text-ruby-300">
              <span className="h-px w-8 bg-ruby-400" /> Guam&apos;s first coding bootcamp
            </div>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[5.15rem]">
              Learn to build software that matters.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Go from complete beginner to AI-capable full-stack developer in under six months—with live instruction, structured practice, and real production experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:codeschoolofguam@gmail.com?subject=Future%20Cohort%20Updates"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-ruby-600 px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ruby-500"
              >
                Request future cohort updates <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/programs" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
                Explore the program <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">No prior coding experience required.</p>
          </div>

          <aside className="rounded-xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> 2026 cohort is underway
            </div>
            <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
              {[
                ["Under 6 months", "Program length"],
                ["12+ hours", "Live + structured practice each week"],
                ["10 students", "Maximum cohort size"],
                ["Remote", "Live from Guam via Zoom"],
              ].map(([value, label]) => (
                <div key={label} className="grid grid-cols-[0.75fr_1.25fr] gap-4 py-4">
                  <span className="font-bold text-white">{value}</span>
                  <span className="text-sm text-slate-400">{label}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-slate-400">Join the update list and we&apos;ll contact you first when the next cohort is planned.</p>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid grid-cols-3 px-4 py-6 text-center sm:px-8">
          {[["11", "graduates"], ["100%", "completion"], ["2", "cohorts"]].map(([value, label]) => (
            <div key={label} className="border-r border-slate-200 px-2 last:border-r-0">
              <div className="text-2xl font-bold text-slate-950 md:text-3xl">{value}</div>
              <div className="csg-label mt-1 text-[9px] text-slate-500 sm:text-[10px]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="csg-label text-ruby-700">Graduate stories</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">A small program with personal support.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 lg:justify-self-end">Students have joined us from high school, career transitions, and entirely different industries. The common thread is consistent effort and a willingness to build.</p>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-xl border border-slate-200 bg-slate-200 lg:grid-cols-3">
            {graduateStories.map((story) => (
              <article key={story.name} className="flex min-h-72 flex-col bg-white p-7 md:p-8">
                <Quote className="h-6 w-6 text-ruby-600" />
                <blockquote className="mt-6 flex-1 font-serif text-2xl leading-snug text-slate-900">“{story.quote}”</blockquote>
                <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{story.initial}</div>
                  <div><div className="font-bold text-slate-900">{story.name}</div><div className="text-xs text-slate-500">{story.role}</div></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="csg-label text-ruby-700">The curriculum</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">Fundamentals first. AI with understanding.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">You will learn to think through software problems before using AI to accelerate the work. Every tool is introduced with context, constraints, and responsibility.</p>
          </div>

          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {curriculum.map((item, index) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="grid gap-4 py-7 md:grid-cols-[70px_0.75fr_1.25fr] md:items-start md:gap-8 md:py-9">
                  <div className="flex items-center gap-3"><span className="csg-label text-[10px] text-slate-400">0{index + 1}</span><Icon className="h-5 w-5 text-ruby-600 md:hidden" /></div>
                  <div><div className="csg-label text-[10px] text-ruby-700">{item.label}</div><h3 className="mt-2 text-2xl font-bold text-slate-950">{item.title}</h3></div>
                  <p className="max-w-2xl leading-relaxed text-slate-600">{item.copy}</p>
                </article>
              )
            })}
          </div>
          <Link href="/curriculum" className="mt-8 inline-flex items-center gap-2 font-bold text-ruby-700">Explore the full curriculum <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="bg-[#0b1220] py-16 text-white md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="csg-label text-ruby-300">The learning journey</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-5xl">Build capability in deliberate stages.</h2>
              <p className="mt-5 leading-relaxed text-slate-300">AI becomes more useful as your own understanding grows. The program is structured around that progression.</p>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {[
                ["01", "Foundation", "Code manually. Learn the terminal, Git, web fundamentals, Ruby, and problem solving."],
                ["02", "Full-stack", "Build Rails APIs, React interfaces, PostgreSQL databases, and deployed applications."],
                ["03", "AI engineering", "Add Python, model APIs, retrieval, agents, prompts, and evaluation workflows."],
                ["04", "Capstone", "Design, build, explain, and present a complete product you can stand behind."],
              ].map(([number, title, copy]) => (
                <div key={number} className="grid gap-2 py-5 sm:grid-cols-[70px_150px_1fr] sm:gap-6">
                  <span className="csg-label text-[10px] text-ruby-300">{number}</span><strong>{title}</strong><span className="text-sm leading-relaxed text-slate-400">{copy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="csg-label text-ruby-700">Real production context</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">Learn around products people use.</h2></div>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 lg:justify-self-end">Through our partnership with Shimizu Technology, students see how professional software is scoped, built, reviewed, and supported beyond the classroom.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className={`flex aspect-[4/3] items-center justify-center p-12 ${project.surface}`}><Image src={project.image} alt={project.title} width={220} height={220} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" /></div>
                <div className="flex items-end justify-between gap-4 p-5"><div><h3 className="text-lg font-bold text-slate-950">{project.title}</h3><p className="mt-1 text-sm text-slate-500">{project.category}</p></div><ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-ruby-600" /></div>
              </a>
            ))}
          </div>
          <Link href="/projects" className="mt-8 inline-flex items-center gap-2 font-bold text-ruby-700">See graduate presentations and projects <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24 lg:py-28">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="csg-label text-ruby-700">Transparent tuition</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-6xl">$7,500</h2>
            <p className="mt-3 text-lg text-slate-600">Complete program tuition. Flexible payment options are available.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [GraduationCap, "Under six months", "Live teaching and structured practice"],
              [Laptop, "Lifetime access", "Recordings, resources, and updates"],
              [Users, "Real experience", "Optional internship and paid opportunities"],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof GraduationCap
              return <div key={String(title)} className="border-t-2 border-ruby-600 pt-5"><FeatureIcon className="h-5 w-5 text-ruby-700" /><h3 className="mt-4 font-bold text-slate-950">{String(title)}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{String(copy)}</p></div>
            })}
          </div>
        </div>
      </section>

      <section className="bg-ruby-700 py-16 text-white md:py-20">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="csg-label text-ruby-100">Future cohorts</p><h2 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">Your first line of code can start something bigger.</h2><p className="mt-4 max-w-2xl text-ruby-100">The 2026 cohort is underway. Join the update list to hear about the next opportunity.</p></div>
          <a href="mailto:codeschoolofguam@gmail.com?subject=Future%20Cohort%20Updates" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 font-bold text-ruby-800 transition hover:-translate-y-0.5">Request future updates <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </div>
  )
}
