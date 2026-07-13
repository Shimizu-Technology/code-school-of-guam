import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Graduate Internship Pathway",
  description: "Learn how Code School of Guam graduates gain real-world software experience through structured internships and paid opportunities with Shimizu Technology.",
  alternates: { canonical: "/internship" },
  openGraph: { title: "Graduate Internship Pathway | Code School of Guam", description: "A practical bridge from classroom projects to real software teams, production systems, and professional development.", url: "/internship" },
}

export default function InternshipLayout({ children }: { children: React.ReactNode }) { return children }
