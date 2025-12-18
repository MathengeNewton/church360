/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  
  // Fix trailing slash handling
  trailingSlash: true,
  
  // React strict mode
  reactStrictMode: true,
  
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Redirects for trailing slash consistency
  async redirects() {
    return [
      // Ensure trailing slash consistency for auth routes
      {
        source: '/auth/login',
        destination: '/auth/login/',
        permanent: false,
      },
      {
        source: '/auth/forgot-password',
        destination: '/auth/forgot-password/',
        permanent: false,
      },
      {
        source: '/auth/reset-password',
        destination: '/auth/reset-password/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
