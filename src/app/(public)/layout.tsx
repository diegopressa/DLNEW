import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { getGlobalSettings } from "@/actions/settingsActions";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59897534866";
    const phone = settings?.phone || "59829250584";
    const email = settings?.email || "info@dldiseno.uy";
    const address = settings?.address || "Montevideo, Uruguay";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "DL Diseño & Estampado",
        description: "Uniformes personalizados para empresas. Estampado, bordado y entrega en todo Uruguay.",
        url: "https://dldisenoyestampado.uy",
        telephone: `+${phone}`,
        email: email,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Montevideo",
            addressCountry: "UY",
            streetAddress: address,
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: -34.9011,
            longitude: -56.1645,
        },
        areaServed: {
            "@type": "Country",
            name: "Uruguay",
        },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
        },
        priceRange: "$$",
        image: "https://dldisenoyestampado.uy/favicon.png",
        sameAs: [],
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar whatsapp={whatsapp} />
            <main className="flex-grow">{children}</main>
            <Footer settings={settings} />
            <FloatingWhatsApp whatsapp={whatsapp} />
        </div>
    );
}
