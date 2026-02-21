"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  Rocket, 
  Users, 
  Target, 
  ExternalLink, 
  Star, 
  Briefcase, 
  GraduationCap,
  Heart,
  Lightbulb,
  School,
  Sparkles,
  CheckCircle,
  Brain,
  Quote
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-ruby-500/20 text-ruby-400 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Anyone Can Do This
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We&apos;re bringing world-class coding education to Guam — and proving that tech careers are possible for everyone on our island.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* The Origin Story */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                <Lightbulb className="w-4 h-4 mr-2" />
                Why We Exist
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Bringing Opportunity Home
              </h2>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 md:p-10 border border-slate-200 mb-8">
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Growing up in Guam, I never knew coding was something I could do. I thought software engineering was for the smartest people in the world — not for someone like me. It wasn&apos;t until I moved to the states and discovered coding bootcamps that I realized: <span className="font-semibold text-slate-900">anyone can learn this.</span>
                </p>
                <p>
                  After completing{" "}
                  <a 
                    href="https://actualize.co" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Actualize Coding Bootcamp
                  </a>
                  {" "}and landing my first software engineering job, I looked back at Guam and saw a gap. There were no coding bootcamps back home. No clear path for people who wanted to learn. The opportunity I found in the states? It didn&apos;t exist here.
                </p>
                <p className="font-semibold text-ruby-600 text-lg">
                  So I decided to create it.
                </p>
                <p>
                  In 2024, I founded the Code School of Guam to give people on our island the same opportunity I had. Our first class graduated in June 2025, and we&apos;re already seeing the impact — not just in job placements, but in how people see themselves. People who never thought they could code are now building real applications.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-600 italic text-lg">
                &ldquo;I want everyone to feel what I feel — that if there&apos;s something I want to build, I can just build it.&rdquo;
              </p>
              <p className="text-slate-500 mt-2">— Leon Shimizu, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Graduate Spotlights */}
      <section className="py-24 lg:py-32 bg-slate-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Graduate Spotlights
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Proof That Anyone Can Do This
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Our graduates aren&apos;t just landing jobs — they&apos;re becoming leaders, teachers, and builders.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Alanna Cruz */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    A
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Alanna Cruz</h3>
                    <p className="text-ruby-600 font-medium text-sm">TA & Junior Software Engineer</p>
                  </div>
                </div>
                <div className="space-y-3 text-slate-700 text-sm">
                  <p>
                    Alanna always felt like the <span className="font-semibold">&ldquo;least tech-savvy&rdquo;</span> person in her family. She signed up <span className="font-semibold">the day before class started</span>, not knowing if she could do it.
                  </p>
                  <p>
                    Today she&apos;s a <span className="font-semibold">Teaching Assistant</span> for our current cohort AND a <span className="font-semibold">Junior Software Engineer</span> at Shimizu Technology.
                  </p>
                  <p className="text-green-700 font-medium">
                    If she can do it, anyone can.
                  </p>
                </div>
              </div>

              {/* Audreana Lett */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-[#800000] rounded-full flex items-center justify-center text-[#FFD700] text-3xl font-bold flex-shrink-0">
                    A
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Audreana Lett</h3>
                    <p className="text-[#800000] font-medium text-sm">Coding Instructor at Father Duenas</p>
                  </div>
                </div>
                <div className="space-y-3 text-slate-700 text-sm">
                  <p>
                    While taking our program, Audreana was already teaching at Father Duenas Memorial School. She was passionate about bringing coding to high schoolers — so we made it happen.
                  </p>
                  <p>
                    She now teaches <span className="font-semibold">15 students</span> across two courses, showing the next generation that coding is a real career path.
                  </p>
                  <p className="text-[#800000] font-medium">
                    From student to teacher — inspiring others to follow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact - FD Partnership */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 bg-[#800000]/10 text-[#800000] rounded-full text-sm font-medium mb-4">
                <School className="w-4 h-4 mr-2" />
                Community Impact
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Bringing Coding to High Schools
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Our graduates aren&apos;t just getting jobs — they&apos;re inspiring the next generation.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#800000]/5 to-[#FFD700]/10 rounded-2xl p-8 border border-[#800000]/20">
              {/* Audreana's Achievement */}
              <div className="text-center mb-8 pb-8 border-b border-[#800000]/20">
                <div className="inline-flex items-center px-3 py-1.5 bg-[#800000] text-[#FFD700] rounded-full text-sm font-medium mb-4">
                  <Star className="w-4 h-4 mr-2" />
                  We&apos;re So Proud of You, Audreana!
                </div>
                <p className="text-slate-700 max-w-2xl mx-auto">
                  <span className="font-semibold text-[#800000]">Audreana Lett</span>, a graduate from our very first cohort, didn&apos;t just complete the program — she&apos;s now <span className="font-semibold">teaching the next generation</span>. Her passion for bringing coding to high schoolers made this partnership possible.
                </p>
              </div>

              {/* FD Partnership Details */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0 text-center">
                  <div className="w-24 h-24 bg-[#800000] rounded-xl flex items-center justify-center text-[#FFD700] text-3xl font-bold mb-2">
                    FD
                  </div>
                  <p className="text-sm text-[#800000] font-medium">Father Duenas<br/>Memorial School</p>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Our First High School Partnership</h3>
                  <p className="text-slate-700 mb-4">
                    Audreana is now teaching coding electives at Father Duenas Memorial School — Leon&apos;s own high school alma mater. She&apos;s bringing a simplified version of our curriculum to high schoolers, proving that <span className="font-semibold">coding is a real career path</span> they can start exploring now.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 text-center border border-[#800000]/10">
                      <div className="text-2xl font-bold text-[#800000]">15</div>
                      <div className="text-sm text-slate-600">Students Enrolled</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-[#800000]/10">
                      <div className="text-2xl font-bold text-[#800000]">2</div>
                      <div className="text-sm text-slate-600">Elective Courses</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-[#800000]/10">
                      <CheckCircle className="w-6 h-6 text-[#FFD700] mx-auto" />
                      <div className="text-sm text-slate-600">Capstones Complete</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Courses offered:</span> Intro to Scripting with Ruby • Intro to HTML/CSS/JavaScript
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UOG AI Workshop */}
      <section className="py-24 lg:py-32 bg-slate-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <Brain className="w-4 h-4 mr-2" />
                Beyond the Bootcamp
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                AI Training for Organizations
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Our expertise in AI isn&apos;t just for our students — we help organizations understand and leverage AI effectively.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="/images/uog-intro-to-ai.jpeg"
                    alt="UOG Intro to AI Workshop attendees"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      UOG
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">University of Guam</h3>
                      <p className="text-sm text-slate-500">July 2025</p>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-slate-900 mb-3">
                    Intro to AI Workshop
                  </h4>
                  <p className="text-slate-600 text-sm mb-4">
                    A two-day seminar for UOG staff from the Office of the Senior Vice President &amp; Provost — covering AI fundamentals, practical applications, and important considerations.
                  </p>

                  {/* Topics */}
                  <ul className="space-y-2 mb-5">
                    <li className="flex items-start text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>What is AI &amp; how does ChatGPT work</span>
                    </li>
                    <li className="flex items-start text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Practical use cases for work &amp; research</span>
                    </li>
                    <li className="flex items-start text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Risks: hallucinations, security, privacy</span>
                    </li>
                  </ul>

                  {/* Quote */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <Quote className="w-5 h-5 text-green-400 mb-2" />
                    <p className="text-slate-700 text-sm italic">
                      &quot;The staff are raving about the training!&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 bg-ruby-500/20 text-ruby-400 rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4 mr-2" />
              Our Vision
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Guam Can Be a Tech Hub
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              For as long as I can remember, Guam has been behind when it comes to technology. But it doesn&apos;t have to stay that way.
            </p>
            
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-left mb-8">
              <p className="text-slate-300 mb-4">
                Here&apos;s what I&apos;ve discovered: <span className="text-white font-semibold">opportunity is everywhere on Guam</span>. There&apos;s so much work that needs custom software solutions — I can&apos;t take it all on myself. The problem isn&apos;t lack of opportunity. The problem is that people don&apos;t know we can build these things <span className="italic">here</span>.
              </p>
              <p className="text-slate-300">
                We don&apos;t need to outsource to the states or overseas. We can build custom solutions right here in Guam. And as more people learn to code, more opportunities will come. That&apos;s why I started both the Code School of Guam and Shimizu Technology — to prove that <span className="text-ruby-400 font-semibold">Guam has the talent</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <Rocket className="w-8 h-8 text-ruby-400 mb-3" />
                <h3 className="text-lg font-bold mb-2">Our Mission</h3>
                <p className="text-slate-400 text-sm">
                  Provide high-quality, accessible coding education to the people of Guam, ensuring graduates are prepared for real software engineering careers.
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <Target className="w-8 h-8 text-ruby-400 mb-3" />
                <h3 className="text-lg font-bold mb-2">The Goal</h3>
                <p className="text-slate-400 text-sm">
                  Transform Guam into a thriving tech hub where people grow up knowing that building software is something they can do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Founder */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                About the Founder
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3">
                <Image
                  src="/NationalsPic2.jpg"
                  alt="Leon Shimizu"
                  width={300}
                  height={300}
                  className="rounded-full mx-auto border-4 border-ruby-500/30"
                />
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold mb-2 text-slate-900">Leon Shimizu</h3>
                <p className="text-ruby-600 font-medium mb-4">Founder, Code School of Guam & Shimizu Technology</p>
                <div className="space-y-4 text-slate-600">
                  <p>
                    Hafa Adai! I&apos;m Leon Shimizu, born and raised in Guam. After graduating from Father Duenas Memorial School in 2017, I pursued mechanical engineering at Allegheny College before discovering my passion for software development.
                  </p>
                  <p>
                    In 2021, I enrolled in Actualize Coding Bootcamp and landed my first software engineering job before even graduating. I now work at Spectrio LLC while also serving as an instructor at Actualize.
                  </p>
                  <p>
                    In 2024, encouraged by my mom, I founded Code School of Guam to bring these same opportunities back home. I also started Shimizu Technology to ensure our graduates have real-world projects to work on — because I know how important that experience is for landing your first job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shimizu Technology Partnership */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Shimizu Technology Partnership
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Employers want experience, but new engineers can&apos;t get experience if no one gives them a chance. We created Shimizu Technology to be that company — ensuring every graduate has access to real-world projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm">
                <div className="flex items-center mb-2">
                  <Rocket className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="font-semibold text-slate-900">Optional Internship</h3>
                </div>
                <p className="text-sm text-slate-600">
                  10-week experience-focused program working on real production apps — build your portfolio
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border-l-4 border-green-500 shadow-sm">
                <div className="flex items-center mb-2">
                  <GraduationCap className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="font-semibold text-slate-900">TA Positions</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Paid teaching assistant roles for the next cohort — reinforce your skills while earning
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border-l-4 border-purple-500 shadow-sm">
                <div className="flex items-center mb-2">
                  <Briefcase className="w-5 h-5 text-purple-500 mr-2" />
                  <h3 className="font-semibold text-slate-900">Junior Dev Roles</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Paid contract positions at Shimizu Technology — work on real client projects
                </p>
              </div>
            </div>
            <a
              href="https://shimizu-technology.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
            >
              Visit Shimizu Technology
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-ruby-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Become part of Guam&apos;s growing tech ecosystem. No prior experience required.
          </p>
          <a
            href="https://forms.gle/nJv8nAfxsvvLSbbq7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-ruby-600 hover:bg-slate-100 rounded-lg text-lg font-medium transition-all"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  )
}
