"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/courses", label: "Focused Courses" },
  { href: "/programs", label: "Full Bootcamp" },
  { href: "/curriculum", label: "Bootcamp Curriculum" },
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

          <Link href="/courses/python-fundamentals" className="hidden items-center gap-2 rounded-md bg-ruby-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ruby-500 xl:inline-flex">
            Python updates <ArrowUpRight className="h-4 w-4" />
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button type="button" className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white xl:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="max-h-dvh w-[min(88vw,26rem)] overflow-y-auto border-white/10 bg-[#0b1220] p-0 text-white xl:hidden">
              <SheetHeader className="border-b border-white/10 px-6 py-5 text-left">
                <SheetTitle className="font-serif text-2xl text-white">Explore Code School</SheetTitle>
                <SheetDescription className="text-slate-300">Courses, the full bootcamp, student work, and school information.</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="space-y-1 px-4 py-5">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-4 py-3 font-semibold ${isActive(item.href) ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/5 hover:text-white"}`}>{item.label}</Link>
                ))}
                <Link href="/courses/python-fundamentals" onClick={() => setMobileMenuOpen(false)} className="mt-5 flex items-center justify-between rounded-md bg-ruby-600 px-4 py-3 font-bold text-white hover:bg-ruby-500">Python course updates <ArrowUpRight className="h-4 w-4" /></Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

    </header>
  )
}
