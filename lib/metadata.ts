import type { Metadata } from "next"

export const SOCIAL_CARD_PATH = "/images/code-school-social-card.png"

export const SOCIAL_CARD_IMAGE = {
  url: SOCIAL_CARD_PATH,
  width: 1200,
  height: 630,
  alt: "Code School of Guam — Learn to build software that matters",
} as const

export function buildSocialMetadata({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url: string
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url,
      siteName: "Code School of Guam",
      images: [SOCIAL_CARD_IMAGE],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_CARD_PATH],
    },
  }
}
