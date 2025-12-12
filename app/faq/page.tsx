"use client"

import Link from "next/link"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { HelpCircle, Mail, Phone } from "lucide-react"

const faqs = [
  {
    question: "Do I need prior coding experience?",
    answer: "No prior coding experience is required. Our program starts from the basics and builds up to advanced concepts."
  },
  {
    question: "Why do you teach Ruby on Rails instead of other programming languages?",
    answer: "We have chosen Ruby on Rails because it's a powerful, beginner-friendly framework that allows for rapid development. It's used by many successful companies like Airbnb, GitHub, and Shopify. Our instructors have professional experience with Rails, ensuring high-quality teaching and real-world insights. Learning Rails provides a strong foundation, making it easier to pick up other languages in the future."
  },
  {
    question: "Do I need to have a Mac to join the program?",
    answer: "While it's not mandatory to have a Mac, we highly recommend it. Using a Mac helps ensure uniformity in the classroom, simplifying setup processes and minimizing technical issues that can arise from different operating systems. This allows you to focus more on learning coding concepts rather than dealing with OS-specific challenges. If you don't have a Mac, you're still welcome to join, but please be aware that some steps and commands may differ slightly."
  },
  {
    question: "Are the classes held in-person or online?",
    answer: "All our classes are conducted fully remotely via Zoom. This allows you to participate in live, interactive sessions from anywhere with a reliable internet connection. Our online format provides flexibility and convenience while maintaining a high level of engagement and support."
  },
  {
    question: "How does the internship work?",
    answer: "The internship is completely optional and unpaid — it's designed for graduates who want to build their portfolio with real-world experience before job hunting. You'll work on production applications at Shimizu Technology in 2-week Agile sprints over 10 weeks. Separately, we offer paid opportunities for top performers: Teaching Assistant positions for the next cohort, and Junior Software Engineer contracts with Shimizu Technology."
  },
  {
    question: "How long do I have access to the class recordings?",
    answer: "You will have lifetime access to all class recordings, in-class resources, and learning materials, supporting your continued learning journey indefinitely."
  },
  {
    question: "Can I reach out for support after the program ends?",
    answer: "We are here to support you even after your cohort concludes. Feel free to reach out with questions or for guidance."
  },
  {
    question: "Are there opportunities to become a teaching assistant?",
    answer: "Yes! Outstanding graduates may be invited to become paid teaching assistants for future cohorts, providing leadership experience and reinforcing your own learning."
  },
  {
    question: "Why is the tuition set at $7,500?",
    answer: "We strive to provide high-quality education with personalized attention through small class sizes and offer real-world experience via internships. Our tuition reflects the value and unique opportunities we provide, while remaining more affordable than many comparable programs."
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes, we offer monthly installment plans during the course duration. We are also working on partnering with local banks for financing options."
  },
  {
    question: "What is the attendance policy?",
    answer: "Attendance is crucial. Missing more than three unexcused classes may result in dismissal without a refund. Excused absences are considered for valid reasons."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes. Full tuition (minus the non-refundable deposit) is refundable if you withdraw before the start of the second week. No refunds are issued from the second week onward."
  },
  {
    question: "How can I access the policies?",
    answer: "You can view our detailed policies, including the Code of Conduct, Attendance Policy, and Refund Policy, in the Policies section of our website."
  },
  {
    question: "What resources do you recommend to get started with coding?",
    answer: "We recommend exploring free coding platforms like freeCodeCamp or Replit to get familiar with coding concepts and practice in-browser before starting pre-work."
  }
]

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-ruby-500/20 text-ruby-400 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            Get Answers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about Code School of Guam
          </p>
        </div>
        {/* Fade to next section - dark to light */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </section>

      {/* FAQs - Card-based accordion like original */}
      <section className="py-16 md:py-20 bg-gray-100 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,0,0,0.1),transparent_70%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="text-left p-4 hover:bg-gray-50 data-[state=open]:bg-gray-50">
                  <div className="flex items-center">
                    <span className="text-ruby-500 font-semibold mr-2">Q:</span>
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 text-gray-600">
                  <div className="pl-6 border-l-2 border-ruby-500">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="max-w-3xl mx-auto mt-8 text-center">
            <p className="text-gray-600">
              Don&apos;t see your question? Feel free to{" "}
              <a href="mailto:codeschoolofguam@gmail.com" className="text-ruby-600 hover:text-ruby-700 font-medium hover:underline">
                contact us
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Still have questions - subtle background change, no fade needed */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;re here to help. Reach out anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:codeschoolofguam@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Us
            </a>
            <a
              href="tel:+16714830219"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-lg font-medium transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call (671) 483-0219
            </a>
          </div>
        </div>
      </section>

      {/* CTA - final section, no fade needed */}
      <section className="py-16 bg-ruby-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to start your coding journey?
          </h2>
          <p className="text-white/90 mb-6">
            Join our February 2026 cohort and transform your career.
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
