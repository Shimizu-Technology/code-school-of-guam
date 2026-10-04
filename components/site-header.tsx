"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const primaryNavItems = [
  { href: "/courses", label: "Courses" },
  { href: "/projects", label: "Student work" },
  { href: "/about", label: "About" },
]

const secondaryNavItems = [
  { href: "/programs", label: "Full bootcamp" },
  { href: "/curriculum", label: "Bootcamp curriculum" },
  { href: "/internship", label: "Internship" },
  { href: "/faq", label: "FAQ" },
  { href: "/interest", label: "Bootcamp updates" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const brandRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => setMobileMenuOpen(false), [pathname])

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false)
    }
    closeOnDesktop()
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className={`sticky top-0 z-50 border-b border-[#ded7c9] bg-[#faf7f0]/95 text-slate-950 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-lg shadow-slate-950/10" : ""}`}>
      <nav aria-label="Main navigation" className="container mx-auto px-4 sm:px-8">
        <div className="flex h-[72px] items-center justify-between gap-5">
          <Link ref={brandRef} href="/" className="flex min-w-0 items-center gap-3">
            <Image src="/CSG-Logo.png" alt="Code School of Guam" width={36} height={36} className="h-9 w-9 shrink-0 rounded-md object-contain" />
            <span className="truncate text-base font-bold tracking-tight sm:text-lg">Code School of Guam</span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {primaryNavItems.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${isActive(item.href) ? "bg-[#eee7da] text-ruby-800" : "text-slate-600 hover:bg-[#eee7da] hover:text-slate-950"}`}>
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/courses#course-interest" className="hidden items-center gap-2 rounded-md bg-ruby-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ruby-500 lg:inline-flex">
            Course updates <ArrowUpRight className="h-4 w-4" />
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button type="button" className="rounded-md p-2 text-slate-700 hover:bg-[#eee7da] hover:text-slate-950 lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" onCloseAutoFocus={(event) => { if (window.matchMedia("(min-width: 1024px)").matches) { event.preventDefault(); brandRef.current?.focus() } }} className="max-h-dvh w-[min(88vw,26rem)] overflow-y-auto border-[#ded7c9] bg-[#faf7f0] p-0 text-slate-950 lg:hidden">
              <SheetHeader className="border-b border-[#ded7c9] px-6 py-5 text-left">
                <SheetTitle className="font-serif text-2xl text-slate-950">Explore Code School</SheetTitle>
                <SheetDescription className="text-slate-600">Courses, the full bootcamp, student work, and school information.</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="space-y-1 px-4 py-5">
                {primaryNavItems.map((item) => (
                  <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-4 py-3 font-semibold ${isActive(item.href) ? "bg-[#eee7da] text-ruby-800" : "text-slate-700 hover:bg-[#eee7da] hover:text-slate-950"}`}>{item.label}</Link>
                ))}
                <div className="my-4 border-t border-[#ded7c9] pt-4">
                  {secondaryNavItems.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setMobileMenuOpen(false)} className={`block rounded-md px-4 py-3 text-sm font-semibold ${isActive(item.href) ? "bg-[#eee7da] text-ruby-800" : "text-slate-700 hover:bg-[#eee7da]"}`}>{item.label}</Link>)}
                </div>
                <Link href="/courses#course-interest" onClick={() => setMobileMenuOpen(false)} className="mt-5 flex items-center justify-between rounded-md bg-ruby-600 px-4 py-3 font-bold text-white hover:bg-ruby-500">Course updates <ArrowUpRight className="h-4 w-4" /></Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

    </header>
  )
}
