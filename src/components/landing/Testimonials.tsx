"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

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
    const [page, setPage] = useState(0);

    if (!items || items.length === 0) return null;

    // Calculate items per page based on total items
    // On mobile always 1, tablet 2, desktop 3
    // We use the max (3) for pagination math, CSS handles visibility
    const perPage = 3;
    const totalPages = Math.ceil(items.length / perPage);

    const prev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
    const next = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

    // Get current page items (always grab up to 3)
    const startIdx = page * perPage;
    const pageItems = items.slice(startIdx, startIdx + perPage);

    return (
        <section className="py-20 bg-slate-50">
            <div className="section-container">
                <div className="text-center mb-12">
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">Lo que dicen nuestros clientes</p>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Empresas que confiaron en DL</h2>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pageItems.map((t) => (
                            <div
                                key={t.id}
                                className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 relative border border-slate-100 flex flex-col justify-between"
                            >
                                <div>
                                    <Quote className="text-primary/15 mb-4" size={32} />

                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>

                                    <p className="text-slate-700 font-medium leading-relaxed mb-6">
                                        &ldquo;{t.content}&rdquo;
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    {t.imageUrl ? (
                                        <img
                                            src={t.imageUrl}
                                            alt={t.name}
                                            className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0 border-2 border-primary/20">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {t.role ? `${t.role} · ` : ""}{t.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <button
                                onClick={prev}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-primary/30 transition-all shadow-sm"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === page ? "bg-primary w-6" : "bg-slate-300"}`}
                                        aria-label={`Página ${i + 1}`}
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
