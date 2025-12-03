// app/layout.tsx

import "./globals.css"
import { ReactNode } from "react"
import { PostHogProvider } from './providers'

export const metadata = {
  title: "Code School of Guam - Learn Full-Stack Development & AI Engineering",
  description: "Guam's first coding bootcamp. Master Ruby on Rails, React, Python & AI Engineering in our 20-week program. Remote classes, real-world projects, career support. February 2026 cohort now enrolling.",
  keywords: "Code School, Guam, Programming, Software Development, Ruby on Rails, React.js, Python, AI Engineering, Machine Learning, Coding Bootcamp, Web Development, Full Stack Developer, Tech Career Guam",
  author: "Code School of Guam",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#b91c1c",
  robots: "index, follow",
  alternates: {
    canonical: "https://codeschoolofguam.com",
  },
}

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://codeschoolofguam.com/#organization",
      "name": "Code School of Guam",
      "url": "https://codeschoolofguam.com",
      "logo": "https://codeschoolofguam.com/CSG-logo.png",
      "description": "Guam's first coding bootcamp offering comprehensive full-stack web development and AI engineering training.",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Guam",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://www.instagram.com/codeschoolofguam",
        "https://www.facebook.com/codeschoolofguam"
      ]
    },
    {
      "@type": "Course",
      "@id": "https://codeschoolofguam.com/#course",
      "name": "Full-Stack Web Development & AI Engineering Bootcamp",
      "description": "20-week comprehensive program covering Ruby, Ruby on Rails, JavaScript, React, Python, and AI Engineering. Includes 5 weeks of pre-work and 15 weeks of live instruction.",
      "provider": {
        "@type": "EducationalOrganization",
        "@id": "https://codeschoolofguam.com/#organization"
      },
      "courseCode": "CSG-FULLSTACK-2026",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "name": "February 2026 Cohort",
        "startDate": "2026-02-02",
        "endDate": "2026-06-30",
        "courseMode": "online",
        "courseWorkload": "PT16H/week"
      },
      "teaches": [
        "Ruby Programming",
        "Ruby on Rails",
        "JavaScript",
        "React.js",
        "Python",
        "AI Engineering",
        "Machine Learning",
        "API Development",
        "Full-Stack Development"
      ],
      "occupationalCredentialAwarded": "Certificate of Completion"
    },
    {
      "@type": "FAQPage",
      "@id": "https://codeschoolofguam.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need prior coding experience?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No prior experience needed! Our 5-week pre-work phase is designed to bring complete beginners up to speed with programming fundamentals."
          }
        },
        {
          "@type": "Question",
          "name": "What is the class schedule?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Live classes are Monday through Thursday, 5:30pm - 9:30pm (Guam time), with 3-5 hours of weekend homework. This schedule is designed for working professionals."
          }
        },
        {
          "@type": "Question",
          "name": "Is the program fully remote?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All classes are conducted remotely via video conferencing, allowing you to learn from anywhere."
          }
        },
        {
          "@type": "Question",
          "name": "What will I learn?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You'll learn Ruby, Ruby on Rails, JavaScript, React, Python, and AI Engineering. You'll build real-world projects including full-stack applications and AI-powered chatbots."
          }
        }
      ]
    }
  ]
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/CSG-logo.png" />
        
        {/* Primary Meta Tags */}
        <meta name="title" content="Code School of Guam - Learn Full-Stack Development & AI Engineering" />
        <meta name="description" content="Guam's first coding bootcamp. Master Ruby on Rails, React, Python & AI Engineering in our 20-week program. Remote classes, real-world projects, career support. February 2026 cohort now enrolling." />
        <meta name="keywords" content="Code School, Guam, Programming, Software Development, Ruby on Rails, React.js, Python, AI Engineering, Machine Learning, Coding Bootcamp, Web Development, Full Stack Developer, Tech Career Guam" />
        <meta name="author" content="Code School of Guam" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://codeschoolofguam.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codeschoolofguam.com" />
        <meta property="og:title" content="Code School of Guam - Launch Your Tech Career" />
        <meta property="og:description" content="Join Guam's first coding bootcamp and master Ruby, Rails, React, Python & AI Engineering. Remote classes, real-world projects, and career support. February 2026 cohort now enrolling!" />
        <meta property="og:image" content="https://codeschoolofguam.com/CSG-logo.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Code School of Guam" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://codeschoolofguam.com" />
        <meta name="twitter:title" content="Code School of Guam - Launch Your Tech Career" />
        <meta name="twitter:description" content="Join Guam's first coding bootcamp and master Ruby, Rails, React, Python & AI Engineering. Remote classes, real-world projects, and career support." />
        <meta name="twitter:image" content="https://codeschoolofguam.com/CSG-logo.png" />

        {/* Apple Touch and PWA */}
        <link rel="apple-touch-icon" href="/CSG-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="GU" />
        <meta name="geo.placename" content="Guam" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <title>Code School of Guam - Learn Full-Stack Development & AI Engineering</title>
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
