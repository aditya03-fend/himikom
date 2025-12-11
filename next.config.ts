/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // aktifkan strict mode React
  compiler: {
    // Aktifkan SWC React transform
    reactRemoveProperties: true,
  },
  images: {
    unoptimized: true,
    // Mengizinkan load gambar dari semua domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // semua domain HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // semua domain HTTP
      },
    ],
  },
};

module.exports = nextConfig;
