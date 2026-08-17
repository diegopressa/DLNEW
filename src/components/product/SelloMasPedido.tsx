import { Star } from "lucide-react";

/**
 * Sello "El más pedido".
 * Mismo lenguaje visual que el resto de los sellos del sitio (Borrador, Pausado,
 * chips de técnicas): rectángulo grafito de esquinas mínimas, texto blanco en
 * mayúsculas con tracking amplio y una estrella chica en azul de marca.
 * - "tarjeta": sobre la foto en la grilla de categoría (con sombra suave).
 * - "ficha": en la fila de datos del artículo (un punto más compacto).
 */
export default function SelloMasPedido({
    variant = "tarjeta",
}: {
    variant?: "tarjeta" | "ficha";
}) {
    const medidas =
        variant === "tarjeta"
            ? "px-2.5 py-1.5 text-[10px] tracking-[0.14em] shadow-sm"
            : "px-2 py-1 text-[10px] tracking-[0.12em]";

    return (
        <span
            className={`inline-flex items-center gap-1.5 bg-grafito text-white rounded-sm font-bold uppercase leading-none whitespace-nowrap ${medidas}`}
        >
            <Star size={10} className="fill-primary text-primary shrink-0" aria-hidden />
            El más pedido
        </span>
    );
}
