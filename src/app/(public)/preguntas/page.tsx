import FAQ from "@/components/landing/FAQ";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Preguntas Frecuentes | DL Diseño & Estampado",
        description: "Respondemos las dudas más comunes sobre pedidos mínimos, tiempos de entrega, formatos de diseño y más."
    };
}

export default function PreguntasPage() {
    return (
        <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
            <FAQ />
        </div>
    );
}
