"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    hasScreenPrint?: boolean;
    hasEmbroidery?: boolean;
}

export default function ProductGallery({ images, hasScreenPrint, hasEmbroidery }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const prev = () => setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    return (
        <>
            {/* Main Image */}
            <div className="relative group rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm aspect-square">
                <Image
                    src={images[selectedIndex]}
                    alt="Producto"
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                />
                {/* Zoom Button */}
                <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm shadow-lg p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 border border-slate-100 z-30"
                    aria-label="Ver imagen ampliada"
                >
                    <ZoomIn className="w-5 h-5 text-slate-700" />
                </button>

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 bottom-4 bg-white shadow-xl p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-slate-100 z-30"
                        >
                            <ChevronLeft className="w-6 h-6 text-slate-900" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 bottom-4 bg-white shadow-xl p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-slate-100 z-30"
                        >
                            <ChevronRight className="w-6 h-6 text-slate-900" />
                        </button>
                    </>
                )}

                {(hasScreenPrint || hasEmbroidery) && (
                    <div className="absolute top-4 right-4 sm:right-6 z-20 animate-in fade-in slide-in-from-right-4 duration-500 origin-top-right scale-[0.8] sm:scale-100">
                        <div className="flex flex-col items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
                                Personalización
                            </span>
                            <div className="flex flex-col gap-2 w-32">
                                {hasScreenPrint && (
                                    <div className="flex items-center justify-center gap-2 bg-[#10b981] text-white px-3 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 w-full">
                                        <span className="text-sm">🎨</span>
                                        <span className="text-[10px] font-black uppercase tracking-wider">Estampado</span>
                                    </div>
                                )}
                                {hasEmbroidery && (
                                    <div className="flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-3 py-2.5 rounded-2xl shadow-lg shadow-violet-500/20 w-full">
                                        <span className="text-sm">🧵</span>
                                        <span className="text-[10px] font-black uppercase tracking-wider">Bordado</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((src, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedIndex(i)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            i === selectedIndex
                                ? "border-primary shadow-md shadow-primary/20 scale-105"
                                : "border-slate-200 hover:border-primary/40 opacity-70 hover:opacity-100"
                        }`}
                    >
                        <Image src={src} alt={`Miniatura ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[selectedIndex]}
                            alt="Producto ampliado"
                            className="w-full h-full object-contain rounded-2xl max-h-[85vh]"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-sm transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-sm transition-all"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm transition-all"
                        >
                            Cerrar ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
