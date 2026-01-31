// app/layout.tsx

import "./globals.css"
import { ReactNode } from "react"
import { PostHogProvider } from './providers'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Metadata, Viewport } from "next"
import { ChatButton } from '@/components/chat-button'

export const metadata: Metadata = {
  title: {
    default: "Code School of Guam - Learn Full-Stack Development & AI Engineering",
    template: "%s | Code School of Guam"
  },
  description: "Guam's first coding bootcamp. Master Ruby, Rails, React, Python & AI Engineering in 20 weeks. Remote classes, real-world projects, and guaranteed job opportunities.",
  keywords: "Code School, Guam, Programming, Software Development, Ruby on Rails, React.js, Python, AI Engineering, Machine Learning, Coding Bootcamp",
  authors: [{ name: "Code School of Guam" }],
  creator: "Leon Shimizu",
  metadataBase: new URL('https://codeschoolofguam.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Code School of Guam - Launch Your Tech Career",
    description: "Join Guam's first coding bootcamp and master Ruby, Rails, React, Python & AI Engineering. Remote classes, real-world projects, and career support.",
    url: 'https://codeschoolofguam.com',
    siteName: 'Code School of Guam',
    images: [
      {
        url: '/CSG-Logo.png',
        width: 512,
        height: 512,
        alt: 'Code School of Guam Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Code School of Guam - Learn to Code",
    description: "Guam's first coding bootcamp. Master Ruby, Rails, React, Python & AI Engineering.",
    images: ['/CSG-Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/CSG-Logo.png',
    apple: '/CSG-Logo.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Code School of Guam',
  description: "Guam's first coding bootcamp offering full-stack development and AI engineering courses.",
  url: 'https://codeschoolofguam.com',
  logo: 'https://codeschoolofguam.com/CSG-Logo.png',
  image: 'https://codeschoolofguam.com/CSG-Logo.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Guam',
    addressCountry: 'US',
  },
  founder: {
    '@type': 'Person',
    name: 'Leon Shimizu',
  },
  sameAs: [
    'https://shimizu-technology.com',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Coding Courses',
    itemListElement: [
      {
        '@type': 'Course',
        name: 'Full-Stack Development Bootcamp',
        description: 'Learn Ruby, Rails, React, Python & AI Engineering in 20 weeks',
        provider: {
          '@type': 'Organization',
          name: 'Code School of Guam',
        },
      },
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          <div id="root">{children}</div>
          {/* Chatbot - fixed position in bottom-left corner */}
          <ChatButton />
        </PostHogProvider>
      </body>
    </html>
  )
}
