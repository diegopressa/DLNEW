"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroImage {
    id: number;
    url: string;
}

export default function HeroCarousel({ images }: { images: HeroImage[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-3xl shadow-2xl bg-slate-100 flex items-center justify-center">
                <Image
                    src="/hero-placeholder.jpg"
                    alt="DL Diseño & Estampado"
                    fill
                    className="object-cover opacity-50"
                />
            </div>
        );
    }

    return (
        <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-3xl shadow-2xl bg-slate-100">
            {images.map((img, index) => (
                <div
                    key={img.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <Image
                        src={img.url}
                        alt={`Hero Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                </div>
            ))}

            {/* Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
