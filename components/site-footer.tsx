import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Mail, Phone } from "lucide-react"

const footerLinks = [
  ["Curriculum", "/curriculum"],
  ["Program & Tuition", "/programs"],
  ["Student Work", "/projects"],
  ["Internship", "/internship"],
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Next Cohort Interest", "/interest"],
]

export function SiteFooter() {
  return (
    <footer className="bg-[#080e19] text-white">
      <div className="container mx-auto px-4 py-12 sm:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-3"><Image src="/CSG-Logo.png" alt="Code School of Guam" width={40} height={40} className="rounded-md" /><span className="text-lg font-bold">Code School of Guam</span></div>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">Guam&apos;s first coding bootcamp. Learn full-stack software development and AI engineering through live instruction and real production context.</p>
            <a href="https://shimizu-technology.com" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ruby-300">In partnership with Shimizu Technology <ArrowUpRight className="h-4 w-4" /></a>
          </div>
          <div>
            <p className="csg-label text-[10px] text-slate-500">Explore</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{footerLinks.map(([label, href]) => <Link key={href} href={href} className="text-slate-300 hover:text-white">{label}</Link>)}</div>
          </div>
          <div>
            <p className="csg-label text-[10px] text-slate-500">Contact</p>
            <div className="mt-4 space-y-3 text-sm"><a href="mailto:codeschoolofguam@gmail.com" className="flex items-center gap-2 text-slate-300 hover:text-white"><Mail className="h-4 w-4 text-ruby-400" />codeschoolofguam@gmail.com</a><a href="tel:+16714830219" className="flex items-center gap-2 text-slate-300 hover:text-white"><Phone className="h-4 w-4 text-ruby-400" />(671) 483-0219</a></div>
            <Link href="/interest" className="mt-5 inline-flex items-center gap-2 rounded-md bg-ruby-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-ruby-500">Join the interest list <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between"><span>© Code School of Guam</span><span>Built in Guam</span></div>
      </div>
    </footer>
  )
}
