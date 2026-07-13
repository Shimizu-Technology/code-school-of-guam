import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the people and mission behind Guam's first coding bootcamp and learn how Code School of Guam is building local software talent and opportunity.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Code School of Guam", description: "Local instruction, professional software context, and a long-term commitment to growing Guam's technology community.", url: "/about" },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) { return children }
