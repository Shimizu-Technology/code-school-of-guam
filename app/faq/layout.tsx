import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coding Bootcamp FAQs",
  description: "Answers about Code School of Guam admissions, schedule, tuition, experience requirements, curriculum, remote format, and graduate opportunities.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Coding Bootcamp FAQs | Code School of Guam", description: "Clear answers about the Code School of Guam program, from weekly time commitment to tuition and career preparation.", url: "/faq" },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) { return children }
