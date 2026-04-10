import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getGlobalSettings } from "@/actions/settingsActions";

import HeroCarousel from "./HeroCarousel";

export default async function Hero() {
    const data = await prisma.heroSection.findUnique({
        where: { id: 1 }
    });
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59897534866";

    // Consultamos las imágenes por separado para evitar errores si prisma generate no se completó
    let images: any[] = [];
    try {
        images = await (prisma as any).heroImage.findMany({
            where: { heroId: 1 },
            orderBy: { order: "asc" }
        });
    } catch (e) {
        console.error("HeroImage table not ready yet:", e);
    }

    const hero = {
        title: data?.title || "Uniformes personalizados para empresas",
        subtitle: data?.subtitle || "Nos encargamos de todo: prenda, estampado y entrega. Presupuesto inmediato y entrega en 24-48 horas.",
        ctaPrimary: data?.ctaPrimary || "Solicitar presupuesto por WhatsApp",
        minOrderText: (data as any)?.minOrderText || "Pedido mínimo: 10 unidades · Atendemos empresas, instituciones y eventos en todo Uruguay.",
        badgeLabel: (data as any)?.badgeLabel || "48h",
        badgeTitle: (data as any)?.badgeTitle || "Entrega Rápida",
        badgeSubtitle: (data as any)?.badgeSubtitle || "Desde 48h según volumen",
        trustStat1: (data as any)?.trustStat1 || "+500 empresas atendidas",
        trustStat2: (data as any)?.trustStat2 || "+10 años de experiencia",
        trustStat3: (data as any)?.trustStat3 || "Envíos a todo Uruguay",
        images: images
    };

    return (
        <section className="relative overflow-hidden pt-24 pb-8 lg:pt-32 lg:pb-10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-slate-50 opacity-50 skew-x-12 translate-x-1/4" />

            <div className="section-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-left duration-700">
                        <div className="w-fit inline-flex items-center gap-2.5 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[11px] font-bold border border-primary/20 uppercase tracking-widest">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            Soluciones para Empresas
                        </div>

                        <h1 className="heading-xl">
                            {hero.title}
                        </h1>

                        <p className="text-lead">
                            {hero.subtitle}
                        </p>

                        {hero.minOrderText && (
                            <p className="text-sm text-slate-500 font-medium">
                                {hero.minOrderText}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`}
                                target="_blank"
                                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group"
                            >
                                {hero.ctaPrimary}
                                <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </Link>

                            <Link
                                href="/trabajos"
                                className="bg-white text-slate-900 border-2 border-slate-100 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                Ver trabajos realizados
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Trust bar */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-slate-500">
                            <span className="font-semibold">{hero.trustStat1}</span>
                            <span className="hidden sm:block text-slate-200">|</span>
                            <span className="font-semibold">{hero.trustStat2}</span>
                            <span className="hidden sm:block text-slate-200">|</span>
                            <span className="font-semibold">{hero.trustStat3}</span>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-right duration-1000">
                        <HeroCarousel images={hero.images} />

                        {/* Trust Badges */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden sm:block">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 text-primary p-2 rounded-lg font-black text-xl border border-primary/20">
                                    {hero.badgeLabel}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{hero.badgeTitle}</p>
                                    <p className="text-xs text-slate-500">{hero.badgeSubtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
