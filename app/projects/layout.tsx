import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Work & Production Projects",
  description: "See Code School of Guam capstone presentations and the production applications graduates support through the Shimizu Technology internship pathway.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Student Work & Production Projects | Code School of Guam", description: "Capstones, community products, and real operational software built around the Code School of Guam learning experience.", url: "/projects" },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) { return children }
