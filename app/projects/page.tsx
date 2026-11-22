"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Gamepad2, Play } from "lucide-react"

const presentations = [
  {
    cohort: "Cohort 2",
    date: "December 2025",
    graduates: "5 graduates",
    videoId: "bWuS_YuiRzI",
    start: 0,
    poster: "/videos/cohort2-capstone-zoom-poster.webp",
    posterAlt: "Cohort 2 graduates smiling on Zoom during capstone presentation day",
  },
  {
    cohort: "Cohort 1",
    date: "2025",
    graduates: "6 graduates",
    videoId: "MNzZeL33jiw",
    start: 650,
    poster: "/images/home/cohort1-hybrid-class.webp",
    posterAlt: "Cohort 1 students collaborating around a table with a classmate joining over Zoom",
  },
] as const

// Verified Cohort 1 & 2 graduate capstones with direct YouTube demo timestamps from the recorded presentations above.
const featuredCapstones = [
  {
    name: "BlueStar: Micronesian Wayfinding",
    cohort: "Cohort 2 · Guam-focused",
    subtitle: "Micronesian wayfinding web app",
    summary: "Built and presented live during Cohort 2 capstone day in December 2025.",
    timestampLabel: "37:03",
    href: "https://www.youtube.com/watch?v=bWuS_YuiRzI&t=2223s",
    accent: "from-[#17202b] to-[#26384c]",
  },
  {
    name: "Shared Shores GU",
    cohort: "Cohort 2 · Guam-focused",
    subtitle: "Guam rental marketplace",
    summary: "Built and presented live during Cohort 2 capstone day in December 2025.",
    timestampLabel: "1:00:27",
    href: "https://www.youtube.com/watch?v=bWuS_YuiRzI&t=3627s",
    accent: "from-[#1e2f38] to-[#2d535c]",
  },
  {
    name: "Indecisive",
    cohort: "Cohort 1 · Full-Stack",
    subtitle: "Cohort 1 capstone web app",
    summary: "Full-stack capstone project designed, built, and demoed live during Cohort 1 presentations.",
    timestampLabel: "12:19",
    href: "https://www.youtube.com/watch?v=MNzZeL33jiw&t=739s",
    accent: "from-[#3b1d24] to-[#6b242a]",
  },
  {
    name: "The Weekly Dish",
    cohort: "Cohort 1 · Full-Stack",
    subtitle: "Cohort 1 capstone web app",
    summary: "Full-stack capstone project designed, built, and demoed live during Cohort 1 presentations.",
    timestampLabel: "57:16",
    href: "https://www.youtube.com/watch?v=MNzZeL33jiw&t=3436s",
    accent: "from-[#1d332d] to-[#285b65]",
  },
] as const

const productionExamples = [
  {
    title: "Hafa Code",
    type: "School learning tool",
    description: "A browser coding environment used by Code School of Guam, FD students, alumni, and other learners.",
    image: "/images/hafa-code-logo.webp",
    href: "https://code.shimizu-technology.com/",
    surface: "bg-[#f8efe0]",
  },
  {
    title: "CSG Learn",
    type: "School learning platform",
    description: "The private platform for lessons, recordings, grading, progress tracking, and cohort management.",
    image: "/CSG-Logo.png",
    href: "https://learn.codeschoolofguam.com/",
    surface: "bg-[#191920]",
  },
  {
    title: "Hafaloha Orders",
    type: "Shimizu client system",
    description: "A live ordering and fulfillment platform that handled 850+ VIP orders during a concert launch.",
    image: "/images/hafaloha-hero.webp",
    href: "https://hafaloha-orders.com/",
    surface: "bg-slate-100",
  },
]

