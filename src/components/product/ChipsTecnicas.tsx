"use client";

import { useEffect, useRef, useState } from "react";

// Chips "Estampado" / "Bordado" con globo explicativo.
// Se abre al pasar el mouse (desktop) o al tocarlo (celular).
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
    // El globo se ancla al PRINCIPIO del grupo de chips (no al chip), así nunca
    // se sale del borde de la tarjeta; la colita sí apunta al chip abierto.
    const [ancla, setAncla] = useState<{ corrimiento: number; centro: number; maxAncho?: number }>({
        corrimiento: 0,
        centro: 20,
    });
    const contenedor = useRef<HTMLDivElement>(null);
    const chips = useRef<Record<string, HTMLDivElement | null>>({});

    const anclarAlGrupo = direccion === "fila" && alineacion === "izquierda";
    const ultimoPuntero = useRef<string>("mouse");

    const abrir = (t: Tecnica) => {
        const grupo = contenedor.current;
        const chip = chips.current[t];
        if (anclarAlGrupo && grupo && chip) {
            const g = grupo.getBoundingClientRect();
            const c = chip.getBoundingClientRect();
            const corrimiento = c.left - g.left;
            // Ancho máximo = lo que hay desde el inicio del grupo hasta el borde
            // derecho de la foto/tarjeta. Así el globo nunca queda cortado.
            const padre = grupo.offsetParent as HTMLElement | null;
            const maxAncho = padre
                ? Math.max(180, padre.getBoundingClientRect().right - g.left - 12)
                : undefined;
            setAncla({ corrimiento, centro: corrimiento + c.width / 2, maxAncho });
        }
        setAbierto(t);
    };

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
                // La colita nunca se sale de los bordes del globo
                const anchoGlobo = Math.min(256, ancla.maxAncho ?? 256);
                const colita = Math.max(10, Math.min(ancla.centro - 5, anchoGlobo - 20));
                return (
                    <div
                        key={t}
                        ref={(el) => { chips.current[t] = el; }}
                        className="relative"
                        // Con mouse alcanza con pasar por arriba; en celular, tocar.
                        onPointerEnter={(e) => { if (e.pointerType === "mouse") abrir(t); }}
                        onPointerLeave={(e) => { if (e.pointerType === "mouse") setAbierto(null); }}
                    >
                        <button
                            type="button"
                            aria-expanded={activo}
                            aria-label={`Qué es ${INFO[t].etiqueta}`}
                            onPointerDown={(e) => { ultimoPuntero.current = e.pointerType; }}
                            onClick={() => {
                                // Con mouse manda el hover; con el dedo, el toque alterna.
                                // Siempre por abrir(), que es quien calcula dónde va el globo.
                                if (activo && ultimoPuntero.current !== "mouse") setAbierto(null);
                                else abrir(t);
                            }}
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
                                // El padding (en vez de margen) hace de puente para que el
                                // globo no se cierre al mover el mouse del chip al globo.
                                style={anclarAlGrupo ? { left: -ancla.corrimiento } : undefined}
                                className={`absolute z-40 animate-globo ${
                                    posicion === "arriba" ? "bottom-full pb-2.5" : "top-full pt-2.5"
                                } ${anclarAlGrupo ? "" : alineacion === "derecha" ? "right-0" : "left-0"}`}
                            >
                                <div
                                    style={anclarAlGrupo && ancla.maxAncho ? { maxWidth: ancla.maxAncho } : undefined}
                                    className="relative w-[min(16rem,72vw)] rounded-lg bg-grafito shadow-xl px-3.5 py-3"
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary mb-1">
                                        {INFO[t].etiqueta}
                                    </p>
                                    <p className="text-[12.5px] leading-snug text-slate-100 normal-case tracking-normal font-normal">
                                        {INFO[t].texto}
                                    </p>
                                    {/* colita: apunta al chip abierto */}
                                    <span
                                        aria-hidden
                                        style={anclarAlGrupo ? { left: colita } : undefined}
                                        className={`absolute w-2.5 h-2.5 bg-grafito rotate-45 ${
                                            posicion === "arriba" ? "-bottom-1" : "-top-1"
                                        } ${anclarAlGrupo ? "" : alineacion === "derecha" ? "right-5" : "left-5"}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
