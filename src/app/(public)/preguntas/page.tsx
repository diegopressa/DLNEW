import FAQ from "@/components/landing/FAQ";
import { getFaqItems } from "@/actions/faqActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preguntas Frecuentes | DL Diseño & Estampado",
    description: "Respondemos las dudas más comunes sobre pedidos mínimos, tiempos de entrega, formatos de diseño y más."
};

export default async function PreguntasPage() {
    const faqItems = await getFaqItems();

    return (
        <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
            <FAQ items={faqItems} />
        </div>
    );
}
