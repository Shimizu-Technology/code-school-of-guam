"use client"

import Link from "next/link"
import { 
  ArrowRight, 
  Briefcase, 
  Code, 
  Calendar, 
  Rocket, 
  Heart,
  Users,
  CheckCircle,
  Star,
  Lightbulb,
  GraduationCap,
  Building2
} from "lucide-react"

export default function InternshipPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
            <Rocket className="w-4 h-4 mr-2" />
            Optional Program
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Real-World Experience for <span className="text-ruby-500">Every Graduate</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our optional internship program ensures every graduate has the opportunity to work on production applications — regardless of prior connections or experience.
          </p>
        </div>
        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Why We Created This - The Story */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 bg-ruby-100 text-ruby-700 rounded-full text-sm font-medium mb-4">
                <Heart className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why We Built This Program
              </h2>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-10 border border-gray-200">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-ruby-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mr-4">
                  L
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Leon Shimizu</h3>
                  <p className="text-sm text-gray-600">Founder, Code School of Guam & Shimizu Technology</p>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  When I started Code School of Guam, I had one goal: teach people to code so they could land high-paying tech jobs. But I quickly realized there was a problem.
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Employers want experience.</span> Even with strong technical skills, many graduates struggle to land their first job because they lack real-world project experience. And unlike major tech hubs, Guam doesn&apos;t have many software companies where new developers can get their start.
                </p>
                <p>
                  So I asked myself: <span className="italic">&ldquo;How can I ensure every single graduate has access to real-world experience?&rdquo;</span>
                </p>
                <p className="font-semibold text-ruby-600">
                  That&apos;s why I started{" "}
                  <a 
                    href="https://shimizu-technology.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-ruby-600 hover:text-ruby-700 underline"
                  >
                    Shimizu Technology
                  </a>.
                </p>
                <p>
                  By building software for local businesses and clients, I created a path for our graduates to work on <span className="font-semibold">real production applications</span> that real people use every day. The internship is completely optional and unpaid — but for those who want to build their portfolio and gain experience, the opportunity is always there.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 italic">
                &ldquo;Every graduate deserves a chance to prove themselves. We&apos;re here to provide that chance.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How The Internship Works */}
      <section className="py-16 md:py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                <Lightbulb className="w-4 h-4 mr-2" />
                The Internship
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A completely optional, experience-focused program for graduates who want to build their portfolio.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="font-bold text-gray-900">10 Weeks</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Work in 2-week sprints following Agile methodology — the same process used by professional software teams.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <Code className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="font-bold text-gray-900">Real Projects</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Contribute to production applications at{" "}
                  <a 
                    href="https://shimizu-technology.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Shimizu Technology
                  </a>
                  {" "}— apps that real businesses and users depend on.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <Users className="w-5 h-5 text-purple-500 mr-2" />
                  <h3 className="font-bold text-gray-900">Team Environment</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Daily standups, sprint planning, code reviews, and demos — experience a real development workflow.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-ruby-500 mr-2" />
                  <h3 className="font-bold text-gray-900">100% Optional</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  No obligation to participate. This is for graduates who want to gain experience before job hunting.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center">
              <p className="text-blue-800">
                <span className="font-semibold">Note:</span> The internship is unpaid, but the experience and portfolio projects you gain are invaluable for landing your first tech job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paid Opportunities */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4 mr-2" />
                Paid Opportunities
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                For Top Performers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Beyond the internship, we offer paid positions to outstanding graduates.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Teaching Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Help teach the next cohort of students. TAs are selected from recent graduates who excelled in the program.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Paid position
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    1-2 positions per cohort
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Reinforces your own learning
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Junior Software Engineer</h3>
                <p className="text-gray-600 mb-4">
                  Join{" "}
                  <a 
                    href="https://shimizu-technology.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Shimizu Technology
                  </a>
                  {" "}as a paid contractor working on client projects.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    Paid contract position
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    Work on real client projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    Build professional experience
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-600">
              <p>
                These opportunities are merit-based. Show dedication during the bootcamp and internship, and doors will open.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Work On */}
      <section className="py-16 md:py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Interns Work On
            </h2>
            <p className="text-gray-600">
              Real production applications, not toy projects
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2">AI Applications</h3>
              <p className="text-sm text-gray-600">RAG systems, chatbots, ML integrations</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Mobile Apps</h3>
              <p className="text-sm text-gray-600">React Native apps for iOS & Android</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="font-semibold mb-2">E-commerce</h3>
              <p className="text-sm text-gray-600">Online ordering & payment systems</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold mb-2">Registration Systems</h3>
              <p className="text-sm text-gray-600">Event registration & admin dashboards</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center text-ruby-600 hover:text-ruby-700 font-medium"
            >
              See projects our graduates have worked on
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-ruby-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Journey
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join Code School of Guam and get access to real-world experience opportunities that most bootcamps can&apos;t offer.
          </p>
          <a
            href="https://forms.gle/8vNXoqxCimxjfXkU6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-ruby-600 hover:bg-gray-100 rounded-lg text-lg font-medium transition-all"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  )
}
