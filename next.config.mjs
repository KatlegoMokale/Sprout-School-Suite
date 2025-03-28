/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    images: {
      unoptimized: true,
      domains: ['cloud.appwrite.io'],
    },
    env: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_LOCATION_INDEX_NAME: process.env.AWS_LOCATION_INDEX_NAME,
    }
  };
  
  export default nextConfig;