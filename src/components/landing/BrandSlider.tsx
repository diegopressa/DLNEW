"use client";

import React from "react";
import Image from "next/image";

interface Brand {
    id: number;
    name: string;
    imageUrl: string;
}

interface BrandSliderProps {
    brands: Brand[];
}

export default function BrandSlider({ brands }: BrandSliderProps) {
    if (brands.length === 0) return null;

    // Duplicamos las marcas varias veces para asegurar que el marquee siempre tenga contenido.
    // Solo el primer set lleva alt real; las copias se marcan como decorativas (aria-hidden) para
    // que un lector de pantalla no anuncie cada marca 4 veces.
    const sets = 4;
    const displayBrands = Array.from({ length: sets }).flatMap((_, setIndex) =>
        brands.map((brand) => ({ ...brand, _setIndex: setIndex }))
    );

    return (
        <div className="pt-10 sm:pt-14 pb-12 bg-white border-b border-slate-50 overflow-hidden relative">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
                <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito">
                    Empresas que confiaron en nosotros
                </h2>
            </div>
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="flex animate-marquee whitespace-nowrap gap-6 items-center">
                {displayBrands.map((brand, index) => {
                    const isFirstSet = brand._setIndex === 0;
                    return (
                        <div
                            key={`${brand.id}-${index}`}
                            className="flex-shrink-0 hover:scale-110 transition-all duration-500 px-2 relative h-14 md:h-20 w-[130px] md:w-[170px]"
                            aria-hidden={isFirstSet ? undefined : true}
                        >
                            <Image
                                src={brand.imageUrl}
                                alt={isFirstSet ? `Logo ${brand.name}` : ""}
                                fill
                                className="object-contain"
                                sizes="170px"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
