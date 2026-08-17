import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";
import { getPrivacyPolicy } from "@/actions/privacyActions";
import { getGlobalSettings } from "@/actions/settingsActions";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/politicas-de-privacidad", {
        title: "Políticas de Privacidad | DL Diseño & Estampado",
        description:
            "Cómo tratamos los datos personales de quienes nos consultan: qué información pedimos, para qué la usamos y cómo pedir su baja o rectificación.",
    });
}

type Seccion = { num: string; titulo: string; parrafos: string[]; ancla: string };

// El texto legal se carga desde /admin como un bloque plano. Acá lo separamos en
// secciones ("1.- ANTECEDENTES") y en párrafos legibles, sin tocar el contenido.
function partirEnParrafos(texto: string, porGrupo = 3): string[] {
    const oraciones = texto.split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ¿«"“])/);
    const salida: string[] = [];
    for (let i = 0; i < oraciones.length; i += porGrupo) {
        salida.push(oraciones.slice(i, i + porGrupo).join(" "));
    }
    return salida;
}

function parsearPolitica(contenido: string) {
    const intro: string[] = [];
    const secciones: Seccion[] = [];
    let actual: Seccion | null = null;

    for (const linea of contenido.split(/\r?\n/)) {
        const l = linea.trim();
        if (!l) continue;

        const m = l.match(/^(\d{1,2})\s*\.?\s*-\s*(.+?)\.?$/);
        if (m && m[2].length <= 80) {
            actual = {
                num: m[1],
                titulo: m[2].trim(),
                parrafos: [],
                ancla: `seccion-${m[1]}`,
            };
            secciones.push(actual);
            continue;
        }

        if (actual) actual.parrafos.push(...partirEnParrafos(l));
        else intro.push(...partirEnParrafos(l));
    }

    return { intro, secciones };
}

export default async function PrivacyPolicyPage() {
    const policy = await getPrivacyPolicy();
    if (!policy) return null;

    const settings = (await getGlobalSettings()) as any;
    const email = settings?.email || "contacto@dldisenoyestampado.uy";
    const { intro, secciones } = parsearPolitica(policy.content);
    const actualizado = new Date(policy.updatedAt).toLocaleDateString("es-UY", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1040px] mx-auto px-4 sm:px-6">
                {/* Encabezado */}
                <header className="pt-10 sm:pt-14 pb-8 border-b border-slate-200">
                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        <ShieldCheck className="w-4 h-4" />
                        Información legal
                    </div>
                    <h1 className="mt-3 font-display uppercase leading-none text-5xl sm:text-6xl text-grafito">
                        {policy.title}
                    </h1>
                    <p className="mt-3 text-slate-600 max-w-[62ch]">
                        Condiciones de uso del sitio y tratamiento de datos personales de DL Diseño &amp;
                        Estampado (Diego Horacio Presa Berrondo), conforme a la Ley N.º 18.331 de Uruguay.
                    </p>
                    <p className="mt-4 text-[13px] text-slate-400">Última actualización: {actualizado}</p>
                </header>

                <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-14">
                    {/* Índice */}
                    <nav aria-label="Índice" className="py-8 lg:py-12">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-4">
                            En esta página
                        </p>
                        <ul className="flex flex-wrap gap-2 lg:block lg:sticky lg:top-28 lg:space-y-1">
                            {secciones.map((s) => (
                                <li key={s.ancla}>
                                    <a
                                        href={`#${s.ancla}`}
                                        className="block rounded-full lg:rounded-none border border-slate-200 lg:border-0 lg:border-l-2 lg:border-slate-200 px-3 py-1.5 lg:pl-3 lg:py-1.5 text-[13px] font-semibold text-slate-500 hover:text-primary hover:border-primary transition-colors"
                                    >
                                        <span className="text-primary font-bold mr-1.5 tabular-nums">{s.num}.</span>
                                        <span className="first-letter:uppercase">{s.titulo.toLowerCase()}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contenido */}
                    <div className="pb-4 lg:py-12">
                        {intro.map((p, i) => (
                            <p key={`intro-${i}`} className="text-[15px] leading-[1.85] text-slate-600 max-w-[70ch] mb-4">
                                {p}
                            </p>
                        ))}

                        {secciones.map((s) => (
                            <section key={s.ancla} id={s.ancla} className="scroll-mt-28 pt-8 first:pt-0">
                                <h2 className="flex items-baseline gap-3 font-display uppercase leading-none text-2xl sm:text-3xl text-grafito">
                                    <span className="text-primary tabular-nums">{s.num}</span>
                                    <span>{s.titulo}</span>
                                </h2>
                                <div className="mt-4 space-y-4 border-l-2 border-slate-100 pl-5">
                                    {s.parrafos.map((p, i) => (
                                        <p key={i} className="text-[15px] leading-[1.85] text-slate-600 max-w-[70ch]">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            </section>
                        ))}

                        {/* Cierre: a dónde escribir */}
                        <div className="mt-12 mb-16 rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
                            <h2 className="font-display uppercase leading-none text-2xl text-grafito">
                                Ejercé tus derechos
                            </h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 max-w-[62ch]">
                                Podés pedir el acceso, la rectificación o la eliminación de tus datos cuando quieras.
                                Escribinos y lo resolvemos.
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <a
                                    href={`mailto:${email}`}
                                    className="inline-flex items-center gap-2 bg-grafito text-white font-bold text-[14px] px-5 py-3 rounded-full hover:bg-primary transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    {email}
                                </a>
                                <Link
                                    href="/contacto"
                                    className="inline-flex items-center text-[14px] font-bold text-grafito border-b-2 border-primary pb-0.5 hover:text-primary transition-colors"
                                >
                                    Ir a Contacto
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdminEditButtonGate href="/admin/politicas-de-privacidad" label="Editar Políticas" />
        </div>
    );
}