function PresentationVideo({ presentation }: { presentation: typeof presentations[number] }) {
  const [playing, setPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const title = `${presentation.cohort} capstone presentations, ${presentation.date}`
  const url = `https://www.youtube.com/watch?v=${presentation.videoId}${presentation.start ? `&t=${presentation.start}s` : ""}`

  useEffect(() => {
    if (playing) iframeRef.current?.focus()
  }, [playing])

  return (
    <article className="overflow-hidden rounded-xl border border-[#ded7c9] bg-white">
      <div className="relative aspect-video overflow-hidden bg-[#0b1220] text-white">
        {playing ? (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${presentation.videoId}?autoplay=1${presentation.start ? `&start=${presentation.start}` : ""}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white"
            aria-label={`Play ${title}`}
          >
            <Image
              src={presentation.poster}
              alt={presentation.posterAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              quality={70}
              className="object-cover"
            />
            <span className="absolute inset-0 bg-[#0b1220]/65 transition-colors group-hover:bg-[#0b1220]/55" aria-hidden="true" />
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-ruby-700/90 text-white shadow-lg motion-safe:transition-transform motion-safe:group-hover:scale-105">
              <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
            </span>
            <span className="relative z-10 font-serif text-2xl font-semibold sm:text-3xl">{presentation.cohort} capstone presentations</span>
            <span className="csg-label relative z-10 text-ruby-200">{presentation.date} · {presentation.graduates}</span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{presentation.cohort} graduate presentations</h3>
          <p className="mt-1 text-sm text-slate-600">{presentation.date} · {presentation.graduates}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ruby-700 underline underline-offset-4"
        >
          Watch on YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

export default function ProjectsPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero relative overflow-hidden bg-[#faf7f0] py-16 text-slate-950 md:py-24">
        <div className="container relative mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-700">Graduate work</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            See what students built and explained.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Watch graduates present their own capstones, jump straight to featured projects, and explore the production systems students learn around.
          </p>
          <a href="#capstones" className="csg-button mt-8">
            Watch presentations <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-7">
        <div className="container mx-auto px-4 sm:px-8">
          <p className="text-sm leading-relaxed text-slate-700">
            <strong className="text-slate-950">First two cohorts:</strong> 11 graduates across Cohorts 1 and 2 in 2025. Everyone who started those two cohorts completed the program. This figure does not include the March 2026 cohort.
          </p>
        </div>
      </section>

      <section id="capstones" className="scroll-mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="csg-label text-ruby-700">Featured graduate capstones</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">
                Real apps built and demoed on camera.
              </h2>
            </div>
            <p className="max-w-prose leading-relaxed text-slate-600 lg:justify-self-end">
              Every full-program graduate designs, builds, and presents a working application. Open any card below to jump straight to that demo timestamp on YouTube.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCapstones.map((project) => (
              <article
                key={project.name}
                className="flex flex-col overflow-hidden rounded-xl border border-[#ded7c9] bg-white"
              >
                <div className={`flex min-h-[124px] flex-col justify-between bg-linear-to-br ${project.accent} p-5 text-white`}>
                  <span className="self-start rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                    {project.cohort}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-medium leading-tight">{project.name}</h3>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm font-bold text-slate-950">{project.subtitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{project.summary}</p>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-bold text-ruby-800 underline underline-offset-4 hover:text-ruby-700"
                  >
                    Watch demo at {project.timestampLabel} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="csg-label text-ruby-700">Full presentation recordings</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">
                The work, in their own words.
              </h2>
            </div>
            <p className="max-w-prose leading-relaxed text-slate-600 lg:justify-self-end">
              Each recording shows graduates walking through the project they built and the decisions behind it. Videos load only when you choose to play one.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {presentations.map((presentation) => (
              <PresentationVideo key={presentation.cohort} presentation={presentation} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="csg-label text-ruby-700">Alumni team project · in progress</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Party Games Hub</h2>
          </div>
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-ruby-50 text-ruby-700">
              <Gamepad2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-5 max-w-prose leading-relaxed text-slate-600">
              A mobile-friendly collection of pass-the-device games built with the Code School of Guam alumni internship team. The public version has a playable Imposter reference game; the other games are still being built.
            </p>
            <a
              href="https://party-games.shimizu-technology.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4"
            >
              Explore Party Games Hub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="csg-label text-ruby-700">Professional context</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">
                Production systems students learn around.
              </h2>
            </div>
            <p className="max-w-prose leading-relaxed text-slate-600 lg:justify-self-end">
              These examples were built and maintained by Shimizu Technology. They give students a view of real users, data, payments, delivery, and support. Listing a system here does not mean every graduate worked on it.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {productionExamples.map((project) => (
              <article key={project.title} className="overflow-hidden border border-slate-200 bg-white">
                <div className={`flex aspect-[4/3] items-center justify-center p-10 ${project.surface}`}>
                  <Image src={project.image} alt="" width={400} height={300} sizes="(min-width: 1024px) 300px, 80vw" className="h-full w-full object-contain" />
                </div>
                <div className="p-6">
                  <p className="csg-label text-ruby-700">{project.type} · Shimizu built</p>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">{project.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{project.description}</p>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4"
                  >
                    Visit the product <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a
            href="https://shimizu-technology.com/work/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4"
          >
            Explore more Shimizu projects <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="csg-label text-ruby-700">A smaller example</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Try a project idea.</h2>
          </div>
          <div>
            <p className="max-w-2xl leading-relaxed text-slate-600">
              This Flappy Bird clone is a school demonstration of programming ideas such as state, loops, collision detection, and responsive design. It is not a graduate capstone.
            </p>
            <Link href="/flappy-bird" className="csg-button-secondary mt-6">
              Play the demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ruby-700 py-16 text-white">
        <div className="container mx-auto flex flex-col gap-7 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="csg-label text-ruby-100">Your next step</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold md:text-5xl">Build something you can explain.</h2>
            <p className="mt-4 max-w-2xl text-ruby-100">Explore our focused classes being prepared, or reach out about a school/employer partnership or future full program.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/courses" className="csg-press inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-ruby-800 hover:bg-ruby-50">
              Explore courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/partners" className="csg-press inline-flex min-h-12 items-center rounded-md border border-white/60 px-5 py-3 font-semibold text-white hover:bg-white/10">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
