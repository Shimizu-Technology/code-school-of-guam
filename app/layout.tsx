// app/layout.tsx

import "./globals.css"
import { ReactNode } from "react"
import { PostHogProvider } from './providers'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: {
    default: "Code School of Guam - Learn Full-Stack Development & AI Engineering",
    template: "%s | Code School of Guam"
  },
  description: "Guam's first coding bootcamp. Master Ruby, Rails, React, Python & AI Engineering in 20 weeks. Remote classes, real-world projects, and guaranteed job opportunities.",
  keywords:
    "Code School, Guam, Programming, Software Development, Ruby on Rails, React.js, Python, AI Engineering, Machine Learning, Coding Bootcamp",
  author: "Code School of Guam",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#000000",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/CSG-logo.png" />
        {/* Open Graph tags for better social media sharing */}
        <meta property="og:title" content="Code School of Guam - Launch Your Tech Career" />
        <meta
          property="og:description"
          content="Join Guam's first coding bootcamp and master Ruby, Rails, React, Python & AI Engineering. Remote classes, real-world projects, and career support."
        />
        <meta property="og:image" content="/CSG-logo.png" />
        <meta property="og:url" content="https://codeschoolofguam.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Apple Touch and PWA Manifest */}
        <link rel="apple-touch-icon" href="/CSG-logo.png" />
        <link rel="manifest" href="/manifest.json" />

        <meta
          name="keywords"
          content="Code School, Guam, Programming, Software Development, Ruby on Rails, React.js, Python, AI Engineering, Machine Learning"
        />
        <meta name="author" content="Code School of Guam" />
      </head>

      <body className="font-sans min-h-screen bg-background text-foreground">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <PostHogProvider>
          <div id="root" className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-grow">
              {children}
            </main>
            <SiteFooter />
          </div>
        </PostHogProvider>
      </body>
    </html>
  )
}
