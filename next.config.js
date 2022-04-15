const { withSentryConfig } = require('@sentry/nextjs');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: {
      layoutRaw: true
    }
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
      'images.ctfassets.net'
    ]
  }
};

const sentryWebpackPluginOptions = {
  silent: true
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
