"use client";

import { useState } from "react";

interface ColorItem {
    name: string;
    hex: string;
}

interface ColorSwatchesProps {
    colors: any[]; // Support both direct Color and ProductColor pivot
}

export default function ColorSwatches({ colors }: ColorSwatchesProps) {
    const [selected, setSelected] = useState(0);

    // Flatten logic handles the pivot table: [{ color: { name, hex } }] OR [{ name, hex }]
    const normalizedColors = colors.map(c => c.color ? c.color : c) as ColorItem[];

    if (!normalizedColors || normalizedColors.length === 0) return null;

    return (
        <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Colores disponibles 
                <span className="ml-2 text-primary font-bold normal-case tracking-normal">
                    — {normalizedColors[selected]?.name}
                </span>
            </p>
            <div className="flex flex-wrap gap-3">
                {normalizedColors.map((color, i) => (
                    <button
                        key={i}
                        title={color.name}
                        onClick={() => setSelected(i)}
                        className={`w-9 h-9 rounded-full transition-all duration-200 border ${
                            i === selected
                                ? "scale-125 border-primary shadow-lg shadow-primary/30 ring-2 ring-white ring-offset-1"
                                : "border-slate-300 hover:scale-110 hover:border-slate-400 shadow-sm"
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
