import React from "react";
import Image from "next/image";
import { getAboutUs } from "@/actions/aboutActions";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/nosotros");
}

export default async function NosotrosPage() {
    const about = await getAboutUs();

    if (!about) return null;

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                                {about.title}
                            </h1>
                        </div>
                        
                        <div className="prose prose-lg prose-slate max-w-none">
                            <p className="text-xl text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                                {about.content}
                            </p>
                        </div>

                        <div className="pt-6 grid grid-cols-2 gap-6 border-t border-slate-100">
                            <div>
                                <p className="text-3xl font-black text-slate-900">{(about as any).stat1Value || "+10"}</p>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{(about as any).stat1Label || "Años de experiencia"}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-slate-900">{(about as any).stat2Value || "+500"}</p>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{(about as any).stat2Label || "Empresas confían"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-200">
                        <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl shadow-slate-200">
                            <Image
                                src={about.imageUrl || "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000"}
                                alt="Sobre Nosotros"
                                fill
                                className="object-cover transition-transform duration-1000 hover:scale-110"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        
                        {/* Decorative Badge */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                                    DL
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 leading-none">Diseño & Estampado</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Sello de calidad</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
