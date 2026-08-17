"use client";

import { useEffect, useRef, useState } from "react";

// Chips "Estampado" / "Bordado" con globo explicativo al tocarlos.
// Se usa en la tarjeta de categoría, en la foto grande y en la ficha del artículo.

type Tecnica = "estampado" | "bordado";

const INFO: Record<Tecnica, { etiqueta: string; texto: string }> = {
    estampado: {
        etiqueta: "Estampado",
        texto: "Este artículo se puede personalizar con la técnica de estampado: tu logo impreso sobre la tela, ideal para diseños con varios colores.",
    },
    bordado: {
        etiqueta: "Bordado",
        texto: "Este artículo se puede personalizar con la técnica de bordado: tu logo cosido con hilo, con terminación premium y resistente a los lavados.",
    },
};

export default function ChipsTecnicas({
    hasScreenPrint,
    hasEmbroidery,
    variant = "foto",
    posicion = "arriba",
    alineacion = "izquierda",
    direccion = "fila",
    className = "",
}: {
    hasScreenPrint?: boolean;
    hasEmbroidery?: boolean;
    variant?: "foto" | "pildora";
    posicion?: "arriba" | "abajo";
    alineacion?: "izquierda" | "derecha";
    direccion?: "fila" | "columna";
    className?: string;
}) {
    const [abierto, setAbierto] = useState<Tecnica | null>(null);
    const contenedor = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!abierto) return;
        const afuera = (e: PointerEvent) => {
            if (!contenedor.current?.contains(e.target as Node)) setAbierto(null);
        };
        const escape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setAbierto(null);
        };
        document.addEventListener("pointerdown", afuera);
        document.addEventListener("keydown", escape);
        return () => {
            document.removeEventListener("pointerdown", afuera);
            document.removeEventListener("keydown", escape);
        };
    }, [abierto]);

    const tecnicas: Tecnica[] = [];
    if (hasScreenPrint) tecnicas.push("estampado");
    if (hasEmbroidery) tecnicas.push("bordado");
    if (tecnicas.length === 0) return null;

    const estiloChip =
        variant === "foto"
            ? "bg-white/95 text-grafito px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.06em] border border-slate-200 hover:bg-white"
            : "border-2 border-grafito rounded-full px-4 py-1.5 text-sm font-bold text-grafito hover:bg-grafito hover:text-white";

    return (
        <div
            ref={contenedor}
            // Los chips viven dentro de un <Link> en la grilla: frenamos el clic
            // para que abra el globo en vez de navegar a la ficha.
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            className={`flex ${direccion === "columna" ? "flex-col" : "flex-row"} ${
                alineacion === "derecha" ? "items-end" : "items-start"
            } gap-1.5 ${className}`}
        >
            {tecnicas.map((t) => {
                const activo = abierto === t;
                return (
                    <div key={t} className="relative">
                        <button
                            type="button"
                            aria-expanded={activo}
                            aria-label={`Qué es ${INFO[t].etiqueta}`}
                            onClick={() => setAbierto(activo ? null : t)}
                            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${estiloChip} ${
                                activo ? (variant === "foto" ? "ring-2 ring-primary" : "bg-grafito text-white") : ""
                            }`}
                        >
                            {INFO[t].etiqueta}
                            <span
                                aria-hidden
                                className={`grid place-items-center rounded-full border font-bold leading-none ${
                                    variant === "foto"
                                        ? "w-3 h-3 text-[8px] border-current opacity-50"
                                        : "w-4 h-4 text-[10px] border-current opacity-60"
                                }`}
                            >
                                ?
                            </span>
                        </button>

                        {activo && (
                            <div
                                role="tooltip"
                                className={`absolute z-40 w-[min(16rem,72vw)] rounded-lg bg-grafito text-white shadow-xl px-3.5 py-3 animate-globo ${
                                    posicion === "arriba" ? "bottom-full mb-2.5" : "top-full mt-2.5"
                                } ${alineacion === "derecha" ? "right-0" : "left-0"}`}
                            >
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary mb-1">
                                    {INFO[t].etiqueta}
                                </p>
                                <p className="text-[12.5px] leading-snug text-slate-100 normal-case tracking-normal font-normal">
                                    {INFO[t].texto}
                                </p>
                                {/* colita del globo */}
                                <span
                                    aria-hidden
                                    className={`absolute w-2.5 h-2.5 bg-grafito rotate-45 ${
                                        posicion === "arriba" ? "-bottom-1" : "-top-1"
                                    } ${alineacion === "derecha" ? "right-5" : "left-5"}`}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
