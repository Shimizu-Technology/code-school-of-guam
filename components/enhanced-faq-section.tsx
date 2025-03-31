"use client"

import { useState } from "react"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

interface FAQ {
  question: string
  answer: string
}

interface EnhancedFAQSectionProps {
  faqs: FAQ[]
}

export function EnhancedFAQSection({ faqs }: EnhancedFAQSectionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  
  // Handle item expansion with animation
  const handleItemClick = (value: string) => {
    setExpandedItem(expandedItem === value ? null : value)
  }

  return (
    <section
      id="faq"
      className="w-full py-12 md:py-16 lg:py-20 bg-gray-100 relative overflow-hidden"
    >
      {/* Mobile-optimized background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,0,0,0.1),transparent_70%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900 reveal-on-scroll">
          Frequently Asked Questions
        </h2>
        
        <Accordion 
          type="single" 
          collapsible 
          className="w-full max-w-3xl mx-auto" 
          data-stagger-children
        >
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="animate-stagger mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 touch-feedback"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccordionTrigger 
                className="text-left p-4 hover:bg-gray-50 data-[state=open]:bg-gray-50"
                onClick={() => handleItemClick(`item-${index}`)}
              >
                <div className="flex items-center">
                  <span className="text-ruby-500 font-semibold mr-2">Q:</span>
                  <span className="font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0 text-gray-600 animate-slideUp">
                <div className="pl-6 border-l-2 border-ruby-500">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-8 text-center reveal-on-scroll">
          <p className="text-gray-600">
            Don't see your question? Feel free to{" "}
            <a 
              href="#contact" 
              className="text-ruby-500 hover:underline animate-pulse-slow touch-feedback"
            >
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}