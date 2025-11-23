// app/layout.tsx

import "./globals.css"
import { ReactNode } from "react"
import { PostHogProvider } from './providers'

export const metadata = {
  title: "Code School of Guam",
  description: "Guam's First Code School",
  keywords:
    "Code School, Guam, Programming, Software Development, Ruby on Rails, React.js",
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
        <meta name="description" content="Guam's First Code School" />

        <title>Code School of Guam</title>
      </head>

      <body className="font-sans min-h-screen bg-background text-foreground">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {/*
          If you want a universal Header or Navbar, you can add it here.
          e.g. <Header />
        */}
        <PostHogProvider>
          <div id="root">{children}</div>
        </PostHogProvider>
      </body>
    </html>
  )
}
