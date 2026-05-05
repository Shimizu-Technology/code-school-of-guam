"use client"

import Link from "next/link"
import Image from "next/image"
import type React from "react"
import { 
  ArrowRight, 
  ExternalLink, 
  Star,
  CheckCircle,
  Code,
  Rocket,
  Quote,
  Users,
  Trophy,
  GraduationCap
} from "lucide-react"

type ShimizuProject = {
  title: string
  subtitle: string
  description: string
  image?: string
  gradient?: string
  icon?: React.ReactNode
  link?: string
  technologies: string[]
  highlights: string[]
  featured?: boolean
  comingSoon?: boolean
}

// Shimizu Technology projects that students learn around and graduates can contribute to
const shimizuProjects: ShimizuProject[] = [
  {
    title: "Hafa Code",
    subtitle: "Student Coding Playground",
    description: "A lightweight Replit alternative built for Code School of Guam, FD students, alumni, and anyone learning to code without heavy setup or distracting AI features.",
    image: "/images/hafa-code-icon.svg",
    link: "https://hafa-code.netlify.app",
    technologies: ["React", "TypeScript", "WASM", "Ruby", "Monaco"],
    highlights: [
      "Ruby, JavaScript, and HTML/CSS/JS in the browser",
      "Simple local projects with optional cloud sync",
      "Built as a real tool students can use and understand"
    ],
    featured: true
  },
  {
    title: "CSG Learning Hub",
    subtitle: "Code School Learning Platform",
    description: "The private learning platform behind Code School of Guam: prework, class content, workshops, recordings, grading, progress tracking, and cohort management.",
    gradient: "from-ruby-500 to-slate-900",
    icon: <GraduationCap className="w-16 h-16 text-white/90" />,
    link: "https://learn.codeschoolofguam.com",
    technologies: ["React", "Rails", "Clerk", "PostgreSQL", "TypeScript"],
    highlights: [
      "Lessons, exercises, recordings, and workshops",
      "Student progress and instructor workflows",
      "Real production platform powering the school"
    ],
    featured: true
  },
  {
    title: "HåfaGPT",
    subtitle: "Chamorro Language Learning Platform",
    description: "A comprehensive AI-powered platform for learning Chamorro, the indigenous language of Guam and the Mariana Islands.",
    image: "/images/HafaGPT-icon1.png",
    link: "https://hafagpt.com",
    technologies: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "OpenAI"],
    highlights: [
      "45,000+ knowledge chunks in RAG system",
      "Searchable dictionary, stories, quizzes, and games",
      "Guam-first AI product with cultural impact"
    ],
    featured: true
  },
  {
    title: "Cornerstone Payroll",
    subtitle: "Guam Payroll Platform",
    description: "A Guam-specific payroll application built as a better local alternative to generic mainland payroll tools and QuickBooks-heavy workflows.",
    image: "/images/cornerstone-logo.jpeg",
    link: "https://cornerstone-payroll.netlify.app",
    technologies: ["React", "Ruby on Rails", "PostgreSQL", "Clerk"],
    highlights: [
      "Payroll runs, pay periods, and approvals",
      "Guam tax and reporting workflows",
      "Check printing and employee records"
    ],
    featured: true
  },
  {
    title: "AIRE Services",
    subtitle: "Live Business Operations App",
    description: "A production operations platform for AIRE Services Guam, already used by employees for clock-in/clock-out and daily workflows.",
    image: "/images/aire-logo.png",
    link: "https://aire-services-guam.netlify.app",
    technologies: ["React", "Rails", "PostgreSQL", "Clerk"],
    highlights: [
      "Employee time clock and attendance",
      "Approval and operations dashboards",
      "Payroll-oriented summaries and exports"
    ]
  },
  {
    title: "Hafaloha Orders",
    subtitle: "Production Ordering Platform",
    description: "Online ordering, retail, VIP event sales, shipping, and admin workflows for a real business with real customers and high-volume event fulfillment.",
    image: "/images/hafaloha_hero.jpg",
    link: "https://hafaloha-orders.com",
    technologies: ["React", "Ruby on Rails", "PostgreSQL", "Stripe", "EasyPost", "Redis"],
    highlights: [
      "850+ VIP orders at concert event",
      "EasyPost shipping and Stripe payments",
      "Real-time order management"
    ]
  },
  {
    title: "Golf for Wishes",
    subtitle: "Make-A-Wish Event Platform",
    description: "Registration and event management platform for Make-A-Wish Guam & CNMI, supporting charity events from signup through tournament day.",
    image: "/images/golf-for-wishes-logo.png",
    link: "https://golfforwishes.com",
    technologies: ["React", "Ruby on Rails", "Stripe", "ActionCable"],
    highlights: [
      "Team registration and payments",
      "Sponsor and raffle management",
      "Admin tools for event-day operations"
    ]
  },
  {
    title: "Three Squares Grill",
    subtitle: "Restaurant & Catering System",
    description: "Coming-soon ordering platform for Three Squares and B&G Pacific, designed around catering, dine-in/takeout, and local restaurant operations.",
    image: "/images/three-squares-grill.svg",
    link: "https://three-squares-web.netlify.app",
    technologies: ["React", "Ruby on Rails", "PostgreSQL", "Stripe"],
    highlights: [
      "Catering and bulk ordering flows",
      "Admin dashboard and order management",
      "Built for multi-location operations"
    ],
    comingSoon: true
  },
  {
    title: "GIAA Golf Tournament",
    subtitle: "Event Registration System",
    description: "Custom registration and admin dashboard for the annual Edward A.P. Muna II Memorial Golf Tournament hosted by the Guam International Airport Authority.",
    image: "/images/giaa-logo.png",
    link: "https://giaa-tournament.com",
    technologies: ["React", "Ruby on Rails", "Stripe", "PostgreSQL"],
    highlights: [
      "Online registration with payments",
      "Admin dashboard for event management",
      "Built for annual reuse"
    ]
  },
  {
    title: "Cornerstone Accounting",
    subtitle: "Tax & Accounting Platform",
    description: "Full-service accounting platform that transformed Cornerstone's paper-based process into a streamlined digital system with client intake and workflow management.",
    image: "/images/cornerstone-logo.jpeg",
    link: "https://cornerstone-accounting.tax",
    technologies: ["React", "Ruby on Rails", "PostgreSQL", "Clerk"],
    highlights: [
      "Digital client intake workflows",
      "Workflow and status dashboards",
      "Recurring operations and time tracking"
    ]
  },
  {
    title: "Typr",
    subtitle: "Voice-to-Text Tool",
    description: "A coming-soon local-first dictation app inspired by Superwhisper and Wispr Flow — a good example of the team building tools for itself.",
    image: "/images/typr-icon.png",
    technologies: ["Tauri", "Rust", "Whisper", "TypeScript"],
    highlights: [
      "Local Whisper-powered dictation",
      "App-aware paste and replace workflows",
      "Built for developers and operators"
    ],
    comingSoon: true
  }
]

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4 mr-2" />
            Success Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            From Zero to <span className="text-ruby-500">Full-Stack Developer</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Watch our students present their capstone projects. In under 6 months, they go from coding beginners to building full-stack applications with Ruby on Rails APIs, React frontends, and AI-powered features. <span className="text-ruby-400 font-medium">11 graduates across 2 cohorts with a 100% completion rate.</span>
          </p>
        </div>
        {/* Fade to next section - dark to light */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-slate-600">Completion Rate</div>
              <div className="text-xs text-slate-500">All students finished the program</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">16</div>
              <div className="text-sm text-slate-600">Weeks to Success</div>
              <div className="text-xs text-slate-500">From beginner to developer</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">8</div>
              <div className="text-sm text-slate-600">Real Projects Built</div>
              <div className="text-xs text-slate-500">Hands-on applications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capstone Videos */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Capstone Presentations
            </h2>
            <p className="text-slate-600">
              Watch our graduates present their final projects
            </p>
          </div>

          {/* Two videos side by side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Cohort 2 - December 2025 */}
            <div>
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl border-2 border-ruby-200">
                <div style={{ paddingTop: '56.25%' }}>
                  <iframe 
                    src="https://www.youtube.com/embed/bWuS_YuiRzI" 
                    title="Code School of Guam Cohort 2 Capstone Presentations - December 2025" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 bg-ruby-100 text-ruby-700 rounded-full text-sm font-medium mb-2">
                  Latest
                </span>
                <p className="text-sm text-slate-600 font-medium">
                  Cohort 2 Capstone Presentations
                </p>
                <p className="text-xs text-slate-500">
                  December 2025 • 5 Graduates
                </p>
              </div>
            </div>

            {/* Cohort 1 - May 2025 */}
            <div>
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl border-2 border-slate-200">
                <div style={{ paddingTop: '56.25%' }}>
                  <iframe 
                    src="https://www.youtube.com/embed/MNzZeL33jiw?t=650" 
                    title="Code School of Guam Cohort 1 Capstone Presentations - May 2025" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-600 font-medium">
                  Cohort 1 Capstone Presentations
                </p>
                <p className="text-xs text-slate-500">
                  May 2025 • 6 Graduates
                </p>
              </div>
            </div>
          </div>

          {/* Project Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-slate-50 rounded-2xl p-6 border-l-4 border-ruby-500">
              <div className="flex items-center mb-3">
                <Code className="w-5 h-5 text-ruby-500 mr-2" />
                <h3 className="font-semibold text-slate-900">Local Impact Projects</h3>
              </div>
              <p className="text-sm text-slate-600">
                Students created apps addressing Guam-specific challenges, from tourism platforms to local business management tools.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-semibold text-slate-900">Industry-Ready Skills</h3>
              </div>
              <p className="text-sm text-slate-600">
                Every project uses professional development practices: Git version control, database design, API integration, and responsive design.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-slate-900">Presentation Skills</h3>
              </div>
              <p className="text-sm text-slate-600">
                Students present to industry professionals, gaining confidence in explaining technical concepts and business value.
              </p>
            </div>
          </div>

          {/* Founder Quote */}
          <div className="max-w-2xl mx-auto mt-12 bg-slate-50 rounded-lg p-6 text-center">
            <p className="text-slate-700 italic mb-3">
              &quot;Seeing our students go from never having coded before to presenting full-stack applications with AI features in just a few months is incredibly rewarding. They&apos;re ready for real developer roles.&quot;
            </p>
            <p className="text-sm text-slate-600">
              - Leon Shimizu, Founder & Lead Instructor
            </p>
          </div>
        </div>
      </section>

      {/* Shimizu Technology Projects */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1.5 bg-ruby-500/10 text-ruby-700 rounded-full text-sm font-medium mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              Real-World Experience
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Projects Our Graduates Work On
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              During their internship with{" "}
              <a
                href="https://shimizu-technology.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ruby-600 hover:text-ruby-700 font-medium"
              >
                Shimizu Technology
              </a>
              , students learn around real production applications like these — the kind of software actual businesses, students, and community organizations depend on.
            </p>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {shimizuProjects.map((project, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-lg transition-all ${project.featured ? 'ring-2 ring-ruby-200' : ''}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="lg:col-span-1 h-64 lg:h-auto relative bg-slate-100 overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className={`object-contain p-8 ${project.image.includes('hafaloha') ? 'object-cover p-0' : ''}`}
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${project.gradient || 'from-slate-600 to-slate-900'}`}>
                        {project.icon}
                      </div>
                    )}
                    {project.featured && !project.comingSoon && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-ruby-500 text-white text-xs font-semibold rounded-full flex items-center">
                          <Star className="w-3 h-3 mr-1" /> Featured
                        </span>
                      </div>
                    )}
                    {project.comingSoon && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full flex items-center">
                          <Rocket className="w-3 h-3 mr-1" /> Coming Soon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-slate-900">{project.title}</h3>
                      <span className="text-slate-500">—</span>
                      <span className="text-slate-600">{project.subtitle}</span>
                    </div>
                    
                    <p className="text-slate-600 mb-4">{project.description}</p>

                    {/* Highlights */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-3">
                      {project.link && !project.comingSoon && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          Visit Site
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </a>
                      )}
                      {project.comingSoon && (
                        <span className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-md text-sm font-medium">
                          <Rocket className="w-3 h-3 mr-2" />
                          Coming Soon
                        </span>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Partner CTA */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">
              These projects are built and maintained by{" "}
              <a 
                href="https://shimizu-technology.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-ruby-600 hover:text-ruby-700 font-medium"
              >
                Shimizu Technology
              </a>
              , our internship partner.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-12 h-12 text-ruby-500/50 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl leading-relaxed mb-6 text-slate-300">
              &ldquo;It was soooo incredible being able to see what was only a discussion of an idea, come to life. No doubt that the online ordering option is a valuable perk & adds to the VIP experience.&rdquo;
            </blockquote>
            <p className="text-slate-400">
              — <span className="text-white font-medium">Hafaloha Owner</span>, on the system our team built
            </p>
            <div className="flex justify-center gap-8 mt-8 text-center">
              <div>
                <div className="text-3xl font-bold text-ruby-400">850+</div>
                <div className="text-sm text-slate-400">VIP Orders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">100%</div>
                <div className="text-sm text-slate-400">Fulfillment</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">Zero</div>
                <div className="text-sm text-slate-400">Downtime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try It Yourself - Interactive Demos */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Rocket className="w-4 h-4 mr-2" />
              Interactive Demo
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              See What&apos;s Possible
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              With the skills you learn at Code School of Guam, projects like this become possible. Built with React and core programming concepts from our curriculum.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Link
              href="/flappy-bird"
              className="group block bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-8 text-center">
                <Rocket className="w-12 h-12 text-white/90 mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-white mb-1">Flappy Bird Clone</h3>
                <p className="text-white/80 text-sm">Built with React & HTML5 Canvas</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-slate-600 text-sm mb-4">
                  A fun example of what you can build with programming fundamentals — state management, game loops, collision detection, and responsive design.
                </p>
                <span className="inline-flex items-center text-ruby-600 font-medium group-hover:text-ruby-700">
                  Play Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            More interactive demos coming soon!
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-ruby-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Build Real Projects?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the Code School of Guam and get the skills to contribute to production applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:codeschoolofguam@gmail.com?subject=Future%20Cohort%20Updates"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-ruby-600 hover:bg-slate-100 rounded-lg text-lg font-medium transition-all"
            >
              Request Future Updates
            </a>
            <Link
              href="/internship"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg text-lg font-medium transition-all"
            >
              Learn About Internship
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
