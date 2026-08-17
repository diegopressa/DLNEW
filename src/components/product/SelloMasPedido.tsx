import { Star } from "lucide-react";

/**
 * Sello "El más pedido": rectángulo negro con el texto blanco en dos renglones
 * y la estrella amarilla de marca asomando en la esquina superior izquierda.
 * Versión minimalista: estrella más chica y plana (sin sombra), esquinas menos
 * redondeadas y texto más ajustado que el primer boceto.
 * - "tarjeta": sobre la foto en la grilla de categoría.
 * - "ficha": en la fila de datos del artículo, en una sola línea.
 */
export default function SelloMasPedido({
    variant = "tarjeta",
}: {
    variant?: "tarjeta" | "ficha";
}) {
    if (variant === "ficha") {
        return (
            <span className="inline-flex items-center gap-1.5 bg-grafito text-white px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase leading-none tracking-[0.06em]">
                <Star
                    size={12}
                    strokeWidth={0}
                    aria-hidden
                    className="fill-resalte shrink-0"
                />
                El más pedido
            </span>
        );
    }

    return (
        <span className="relative inline-flex flex-col items-start bg-grafito text-white px-2.5 py-1.5 rounded-md">
            <Star
                size={18}
                strokeWidth={0}
                aria-hidden
                className="absolute -top-2 -left-1.5 fill-resalte"
            />
            <span className="text-[10.5px] font-bold uppercase leading-[1.25] tracking-[0.06em]">
                El más
            </span>
            <span className="text-[10.5px] font-bold uppercase leading-[1.25] tracking-[0.06em]">
                pedido
            </span>
        </span>
    );
}
