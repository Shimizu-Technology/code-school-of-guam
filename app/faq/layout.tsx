import type { Metadata } from "next"
import { faqGroups } from "@/data/faq"
import { buildSocialMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Coding Course and Bootcamp FAQs",
  description: "Answers about Code School of Guam's focused courses, full bootcamp, enrollment status, learning format, and future updates.",
  alternates: { canonical: "/faq" },
  ...buildSocialMetadata({
    title: "Courses and Bootcamp FAQs | Code School of Guam",
    description: "Clear answers about the focused-course pilot and the full bootcamp.",
    url: "/faq",
  }),
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }))
  ),
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}
