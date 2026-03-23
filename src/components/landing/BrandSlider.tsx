"use client";

import React from "react";

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

    // Duplicamos las marcas varias veces para asegurar que el marquee siempre tenga contenido
    const displayBrands = [...brands, ...brands, ...brands, ...brands];

    return (
        <div className="pt-4 pb-16 bg-white border-b border-slate-50 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            
            <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
                {displayBrands.map((brand, index) => (
                    <div 
                        key={`${brand.id}-${index}`} 
                        className="flex-shrink-0 hover:scale-110 transition-all duration-500 px-4"
                    >
                        <img 
                            src={brand.imageUrl} 
                            alt={brand.name} 
                            className="h-20 md:h-28 w-auto object-contain max-w-[240px]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
