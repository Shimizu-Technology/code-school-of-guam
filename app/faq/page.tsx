"use client"

import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { ArrowRight, Mail, Phone } from "lucide-react"
import { faqGroups, type FaqItem } from "@/data/faq"

function renderFaqAnswer(item: FaqItem): ReactNode {
  if (!item.links?.length) return item.answer
  let nodes: ReactNode[] = [item.answer]
  for (const link of item.links) {
    nodes = nodes.flatMap<ReactNode>((node, idx) => {
      if (typeof node !== "string" || !node.includes(link.label)) return [node]
      const parts = node.split(link.label)
      return parts.flatMap<ReactNode>((part, partIdx) =>
        partIdx < parts.length - 1
          ? [
              <Fragment key={`${idx}-${partIdx}-t`}>{part}</Fragment>,
              <a
                key={`${idx}-${partIdx}-a`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ruby-700 underline underline-offset-4 hover:text-ruby-800"
              >
                {link.label}
              </a>,
            ]
          : [<Fragment key={`${idx}-${partIdx}-t`}>{part}</Fragment>]
      )
    })
  }
  return nodes
}

export default function FAQPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="csg-page-hero relative overflow-hidden bg-[#faf7f0] py-16 text-slate-950 md:py-24">

        <div className="container relative mx-auto px-4 sm:px-8">
          <p className="csg-label text-ruby-700">Useful answers</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-tight md:text-7xl">Questions before you begin.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">Find the right learning path, understand what is available now, and see where course or cohort terms may differ.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 sm:px-8 md:py-24">
        {faqGroups.map((group) => (
          <section key={group.title} id={group.id} aria-labelledby={`${group.id}-title`} className="grid grid-cols-1 gap-7 border-t border-slate-200 py-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <h2 id={`${group.id}-title`} className="font-serif text-3xl font-semibold text-slate-950 md:text-4xl">{group.title}</h2>
              <p className="mt-3 max-w-sm leading-relaxed text-slate-600">{group.description}</p>
            </div>
            <Accordion type="single" collapsible className="min-w-0 divide-y divide-slate-200 border-y border-slate-200">
              {group.items.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-0">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold leading-snug text-slate-950 [overflow-wrap:anywhere] hover:no-underline hover:text-ruby-700 md:text-lg">{faq.question}</AccordionTrigger>
                  <AccordionContent className="max-w-prose pb-6 pr-7 text-base leading-relaxed text-slate-600 [overflow-wrap:anywhere]">{renderFaqAnswer(faq)}</AccordionContent>
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
