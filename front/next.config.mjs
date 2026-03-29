/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let Node resolve pdf.js + worker from node_modules (fixes Turbopack fake worker path)
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', '@napi-rs/canvas'],
  // Vercel NFT often skips pdf.worker.mjs under nested pdf-parse/pdfjs-dist — force include
  outputFileTracingIncludes: {
    '/api/proxy/quiz': [
      'node_modules/pdf-parse/node_modules/pdfjs-dist/legacy/build/**/*',
      'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
    ],
    '/api/ai/analyze': [
      'node_modules/pdf-parse/node_modules/pdfjs-dist/legacy/build/**/*',
      'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
    ],
  },
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
