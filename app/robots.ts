import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/payment/', '/payment-success/'],
    },
    sitemap: 'https://codeschoolofguam.com/sitemap.xml',
  }
}

