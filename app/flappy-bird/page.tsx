import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Gamepad2 } from "lucide-react"
import FlappyBirdGame from "@/components/flappy-bird-game"
import { buildSocialMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Flappy Bird Demo",
  description: "Play our Flappy Bird clone and see how coding can create fun games!",
  alternates: { canonical: "/flappy-bird" },
  ...buildSocialMetadata({
    title: "Flappy Bird Demo | Code School of Guam",
    description: "Play a student-friendly browser game and see what learning to code can create.",
    url: "/flappy-bird",
  }),
}

const concepts = [
  { title: "React Hooks", detail: "State management and side effects" },
  { title: "Canvas API", detail: "2D graphics and game rendering" },
  { title: "Game Loop", detail: "Animation with requestAnimationFrame" },
  { title: "Physics Simulation", detail: "Gravity and collision detection" },
  { title: "Event Handling", detail: "Keyboard and touch input" },
  { title: "Local Storage", detail: "Data persistence and high scores" },
  { title: "Responsive Design", detail: "Mobile-first development" },
  { title: "TypeScript", detail: "Type safety and better code" },
] as const

export default function FlappyBirdPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero bg-[#faf7f0] text-slate-950">
        <div className="container mx-auto px-4 sm:px-8">
          <Link
            href="/projects"
            className="csg-press inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ruby-700 underline underline-offset-4 hover:text-ruby-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to student work
          </Link>

          <div className="mx-auto mt-6 max-w-3xl text-center">
            <p className="csg-label inline-flex items-center gap-2 text-ruby-700">
              <Gamepad2 className="h-4 w-4" aria-hidden="true" /> Interactive demo
            </p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-slate-950 md:text-6xl">
              Flappy Bird <span className="text-ruby-700">Clone</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              A school demonstration of state, loops, collision detection, and responsive design. Tap or press space to fly and avoid the pipes.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 sm:px-8 md:py-16">
        <div className="mx-auto mb-14 max-w-lg">
          <FlappyBirdGame />
        </div>

        <section className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-[#ded7c9] bg-white">
          <div className="bg-[#141b25] px-6 py-6 text-white md:px-8">
            <p className="csg-label text-ruby-200">Under the hood</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
              How this game was built
            </h2>
            <p className="mt-2 text-slate-300">
              Real-world programming ideas behind a small browser game.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              This Flappy Bird clone demonstrates core programming concepts using React, TypeScript, and HTML5 Canvas.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {concepts.map((concept) => (
                <div key={concept.title} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ruby-700" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-slate-950">{concept.title}</h3>
                    <p className="text-sm text-slate-600">{concept.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[#ded7c9] bg-[#faf7f0] p-6">
              <h3 className="font-serif text-2xl font-semibold text-slate-950">
                Ready to build your own projects?
              </h3>
              <p className="mt-2 text-slate-600">
                Explore our focused coding courses or join updates for future full bootcamp cohorts.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/courses" className="csg-button">
                  Explore courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/interest" className="csg-button-secondary">
                  Bootcamp updates
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
