/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let Node resolve pdf.js + worker from node_modules (fixes Turbopack fake worker path)
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', '@napi-rs/canvas'],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Set to 100MB for video uploads
      allowedOrigins: ['localhost:3000'], // Optional: specify allowed origins
    },
  },
  // Optional: webpack configuration for PDF.js if needed
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

export default nextConfig
