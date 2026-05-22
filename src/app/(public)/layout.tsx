import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { getGlobalSettings } from "@/actions/settingsActions";
import { getCategories } from "@/actions/categoryActions";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings: any = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59897534866";

    const dbCategories = await getCategories();
    const navCategories = dbCategories.map((c: any) => ({
        name: c.name,
        href: `/categorias/lista-${c.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/\s+/g, "-")}`,
        image: c.imageUrl,
    }));
    const phone = settings?.phone || "59829250584";
    const email = settings?.email || "info@dldiseno.uy";
    const address = settings?.address || "Montevideo, Uruguay";

    const sameAs = [settings?.facebookUrl, settings?.instagramUrl].filter(Boolean);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://dldisenoyestampado.uy/#localbusiness",
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
        areaServed: [
            { "@type": "Country", name: "Uruguay" },
            { "@type": "AdministrativeArea", name: "Montevideo" },
            { "@type": "AdministrativeArea", name: "Canelones" },
            { "@type": "AdministrativeArea", name: "Maldonado" },
        ],
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
        },
        priceRange: "$$",
        image: "https://dldisenoyestampado.uy/og-image.jpg",
        logo: "https://dldisenoyestampado.uy/logo.png",
        sameAs,
    };

    const organizationJsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://dldisenoyestampado.uy/#organization",
        name: "DL Diseño & Estampado",
        url: "https://dldisenoyestampado.uy",
        logo: "https://dldisenoyestampado.uy/logo.png",
        contactPoint: {
            "@type": "ContactPoint",
            telephone: `+${phone}`,
            contactType: "customer service",
            areaServed: "UY",
            availableLanguage: "es",
        },
        sameAs,
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <Navbar whatsapp={whatsapp} categories={navCategories} logoUrl={settings?.logoUrl} />
            <main className="flex-grow">{children}</main>
            <Footer settings={settings} />
            <FloatingWhatsApp whatsapp={whatsapp} />
        </div>
    );
}
