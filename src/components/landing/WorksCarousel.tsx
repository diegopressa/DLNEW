"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
    id: number;
    title: string;
    category?: string | null;
    imageUrl: string;
}

interface WorksCarouselProps {
    works: Project[];
}

export default function WorksCarousel({ works }: WorksCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [isHovered, setIsHovered] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener("scroll", checkScroll);
            checkScroll();
            window.addEventListener("resize", checkScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener("scroll", checkScroll);
            }
            window.removeEventListener("resize", checkScroll);
        };
    }, [works]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const firstChild = container.firstElementChild as HTMLElement;
            if (!firstChild) return;
            
            // Calculamos el ancho de un ítem más el gap (gap-6 = 24px)
            const itemWidth = firstChild.offsetWidth + 24; 
            const { clientWidth, scrollLeft, scrollWidth } = container;
            
            if (direction === "right") {
                // Si estamos cerca del final, volver al principio
                if (scrollLeft + clientWidth >= scrollWidth - 20) {
                    container.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    container.scrollBy({ left: itemWidth, behavior: "smooth" });
                }
            } else {
                container.scrollBy({ left: -itemWidth, behavior: "smooth" });
            }
        }
    };

    // AutoPlay effect
    useEffect(() => {
        if (works.length <= 4 || isHovered) return;

        const interval = setInterval(() => {
            scroll("right");
        }, 5000);

        return () => clearInterval(interval);
    }, [works.length, isHovered]);

    return (
        <div 
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Botones de navegación (solo visibles si hay scroll) */}
            {works.length > 4 && (
                <>
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-900 transition-all hover:scale-110 active:scale-95 disabled:opacity-0 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
                        aria-label="Anterior"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-900 transition-all hover:scale-110 active:scale-95 disabled:opacity-0 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
                        aria-label="Siguiente"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Contenedor del Scroll */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {works.map((work) => (
                    <div 
                        key={work.id} 
                        className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start space-y-4"
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-sm bg-slate-100 border border-slate-100">
                            <img
                                src={work.imageUrl}
                                alt={work.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                        <div className="px-2">
                            <h4 className="font-bold text-slate-900 text-lg leading-tight">{work.title}</h4>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{work.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
