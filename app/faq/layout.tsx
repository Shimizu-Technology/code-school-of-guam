import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coding Course and Bootcamp FAQs",
  description: "Answers about Code School of Guam's focused courses, full bootcamp, enrollment status, learning format, and future updates.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Courses and Bootcamp FAQs | Code School of Guam", description: "Clear answers about the focused-course pilot and the full bootcamp.", url: "/faq" },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) { return children }
