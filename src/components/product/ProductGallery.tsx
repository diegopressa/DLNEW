"use client";

import { useState } from "react";
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
                <img
                    src={images[selectedIndex]}
                    alt="Producto"
                    className="w-full h-full object-cover transition-all duration-500"
                />
                {/* Zoom Button */}
                <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm shadow-lg p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 border border-slate-100"
                    aria-label="Ver imagen ampliada"
                >
                    <ZoomIn className="w-5 h-5 text-slate-700" />
                </button>

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-slate-100 z-10"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-slate-100 z-10"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-700" />
                        </button>
                    </>
                )}

                {/* Customization Badges Overlay */}
                {(hasScreenPrint || hasEmbroidery) && (
                    <div className="absolute top-20 right-4 sm:right-6 z-20 animate-in fade-in slide-in-from-right-4 duration-500 origin-top-right scale-90 sm:scale-100">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none mb-1">
                                    Personalización
                                </span>
                                <div className="flex flex-col gap-2">
                                    {hasScreenPrint && (
                                        <div className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg shadow-emerald-300/30">
                                            <span className="text-xs">🎨</span>
                                            <span className="text-[10px] font-black uppercase tracking-wider">Estampado</span>
                                        </div>
                                    )}
                                    {hasEmbroidery && (
                                        <div className="flex items-center gap-2 bg-violet-500 text-white px-3 py-1.5 rounded-full shadow-lg shadow-violet-300/30">
                                            <span className="text-xs">🧵</span>
                                            <span className="text-[10px] font-black uppercase tracking-wider">Bordado</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Vertical dashed line on the right */}
                            <div className="h-12 border-r-2 border-dashed border-slate-300/50" />
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
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            i === selectedIndex
                                ? "border-primary shadow-md shadow-primary/20 scale-105"
                                : "border-slate-200 hover:border-primary/40 opacity-70 hover:opacity-100"
                        }`}
                    >
                        <img src={src} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
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
