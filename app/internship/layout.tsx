import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Professional Practice and Graduate Opportunities",
  description: "See how Code School of Guam teaches professional software practice and how project opportunities for graduates depend on availability and readiness.",
  alternates: { canonical: "/internship" },
  openGraph: { title: "Professional Practice | Code School of Guam", description: "Learn how CSG connects classroom skills with collaboration, code review, and real production context. Opportunities vary by project.", url: "/internship" },
}

export default function InternshipLayout({ children }: { children: React.ReactNode }) { return children }
