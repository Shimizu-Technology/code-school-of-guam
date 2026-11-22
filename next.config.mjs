/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Images are optimized: @netlify/plugin-nextjs routes /_next/image through the
  // Netlify Image CDN, which resizes to the requested width and negotiates format.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // No standalone policies page exists; written terms are described in the FAQ.
      { source: '/policies', destination: '/faq#tuition-and-policies', statusCode: 301 },
    ];
  },
};

export default nextConfig;
