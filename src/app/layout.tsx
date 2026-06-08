import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import MetaPixelRouteTracker from "@/components/analytics/MetaPixelRouteTracker";
import "./globals.css";

const META_PIXEL_ID = "4652295098327361";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DL Diseño & Estampado | Uniformes Personalizados para Empresas",
  description: "Nos encargamos de todo: prenda, estampado y entrega. Presupuesto inmediato y entrega en 24-48 horas. Uniformes en Montevideo, Canelones y Maldonado.",
  keywords: [
    "uniformes para empresas",
    "uniformes personalizados",
    "ropa de trabajo",
    "estampados uruguay",
    "uniformes montevideo",
    "bordado para empresas",
    "ropa corporativa uruguay",
    "uniformes laborales",
  ],
  metadataBase: new URL("https://dldisenoyestampado.uy"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://dldisenoyestampado.uy",
    siteName: "DL Diseño & Estampado",
    title: "DL Diseño & Estampado | Uniformes Personalizados para Empresas",
    description: "Uniformes personalizados para empresas en Uruguay. Estampado, bordado y entrega en 24-48h. +500 empresas confían en nosotros.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "DL Diseño & Estampado" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DL Diseño & Estampado | Uniformes para Empresas",
    description: "Uniformes personalizados para empresas en Uruguay. Estampado, bordado y entrega en 24-48h.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
        <MetaPixelRouteTracker />

        {/* Meta Pixel — base + PageView inicial */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>

        {/* Google tag (gtag.js) — carga diferida para no bloquear renderizado */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-723199533"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'AW-723199533');
            gtag('config', 'G-YT47D5C7GN');

            document.addEventListener('click', function(e) {
              var el = e.target.closest('a, button');
              if (el) {
                var url = el.href || (el.getAttribute && el.getAttribute('href')) || '';
                if (/wa\\.me|api\\.whatsapp\\.com/.test(url)) {
                  e.preventDefault();
                  if (typeof window.gtag === 'function') {
                    window.gtag('event', 'conversion', {
                      'send_to': 'AW-723199533/HMUhCLKtn5McEK3M7NgC'
                    });
                  }
                  if (typeof window.fbq === 'function') {
                    window.fbq('track', 'Lead');
                  }
                  setTimeout(function() {
                    window.location.href = url;
                  }, 300);
                }
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
