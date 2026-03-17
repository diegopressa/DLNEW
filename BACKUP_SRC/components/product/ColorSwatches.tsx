"use client";

import { useState } from "react";

interface Color {
    name: string;
    hex: string;
}

interface ColorSwatchesProps {
    colors: Color[];
}

export default function ColorSwatches({ colors }: ColorSwatchesProps) {
    const [selected, setSelected] = useState(0);

    return (
        <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Colores disponibles
                <span className="ml-2 text-primary font-bold normal-case tracking-normal">
                    — {colors[selected].name}
                </span>
            </p>
            <div className="flex flex-wrap gap-3">
                {colors.map((color, i) => (
                    <button
                        key={i}
                        title={color.name}
                        onClick={() => setSelected(i)}
                        className={`w-9 h-9 rounded-full transition-all duration-200 border-2 ${
                            i === selected
                                ? "scale-125 border-primary shadow-lg shadow-primary/30 ring-2 ring-white ring-offset-1"
                                : "border-white/80 hover:scale-110 hover:border-slate-300 shadow-sm"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={color.name}
                        aria-pressed={i === selected}
                    />
                ))}
            </div>
        </div>
    );
}
