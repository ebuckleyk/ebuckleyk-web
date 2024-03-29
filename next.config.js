const withPWA = require('next-pwa');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react'
  }
});
const { withAxiom } = require('next-axiom');

const isProd = process.env.NODE_ENV === 'production';
const webportalUrl = process.env.EBUCKLEYK_WEBPORTAL_URL || '';
const cdn = process.env.NEXT_PUBLIC_CDN || '';

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' ${isProd ? '' : "'unsafe-eval'"};
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' ${cdn} ${webportalUrl} https://pbs.twimg.com https://www.cdkglobal.com https://lh3.googleusercontent.com data:;
  connect-src 'self' ${webportalUrl} https://vitals.vercel-insights.com https://*.amazonaws.com https://www.google-analytics.com;
  script-src-elem 'self' https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ 'sha256-GcS5prM4K7dXLg50kFkeZ3YjiSAar6n2S/amw3ulb3w=';
  frame-src 'self' https://www.youtube.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/;
  media-src 'self' ${cdn};
`;
const securityHeaders = [
  {
    // header controls DNS prefetching, allowing browsers to proactively perform domain name resolution on external links,
    // images, CSS, JavaScript and more. This reduces latency when the user clicks a link
    key: 'X-DNS-Prefetch-Control',
    value: 'one'
  },
  {
    // This header informs browsers it should only be accessed using HTTPS, instead of using HTTP.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    // This header stops pages from loading when they detect reflected cross-site scripting (XSS) attacks.
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // This header indicates whether the site should be allowed to be displayed within an iframe.
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    // This header prevents the browser from attempting to guess the type of content if the Content-Type header is not explicitly set.
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // This header controls how much information the browser includes when navigating from the current website (origin) to another.
    // see: https://scotthelme.co.uk/a-new-security-header-referrer-policy/
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    // This header helps prevent cross-site scripting (XSS), clickjacking and other code injection attacks.
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    images: {
      allowFutureImage: true
    }
  },
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: true // process.env.NODE_ENV === 'development'
  },
  images: {
    domains: [
      'static.wikia.nocookie.net',
      'res.cloudinary.com',
      'play-lh.googleusercontent.com',
      'www.cdkglobal.com',
      'www.jdrf.org',
      'thebestandbrightest.com',
      'media-exp1.licdn.com',
      'i.ytimg.com',
      'image.isu.pub',
      'images.ctfassets.net',
      `${cdn.replace('https://', '')}`
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/:path*'
        },
        {
          source: '/portal/:path*',
          destination: `${webportalUrl}/portal/:path*`
        },
        {
          source: '/api/:path*',
          destination: `${webportalUrl}/portal/api/:path*`
        }
      ]
    };
  }
};

module.exports = withAxiom(withPWA(withMDX(nextConfig)));
