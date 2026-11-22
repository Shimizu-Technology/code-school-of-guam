import type { Metadata } from "next"
import { buildSocialMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Student Work & Production Projects",
  description: "See Code School of Guam capstone presentations, an alumni team project, and the Shimizu Technology production systems students learn around.",
  alternates: { canonical: "/projects" },
  ...buildSocialMetadata({
    title: "Student Work & Production Projects | Code School of Guam",
    description: "Capstones, community products, and real operational software built around the Code School of Guam learning experience.",
    url: "/projects",
  }),
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) { return children }
