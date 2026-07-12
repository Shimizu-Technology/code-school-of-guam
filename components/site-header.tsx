"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

const navItems = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/programs", label: "Program & Tuition" },
  { href: "/projects", label: "Student Work" },
  { href: "/internship", label: "Internship" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => setMobileMenuOpen(false), [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className={`sticky top-0 z-50 border-b border-white/10 bg-[#0b1220]/95 text-white backdrop-blur-xl transition-shadow ${scrolled ? "shadow-lg shadow-slate-950/10" : ""}`}>
      <nav className="container mx-auto px-4 sm:px-8">
        <div className="flex h-[72px] items-center justify-between gap-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image src="/CSG-Logo.png" alt="Code School of Guam" width={36} height={36} className="h-9 w-9 flex-shrink-0 rounded-md border border-white/10 object-cover" />
            <span className="truncate text-base font-bold tracking-tight sm:text-lg">Code School of Guam</span>
          </Link>

          <div className="hidden items-center gap-0.5 xl:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${isActive(item.href) ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                {item.label}
              </Link>
            ))}
          </div>

          <a href="/interest" className="hidden items-center gap-2 rounded-md bg-ruby-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ruby-500 xl:inline-flex">
            Next cohort interest <ArrowUpRight className="h-4 w-4" />
          </a>

          <button onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white xl:hidden" aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <button className="fixed inset-0 top-[72px] z-40 bg-slate-950/60 xl:hidden" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" />
          <div className="absolute left-0 top-full z-50 w-full border-t border-white/10 bg-[#0b1220] px-4 py-4 xl:hidden">
            <div className="mx-auto max-w-2xl space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={`block rounded-md px-4 py-3 font-semibold ${isActive(item.href) ? "bg-white/10 text-white" : "text-slate-300"}`}>{item.label}</Link>
              ))}
              <a href="/interest" className="mt-4 flex items-center justify-between rounded-md bg-ruby-600 px-4 py-3 font-bold text-white">Join the interest list <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
