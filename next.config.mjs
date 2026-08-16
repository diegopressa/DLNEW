/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // URLs de categorías renombradas en la reorganización de 08/2026:
  // redirect permanente para no perder el posicionamiento ni los links viejos.
  async redirects() {
    return [
      {
        source: "/categorias/lista-accesorios",
        destination: "/categorias/lista-gorros",
        permanent: true,
      },
      {
        source: "/categorias/lista-accesorios/:slug",
        destination: "/categorias/lista-gorros/:slug",
        permanent: true,
      },
      {
        source: "/categorias/lista-ropa-de-trabajo-y-alta-visibilidad",
        destination: "/categorias/lista-alta-visibilidad-y-seguridad",
        permanent: true,
      },
      {
        source: "/categorias/lista-ropa-de-trabajo-y-alta-visibilidad/:slug",
        destination: "/categorias/lista-alta-visibilidad-y-seguridad/:slug",
        permanent: true,
      },
    ];
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