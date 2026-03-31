import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
              gtag('js', new Date());
              gtag('config', 'AW-723199533');

              // WhatsApp Conversion Tracking
              document.addEventListener('click', function(e) {
                var t = e.target.closest('a');
                if (t && (t.href.includes('wa.me') || t.href.includes('api.whatsapp.com'))) {
                  gtag('event', 'conversion', {
                    'send_to': 'AW-723199533/Kt0oCP6qlZMcEK3M7NgC'
                  });
                }
              }, { passive: true });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
