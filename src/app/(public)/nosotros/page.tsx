import React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { getAboutUs } from "@/actions/aboutActions";
import { getGlobalSettings } from "@/actions/settingsActions";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/nosotros");
}

export default async function NosotrosPage() {
    const [about, settings] = await Promise.all([
        getAboutUs(),
        getGlobalSettings(),
    ]);

    if (!about) return null;

    const whatsapp = (settings as any)?.whatsapp || "59897534866";
    const waUrl = `https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 lg:gap-14 items-start">
                    <div>
                        <h1 className="font-display uppercase leading-none text-5xl sm:text-6xl lg:text-7xl text-grafito">
                            {about.title}
                        </h1>

                        <p className="mt-6 text-slate-600 leading-relaxed whitespace-pre-line max-w-[62ch]">
                            {about.content}
                        </p>

                        <div className="mt-8 pt-6 grid grid-cols-2 gap-6 border-t border-slate-200 max-w-md">
                            <div>
                                <p className="font-display text-5xl text-primary">{(about as any).stat1Value || "+10"}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mt-1">{(about as any).stat1Label || "Años de experiencia"}</p>
                            </div>
                            <div>
                                <p className="font-display text-5xl text-primary">{(about as any).stat2Value || "+500"}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mt-1">{(about as any).stat2Label || "Empresas confían"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-slate-200">
                        <Image
                            src={about.imageUrl || "/logo.png"}
                            alt="Sobre DL Diseño & Estampado"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>

            {/* ── CTA de cierre ── */}
            <section className="bg-primary text-white">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-wrap items-center justify-between gap-7">
                    <div>
                        <h2 className="font-display uppercase text-4xl sm:text-5xl text-white">
                            Ahora que sabés quiénes somos…
                        </h2>
                        <p className="mt-2 text-white/90 font-medium max-w-[46ch]">
                            Escribinos, estamos para ayudarte a uniformar a tu equipo.
                        </p>
                    </div>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-grafito text-white px-7 py-4 rounded-md font-bold uppercase tracking-wide text-sm hover:bg-black transition-colors flex items-center gap-2.5"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contactar por WhatsApp
                    </a>
                </div>
            </section>

            <AdminEditButtonGate href="/admin/nosotros" label="Editar Nosotros" />
        </div>
    );
}
