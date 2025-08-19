/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
  
  // --- ADD THIS ---
  devIndicators: {
    allowedDevOrigins: [
      // This will allow any origin during development.
      // You can be more specific if you want to.
      '**', 
    ],
  },
  // --- END ADD ---
};

export default nextConfig;