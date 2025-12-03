"use client"

import { useState, useEffect } from "react"
import { usePostHog } from "posthog-js/react"
import {
  setupScrollAnimations,
  setupStaggeredAnimations,
  setupDeviceOrientationEffects,
  setupTouchEffects
} from "@/lib/animation-utils"
import { SimpleMobileNav } from "@/components/simple-mobile-nav"
import { EnhancedFAQSection } from "@/components/enhanced-faq-section"
import { RefinedTimelineSection } from "@/components/refined-timeline-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowDown,
  ChevronRight,
  ChevronDown,
  Code,
  Rocket,
  Users,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle,
  Calendar,
  Clock,
  GamepadIcon,
  Database,
  Star,
  Brain,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import emailjs from "@emailjs/browser"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const posthog = usePostHog()

  // Tracking functions
  const trackApplyClick = (location: string) => {
    posthog?.capture('apply_button_clicked', {
      location,
      cohort: 'February 2026',
      button_text: 'Apply for February Cohort'
    })
  }

  const trackPricingClick = (location: string) => {
    posthog?.capture('view_pricing_clicked', {
      location,
      scroll_to: 'programs_section'
    })
  }

  const trackExternalLink = (destination: string, linkType: string) => {
    posthog?.capture('external_link_clicked', {
      destination,
      link_type: linkType
    })
  }

  const trackSectionView = (sectionName: string) => {
    posthog?.capture('section_viewed', {
      section: sectionName
    })
  }

  useEffect(() => {
    setIsVisible(true)

    // Track scroll depth milestones
    const scrollDepthTracked = {
      '25': false,
      '50': false,
      '75': false,
      '100': false
    }

    // Track section views
    const sectionsViewed = new Set<string>()

    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        if (section instanceof HTMLElement) {
          const sectionTop = section.offsetTop
          const sectionBottom = sectionTop + section.offsetHeight
          if (sectionTop <= scrollPosition && sectionBottom > scrollPosition) {
            setActiveSection(section.id)
            
            // Track section view (only once per section)
            if (section.id && !sectionsViewed.has(section.id)) {
              sectionsViewed.add(section.id)
              trackSectionView(section.id)
            }
          }
        }
      })

      // Track scroll depth
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100

      Object.keys(scrollDepthTracked).forEach((milestone) => {
        const depth = parseInt(milestone)
        if (scrolled >= depth && !scrollDepthTracked[milestone as keyof typeof scrollDepthTracked]) {
          scrollDepthTracked[milestone as keyof typeof scrollDepthTracked] = true
          posthog?.capture('scroll_depth_reached', {
            depth: `${depth}%`,
            page: 'landing_page'
          })
        }
      })
    }

    // Initialize scroll position tracking
    window.addEventListener("scroll", handleScroll)
    
    // Initialize all our animation utilities
    setupScrollAnimations()
    setupStaggeredAnimations()
    
    // Only initialize device orientation effects on mobile devices
    if (window.innerWidth <= 768) {
      setupDeviceOrientationEffects()
    }
    
    // Initialize touch effects for all devices
    setupTouchEffects()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [posthog])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    emailjs
      .send(
        "service_jt2foj7",
        "template_un3f26f",
        {
          from_name: email,
          message: "New subscriber to your email list!",
        },
        "-4iZEmtDtCvBEn4gX"
      )
      .then(
        () => {
          alert("Subscription successful!")
          setEmail("") // Clear the email input
        },
        () => {
          alert("Subscription failed. Please try again.")
        }
      )
  }

  const navItems = [
    { href: "#why-choose-us", label: "Why Choose Us" },
    { href: "#what-youll-learn", label: "What You'll Learn" },
    { href: "#programs", label: "Programs & Pricing" },
    { href: "#student-projects", label: "Student Projects" },
    { href: "#timeline", label: "Timeline" },
    { href: "#internship", label: "Internship" },
    { href: "#career", label: "Career Services" },
    { href: "#flappy-bird-demo", label: "Demo Game" },
    { href: "#about", label: "About Us" },
    { href: "#founder", label: "About the Founder" },
    { href: "#admissions", label: "Admissions" },
    { href: "#faq", label: "FAQs" },
    { href: "#policies", label: "Policies" },
    { href: "#contact", label: "Contact Us" },
    { href: "/payment", label: "Payment", isButton: true },
  ]

  const faqs = [
    {
      question: "Do I need prior coding experience?",
      answer:
        "No prior coding experience is required. Our program starts from the basics and builds up to advanced concepts.",
    },

    {
      question: "Why do you teach Ruby on Rails instead of other programming languages?",
      answer:
        "We have chosen Ruby on Rails because it&apos;s a powerful, beginner-friendly framework that allows for rapid development. It&apos;s used by many successful companies like Airbnb, GitHub, and Shopify. Our instructors have professional experience with Rails, ensuring high-quality teaching and real-world insights. Learning Rails provides a strong foundation, making it easier to pick up other languages in the future.",
    },
    {
      question: "Do I need to have a Mac to join the program?",
      answer:
        "While it&apos;s not mandatory to have a Mac, we highly recommend it. Using a Mac helps ensure uniformity in the classroom, simplifying setup processes and minimizing technical issues that can arise from different operating systems. This allows you to focus more on learning coding concepts rather than dealing with OS-specific challenges. If you don&apos;t have a Mac, you&apos;re still welcome to join, but please be aware that some steps and commands may differ slightly.",
    },
    {
      question: "Are the classes held in-person or online?",
      answer:
        "All our classes are conducted fully remotely via Zoom. This allows you to participate in live, interactive sessions from anywhere with a reliable internet connection. Our online format provides flexibility and convenience while maintaining a high level of engagement and support.",
    },
    {
      question: "How does the internship work?",
      answer:
        "The internship is an optional 2-month program where you work on real projects in an Agile environment. After completion, we offer 2-3 guaranteed positions for top performers: 1-2 Teacher&apos;s Assistant positions for the next Code School cohort and one 6-month software engineering contract with Shimizu Technology.",
    },
    {
      question: "How long do I have access to the class recordings?",
      answer:
        "You will have lifetime access to all class recordings, in-class resources, and learning materials, supporting your continued learning journey indefinitely.",
    },
    {
      question: "Can I reach out for support after the program ends?",
      answer:
        "We are here to support you even after your cohort concludes. Feel free to reach out with questions or for guidance.",
    },
    {
      question: "Are there opportunities to become a teaching assistant?",
      answer:
        "Yes! Outstanding graduates may be invited to become paid teaching assistants for future cohorts, providing leadership experience and reinforcing your own learning.",
    },
    {
      question: "Why is the tuition set at $7,500?",
      answer:
        "We strive to provide high-quality education with personalized attention through small class sizes and offer real-world experience via internships. Our tuition reflects the value and unique opportunities we provide, while remaining more affordable than many comparable programs.",
    },
    {
      question: "Do you offer payment plans?",
      answer:
        "Yes, we offer monthly installment plans during the course duration. We are also working on partnering with local banks for financing options.",
    },
    {
      question: "What is the attendance policy?",
      answer:
        "Attendance is crucial. Missing more than three unexcused classes may result in dismissal without a refund. Excused absences are considered for valid reasons.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Yes. Full tuition (minus the non-refundable deposit) is refundable if you withdraw before the start of the second week. No refunds are issued from the second week onward.",
    },
    {
      question: "How can I access the policies?",
      answer:
        "You can view our detailed policies, including the Code of Conduct, Attendance Policy, and Refund Policy, in the Policies section of our website.",
    },
    {
      question: "What resources do you recommend to get started with coding?",
      answer:
        "We recommend exploring free coding platforms like freeCodeCamp or Replit to get familiar with coding concepts and practice in-browser before starting pre-work.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Global inline styling for fade-in animations, etc. */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-1 {
          animation-delay: 0.2s;
        }
        .delay-2 {
          animation-delay: 0.4s;
        }
        .delay-3 {
          animation-delay: 0.6s;
        }
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        html {
          scroll-behavior: smooth;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ruby-600 focus:text-white focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md" role="banner">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo / Title with Smooth Scroll */}
            <a
              className="flex items-center hover:text-white cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Code School of Guam - Go to top"
            >
              <Code className="h-8 w-8 text-ruby-500" aria-hidden="true" />
              <span className="ml-2 text-xl font-bold text-white">Code School of Guam</span>
            </a>

            {/* Desktop Nav - Large Screens */}
            <nav className="hidden xl:flex space-x-4">
              {navItems.slice(0, 4).map((item, index) => (
                <Link
                  key={index}
                  className={`text-sm font-medium hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded-md ${
                    activeSection === item.href.slice(1)
                      ? "text-red-500 bg-gray-800"
                      : ""
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Nav - Medium Screens */}
            <nav className="hidden lg:flex xl:hidden space-x-3">
              {navItems.slice(0, 2).map((item, index) => (
                <Link
                  key={index}
                  className={`text-sm font-medium hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded-md ${
                    activeSection === item.href.slice(1)
                      ? "text-red-500 bg-gray-800"
                      : ""
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* "More" menu (large screens) */}
            <div className="hidden xl:block relative group">
              <button 
                className="text-sm font-medium hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded-md"
                aria-label="More navigation options"
                aria-haspopup="true"
              >
                More
                <ChevronDown className="inline-block ml-1 h-4 w-4" aria-hidden="true" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {navItems.slice(4).map((item, index) => (
                  <Link
                    key={index}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-red-500"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* "More" menu (medium screens) */}
            <div className="hidden lg:block xl:hidden relative group">
              <button 
                className="text-sm font-medium hover:text-red-500 transition-colors duration-200 px-2 py-1 rounded-md"
                aria-label="More navigation options"
                aria-haspopup="true"
              >
                More
                <ChevronDown className="inline-block ml-1 h-4 w-4" aria-hidden="true" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {navItems.slice(2).map((item, index) => (
                  <Link
                    key={index}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-red-500"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Simple Mobile Nav for Better Compatibility */}
            <SimpleMobileNav navItems={navItems} activeSection={activeSection} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1" id="main-content" role="main">
        {/* Hero / Landing Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          {/* Animated code-like background elements */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Mobile-optimized floating elements that respond to device movement */}
          <div className="absolute inset-0 opacity-10 md:opacity-5">
            <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-ruby-500 rounded-full animate-float" style={{ animationDelay: '0.5s' }} data-tilt-effect></div>
            <div className="absolute top-2/3 right-1/5 w-12 h-12 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '1.2s' }} data-tilt-effect></div>
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-green-400 rounded-full animate-float" style={{ animationDelay: '0.8s' }} data-tilt-effect></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div
              className={`flex flex-col items-center space-y-8 md:space-y-6 text-center ${
                isVisible ? "fade-in" : ""
              }`}
              data-tilt-effect
            >
              {/* Main heading and subheading */}
              <div className="space-y-6 reveal-on-scroll">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-white drop-shadow-lg px-2">
                  Launch Your Tech Career in Guam
                </h1>
                
                {/* New AI Curriculum Badge */}
                <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-xs md:text-sm font-bold transform hover:scale-105 transition-all duration-300 cursor-default shadow-[0_0_15px_rgba(234,179,8,0.3)] mx-auto max-w-[90vw]">
                  <Brain className="mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="truncate sm:whitespace-normal">Now including Python & AI Engineering</span>
                </div>

                <div className="mx-auto max-w-[700px] space-y-4 px-4">
                  <p className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                    Guam&apos;s First Coding Bootcamp
                    <span className="hidden md:inline"> • </span>
                    <span className="block md:inline text-green-300 mt-1 md:mt-0">5-Week Pre-work + 15-Week Live Classes</span>
                  </p>
                  
                  {/* Single most important urgency element */}
                  <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-xs md:text-sm font-medium animate-pulse">
                    ⚡ Only 10 Students Per Cohort
                  </div>
                  
                  <p className="text-sm text-green-300 font-medium">
                    <span className="hidden md:inline">🚀 2nd class in progress • </span>
                    Next cohort pre-work starts February 2nd, 2026
                  </p>
                </div>
              </div>
              
              {/* CTA buttons */}
              <div className="w-full max-w-sm mx-auto space-y-4 reveal-on-scroll px-4">
                <a
                  href="https://forms.gle/8vNXoqxCimxjfXkU6"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackApplyClick('hero_section')}
                  className="flex h-14 items-center justify-center rounded-md bg-ruby-500 px-6 text-lg font-medium text-white shadow-lg transition-all hover:bg-ruby-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ruby-400 w-full"
                  aria-label="Apply for February cohort"
                  role="button"
                >
                  Apply for February Cohort
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
                
                <div className="text-center space-y-3 md:space-y-2">
                  <p className="text-xs text-gray-400 md:text-gray-300">
                    No coding experience required • From beginner to job-ready
                  </p>
                  
                  {/* Secondary CTA - button style */}
                  <div className="pt-2">
                    <a
                      href="#programs"
                      onClick={() => trackPricingClick('hero_section')}
                      className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-gray-500 bg-gray-800/50 text-sm text-gray-200 hover:bg-gray-700/50 hover:text-white transition-all w-full"
                    >
                      View Pricing & Payment Plans
                      <ArrowDown className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent"></div>
        </section>



        {/* Student Success Stories */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-ruby-500/10 border border-ruby-500/20 rounded-full text-ruby-700 text-sm font-medium mb-4">
                <Users className="h-4 w-4 mr-2" />
                Student Success
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-gray-900">
                Hear from Our <span className="text-ruby-500">First Class</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real stories from our pilot cohort graduates who transformed their careers through coding
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Noah Peredo Testimonial */}
              <Card className="hover-lift bg-white shadow-lg border-l-4 border-ruby-500 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-ruby-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      N
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-900">Noah Peredo</h3>
                      <p className="text-sm text-gray-600">Graduate</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic mb-4 flex-grow">
                    &quot;Clear mind and trust the process. CSG will match the effort that you give it, so at the end of the day, how bad do you want it?&quot;
                  </blockquote>
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </CardContent>
              </Card>

              {/* Jessica Fernandez Testimonial */}
              <Card className="hover-lift bg-white shadow-lg border-l-4 border-ruby-500 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-ruby-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      J
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-900">Jessica Fernandez</h3>
                      <p className="text-sm text-gray-600">Graduate</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic mb-4 flex-grow">
                    &quot;I am very very VERY glad I enrolled and finished it! Now, I constantly think about ways I could &apos;hack&apos; my daily life by creating apps. Leon was extremely helpful in answering all my questions and providing valuable guidance.&quot;
                  </blockquote>
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </CardContent>
              </Card>

              {/* Alanna Cruz Testimonial */}
              <Card className="hover-lift bg-white shadow-lg border-l-4 border-ruby-500 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-ruby-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-900">Alanna Cruz</h3>
                      <p className="text-sm text-gray-600">Software Engineer</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic mb-4 flex-grow">
                    &quot;The Code School of Guam provided me with a comprehensive curriculum covering Ruby, Rails, React, and now Python & AI Engineering. The expert guidance and hands-on projects prepared me perfectly for my software engineering career!&quot;
                  </blockquote>
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">
                Ready to join our next success story?
              </p>
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm text-gray-700 mb-4">
                  Join our February 2026 cohort and transform your career with Ruby, Rails, React, Python & AI Engineering. <strong>Enrollment now open!</strong>
                </p>
                <a
                  href="https://forms.gle/8vNXoqxCimxjfXkU6"
                  onClick={() => trackApplyClick('testimonials_section')}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-ruby-500 text-white px-6 text-base font-medium shadow-lg transition-all hover:bg-ruby-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ruby-400 w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply for February Cohort
                  <Rocket className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Value & What's Included Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-800 text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Package Value
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-gray-900">
                What&apos;s Included — <span className="text-green-600">No Hidden Fees</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                For $7,500, you get everything you need to become a junior full-stack developer — plus lifetime support and guaranteed opportunities
              </p>
              
              {/* Clean pricing highlight */}
              <div className="inline-flex items-center px-3 py-1 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-medium">
                <Star className="h-4 w-4 mr-1" />
                New lower tuition - 25% less than before!
              </div>
            </div>

            {/* Value Comparison */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 md:p-8 border border-green-200 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">$7,500</div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">Code School of Guam</div>
                    <div className="text-sm text-gray-600">New Lower Price • Was $10,000</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-gray-400 text-2xl font-bold">VS</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-500 mb-2">$16,000+</div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">U.S. Bootcamps</div>
                    <div className="text-sm text-gray-600">Without internship guarantee</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    🎯 <span className="text-green-600">Save over $8,500</span> while getting MORE value with our locally-focused program
                  </p>
                </div>
              </div>
            </div>

            {/* What's Included Grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Core Program */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">4½-Month Bootcamp</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    From zero to certified junior full-stack developer with live instruction and hands-on projects
                  </p>
                </div>

                {/* Lifetime Access */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Lifetime Access</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Every class recording, guide, and resource — plus future curriculum updates with AI and latest tech
                  </p>
                </div>

                {/* Career Services */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Career Services</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Continuous coaching: resumé building, LinkedIn optimization, mock interviews, and job search support
                  </p>
                </div>

                {/* Guaranteed Internship */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Guaranteed Internship</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    10-week paid internship building real apps for Guam businesses — not just practice projects
                  </p>
                </div>

                {/* Expert Network */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Expert Network</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    1-2 Q&A sessions with senior mainland engineers — grow your network and get industry insights
                  </p>
                </div>

                {/* Post-Grad Opportunities */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all bg-gradient-to-br from-ruby-50 to-red-50 border-ruby-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-ruby-100 rounded-lg flex items-center justify-center mr-3">
                      <Rocket className="h-6 w-6 text-ruby-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Post-Grad Opportunities</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Paid TA roles at CSG + contract work with Shimizu Technology — continue earning while you learn
                  </p>
                </div>

              </div>

              {/* Alumni Network Bonus */}
              <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 md:p-8 text-white">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Growing Alumni Network</h3>
                  </div>
                  <p className="text-gray-300 text-lg mb-4">
                    Join Guam&apos;s first coding bootcamp alumni network for ongoing support, referrals, and collaboration opportunities with local businesses
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Always expanding partnerships with large Guam businesses</span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-12">
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 max-w-2xl mx-auto">
                  <p className="text-gray-700 mb-4">
                    <strong>Questions about payment options?</strong> We offer multiple flexible plans and are happy to work with you to find what fits your situation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="https://forms.gle/8vNXoqxCimxjfXkU6"
                      onClick={() => trackApplyClick('value_section')}
                      className="inline-flex h-12 items-center justify-center rounded-md bg-ruby-600 px-6 text-base font-medium text-white shadow-lg transition-all hover:bg-ruby-700 hover:scale-105"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply for February Cohort
                    </a>
                    <a
                      href="#programs"
                      onClick={() => trackPricingClick('value_section')}
                      className="inline-flex h-12 items-center justify-center rounded-md bg-gray-100 border border-gray-300 px-6 text-base font-medium text-gray-700 shadow-lg transition-all hover:bg-gray-200 hover:scale-105"
                    >
                      View Payment Plans
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consolidated Why Choose Us - Combining best elements from both sections */}
        <section
          id="why-choose-us"
          className="w-full py-12 md:py-16 lg:py-20 bg-gray-900 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-ruby-500/20 border border-ruby-500/30 rounded-full text-ruby-300 text-sm font-medium mb-4">
                <Rocket className="h-4 w-4 mr-2" />
                What Makes Us Different
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Guam&apos;s First <span className="text-ruby-500">Tech Bootcamp</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                From complete beginner to job-ready developer - we&apos;re building Guam&apos;s tech ecosystem with personalized attention and real job opportunities
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="rounded-xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.02] border-2 border-gray-700">
                <Image
                  src="/images/Chamorro-Chips-In-Person.png"
                  alt="Code School of Guam students learning together during an in-person class session"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="bg-gray-800 p-4 text-center">
                  <p className="text-gray-300 text-sm italic">Building Guam&apos;s tech community - one coder at a time</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-800/70 rounded-lg p-6 border-l-4 border-ruby-500 hover:transform hover:scale-105 transition-all">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-ruby-500 rounded-lg flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Maximum 10 Students</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Intimate cohorts ensure every student gets personalized attention and mentorship
                  </p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-6 border-l-4 border-green-500 hover:transform hover:scale-105 transition-all">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Lifetime Access</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Forever access to all recordings, resources, and future curriculum updates
                  </p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-6 border-l-4 border-blue-500 hover:transform hover:scale-105 transition-all">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Guaranteed Opportunities</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    2-3 paid positions for top performers: TA roles + 6-month contract with Shimizu Technology
                  </p>
                </div>
              </div>
            </div>

            {/* Mission & Vision - Streamlined */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800/70 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Rocket className="mr-3 h-6 w-6 text-ruby-500" />
                  Our Mission
                </h3>
                <p className="text-gray-300">
                  To provide high-quality, accessible coding education to the people of Guam and beyond, ensuring graduates are prepared to enter the job market as software engineers.
                </p>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Users className="mr-3 h-6 w-6 text-ruby-500" />
                  Our Vision
                </h3>
                <p className="text-gray-300">
                  We envision transforming Guam into a tech hub by equipping local residents with the skills and real-world experience needed to succeed in the global software industry.
                </p>
              </div>
            </div>
            
            {/* Local Impact Statement */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-gray-700 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Building Guam&apos;s Tech Future
              </h3>
              <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto">
                Our <span className="text-ruby-400 font-semibold">fully remote classes</span> make world-class education accessible from Hagåtña to Dededo, Yigo to Merizo, and beyond. As Guam&apos;s tech ecosystem grows, we&apos;re committed to developing local talent that can contribute to the island&apos;s digital transformation.
              </p>
            </div>
          </div>
        </section>

        {/* What You'll Learn - Combined Ruby/React + Curriculum Overview */}
        <section
          id="what-youll-learn"
          className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-ruby-500/10 border border-ruby-500/20 rounded-full text-ruby-700 text-sm font-medium mb-4">
                <Code className="h-4 w-4 mr-2" />
                20-Week Journey
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-gray-900">
                What You&apos;ll Learn & Why
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Master Ruby on Rails, React.js, and Python & AI - the comprehensive toolkit that opens doors to any tech career
              </p>
            </div>

            {/* Tech Stack Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              <Card className="hover-lift bg-white shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                    <Code className="mr-3 h-6 w-6 text-red-500" />
                    Ruby on Rails: Backend Mastery
                  </h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Beginner-friendly, readable syntax
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Rapid prototyping & development
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Used by Airbnb, GitHub, Shopify
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Convention over configuration
                    </li>
                  </ul>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">
                      Perfect for building robust APIs and web applications
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift bg-white shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                    <Code className="mr-3 h-6 w-6 text-blue-500" />
                    React.js: Frontend Excellence
                  </h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Most in-demand frontend framework
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Component-based architecture
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Used by Meta, Netflix, Airbnb
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Gateway to React Native (mobile)
                    </li>
                  </ul>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">
                      Perfect pair with Rails APIs for full-stack development
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift bg-white shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                    <Brain className="mr-3 h-6 w-6 text-yellow-500" />
                    Python & AI: Future Skills
                  </h3>
                  <ul className="space-y-3 text-gray-600 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Build Chatbots & RAG Systems
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      LLMs & Prompt Engineering
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      Agentic Systems & Evals
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      High-demand AI skillset
                    </li>
                  </ul>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-yellow-700 font-medium">
                      Create intelligent applications with the power of AI
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tech Stack Visual */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-center mb-6 text-gray-900">Your Complete Tech Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 font-bold text-lg">Rb</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Ruby</h4>
                    <p className="text-sm text-gray-600">Programming Language</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 font-bold text-xs">Rails</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Ruby on Rails</h4>
                    <p className="text-sm text-gray-600">Backend Framework</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-xs">React</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">React</h4>
                    <p className="text-sm text-gray-600">Frontend Framework</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Database className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">PostgreSQL</h4>
                    <p className="text-sm text-gray-600">Database</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Python & AI</h4>
                    <p className="text-sm text-gray-600">AI Engineering</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Foundation Message */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                  Your Foundation for Any Tech Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                      <Rocket className="mr-2 h-5 w-5 text-ruby-500" />
                      Master Core Concepts
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Learn fundamental programming principles that transfer to any language. Once you understand variables, loops, functions, and object-oriented programming, switching languages becomes just learning new syntax.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                      Real-World Application
                    </h4>
                    <p className="text-gray-600 text-sm">
                      These are the exact technologies used at Shimizu Technology for your internship opportunities. You&apos;ll be job-ready from day one with the tools companies actually use.
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium">
                    <span className="text-ruby-600">Ruby + Rails + React + Python & AI</span> → Complete full-stack foundation for any modern tech stack
                  </p>
                </div>
              </div>
            </div>

                         {/* Learning Path Preview */}
             <div className="max-w-4xl mx-auto">
               <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Your 20-Week Learning Journey</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-gray-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">PRE</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">Foundations (5 Weeks)</h4>
                     <p className="text-sm text-gray-600">Ruby & Web Fundamentals</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">1-3</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">Ruby & Rails APIs</h4>
                     <p className="text-sm text-gray-600">Backend Development</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-green-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">4-5</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">JS & React Intro</h4>
                     <p className="text-sm text-gray-600">Frontend Fundamentals</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">6</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">GitHub Team Projects</h4>
                     <p className="text-sm text-gray-600">Collaboration & Workflow</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-cyan-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">7</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">Advanced Rails</h4>
                     <p className="text-sm text-gray-600">Complex Associations</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-purple-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">8-9</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">Frontend Deep Dive</h4>
                     <p className="text-sm text-gray-600">Advanced React</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">10-13</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">Python & AI</h4>
                     <p className="text-sm text-gray-600">LLMs, RAG & Agentic Systems</p>
                   </div>
                 </div>
                 <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-8 bg-ruby-500 rounded flex items-center justify-center text-white font-semibold text-xs mr-4">14-15</div>
                   <div className="flex-1">
                     <h4 className="font-semibold text-gray-900">Capstone Projects</h4>
                     <p className="text-sm text-gray-600">Full-Stack AI Apps</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* Programs & Pricing Section */}
        <section
          id="programs"
          className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-100 to-white text-gray-900 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12 reveal-on-scroll">
              <div className="inline-flex items-center px-4 py-2 bg-ruby-500/10 border border-ruby-500/20 rounded-full text-ruby-700 text-sm font-medium mb-4">
                <GraduationCap className="h-4 w-4 mr-2" />
                Enrollment Open
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-gray-900">
                Next Cohort Starts <span className="text-ruby-500">February 2, 2026</span>
              </h2>
              <div className="w-24 h-1 bg-ruby-500 mx-auto mb-4 rounded-full"></div>
              
              {/* Clean enrollment status */}
              <div className="inline-flex items-center px-3 py-1 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-4">
                <Clock className="h-4 w-4 mr-1" />
                Enrollment now open
              </div>
              
              <p className="text-xl text-gray-600 mb-0">
                20-week comprehensive program with <span className="font-semibold text-ruby-600">Ruby, Rails, React, Python & AI Engineering</span>
              </p>
            </div>
            
            {/* Main Program Highlight */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Schedule Info Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 hover-lift">
                  <div className="p-6 md:p-8">
                    <div className="flex items-start mb-4">
                      <Calendar className="h-8 w-8 text-ruby-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Live Coding Bootcamp</h3>
                        <p className="text-gray-600 mb-4">
                          20 weeks • Fully Remote • Max 10 Students • Ruby, Rails, React, Python & AI
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xl font-bold text-gray-900">20-25</div>
                        <div className="text-sm text-gray-600">Hours/Week</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xl font-bold text-gray-900">Max 10</div>
                        <div className="text-sm text-gray-600">Students</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-ruby-500">
                        <Calendar className="h-5 w-5 text-ruby-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-gray-900">Live Classes:</span>
                          <span className="text-gray-700">Monday – Thursday, 5:30pm – 9:30pm</span>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <Clock className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-gray-900">3-Day Weekend:</span>
                          <span className="text-gray-700">Homework & Deliberate Practice</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700 mb-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Live instruction via Zoom + optional in-person sessions
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Lifetime access to all recordings & materials
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Job placement support + internship opportunities
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Pricing & CTA Card */}
                <div className="bg-ruby-600 rounded-xl shadow-xl overflow-hidden hover-lift">
                  <div className="p-6 md:p-8 flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white">New Lower Tuition</h3>
                      <div className="w-16 h-1 bg-white/30 mb-4 rounded-full"></div>
                      
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-white/60 line-through">$10,000</div>
                        <div className="text-3xl font-bold text-white">$7,500</div>
                        <div className="text-sm text-white/80">February 2026 Cohort</div>
                      </div>
                      
                      <div className="bg-white/20 rounded-lg p-3 mb-4">
                        <div className="text-white font-semibold text-sm text-center">
                          💰 25% Lower Than Before!
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <a
                        href="https://forms.gle/8vNXoqxCimxjfXkU6"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackApplyClick('pricing_card')}
                        className="inline-flex w-full h-10 items-center justify-center rounded-md bg-white text-ruby-700 px-6 text-sm font-medium shadow-lg transition-all hover:bg-gray-100 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      >
                        Apply for February Cohort
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                      <a
                        href="#contact"
                        className="block w-full h-10 flex items-center justify-center rounded-md bg-ruby-700 text-white text-sm font-medium shadow-lg transition-all hover:bg-ruby-800 hover:scale-105"
                      >
                        Questions? Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Payment Options */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Flexible Payment Options</h3>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center mb-8 bg-gray-100 rounded-lg p-1" role="tablist" aria-label="Payment options">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === "overview"
                      ? "bg-white text-ruby-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "overview"}
                  aria-controls="tab-panel-overview"
                  id="tab-overview"
                >
                  Payment Overview
                </button>
                <button
                  onClick={() => setActiveTab("installments")}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === "installments"
                      ? "bg-white text-ruby-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "installments"}
                  aria-controls="tab-panel-installments"
                  id="tab-installments"
                >
                  Monthly Plans
                </button>
                <button
                  onClick={() => setActiveTab("financing")}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === "financing"
                      ? "bg-white text-ruby-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  role="tab"
                  aria-selected={activeTab === "financing"}
                  aria-controls="tab-panel-financing"
                  id="tab-financing"
                >
                  Financing Options
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 min-h-[300px]">
                {activeTab === "overview" && (
                  <div 
                    className="animate-fadeIn"
                    role="tabpanel"
                    id="tab-panel-overview"
                    aria-labelledby="tab-overview"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-all">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900 mb-1">Pay in Full</h4>
                        <p className="text-2xl font-bold text-green-600 mb-1">$7,500</p>
                        <p className="text-sm text-gray-600">One-time payment</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-all">
                        <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900 mb-1">Monthly Plans</h4>
                        <p className="text-2xl font-bold text-blue-600 mb-1">$940+</p>
                        <p className="text-sm text-gray-600">4-8 month plans</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-all">
                        <Briefcase className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900 mb-1">PFC Financing</h4>
                        <p className="text-2xl font-bold text-purple-600 mb-1">Apply</p>
                        <p className="text-sm text-gray-600">Bank partnership</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Our Commitment to Accessibility</h4>
                      <p className="text-gray-600">
                        While comparable programs charge $15,000-$20,000, we&apos;ve set our tuition lower to make quality coding education accessible to motivated students in Guam and beyond.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "installments" && (
                  <div 
                    className="animate-fadeIn"
                    role="tabpanel"
                    id="tab-panel-installments"
                    aria-labelledby="tab-installments"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="hover:shadow-lg transition-all border-2 border-blue-200">
                        <CardContent className="p-6 text-center">
                          <h4 className="font-bold text-xl mb-2">4-Month Plan</h4>
                          <p className="text-3xl font-bold text-blue-600 mb-2">$1,875</p>
                          <p className="text-sm text-gray-600 mb-4">per month</p>
                          <p className="text-xs text-gray-500">Total: $7,500</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all border-2 border-green-200 bg-green-50">
                        <CardContent className="p-6 text-center">
                          <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mb-2 inline-block">POPULAR</div>
                          <h4 className="font-bold text-xl mb-2">6-Month Plan</h4>
                          <p className="text-3xl font-bold text-green-600 mb-2">$1,250</p>
                          <p className="text-sm text-gray-600 mb-4">per month</p>
                          <p className="text-xs text-gray-500">Total: $7,500</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all border-2 border-purple-200">
                        <CardContent className="p-6 text-center">
                          <h4 className="font-bold text-xl mb-2">8-Month Plan</h4>
                          <p className="text-3xl font-bold text-purple-600 mb-2">$938</p>
                          <p className="text-sm text-gray-600 mb-4">per month</p>
                          <p className="text-xs text-gray-500">Total: $7,500</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                      <p className="text-center text-blue-800">
                        <strong>Note:</strong> All payment plans require a $500 deposit to secure your spot. Monthly payments begin after the deposit.
                      </p>
                    </div>
                    
                    {/* Custom Payment Plan Option */}
                    <div className="bg-gradient-to-r from-ruby-50 to-red-50 rounded-lg p-6 border border-ruby-200">
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Need a Custom Payment Plan?</h4>
                        <p className="text-gray-700 mb-4">
                          Don&apos;t see a plan that works for your situation? We&apos;re here to help! Reach out and we&apos;ll work together to find a payment solution that fits your needs.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                        <a
                          href="https://instagram.com/codeschoolofguam"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-105"
                        >
                          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-white text-xs font-bold">IG</span>
                          </div>
                          <span className="text-xs font-medium text-gray-900">Instagram</span>
                          <span className="text-xs text-gray-600">@codeschoolofguam</span>
                        </a>
                        
                        <a
                          href="https://facebook.com/codeschoolofguam"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-105"
                        >
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                            <span className="text-white text-xs font-bold">FB</span>
                          </div>
                          <span className="text-xs font-medium text-gray-900">Facebook</span>
                          <span className="text-xs text-gray-600">@codeschoolofguam</span>
                        </a>
                        
                        <a
                          href="mailto:codeschoolofguam@gmail.com"
                          className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-105"
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                            <Mail className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-900">Email</span>
                          <span className="text-xs text-gray-600">codeschoolofguam@gmail.com</span>
                        </a>
                        
                        <a
                          href="tel:+16714830219"
                          className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-105"
                        >
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                            <Phone className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-900">Text/Call</span>
                          <span className="text-xs text-gray-600">(671) 483-0219</span>
                        </a>
                      </div>
                      
                      <p className="text-center text-sm text-gray-600 mt-4">
                        We believe in making coding education accessible to everyone. Let&apos;s find a solution that works for you!
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "financing" && (
                  <div 
                    className="animate-fadeIn"
                    role="tabpanel"
                    id="tab-panel-financing"
                    aria-labelledby="tab-financing"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-purple-600" />
                      </div>
                      <h4 className="text-2xl font-bold mb-4">PFC Finance Partnership</h4>
                      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        We&apos;ve partnered with PFC Finance to offer student loans for qualified applicants. This option allows you to spread the cost over a longer period with competitive rates.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                        <h5 className="font-bold text-purple-800 mb-3">Loan Benefits</h5>
                        <ul className="space-y-2 text-purple-700 text-sm">
                          <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Competitive interest rates</li>
                          <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Flexible repayment terms</li>
                          <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Local Guam-based lender</li>
                          <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2" />Quick application process</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h5 className="font-bold text-gray-800 mb-3">Next Steps</h5>
                        <ol className="space-y-2 text-gray-700 text-sm">
                          <li className="flex items-start"><span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>Contact us to discuss financing</li>
                          <li className="flex items-start"><span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>We&apos;ll connect you with PFC Finance</li>
                          <li className="flex items-start"><span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>Complete loan application</li>
                          <li className="flex items-start"><span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">4</span>Start your coding journey!</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>





        {/* Flappy Bird Demo */}
        <section
          id="flappy-bird-demo"
          className="w-full py-12 md:py-16 lg:py-20 bg-gray-900 text-white relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Experience Coding in Action
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Want to see what you can create with the skills you&apos;ll learn? Try
              our Flappy Bird clone, built with React and HTML5 Canvas!
            </p>
            <Link
              href="/flappy-bird"
              className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-lift"
            >
              <GamepadIcon className="mr-2 h-4 w-4" />
              Play Flappy Bird
            </Link>
          </div>
        </section>





        {/* Success Stories - Student Projects */}
        <section
          id="student-projects"
          className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-100 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-800 text-sm font-medium mb-4">
                <Rocket className="h-4 w-4 mr-2" />
                Success Stories
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-gray-900">
                From Zero to <span className="text-ruby-500">Full-Stack Developer</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Watch our first cohort students present their capstone projects. In 20 weeks, they went from coding beginners to building full-stack applications with Ruby on Rails APIs, React frontends, and AI-powered features.
              </p>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-ruby-600 mb-2">100%</div>
                <div className="text-sm font-medium text-gray-900">Completion Rate</div>
                <div className="text-xs text-gray-600">All students finished the program</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-ruby-600 mb-2">16</div>
                <div className="text-sm font-medium text-gray-900">Weeks to Success</div>
                <div className="text-xs text-gray-600">From beginner to developer</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-ruby-600 mb-2">8</div>
                <div className="text-sm font-medium text-gray-900">Real Projects Built</div>
                <div className="text-xs text-gray-600">Hands-on applications</div>
              </div>
            </div>
            
            <div className="max-w-5xl mx-auto mb-12 px-4 sm:px-6">
              {/* YouTube video container with proper aspect ratio */}
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl border-2 border-gray-200">
                <div style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio container */}
                  <iframe 
                    src="https://www.youtube.com/embed/MNzZeL33jiw?t=650" 
                    title="Code School of Guam Capstone Presentations - Chamorro Chips (May 9th, 2025)" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 italic">
                  First Cohort Capstone Presentations - May 2025
                </p>
              </div>
            </div>
            
            {/* Project Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-ruby-500">
                <div className="flex items-center mb-3">
                  <Code className="h-6 w-6 text-ruby-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Local Impact Projects</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Students created apps addressing Guam-specific challenges, from tourism platforms to local business management tools.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-green-500">
                <div className="flex items-center mb-3">
                  <GraduationCap className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Industry-Ready Skills</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Every project uses professional development practices: Git version control, database design, API integration, and responsive design.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500">
                <div className="flex items-center mb-3">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Presentation Skills</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Students present to industry professionals, gaining confidence in explaining technical concepts and business value.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto mb-6">
                                  <p className="text-gray-700 italic">
                    &quot;Seeing our students go from never having coded before to presenting full-stack applications with AI features in 20 weeks is incredibly rewarding. They&apos;re ready for real developer roles.&quot;
                  </p>
                <div className="mt-3 text-sm text-gray-600">
                  - Leon Shimizu, Founder & Lead Instructor
                </div>
              </div>
              
                            <div className="max-w-lg mx-auto">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Ready to create your own success story? Join our February 2026 cohort.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://forms.gle/8vNXoqxCimxjfXkU6"
                    onClick={() => trackApplyClick('student_projects_section')}
                    className="inline-flex h-12 items-center justify-center rounded-md bg-ruby-600 px-6 text-base font-medium text-white shadow-lg transition-all hover:bg-ruby-700 hover:scale-105 flex-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply for February Cohort
                    <Rocket className="ml-2 h-5 w-5" />
                  </a>
                  <a
                    href="#programs"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-gray-600 px-6 text-base font-medium text-white shadow-lg transition-all hover:bg-gray-700 hover:scale-105 flex-1"
                  >
                    View Pricing
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Refined Timeline Section with Subtle Animations & Better Styling */}
        <RefinedTimelineSection
          timelineItems={[
            {
              weeks: "Pre-work (5 weeks)",
              title: "Programming Fundamentals with Ruby",
              description:
                "Work with our pre-work instructor on programming fundamentals using Ruby, plus intro to HTML, CSS, and JavaScript.",
            },
            {
              weeks: "Weeks 1-3",
              title: "Ruby Review & Rails APIs",
              description:
                "Review Ruby fundamentals, then dive into APIs and Ruby on Rails API development.",
            },
            {
              weeks: "Weeks 4-5",
              title: "JavaScript & React Introduction",
              description:
                "Master JavaScript fundamentals and introduction to React for frontend development.",
            },
            {
              weeks: "Week 6",
              title: "GitHub Team Projects",
              description:
                "Collaborative development using Git and GitHub with team-based projects.",
            },
            {
              weeks: "Week 7",
              title: "Advanced Rails Development",
              description:
                "Continue with Rails - advanced associations, authentication, and complex data relationships.",
            },
            {
              weeks: "Weeks 8-9",
              title: "Frontend Development Deep Dive",
              description:
                "Advanced React concepts, state management, and building dynamic user interfaces.",
            },
            {
              weeks: "Weeks 10-13",
              title: "Python & AI Engineering",
              description:
                "Deep dive into LLMs, building chatbots, RAG (Retrieval-Augmented Generation), Evals, and Agentic Systems.",
            },
            {
              weeks: "Weeks 14-15",
              title: "Capstone Projects",
              description:
                "Design and build full-stack applications with Rails APIs, React frontends, and AI features.",
            },
          ]}
        />

        {/* Internship */}
        <section
          id="internship"
          className="w-full py-12 md:py-16 lg:py-20 bg-white text-gray-900 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Internship Program
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Our optional 2-month internship program provides you with
              real-world experience, setting you apart in the job market.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover-lift bg-gray-100">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                    <Briefcase className="mr-2 h-5 w-5 text-ruby-500" />
                    Internship Details
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>2-month duration</li>
                    <li>Work on real applications for our software firm</li>
                    <li>Agile work environment</li>
                    <li>Onboarding week to set up the project</li>
                    <li>Weekly sprints with assigned tasks</li>
                    <li>Sprint planning and retrospectives</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-gray-100">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                    <CheckCircle className="mr-2 h-5 w-5 text-ruby-500" />
                    Benefits of the Internship
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Apply your skills in a professional setting</li>
                    <li>Build a network within the tech industry</li>
                    <li>Understand the software development lifecycle</li>
                    <li>Improve teamwork and communication skills</li>
                    <li>Select guaranteed positions for top performers:</li>
                    <li className="ml-6">1-2 Teacher&apos;s Assistant positions for the next Code School of Guam cohort</li>
                    <li className="ml-6">One 6-month contract software engineering position with Shimizu Technology</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Career Services */}
        <section
          id="career"
          className="w-full py-12 md:py-16 lg:py-20 bg-gray-100 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900">
              Career Services
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Our commitment to your success extends beyond the classroom. We
              offer comprehensive career services to help you launch your tech
              career, all delivered{" "}
              <span className="font-semibold text-ruby-500">remotely</span>.
              Our career services include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover-lift bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 flex items-center text-gray-900">
                    <Briefcase className="mr-2 h-5 w-5 text-ruby-500" />
                    Resume Building
                  </h3>
                  <p className="text-gray-600">
                    Learn how to craft a compelling tech resume that highlights
                    your new skills and projects.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 flex items-center text-gray-900">
                    <Users className="mr-2 h-5 w-5 text-ruby-500" />
                    Interview Preparation
                  </h3>
                  <p className="text-gray-600">
                    Practice technical interviews and receive feedback to
                    improve your performance.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 flex items-center text-gray-900">
                    <Rocket className="mr-2 h-5 w-5 text-ruby-500" />
                    Job Search Strategies
                  </h3>
                  <p className="text-gray-600">
                    Learn effective strategies for finding and applying to tech
                    jobs, both locally and remotely.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <p className="text-lg text-gray-600 text-center">
                Additional services include: LinkedIn profile optimization,
                portfolio development, networking opportunities, and
                post-graduation support for up to 6 months.
              </p>
            </div>
          </div>
        </section>

        {/* Admissions */}
        <section
          id="admissions"
          className="w-full py-12 md:py-16 lg:py-20 bg-gray-900 text-white relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Admissions Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover-lift bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
                    <CheckCircle className="mr-2 h-5 w-5 text-ruby-500" />
                    Application Steps
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    <li>Submit online application</li>
                    <li>Participate in a video interview</li>
                    <li>Pay deposit to secure your spot</li>
                    <li>Begin pre-work</li>
                  </ol>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
                    <CheckCircle className="mr-2 h-5 w-5 text-ruby-500" />
                    What We Look For
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Passion for technology and problem-solving</li>
                    <li>
                      Strong work ethic and ability to commit to an intensive
                      program
                    </li>
                    <li>Basic computer skills and familiarity with technology</li>
                    <li>Teamwork and collaboration</li>
                    <li>Resilience and willingness to learn from mistakes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <a
                href="https://forms.gle/8vNXoqxCimxjfXkU6"
                className="inline-flex h-10 items-center justify-center rounded-md bg-ruby-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-ruby-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ruby-400 disabled:pointer-events-none disabled:opacity-50 hover-lift"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Founder */}
        <section
          id="founder"
          className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-800 to-gray-900 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              About the Founder
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full md:w-1/3">
                <Image
                  src="/NationalsPic2.jpg"
                  alt="Leon Shimizu"
                  width={300}
                  height={300}
                  className="rounded-full mx-auto"
                />
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">Leon Shimizu</h3>
                <p className="text-gray-300 mb-4">
                  Hafa Adai! I&apos;m Leon Shimizu, born and raised in Guam. After
                  graduating from Father Duenas Memorial School in 2017, I
                  pursued mechanical engineering and played football at
                  Allegheny College in Pennsylvania. While I wasn&apos;t entirely
                  certain of my career path, my passion for math and
                  encouragement from family and friends led me toward
                  engineering.
                </p>
                <p className="text-gray-300 mb-4">
                  After my first year of college, upon learning that I was
                  expecting my first child, I returned to Guam to be with my
                  family. Then in 2019, I moved to Las Vegas to pursue new
                  opportunities while staying close to family. As the pandemic
                  began, I left college to enter the workforce full-time. I
                  started as a produce clerk at Vons and later joined an Amazon
                  Fulfillment Center, quickly advancing to Process Assistant.
                </p>
                <p className="text-gray-300 mb-4">
                  In the summer of 2021, inspired by relatives who transitioned
                  into software engineering through coding bootcamps, I decided
                  to explore a coding career. After extensive research, I
                  enrolled in Actualize Coding Bootcamp, left my job at Amazon,
                  and fully committed to learning software development. While
                  challenging, I was determined to succeed.
                </p>
                <p className="text-gray-300 mb-4">
                  Before the bootcamp concluded, I secured a position with
                  Spectrio LLC, where I currently work. Over the past few years,
                  I&apos;ve also had the privilege of giving back by working as an
                  instructor and Teaching Assistant at Actualize, and
                  contributing to SkillsEngine. These experiences fueled my
                  passion for both coding and education.
                </p>
                <p className="text-gray-300 mb-4">
                  My mom encouraged me to start a code school in Guam—initially,
                  I hesitated. But I realized there is no better time than now to
                  give back to the island that shaped me. That&apos;s why I founded
                  the Code School of Guam.
                </p>
                <p className="text-gray-300 mb-4">
                  To further support our students, I also started a software
                  firm where they can intern, work on real projects, and gain
                  practical experience—an essential factor employers seek.
                </p>
                <p className="text-gray-300">
                  My mission is to help others realize that a career in software
                  engineering is attainable. I&apos;m here to support you every step
                  of the way. If I can do it, so can you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section with Mobile Animations */}
        <EnhancedFAQSection faqs={faqs} />

        {/* Policies */}
        <section
          id="policies"
          className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(204,0,0,0.05),transparent_70%)]"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover-lift bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Attendance Policy
                  </h3>
                  <p className="text-gray-300">
                    Attendance is crucial for your success. Students are
                    expected to attend all scheduled classes punctually. Missing
                    more than three unexcused classes may result in dismissal
                    from the program without a refund. Excused absences are
                    allowed for situations beyond your control (e.g., medical
                    emergencies). Documentation may be required after three
                    excused absences.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Code of Conduct
                  </h3>
                  <p className="text-gray-300">
                    We are committed to providing a respectful and inclusive
                    learning environment. Students are expected to treat all
                    individuals with respect and courtesy. Discrimination,
                    harassment, or inappropriate behavior will not be tolerated.
                    Violations may result in disciplinary action, up to
                    dismissal without a refund.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Refund Policy
                  </h3>
                  <p className="text-gray-300">
                    The non-refundable deposit is required to secure your
                    enrollment. Full tuition (minus the deposit) is refundable
                    if you withdraw before the start of the second week of
                    classes. No refunds will be issued from the second week
                    onward. Students dismissed due to violations of the Code of
                    Conduct or failure to meet program requirements are not
                    eligible for a refund.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Academic Integrity
                  </h3>
                  <p className="text-gray-300">
                    Students must submit original work unless collaboration is
                    explicitly permitted. Cheating, plagiarism, and unauthorized
                    assistance are prohibited and may result in disciplinary
                    action, including dismissal without a refund.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 text-center">
              <a
                href="https://docs.google.com/document/d/1d8J1ctT7iN_WoMdTpJYdM-2ngJY9UsWtVlVzhVou90Q/edit?usp=sharing"
                className="text-red-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Policies
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-r from-ruby-600 to-red-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                Ready to Start Your <span className="text-yellow-300">Coding Journey</span>?
              </h2>
              <p className="text-xl text-ruby-100 mb-6 max-w-3xl mx-auto">
                Join Guam&apos;s first coding bootcamp and master Ruby, Rails, React, Python & AI Engineering in 20 weeks.
              </p>
              
              {/* Clean urgency message */}
              <div className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-full text-yellow-300 text-sm font-medium mb-8">
                <Users className="h-4 w-4 mr-1" />
                Enrollment now open for February 2026 cohort
              </div>
              
              <div className="max-w-lg mx-auto mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
                  <div className="text-5xl font-bold text-yellow-300 mb-3">$7,500</div>
                  <div className="text-xl font-bold mb-2 text-white">February 2026 Cohort</div>
                  <div className="text-ruby-100 mb-2">Previous Price: <span className="line-through">$10,000</span></div>
                  <div className="text-sm text-ruby-100 mb-6">Pre-work starts February 2nd, 2026 • Enrollment Open</div>
                  <a
                    href="https://forms.gle/8vNXoqxCimxjfXkU6"
                    onClick={() => trackApplyClick('final_cta_section')}
                    className="inline-flex h-14 items-center justify-center rounded-md bg-white px-8 text-lg font-bold text-ruby-700 shadow-lg transition-all hover:bg-gray-100 hover:scale-105 w-full mb-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                    <ChevronRight className="ml-2 h-6 w-6" />
                  </a>
                  <p className="text-xs text-ruby-200">
                    New lower tuition - 25% less than before
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-6 text-xs text-ruby-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    No Experience Required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    100% Remote
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Job Placement Support
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Flexible Payment Plans
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="w-full py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden"
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900">
              Contact Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover-lift bg-gray-100">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                    <Mail className="mr-2 h-5 w-5 text-red-500" />
                    Email Us
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Have questions? We&apos;re here to help!
                  </p>
                  <a
                    href="mailto:codeschoolofguam@gmail.com"
                    className="text-red-500 hover:underline"
                  >
                    codeschoolofguam@gmail.com
                  </a>
                </CardContent>
              </Card>
              <Card className="hover-lift bg-gray-100">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                    <Phone className="mr-2 h-5 w-5 text-red-500" />
                    Call Us
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We&apos;re available Monday-Saturday, 9am-5pm ChST
                  </p>
                  <a
                    href="tel:+1674830219"
                    className="text-red-500 hover:underline"
                  >
                    +1 (671) 483-0219
                  </a>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">
                Stay Updated
              </h3>
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">Subscribe</Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-900 text-white" role="contentinfo">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Code School of Guam</h3>
              <p className="text-sm text-gray-400">
                Empowering Guam&apos;s tech future, one line of code at a time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/codeschoolofguam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Instagram Icon */}
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 
                         1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 
                         4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 
                         1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 
                         1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 
                         4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048
                         -1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049
                         -1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 
                         0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024
                         -.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049
                         -1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 
                         4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 
                         2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011
                         -3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748
                         -.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023
                         -.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975
                         .207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748
                         .353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 
                         2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8
                         -.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344
                         -1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917
                         -.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 
                         00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3
                         -1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 
                         5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 
                         3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 
                         1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61566511371763&mibextid=LQQJ4d"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Facebook Icon */}
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 
                         6.477 2 12c0 4.991 3.657 9.128 8.438 
                         9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 
                         1.492-3.89 3.777-3.89 1.094 0 2.238.195 
                         2.238.195v2.46h-1.26c-1.243 0-1.63.771
                         -1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 
                         21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center">
            <p className="text-sm text-gray-400">
              © 2024 Code School of Guam. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Apply Now Button - Enhanced for Mobile */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://forms.gle/8vNXoqxCimxjfXkU6"
          className="inline-flex h-12 items-center justify-center rounded-md bg-ruby-500 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-ruby-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ruby-400 disabled:pointer-events-none disabled:opacity-50 hover-lift animate-pulse-slow animate-ripple touch-feedback"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apply to Code School of Guam"
        >
          <span className="animate-shimmer">Apply Now</span>
        </a>
      </div>
    </div>
  )
}

