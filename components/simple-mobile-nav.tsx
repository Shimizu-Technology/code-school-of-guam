"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface NavItem {
  href: string
  label: string
  isButton?: boolean
}

interface SimpleMobileNavProps {
  navItems: NavItem[]
  activeSection: string
}

export function SimpleMobileNav({ navItems, activeSection }: SimpleMobileNavProps) {
  const [showNav, setShowNav] = useState(false)
  
  // Close the mobile nav after clicking a link
  const closeNav = () => {
    setShowNav(false)
  }

  return (
    <Sheet open={showNav} onOpenChange={setShowNav}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="xl:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="bg-gray-900 text-white p-0 w-[85%] sm:max-w-md"
      >
        <SheetHeader className="p-4 border-b border-gray-800">
          <SheetTitle className="text-white">Menu</SheetTitle>
          <SheetDescription className="text-gray-400">
            Navigation links for Code School of Guam
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 px-2 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                className={`py-3 px-4 rounded-md ${
                  activeSection === item.href.slice(1)
                    ? "bg-ruby-500 text-white font-medium"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
                href={item.href}
                onClick={closeNav}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-800">
            <a
              href="https://forms.gle/bifqSWnbH74vLZ7v7"
              className="flex w-full items-center justify-center rounded-md bg-ruby-500 px-5 py-3 text-base font-medium text-white"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeNav}
            >
              Apply Now
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}