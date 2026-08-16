"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Loader2, Save, X, Hand, Star } from "lucide-react";
import { reorderProductsSlots } from "@/actions/productActions";
import { fondoColor } from "@/lib/colorUtils";

// Grilla de la página de categoría. Para el público es idéntica a siempre;
// en modo admin las tarjetas se pueden ARRASTRAR para reordenarlas viendo
// la página tal como la ve el cliente, y aparece una barra para guardar.
export default function CategoryGrid({ products, categorySlug }: { products: any[]; categorySlug: string }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [lista, setLista] = useState<any[]>(products);
    const [cambiado, setCambiado] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const dragIndex = useRef<number | null>(null);
    const ultimoDrag = useRef(0);
    const router = useRouter();

    useEffect(() => {
        setLista(products);
        setCambiado(false);
    }, [products]);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/check-session", { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => { if (!cancelled) setIsAdmin(!!d.isAdmin); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    const empezarDrag = (e: React.DragEvent, i: number) => {
        dragIndex.current = i;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(i)); // requerido por Firefox
    };

    const sobreTarjeta = (e: React.DragEvent, i: number) => {
        e.preventDefault();
        const desde = dragIndex.current;
        if (desde === null || desde === i) return;
        setLista((prev) => {
            const copia = [...prev];
            const [movido] = copia.splice(desde, 1);
            copia.splice(i, 0, movido);
            return copia;
        });
        dragIndex.current = i;
        setCambiado(true);
    };

    const terminarDrag = () => {
        dragIndex.current = null;
        ultimoDrag.current = Date.now();
    };

    // Evita que el clic post-arrastre navegue a la ficha
    const bloquearClickPostDrag = (e: React.MouseEvent) => {
        if (Date.now() - ultimoDrag.current < 400) e.preventDefault();
    };

    const guardarOrden = async () => {
        setGuardando(true);
        try {
            const r = await reorderProductsSlots(lista.map((p) => p.id));
            if (r.success) {
                setCambiado(false);
                router.refresh();
            } else {
                alert(r.error || "No se pudo guardar el orden");
            }
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            {isAdmin && !cambiado && lista.length > 1 && (
                <p className="mb-4 flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 w-fit">
                    <Hand size={14} /> Modo admin: arrastrá las tarjetas para cambiar el orden
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {lista.map((product: any, i: number) => (
                    <Link
                        key={product.id}
                        href={`/categorias/${categorySlug}/${product.slug}`}
                        draggable={isAdmin}
                        onDragStart={isAdmin ? (e) => empezarDrag(e, i) : undefined}
                        onDragOver={isAdmin ? (e) => sobreTarjeta(e, i) : undefined}
                        onDragEnd={isAdmin ? terminarDrag : undefined}
                        onClick={isAdmin ? bloquearClickPostDrag : undefined}
                        className={`group bg-white border border-slate-200 rounded-md overflow-hidden hover:border-grafito hover:shadow-lg transition-all ${isAdmin ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                        <div className="relative aspect-square bg-[#F7F7F7]">
                            {product.images[0] ? (
                                <img
                                    src={product.images[0].url}
                                    alt={product.name}
                                    draggable={false}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Package size={56} />
                                </div>
                            )}
                            {(product.masVendido || product.highlight) && (
                                <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                                    {product.masVendido && (
                                        <span className="flex items-center gap-1 bg-grafito text-white px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.03em]">
                                            <Star size={10} className="text-celeste fill-celeste shrink-0" /> El más pedido
                                        </span>
                                    )}
                                    {product.highlight && (
                                        <span className="bg-primary text-white px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.08em]">
                                            {product.highlight}
                                        </span>
                                    )}
                                </span>
                            )}
                            {(!product.isActive || product.pausadoManual) && (
                                <span className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                                    {!product.isActive && (
                                        <span className="bg-red-600 text-white px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.06em]">
                                            Borrador
                                        </span>
                                    )}
                                    {product.pausadoManual && (
                                        <span className="bg-orange-500 text-white px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.06em]">
                                            Pausado
                                        </span>
                                    )}
                                </span>
                            )}
                            {(product.hasScreenPrint || product.hasEmbroidery) && (
                                <span className="absolute bottom-3 left-3 flex gap-1.5">
                                    {product.hasScreenPrint && (
                                        <span className="bg-white/95 text-grafito px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.06em] border border-slate-200">
                                            Estampado
                                        </span>
                                    )}
                                    {product.hasEmbroidery && (
                                        <span className="bg-white/95 text-grafito px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.06em] border border-slate-200">
                                            Bordado
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-[15px] text-grafito leading-snug mb-1">
                                {product.name}
                            </h3>
                            {product.description && (
                                <p className="text-[13px] text-slate-500 line-clamp-2 mb-3">
                                    {product.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <span className="flex items-center gap-1">
                                    {product.colors.slice(0, 6).map((pc: any, j: number) => {
                                        const color = pc.color;
                                        if (!color) return null;
                                        return (
                                            <span
                                                key={j}
                                                className="w-[15px] h-[15px] rounded-full border border-grafito/20"
                                                style={{ background: fondoColor(color.hex, color.hex2) }}
                                                title={color.name}
                                            />
                                        );
                                    })}
                                    {product.colors.length > 6 && (
                                        <span className="text-[11px] font-bold text-slate-500 ml-0.5">
                                            +{product.colors.length - 6}
                                        </span>
                                    )}
                                </span>
                                <span className="text-[13px] font-bold text-grafito border-b-2 border-primary pb-0.5">
                                    Ver prenda →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Barra flotante de guardado cuando hay cambios de orden */}
            {isAdmin && cambiado && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-grafito text-white rounded-full shadow-2xl px-4 py-2.5">
                    <span className="text-xs font-bold uppercase tracking-wide pr-1">Orden nuevo sin guardar</span>
                    <button
                        onClick={guardarOrden}
                        disabled={guardando}
                        className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {guardando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Guardar orden
                    </button>
                    <button
                        onClick={() => { setLista(products); setCambiado(false); }}
                        disabled={guardando}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        <X size={14} />
                        Cancelar
                    </button>
                </div>
            )}
        </>
    );
}
