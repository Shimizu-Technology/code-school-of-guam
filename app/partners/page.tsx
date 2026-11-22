import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, GraduationCap, Handshake, Mail, Phone } from "lucide-react"
import { UnifiedInquiryForm } from "@/components/unified-inquiry-form"
import { buildSocialMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "For Schools, Employers & Partners",
  description:
    "Explore Code School of Guam workshops and training for Guam schools, universities, local employers, and community organizations.",
  alternates: { canonical: "/partners" },
  ...buildSocialMetadata({
    title: "Partner with Code School of Guam",
    description:
      "Practical coding and AI workshops for Guam schools, employers, and community organizations — taught on island by local engineers.",
    url: "/partners",
  }),
}

const partnerTracks = [
  {
    icon: GraduationCap,
    eyebrow: "Track 01",
    title: "Schools & Universities",
    summary:
      "We offer practical AI workshops for faculty and staff, introductory coding curriculum support, and guest sessions grounded in browser-first tools like Hafa Code.",
    proofLabel: "Local background",
    proof:
      "Leon led a July 2025 AI workshop for University of Guam staff. Independently, Cohort 1 graduate Audreana Crane teaches introductory coding at Father Dueñas Memorial School.",
  },
  {
    icon: Building2,
    eyebrow: "Track 02",
    title: "Guam Employers & Teams",
    summary:
      "We offer focused training in Python, automation, SQL, and practical AI workflows tailored for local staff.",
    proofLabel: "Local background",
    proof:
      "Cohort 1 graduate Alanna Cruz works in software at DMR, and CSG students learn around production systems built and maintained in Guam by Shimizu Technology.",
  },
  {
    icon: Handshake,
    eyebrow: "Track 03",
    title: "Workforce & Community Organizations",
    summary:
      "We offer group coding workshops and structured training programs for local organizations, with lessons and project reviews organized in CSG Learn.",
    proofLabel: "Local background",
    proof:
      "11 graduates completed Cohorts 1 and 2 in 2025 (100% completion across those first two cohorts). CSG Learn tracks Cohort 3 onward, and the alumni library launched in September 2026.",
  },
] as const

export default function PartnersPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero bg-[#faf7f0] text-slate-950">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div>
            <p className="csg-label text-ruby-700">For Guam schools, employers &amp; community</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
              Partner with Code School of Guam.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              We offer practical coding and AI training for Guam educators, local employers, and community organizations — taught on island around real projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#partner-inquiry" className="csg-button">
                Start a conversation <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/projects" className="csg-button-secondary">
                See student work
              </Link>
            </div>
          </div>

          <figure className="overflow-hidden rounded-xl border border-[#ded7c9] bg-white">
            <Image
              src="/images/uog-intro-to-ai.webp"
              alt="University of Guam staff attending an introductory AI workshop led by Leon Shimizu"
              width={1200}
              height={900}
              priority
              quality={70}
              sizes="(min-width: 1024px) 520px, 100vw"
              className="aspect-[16/10] w-full object-cover object-bottom"
            />
            <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-600">
              Leon leading an introductory AI workshop for University of Guam staff, July 2025.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <p className="csg-label text-ruby-700">Three ways we work together</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Built on local teaching and verifiable student work.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We scope every engagement around real goals, clear schedules, and honest expectations — whether it is a single staff workshop, a focused Python track, or group training for a local organization.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {partnerTracks.map(({ icon: Icon, eyebrow, title, summary, proofLabel, proof }) => (
              <article
                key={title}
                className="flex flex-col rounded-xl border border-[#ded7c9] bg-[#fffdf8] p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="csg-label text-ruby-700">{eyebrow}</span>
                  <Icon className="h-5 w-5 text-ruby-700" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-serif text-3xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{summary}</p>
                <div className="mt-auto border-t border-[#ded7c9] pt-5">
                  <p className="csg-label text-slate-500">{proofLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{proof}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f1ede5] py-16 md:py-20">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="csg-label text-ruby-700">How training runs</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-950">
              Tools built for real learning, not slide decks.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border-t-2 border-ruby-700 pt-4">
              <h3 className="text-lg font-bold text-slate-950">Browser-first coding (Hafa Code)</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Participants write and run Python directly in the browser with zero software installs, which works cleanly on school and office machines.
              </p>
            </div>
            <div className="border-t-2 border-[#c8bfb0] pt-4">
              <h3 className="text-lg font-bold text-slate-950">Structured review (CSG Learn)</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Lessons, exercises, project submissions, and instructor reviews live in one place, giving learners and training partners clear progress records.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="partner-inquiry" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto grid gap-10 px-4 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="csg-label text-ruby-700">Get in touch</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
              Tell us what your school or team needs.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-slate-600">
              Share your organization, goals, and rough timeline. Leon reads every note personally.
            </p>
            <div className="mt-8 space-y-2 border-t border-[#ded7c9] pt-6 text-sm text-slate-700">
              <a
                href="mailto:codeschoolofguam@gmail.com"
                className="flex min-h-11 items-center gap-2.5 font-semibold text-ruby-800 hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                codeschoolofguam@gmail.com
              </a>
              <a
                href="tel:+16714830219"
                className="flex min-h-11 items-center gap-2.5 font-semibold text-slate-800 hover:text-ruby-800"
              >
                <Phone className="h-4 w-4 shrink-0 text-ruby-700" aria-hidden="true" />
                (671) 483-0219
              </a>
            </div>
          </div>

          <div className="border-t-4 border-ruby-700 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
            <UnifiedInquiryForm defaultMode="partner" />
          </div>
        </div>
      </section>
    </div>
  )
}
