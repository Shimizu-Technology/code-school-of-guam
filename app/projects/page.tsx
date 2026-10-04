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
  },
  {
    cohort: "Cohort 1",
    date: "2025",
    graduates: "6 graduates",
    videoId: "MNzZeL33jiw",
    start: 650,
  },
]

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
    title: "CSG Learning Hub",
    type: "School learning platform",
    description: "The private platform for lessons, recordings, grading, progress tracking, and cohort management.",
    image: "/CSG-Logo.png",
    href: "https://learn.codeschoolofguam.com/",
    surface: "bg-[#101827]",
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
    <article className="border border-slate-200 bg-white">
      <div className="relative aspect-video overflow-hidden bg-[#0b1220] text-white">
        {playing ? (
          <iframe ref={iframeRef} src={`https://www.youtube-nocookie.com/embed/${presentation.videoId}?autoplay=1${presentation.start ? `&start=${presentation.start}` : ""}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0 h-full w-full" />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_25%,rgba(165,25,25,0.35),transparent_55%)] px-6 text-center focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white" aria-label={`Play ${title}`}>
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10 transition group-hover:bg-ruby-600"><Play className="ml-1 h-7 w-7 fill-current" /></span>
            <span className="font-serif text-2xl font-semibold sm:text-3xl">{presentation.cohort} capstone presentations</span>
            <span className="csg-label text-ruby-200">{presentation.date}</span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div><h3 className="text-lg font-bold text-slate-950">{presentation.cohort} graduate presentations</h3><p className="mt-1 text-sm text-slate-600">{presentation.date} · {presentation.graduates}</p></div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ruby-700 underline underline-offset-4">Watch on YouTube <ArrowUpRight className="h-4 w-4" /></a>
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
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">See what students built and explained.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">Watch graduates present their own capstones. Then explore the production systems we use to show how software is built and supported beyond class.</p>
          <a href="#capstones" className="mt-8 inline-flex items-center gap-2 rounded-md bg-ruby-600 px-6 py-3 font-semibold text-white hover:bg-ruby-500">Watch presentations <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-7">
        <div className="container mx-auto px-4 sm:px-8">
          <p className="text-sm leading-relaxed text-slate-700"><strong className="text-slate-950">First two cohorts:</strong> 11 graduates across Cohorts 1 and 2 in 2025. Everyone who started those two cohorts completed the program. This figure does not include the March 2026 cohort.</p>
        </div>
      </section>

      <section id="capstones" className="scroll-mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="csg-label text-ruby-700">Student capstones</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">The work, in their own words.</h2></div>
            <p className="max-w-2xl leading-relaxed text-slate-600 lg:justify-self-end">Each recording shows graduates walking through the project they built and the decisions behind it. Videos load only when you choose to play one.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {presentations.map((presentation) => <PresentationVideo key={presentation.cohort} presentation={presentation} />)}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><p className="csg-label text-ruby-700">Alumni team project · in progress</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Party Games Hub</h2></div>
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-ruby-50 text-ruby-700"><Gamepad2 className="h-6 w-6" aria-hidden="true" /></div>
            <p className="mt-5 max-w-2xl leading-relaxed text-slate-600">A mobile-friendly collection of pass-the-device games built with the Code School of Guam alumni internship team. The public version has a playable Imposter reference game; the other games are still being built.</p>
            <a href="https://party-games.shimizu-technology.com/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4">Explore Party Games Hub <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="csg-label text-ruby-700">Professional context</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Production systems students learn around.</h2></div>
            <p className="max-w-2xl leading-relaxed text-slate-600 lg:justify-self-end">These examples were built and maintained by Shimizu Technology. They give students a view of real users, data, payments, delivery, and support. Listing a system here does not mean every graduate worked on it.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {productionExamples.map((project) => (
              <article key={project.title} className="overflow-hidden border border-slate-200 bg-white">
                <div className={`flex aspect-[4/3] items-center justify-center p-10 ${project.surface}`}><Image src={project.image} alt="" width={400} height={300} className="h-full w-full object-contain" /></div>
                <div className="p-6"><p className="csg-label text-ruby-700">{project.type} · Shimizu built</p><h3 className="mt-3 text-xl font-bold text-slate-950">{project.title}</h3><p className="mt-3 leading-relaxed text-slate-600">{project.description}</p><a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4">Visit the product <ArrowUpRight className="h-4 w-4" /></a></div>
              </article>
            ))}
          </div>
          <a href="https://shimizu-technology.com/work/" className="mt-8 inline-flex items-center gap-2 font-semibold text-ruby-700 underline underline-offset-4">Explore more Shimizu projects <ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div><p className="csg-label text-ruby-700">A smaller example</p><h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 md:text-5xl">Try a project idea.</h2></div>
          <div><p className="max-w-2xl leading-relaxed text-slate-600">This Flappy Bird clone is a school demonstration of programming ideas such as state, loops, collision detection, and responsive design. It is not a graduate capstone.</p><Link href="/flappy-bird" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-950 hover:border-ruby-700 hover:text-ruby-700">Play the demo <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="bg-ruby-700 py-16 text-white">
        <div className="container mx-auto flex flex-col gap-7 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="csg-label text-ruby-100">Your next step</p><h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold md:text-5xl">Build something you can explain.</h2><p className="mt-4 max-w-2xl text-ruby-100">Explore the focused courses being prepared, or join updates for a future full bootcamp cohort.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/courses" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-ruby-800">Explore courses <ArrowRight className="h-4 w-4" /></Link><Link href="/interest" className="inline-flex min-h-12 items-center rounded-md border border-white/60 px-5 py-3 font-semibold text-white">Bootcamp updates</Link></div>
        </div>
      </section>
    </div>
  )
}
