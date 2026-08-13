import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";
import { getFaqItems } from "@/actions/faqActions";

// FAQ compacto para la home: un bloque cerrado que invita a desplegar.
// Recién al abrirlo aparecen las primeras 4 preguntas del admin.
export default async function FAQTeaser() {
    const items = (((await getFaqItems()) as any[]) || []).slice(0, 4);
    if (items.length === 0) return null;

    return (
        <section className="bg-white py-14 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <details className="group border border-slate-200 rounded-md hover:border-primary/40 transition-colors">
                    <summary className="list-none cursor-pointer flex items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                        <div>
                            <h2 className="font-display uppercase text-3xl sm:text-4xl text-grafito">
                                ¿Tenés dudas antes de pedir?
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 font-medium">
                                Mínimos, formatos del logo, envíos y plazos — desplegá y resolvelas en un minuto.
                            </p>
                        </div>
                        <span className="shrink-0 w-11 h-11 rounded-md bg-primary text-white grid place-items-center group-open:rotate-180 transition-transform">
                            <ChevronDown className="w-5 h-5" />
                        </span>
                    </summary>

                    <div className="border-t border-slate-200 px-5 sm:px-6 pb-6">
                        {items.map((f: any) => (
                            <details key={f.id} className="group/item border-b border-slate-100 last:border-b-0">
                                <summary className="list-none cursor-pointer flex justify-between items-center gap-4 py-4 font-bold text-[15px] text-grafito [&::-webkit-details-marker]:hidden">
                                    {f.question}
                                    <Plus className="w-5 h-5 shrink-0 text-primary group-open/item:rotate-45 transition-transform" />
                                </summary>
                                <p className="pb-4 text-sm text-slate-600 max-w-[70ch] leading-relaxed">{f.answer}</p>
                            </details>
                        ))}
                        <div className="pt-5">
                            <Link
                                href="/preguntas"
                                className="font-bold text-sm text-grafito border-b-2 border-primary pb-0.5 hover:text-primary transition-colors"
                            >
                                Ver todas las preguntas →
                            </Link>
                        </div>
                    </div>
                </details>
            </div>
        </section>
    );
}
