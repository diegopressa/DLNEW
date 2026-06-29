/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Revertido el 29/06/2026: Vercel Hobby (Free) tope la optimizacion en
    // ~1000 imagenes/mes y empezo a devolver HTTP 402 (PAYMENT_REQUIRED) en
    // productos/categorias. Con unoptimized:true las imagenes vuelven a
    // servirse directo desde Supabase Storage. El cacheControl de 30d del
    // bucket mitiga el egress en el corto plazo.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "dldisenoyestampado.uy",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;