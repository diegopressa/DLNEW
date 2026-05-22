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
        <div className="pt-4 pb-16 bg-white border-b border-slate-50 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
                {displayBrands.map((brand, index) => {
                    const isFirstSet = brand._setIndex === 0;
                    return (
                        <div
                            key={`${brand.id}-${index}`}
                            className="flex-shrink-0 hover:scale-110 transition-all duration-500 px-4 relative h-20 md:h-28 w-[180px] md:w-[240px]"
                            aria-hidden={isFirstSet ? undefined : true}
                        >
                            <Image
                                src={brand.imageUrl}
                                alt={isFirstSet ? `Logo ${brand.name}` : ""}
                                fill
                                className="object-contain"
                                sizes="240px"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
