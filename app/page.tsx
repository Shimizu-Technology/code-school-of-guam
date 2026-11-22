import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import "./home.css"
import { buildSocialMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  ...buildSocialMetadata({
    title: "Code School of Guam - Focused Courses and Full Bootcamp",
    description: "Start with a focused coding course or explore the full software development bootcamp. Beginner Python is being tested with an invited group in early 2027.",
    url: "https://codeschoolofguam.com",
  }),
}
import { HeroEditor } from "@/components/home/hero-editor"
import { LearningRoute } from "@/components/home/learning-route"
import { CapstoneClip } from "@/components/home/capstone-clip"
import { OpeningPhoto } from "@/components/home/opening-photo"
import { StoryDeck } from "@/components/home/story-deck"
import { WeightedHeading } from "@/components/home/weighted-heading"
import { RevealOnScroll } from "@/components/home/reveal-on-scroll"

const HEADLINE_WORDS = ["Learn", "to", "build", "software", "that"]

// Graduate counts come from /projects: Cohort 1 (6) and Cohort 2 (5), both completed in 2025.
const STATS = [["11", "graduates"], ["100%", "completion"], ["2", "cohorts"]] as const

const PHOTOS = [
  {
    src: "/images/home/cohort1-graduation-dinner.webp",
    width: 1600,
    height: 1200,
    alt: "Cohort 1 graduates with instructors and guests around a restaurant table at their graduation dinner",
    caption: <>Cohort 1 graduation dinner, June 2025</>,
    className: "home-ph-a",
    sizes: "(min-width: 900px) 640px, 100vw",
  },
  {
    src: "/images/home/mini-capstone-demo.webp",
    width: 1600,
    height: 743,
    alt: "A student points at his app on a large TV while classmates watch from the table",
    caption: <><b>Presenting their work</b> · Mini-capstone demo</>,
    className: "home-ph-b",
    sizes: "(min-width: 900px) 480px, 100vw",
  },
  {
    src: "/images/home/cohort2-working-session.webp",
    width: 1600,
    height: 1000,
    alt: "An instructor leans in to help a student at a laptop while classmates work around the table",
    caption: <><b>Working session</b> · Cohort 2 in-person class</>,
    className: "home-ph-c",
    sizes: "(min-width: 900px) 480px, 100vw",
  },
]

export default function HomePage() {
  return (
    <div id="home" className="home bg-[#faf7f0]">
      <RevealOnScroll rootId="home" />

      <section className="home-hero border-b border-[#ded7c9]" aria-labelledby="home-title">
        <div className="container mx-auto grid gap-10 px-4 py-10 sm:px-8 md:py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:py-16">
          <div className="min-w-0">
            <p className="csg-label home-fade text-ruby-700" style={{ ["--i" as string]: 0 }}>Learn to code · Taught from Guam</p>
            <h1 id="home-title" className="home-title">
              {HEADLINE_WORDS.map((word, i) => (
                <span key={word}><span className="home-w"><span className="home-wi" style={{ ["--i" as string]: i }}>{word}</span></span>{" "}</span>
              ))}
              <span className="home-w home-w-open">
                <em className="home-wi" style={{ ["--i" as string]: HEADLINE_WORDS.length }}>
                  matters.
                  <svg className="home-underline" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <path pathLength={1} d="M4 16 C 60 6, 120 4, 180 9 S 270 18, 296 8" />
                  </svg>
                </em>
              </span>
            </h1>
            <p className="home-fade mt-6 max-w-[34rem] text-lg leading-8 text-slate-600" style={{ ["--i" as string]: 1 }}>Start with a focused course and a useful project, or explore the full bootcamp for a longer path through software development.</p>
            <div className="home-fade mt-7 flex flex-wrap gap-3" style={{ ["--i" as string]: 2 }}>
              <Link href="/courses" className="csg-button home-arrow">Explore courses <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/programs" className="csg-button-secondary">Full bootcamp</Link>
            </div>
            <p className="home-fade mt-4 max-w-lg text-sm leading-6 text-slate-600" style={{ ["--i" as string]: 3 }}>The early 2027 Python pilot is for invited adults. Public courses are being prepared.</p>
          </div>
          <HeroEditor />
        </div>
        <div className="border-t border-[#ded7c9]">
          <div className="container mx-auto flex flex-wrap gap-x-6 gap-y-1 px-4 py-4 text-sm leading-6 text-slate-600 sm:px-8">
            <strong className="text-ruby-800">Current status</strong>
            <span>Early 2027 Python: invited pilot.</span>
            <span>Other courses: in development.</span>
            <span>March 2026 bootcamp: closed.</span>
            <span>Future bootcamp dates: unannounced.</span>
          </div>
        </div>
      </section>

      <section id="path" className="home-section" aria-labelledby="home-path-title">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="csg-label text-ruby-700">How learning works here</p>
            <h2 id="home-path-title" className="home-h2" data-reveal>One step, then the next.</h2>
            <p className="home-lead" data-reveal>Start small, build something real, and get help along the way. Go further when you&apos;re ready.</p>
          </div>
          <LearningRoute />
        </div>
      </section>

      <section id="work" className="home-section border-y border-[#ded7c9] bg-[#fffdf8]" aria-labelledby="home-work-title">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="home-split">
            <div>
              <p className="csg-label text-ruby-700">Graduate work</p>
              <h2 id="home-work-title" className="home-h2" data-reveal>See what graduates built.</h2>
            </div>
            <div data-reveal>
              <p className="text-lg leading-8 text-slate-600">Graduates present their own applications and explain the decisions behind them: capstones, an alumni team project, and the production systems students learn around.</p>
              <Link href="/projects" className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-ruby-800 underline underline-offset-4">Watch capstone presentations <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>

          <div className="home-photos">
            {PHOTOS.map((photo) => (
              <figure key={photo.src} className={`home-ph ${photo.className}`}>
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={photo.sizes} quality={70} />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="home-live">
            <CapstoneClip />
            <div>
              <p className="csg-label text-ruby-700">Graduates teaching</p>
              <p className="home-teach">Audreana, a Cohort 1 graduate, now teaches a beginner version of the course at Father Dueñas Memorial School.</p>
            </div>
          </div>

          <dl className="home-stats">
            {STATS.map(([value, label]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <p className="mt-4 max-w-[52rem] text-[13px] leading-6 text-slate-600">Results from the first two cohorts, completed in 2025: everyone who started those cohorts completed the program. The March 2026 cohort is not included.</p>
        </div>
      </section>

      <OpeningPhoto />

      <section id="stories" className="home-section" aria-label="Graduate stories">
        <div className="container mx-auto px-4 sm:px-8">
          <StoryDeck />
        </div>
      </section>

      <section id="start" className="home-cta" aria-labelledby="home-cta-title">
        <div className="container mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-200">Next step</p>
          <WeightedHeading id="home-cta-title" text="Find your starting point." />
          <p className="mt-6 max-w-[40rem] text-[17px] leading-7 text-slate-300">Explore the courses being prepared and tell us what you&apos;d like to learn. For the longer program, join the separate bootcamp updates list; dates and tuition are unannounced.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/courses#course-interest" className="csg-button home-arrow">Course updates <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/interest" className="csg-press inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-5 py-3 font-bold text-white hover:bg-white/10 active:bg-white/20">Bootcamp updates</Link>
          </div>
          <p className="home-prompt" aria-hidden="true"><b>$</b> python start_here.py <span className="home-caret home-caret-cta" /></p>
        </div>
      </section>
    </div>
  )
}
