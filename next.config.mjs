/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Images are optimized: @netlify/plugin-nextjs routes /_next/image through the
  // Netlify Image CDN, which resizes to the requested width and negotiates format.
  async redirects() {
    return [
      // No standalone policies page exists; written terms are described in the FAQ.
      { source: '/policies', destination: '/faq#tuition-and-policies', statusCode: 301 },
    ];
  },
};

export default nextConfig;
