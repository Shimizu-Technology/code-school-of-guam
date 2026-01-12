"use client"

import Link from "next/link"
import { Mail, Phone, ExternalLink } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center text-white font-bold text-lg mb-4">
              <span className="text-ruby-500 mr-1">&lt;</span>
              <span className="text-ruby-400">/</span>
              <span className="text-ruby-500 mr-2">&gt;</span>
              <span>Code School of Guam</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Guam&apos;s first coding bootcamp. Learn to build AI-powered applications in under 6 months.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="text-ruby-400">Partner:</span>
              <a 
                href="https://shimizu-technology.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center"
              >
                Shimizu Technology
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/curriculum" className="text-gray-400 hover:text-white transition-colors">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-white transition-colors">
                  Programs & Pricing
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
                  Student Projects
                </Link>
              </li>
              <li>
                <Link href="/internship" className="text-gray-400 hover:text-white transition-colors">
                  Internship Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/payment" className="text-gray-400 hover:text-white transition-colors">
                  Make a Payment
                </Link>
              </li>
              <li>
                <Link href="/flappy-bird" className="text-gray-400 hover:text-white transition-colors">
                  Demo Game
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:codeschoolofguam@gmail.com" 
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2 text-ruby-500" />
                  codeschoolofguam@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+16714830219" 
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2 text-ruby-500" />
                  (671) 483-0219
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="https://forms.gle/8vNXoqxCimxjfXkU6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-ruby-500 hover:bg-ruby-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Code School of Guam. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Built with ❤️ in Guam
          </p>
        </div>
      </div>
    </footer>
  )
}

