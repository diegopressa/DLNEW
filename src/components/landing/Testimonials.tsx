"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
    id: number;
    name: string;
    company: string;
    role?: string;
    content: string;
    imageUrl?: string;
}

interface Props {
    items: Testimonial[];
}

export default function Testimonials({ items }: Props) {
    const [current, setCurrent] = useState(0);

    if (!items || items.length === 0) return null;

    const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

    const t = items[current];

    return (
        <section className="py-20 bg-slate-50">
            <div className="section-container">
                <div className="text-center mb-12">
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">Lo que dicen nuestros clientes</p>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Empresas que confiaron en DL</h2>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-10 md:p-14 relative border border-slate-100">
                        <Quote className="text-primary/20 absolute top-8 left-8" size={48} />

                        <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-10 relative z-10">
                            &ldquo;{t.content}&rdquo;
                        </p>

                        <div className="flex items-center gap-4">
                            {t.imageUrl ? (
                                <img
                                    src={t.imageUrl}
                                    alt={t.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-black text-xl flex items-center justify-center shrink-0 border-2 border-primary/20">
                                    {t.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-black text-slate-900">{t.name}</p>
                                <p className="text-sm text-slate-500 font-medium">
                                    {t.role ? `${t.role} · ` : ""}{t.company}
                                </p>
                            </div>
                        </div>
                    </div>

                    {items.length > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={prev}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-primary/30 transition-all shadow-sm"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2">
                                {items.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-slate-300"}`}
                                        aria-label={`Ir al testimonio ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={next}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-primary/30 transition-all shadow-sm"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
