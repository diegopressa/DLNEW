import FAQ from "@/components/landing/FAQ";
import { getFaqItems } from "@/actions/faqActions";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | DL Diseño & Estampado",
    description: "Respondemos las dudas más comunes sobre pedidos mínimos, tiempos de entrega, formatos de diseño y más."
};

export default async function PreguntasPage() {
    const faqItems = await getFaqItems();

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: (faqItems || []).map((item: any) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <FAQ items={faqItems} />
            <AdminEditButtonGate href="/admin/faq" label="Editar Preguntas" />
        </div>
    );
}
