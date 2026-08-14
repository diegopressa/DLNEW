"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, RefreshCw, Loader2 } from "lucide-react";
import { changeMainProductImage, addProductImages } from "@/actions/productActions";

// Barra de "modo admin" bajo la galería del producto: cambiar la imagen principal
// o agregar imágenes abriendo directo el explorador de archivos, sin pasar por el admin.
export default function AdminQuickImages({ productId }: { productId: number }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [subiendo, setSubiendo] = useState<"principal" | "agregar" | null>(null);
    const inputPrincipal = useRef<HTMLInputElement>(null);
    const inputAgregar = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/check-session", { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => { if (!cancelled) setIsAdmin(!!d.isAdmin); })
            .catch(() => { if (!cancelled) setIsAdmin(false); });
        return () => { cancelled = true; };
    }, []);

    if (!isAdmin) return null;

    const subirArchivo = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "articulos");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.success ? data.url : null;
    };

    const cambiarPrincipal = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setSubiendo("principal");
        try {
            const url = await subirArchivo(file);
            if (url) {
                const r = await changeMainProductImage(productId, url);
                if (r.success) router.refresh();
                else alert("No se pudo guardar la imagen");
            } else {
                alert("No se pudo subir la imagen");
            }
        } finally {
            setSubiendo(null);
        }
    };

    const agregarImagenes = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        e.target.value = "";
        if (!files.length) return;
        setSubiendo("agregar");
        try {
            const urls: string[] = [];
            for (const f of files) {
                const url = await subirArchivo(f);
                if (url) urls.push(url);
            }
            if (urls.length) {
                const r = await addProductImages(productId, urls);
                if (r.success) router.refresh();
                else alert("No se pudieron guardar las imágenes");
            }
            if (urls.length < files.length) alert(`${files.length - urls.length} imagen(es) fallaron al subir`);
        } finally {
            setSubiendo(null);
        }
    };

    return (
        <div className="mt-3 flex flex-wrap items-center gap-2 bg-amber-50 border border-amber-200 rounded-md p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700 px-1.5">
                Modo admin
            </span>
            <button
                onClick={() => inputPrincipal.current?.click()}
                disabled={!!subiendo}
                className="flex items-center gap-1.5 bg-white border border-amber-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-md hover:bg-amber-100 transition-colors disabled:opacity-50"
            >
                {subiendo === "principal" ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Cambiar imagen principal
            </button>
            <button
                onClick={() => inputAgregar.current?.click()}
                disabled={!!subiendo}
                className="flex items-center gap-1.5 bg-white border border-amber-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-md hover:bg-amber-100 transition-colors disabled:opacity-50"
            >
                {subiendo === "agregar" ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                Agregar imágenes
            </button>
            <input ref={inputPrincipal} type="file" accept="image/*" className="hidden" onChange={cambiarPrincipal} />
            <input ref={inputAgregar} type="file" accept="image/*" multiple className="hidden" onChange={agregarImagenes} />
        </div>
    );
}
