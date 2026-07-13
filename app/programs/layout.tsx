import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Program, Schedule & Tuition",
  description: "Review Code School of Guam's live bootcamp format, weekly schedule, $7,500 tuition, payment options, and next-cohort interest list.",
  alternates: { canonical: "/programs" },
  openGraph: { title: "Program, Schedule & Tuition | Code School of Guam", description: "An under-six-month remote coding bootcamp with live instruction, structured practice, AI engineering, and real production context.", url: "/programs" },
}

export default function ProgramsLayout({ children }: { children: React.ReactNode }) { return children }
