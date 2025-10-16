// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Anything under /__clerk/* goes to Clerk's Frontend API
        source: '/__clerk/:path*',
        destination: 'https://frontend-api.clerk.services/:path*',
      },
    ];
  },
};

module.exports = nextConfig;