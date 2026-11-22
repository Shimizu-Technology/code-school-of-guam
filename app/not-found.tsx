import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero bg-[#faf7f0] text-slate-950">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-2xl">
            <p className="csg-label text-ruby-700">404 · Page not found</p>
            <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.06] tracking-[-0.03em] text-slate-950 sm:text-6xl">
              That page isn&apos;t here.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              The link may have moved or the address may have a typo. You can head back home, browse focused coding courses, or read about the full bootcamp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="csg-button">
                Back to home <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/courses" className="csg-button-secondary">
                Focused courses
              </Link>
              <Link href="/programs" className="csg-button-secondary">
                Full bootcamp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
