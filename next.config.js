/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  },
};

module.exports = nextConfig;
