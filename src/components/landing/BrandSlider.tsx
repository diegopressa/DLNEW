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
        <div className="py-12 bg-white border-y border-slate-50 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            
            <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
                {displayBrands.map((brand, index) => (
                    <div 
                        key={`${brand.id}-${index}`} 
                        className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    >
                        <img 
                            src={brand.imageUrl} 
                            alt={brand.name} 
                            className="h-10 md:h-12 w-auto object-contain max-w-[140px]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
