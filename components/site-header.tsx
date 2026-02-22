"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"

const mainNavItems = [
  { href: "/", label: "Home" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/programs", label: "Programs & Pricing" },
  { href: "/projects", label: "Projects" },
  { href: "/internship", label: "Internship" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg" 
          : "bg-slate-900"
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center text-white font-bold text-lg">
              <span className="text-ruby-500 mr-1">&lt;</span>
              <span className="text-ruby-400">/</span>
              <span className="text-ruby-500 mr-2">&gt;</span>
              <span className="group-hover:text-ruby-400 transition-colors">Code School of Guam</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-ruby-500/20 text-ruby-400"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden xl:flex items-center">
            <a
              href="https://forms.gle/nJv8nAfxsvvLSbbq7"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-ruby-500 hover:bg-ruby-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 xl:hidden" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="xl:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800 z-50">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-ruby-500/20 text-ruby-400"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <a
                  href="https://forms.gle/nJv8nAfxsvvLSbbq7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 bg-ruby-500 hover:bg-ruby-600 text-white rounded-md font-medium"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

