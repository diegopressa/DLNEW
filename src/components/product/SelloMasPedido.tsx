import { Star } from "lucide-react";

/**
 * Sello "El más pedido".
 * - variante "tarjeta": caja negra en dos renglones con la estrella amarilla
 *   asomando en la esquina superior izquierda (sobre la foto del producto).
 * - variante "ficha": versión en una sola línea para la fila de datos del artículo.
 */
export default function SelloMasPedido({
    variant = "tarjeta",
}: {
    variant?: "tarjeta" | "ficha";
}) {
    if (variant === "ficha") {
        return (
            <span className="inline-flex items-center gap-1.5 bg-grafito text-white px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase leading-none tracking-[0.04em]">
                <Star
                    size={13}
                    strokeWidth={1.75}
                    aria-hidden
                    className="text-grafito fill-resalte shrink-0 -rotate-12"
                />
                El más pedido
            </span>
        );
    }

    return (
        <span className="relative inline-flex flex-col items-start bg-grafito text-white px-3 py-2 rounded-xl shadow-md">
            <Star
                size={24}
                strokeWidth={1.75}
                aria-hidden
                className="absolute -top-2.5 -left-2 text-grafito fill-resalte -rotate-12 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            />
            <span className="text-[12px] font-black uppercase leading-[1.1] tracking-[0.02em]">
                El más
            </span>
            <span className="text-[12px] font-black uppercase leading-[1.1] tracking-[0.02em]">
                pedido
            </span>
        </span>
    );
}
