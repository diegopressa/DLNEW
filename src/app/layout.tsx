import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DL Diseño & Estampado | Uniformes Personalizados para Empresas",
  description: "Nos encargamos de todo: prenda, estampado y entrega. Presupuesto inmediato y entrega en 24-48 horas. Uniformes en Montevideo, Canelones y Maldonado.",
  keywords: ["uniformes para empresas", "uniformes personalizados", "ropa de trabajo", "estampados uruguay"],
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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-723199533"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', 'AW-723199533');

              // WhatsApp Conversion Tracking with Delay
              document.addEventListener('click', function(e) {
                var el = e.target.closest('a, button');
                if (el) {
                  var url = el.href || (el.getAttribute && el.getAttribute('href')) || '';
                  if (/wa\.me|api\.whatsapp\.com/.test(url)) {
                    e.preventDefault();
                    if (typeof window.gtag === 'function') {
                      window.gtag('event', 'conversion', {
                        'send_to': 'AW-723199533/HMUhCLKtn5McEK3M7NgC'
                      });
                    }
                    setTimeout(function() {
                      window.location.href = url;
                    }, 300);
                  }
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
