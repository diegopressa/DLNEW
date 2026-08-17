import { MessageCircle, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getGlobalSettings } from "@/actions/settingsActions";

// Hero estilo workwear: foto de fondo con titular condensado gigante.
export default async function Hero() {
    const [data, settings, images] = await Promise.all([
        prisma.heroSection.findUnique({ where: { id: 1 } }),
        getGlobalSettings(),
        (prisma as any).heroImage.findMany({
            where: { heroId: 1 },
            orderBy: { order: "asc" }
        }).catch(() => [] as any[]) as Promise<any[]>,
    ]);
    const whatsapp = settings?.whatsapp || "59897534866";

    const hero = {
        title: data?.title || "El uniforme de tu equipo, resuelto",
        subtitle: data?.subtitle || "Prenda + logo + entrega en 24–48 Hs. Un solo proveedor para uniformar a tu empresa.",
        ctaPrimary: data?.ctaPrimary || "Pedir presupuesto por WhatsApp",
        bgImage: images[0]?.url as string | undefined,
        minOrderText: data?.minOrderText || "",
    };

    // Barra de confianza: se edita en /admin/home. Vacío = no se muestra.
    const stats = [data?.trustStat1, data?.trustStat2, data?.trustStat3].filter(
        (t): t is string => !!t && !!t.trim()
    );

    return (
        <section className="relative bg-grafito overflow-hidden">
            {hero.bgImage && (
                <Image
                    src={hero.bgImage}
                    alt=""
                    fill
                    priority
                    className="object-cover opacity-45"
                    sizes="100vw"
                />
            )}
            <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="max-w-[640px] py-16 sm:py-24 lg:py-32 text-white">
                    <span className="inline-block bg-primary text-white font-bold text-[11px] sm:text-xs uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm mb-5">
                        Uniformes para empresas · Uruguay
                    </span>
                    <h1 className="font-display uppercase leading-[0.98] text-5xl sm:text-6xl lg:text-[4.6rem] text-white">
                        {hero.title}
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-[46ch]">
                        {hero.subtitle}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
                        <Link
                            href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`}
                            target="_blank"
                            className="bg-primary text-white px-7 py-4 rounded-md font-bold uppercase tracking-wide text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2.5"
                        >
                            {hero.ctaPrimary}
                            <MessageCircle className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/trabajos"
                            className="border-2 border-white text-white px-7 py-4 rounded-md font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors flex items-center justify-center"
                        >
                            Ver trabajos
                        </Link>
                    </div>

                    {hero.minOrderText && (
                        <p className="mt-6 text-[13px] sm:text-sm text-slate-300">{hero.minOrderText}</p>
                    )}

                    {stats.length > 0 && (
                        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-4">
                            {stats.map((s) => (
                                <li key={s} className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-200">
                                    <Check className="w-4 h-4 text-primary shrink-0" strokeWidth={3} />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}
