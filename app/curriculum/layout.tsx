import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Full-Stack & AI Curriculum",
  description: "Explore Code School of Guam's full-stack and AI engineering curriculum, from programming fundamentals through production applications and capstone work.",
  alternates: { canonical: "/curriculum" },
  openGraph: { title: "Full-Stack & AI Curriculum | Code School of Guam", description: "Learn Ruby, Rails, React, Python, AI engineering, and professional software development through a deliberate project-based curriculum.", url: "/curriculum" },
}

export default function CurriculumLayout({ children }: { children: React.ReactNode }) { return children }
