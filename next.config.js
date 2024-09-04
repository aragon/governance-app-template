/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  transpilePackages: ["react-hook-mousetrap"],
  async redirects() {
    return [
      {
        source: "/", // Match the homepage
        destination: "/plugins/community-proposals/#/", // The URL to redirect to
        permanent: true, // Set to false for a temporary redirect
      },
    ];
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
