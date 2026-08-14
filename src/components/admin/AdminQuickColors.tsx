"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { toggleProductColor } from "@/actions/productActions";
import { getColors } from "@/actions/colorActions";

// Editor de colores del artículo, en el mismo bloque "Colores disponibles" (modo admin):
// muestra la paleta completa y con un toque se agrega o quita cada color.
export default function AdminQuickColors({
    productId,
    seleccionados,
    conMarco = false,
}: {
    productId: number;
    seleccionados: number[];
    conMarco?: boolean; // cuando el artículo no tiene colores, el bloque público no existe y este trae su propio marco
}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [paleta, setPaleta] = useState<any[]>([]);
    const [activos, setActivos] = useState<number[]>(seleccionados);
    const [guardando, setGuardando] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/check-session", { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => {
                if (cancelled || !d.isAdmin) return;
                setIsAdmin(true);
                getColors(true).then((cs: any[]) => { if (!cancelled) setPaleta(cs); });
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    if (!isAdmin || paleta.length === 0) return null;

    const alternar = async (colorId: number) => {
        if (guardando !== null) return;
        const agregar = !activos.includes(colorId);
        setGuardando(colorId);
        setActivos((prev) => (agregar ? [...prev, colorId] : prev.filter((id) => id !== colorId)));
        try {
            const r = await toggleProductColor(productId, colorId, agregar);
            if (r.success) {
                router.refresh();
            } else {
                setActivos((prev) => (agregar ? prev.filter((id) => id !== colorId) : [...prev, colorId]));
                alert("No se pudo guardar el cambio de color");
            }
        } finally {
            setGuardando(null);
        }
    };

    const contenido = (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700 mb-2">
                Modo admin — tocá un color para agregarlo o quitarlo
            </p>
            <div className="flex flex-wrap gap-2.5">
                {paleta.map((color) => {
                    const activo = activos.includes(color.id);
                    return (
                        <button
                            key={color.id}
                            onClick={() => alternar(color.id)}
                            disabled={guardando !== null}
                            title={`${color.name} — ${activo ? "quitar del artículo" : "agregar al artículo"}`}
                            className={`relative w-9 h-9 rounded-full border transition-all duration-150 disabled:cursor-wait ${
                                activo
                                    ? "border-primary ring-2 ring-primary ring-offset-1 shadow-md"
                                    : "border-slate-300 opacity-35 hover:opacity-70"
                            }`}
                            style={{ backgroundColor: color.hex }}
                        >
                            {guardando === color.id ? (
                                <Loader2 size={15} className="absolute inset-0 m-auto animate-spin text-white drop-shadow" />
                            ) : activo ? (
                                <Check size={15} className="absolute inset-0 m-auto text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]" />
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return conMarco ? <div className="py-5 border-b border-slate-200">{contenido}</div> : contenido;
}
