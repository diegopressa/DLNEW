import Link from "next/link";
import { Plus } from "lucide-react";
import { getFaqItems } from "@/actions/faqActions";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | DL Diseño & Estampado",
    description: "Respondemos las dudas más comunes sobre pedidos mínimos, tiempos de entrega, formatos de diseño y más."
};

export default async function PreguntasPage() {
    const faqItems = ((await getFaqItems()) as any[]) || [];

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item: any) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <div className="bg-white min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <div className="max-w-[840px] mx-auto px-4 sm:px-6">
                <header className="pt-10 sm:pt-14 pb-8 sm:pb-10">
                    <h1 className="font-display uppercase leading-none text-5xl sm:text-6xl text-grafito">
                        Preguntas frecuentes
                    </h1>
                    <p className="mt-3 text-slate-600 max-w-[62ch]">
                        Mínimos, formatos del logo, envíos, plazos y pagos. Si tu duda no está acá, escribinos y te respondemos.
                    </p>
                </header>

                <div className="pb-8 border-t border-slate-200">
                    {faqItems.map((f: any) => (
                        <details key={f.id} className="group/item border-b border-slate-200">
                            <summary className="list-none cursor-pointer flex justify-between items-center gap-4 py-5 font-bold text-[15px] text-grafito [&::-webkit-details-marker]:hidden">
                                {f.question}
                                <Plus className="w-5 h-5 shrink-0 text-primary group-open/item:rotate-45 transition-transform" />
                            </summary>
                            <p className="pb-5 text-[15px] text-slate-600 max-w-[70ch] leading-relaxed">{f.answer}</p>
                        </details>
                    ))}
                </div>

                <p className="pb-14 text-slate-600">
                    ¿Tenés otra pregunta?{" "}
                    <Link href="/contacto" className="font-bold text-grafito border-b-2 border-primary pb-0.5 hover:text-primary transition-colors">
                        Contactanos
                    </Link>{" "}
                    y te respondemos.
                </p>
            </div>
            <AdminEditButtonGate href="/admin/faq" label="Editar Preguntas" />
        </div>
    );
}
