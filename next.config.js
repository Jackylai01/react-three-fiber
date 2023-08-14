const ContentSecurityPolicy = `
   font-src 'self';
`;

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // don't use object format for rewrites since it's not supported yet
  // https://github.com/serverless-nextjs/serverless-next.js/issues/1003
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3001/:path*`,
      },
    ];
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: securityHeaders,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
