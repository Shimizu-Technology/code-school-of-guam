import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Full Bootcamp",
  description: "Explore Code School of Guam's full bootcamp, the structure of its 2026 cohort, and updates for a future cohort. Next-cohort dates and tuition have not been announced.",
  alternates: { canonical: "/programs" },
  openGraph: { title: "Full Bootcamp | Code School of Guam", description: "Sustained instruction, integrated software projects, and real production context. The next cohort has not been announced.", url: "/programs" },
}

export default function ProgramsLayout({ children }: { children: React.ReactNode }) { return children }
