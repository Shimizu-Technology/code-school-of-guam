"use client"

import Link from "next/link"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { ArrowRight, Mail, Phone } from "lucide-react"

const faqGroups = [
  {
    title: "Choosing a path",
    description: "Focused courses, the full bootcamp, and who each is for.",
    items: [
      {
        question: "What is the difference between a focused course and the full bootcamp?",
        answer: "A focused course teaches one subject through short lessons, practice, and a bounded project. Guided runs include private instructor time and feedback; a future self-paced option would have different support terms. The full bootcamp is a longer program across frontend, backend, databases, and AI, with integrated projects and sustained instruction. Completing focused courses does not mean you have completed the bootcamp."
      },
      {
        question: "Can I enroll in Python Fundamentals now?",
        answer: "The first three-week Python Fundamentals run is being prepared for an invited group in December 2026. Public enrollment is not open. You can join the course-specific updates list on the Python Fundamentals page to hear about a later public run."
      },
      {
        question: "Do I need prior coding experience?",
        answer: "No prior coding experience is required. Our program starts from the basics and builds up to advanced concepts."
      },
      {
        question: "Is there an age requirement?",
        answer: "The invited December 2026 Python pilot is for adults. We are exploring future courses for ages 13–17 with guardian involvement and appropriate support and safety practices. Any course for younger children would be developed separately. Each offer will state its age requirements before enrollment."
      },
      {
        question: "Can I take a course from outside Guam?",
        answer: "Our future focused courses are being designed for online learners beyond Guam. The December 2026 Python pilot is an invited adult group. Before any public guided run opens, we will publish its instructor availability and meeting times clearly across time zones. The full bootcamp has its own cohort-specific requirements."
      },
      {
        question: "Will there be a self-paced option?",
        answer: "We plan to use the same lessons, exercises, and project for two options. Self-paced learners would study on their own schedule with course-question messaging, but without private Zoom meetings or individual project review. We plan 12 months of self-paced lesson access; the messaging window and reply times will be set in the written offer. Guided learners would also get private instructor meetings and personal feedback. The invited December Python pilot tests the guided format. Public enrollment and self-paced pricing are not open or announced; final written terms will be published first."
      },
      {
        question: "Why is there only one full bootcamp cohort in 2026?",
        answer: "The March 2026 full bootcamp cohort began March 2 and is closed to new students. We have not announced another full cohort for 2026. We are also developing shorter focused courses, starting with an invited Python Fundamentals pilot in December. Those are separate from the full bootcamp."
      },
    ],
  },
  {
    title: "Learning and support",
    description: "Schedule, equipment, teaching, resources, and opportunities after the program.",
    items: [
      {
        question: "Why does the full bootcamp teach Ruby on Rails, and what languages will focused courses use?",
        answer: "Ruby on Rails has been part of our full bootcamp because it lets learners build and understand a complete web application. Focused courses will use the language that fits their subject: the invited December pilot starts with Python, and we are developing Ruby and JavaScript fundamentals along with later courses in areas such as SQL, frontend development, and Rails APIs. Each course page will state what it teaches and what learners should know before starting."
      },
      {
        question: "Do I need to have a Mac to join the program?",
        answer: "A Mac is not required for the invited Python Fundamentals pilot; learners can write and run Python in Hafa Code through a browser. Device and setup requirements for other courses or bootcamp cohorts will be shared with each offer."
      },
      {
        question: "Are the classes held in-person or online?",
        answer: "The March 2026 full bootcamp began with live Zoom sessions, structured online practice, and mentorship; enrolled students now follow individual completion or restart schedules. The invited Python Fundamentals pilot uses short lessons and one private Zoom hour each week. Later guided runs may use trained instructors, while a future self-paced option would have different support. Check each offer before enrolling."
      },
      {
        question: "How does the internship work?",
        answer: "Some graduates have practiced on real software through Shimizu Technology. Internships, contracts, teaching roles, and jobs depend on available projects and each graduate's readiness; none is guaranteed by completing a course or the bootcamp. Any defined internship for a future cohort will be described in that cohort's written offer."
      },
      {
        question: "How long do I have access to the class recordings?",
        answer: "Recording and resource access depends on the specific course or cohort. We will provide the access period in its written terms before payment."
      },
      {
        question: "Can I reach out for support after the program ends?",
        answer: "You can contact us after a course ends. The period and type of instructor support included with enrollment will be described in that offer's written terms."
      },
      {
        question: "Are there opportunities to become a teaching assistant?",
        answer: "Outstanding graduates may be considered for paid teaching roles when openings exist. Completing a course or the bootcamp does not guarantee a position."
      },
      {
        question: "What is the hybrid format?",
        answer: "For the March 2026 full bootcamp, live Zoom classes are Tuesday and Thursday, with structured practice during the week and mentorship. Guided focused courses use a different format: short lessons, exercises, project feedback, and private meetings. A future self-paced option would have different support terms. See each offer page for its current schedule and support terms."
      },
      {
        question: "What AI tools will I learn?",
        answer: "The full bootcamp has taught a progression from coding fundamentals to building AI-powered applications. Specific tools and any paid software licenses depend on the cohort's curriculum and written offer. Python Fundamentals starts with beginner Python and does not require prior AI experience."
      },
      {
        question: "Do I need to know anything about AI before starting?",
        answer: "No prior AI knowledge is needed for Python Fundamentals. The full bootcamp has introduced AI after core coding skills; a future cohort's exact AI curriculum will be described with its offer."
      },
      {
        question: "What resources do you recommend to get started with coding?",
        answer: "We recommend exploring free coding platforms like freeCodeCamp or Replit to get familiar with coding concepts and practice in-browser before starting pre-work."
      },
    ],
  },
  {
    title: "Tuition and policies",
    description: "Prices and written terms for a specific course or cohort.",
    items: [
      {
        question: "Why is the tuition set at $7,500?",
        answer: "The $7,500 figure was tuition for the March 2026 full bootcamp cohort, which is closed to new students. The price for a future full cohort has not been announced. Focused courses have separate prices and terms when enrollment opens."
      },
      {
        question: "Do you offer payment plans?",
        answer: "Payment options depend on the specific offer. The March 2026 bootcamp had installment options; terms for a future cohort have not been announced. Ask us for the current written terms before making a payment."
      },
      {
        question: "What is the attendance policy?",
        answer: "Attendance expectations depend on the course or cohort. We will provide them, including any consequences of missed sessions, in the written terms for that offer before payment."
      },
      {
        question: "Is there a refund policy?",
        answer: "Refund and deposit terms depend on the course or cohort. We will provide the applicable policy in writing before payment."
      },
      {
        question: "How can I access the policies?",
        answer: "Please email codeschoolofguam@gmail.com for the written terms that apply to your specific cohort or course. We will show the applicable access, meeting, and refund terms before accepting payment for a new offer."
      }
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-[#0b1220] py-16 text-white md:py-24">
        <div className="csg-grid absolute inset-0 opacity-30" />
        <div className="container relative mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-300">Useful answers</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-tight md:text-7xl">Questions before you begin.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">Find the right learning path, understand what is available now, and see where course or cohort terms may differ.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 sm:px-8 md:py-24">
        {faqGroups.map((group) => (
          <section key={group.title} className="grid gap-7 border-t border-slate-200 py-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-slate-950 md:text-4xl">{group.title}</h2>
              <p className="mt-3 max-w-sm leading-relaxed text-slate-600">{group.description}</p>
            </div>
            <Accordion type="single" collapsible className="divide-y divide-slate-200 border-y border-slate-200">
              {group.items.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-0">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold leading-snug text-slate-950 hover:no-underline hover:text-ruby-700 md:text-lg">{faq.question}</AccordionTrigger>
                  <AccordionContent className="max-w-3xl pb-6 pr-7 text-base leading-relaxed text-slate-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      <section className="border-t border-slate-200 bg-white py-16 md:py-20">
        <div className="container mx-auto grid gap-8 px-4 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="csg-label text-ruby-700">Still have a question?</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-slate-950">Talk with us directly.</h2>
            <p className="mt-3 text-slate-600">We can clarify the current offer and provide its written terms.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="mailto:codeschoolofguam@gmail.com" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ruby-700 px-5 py-3 font-semibold text-white hover:bg-ruby-800"><Mail className="h-4 w-4" /> Email us</a>
            <a href="tel:+16714830219" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-900 hover:bg-slate-50"><Phone className="h-4 w-4" /> (671) 483-0219</a>
          </div>
        </div>
      </section>
      <section className="bg-ruby-700 py-14 text-white">
        <div className="container mx-auto flex flex-col gap-6 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="font-serif text-3xl font-semibold md:text-4xl">Find your starting point.</h2><p className="mt-2 text-ruby-100">The March 2026 bootcamp is closed to new students; focused courses are being prepared.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/courses" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-5 py-3 font-semibold text-ruby-800">Explore courses <ArrowRight className="h-4 w-4" /></Link><Link href="/interest" className="inline-flex min-h-12 items-center rounded-md border border-white/60 px-5 py-3 font-semibold text-white">Bootcamp updates</Link></div>
        </div>
      </section>
    </div>
  )
}
