"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, RefreshCw, Loader2, PauseCircle, PlayCircle, Pencil, X } from "lucide-react";
import { changeMainProductImage, addProductImages, togglePausadoManual, updateProductFicha } from "@/actions/productActions";

export type FichaProducto = {
    name: string;
    masterCode?: string | null;
    description?: string | null;
    materials?: string | null;
    damaCompo?: string | null;
    talles?: string | null;
    damaTalles?: string | null;
    ninoTalles?: string | null;
};

// Barra de "modo admin" bajo la galería del producto: cambiar la imagen principal,
// agregar imágenes (explorador directo), pausar/reanudar y editar la ficha.
export default function AdminQuickImages({
    productId,
    pausado = false,
    pausadoNota,
    ficha,
}: {
    productId: number;
    pausado?: boolean;
    pausadoNota?: string | null;
    ficha?: FichaProducto;
}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [subiendo, setSubiendo] = useState<"principal" | "agregar" | "pausa" | "ficha" | null>(null);
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState<FichaProducto | null>(null);
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

    const abrirEditor = () => {
        if (!ficha) return;
        setForm({
            name: ficha.name || "",
            masterCode: ficha.masterCode || "",
            description: ficha.description || "",
            materials: ficha.materials || "",
            damaCompo: ficha.damaCompo || "",
            talles: ficha.talles || "",
            damaTalles: ficha.damaTalles || "",
            ninoTalles: ficha.ninoTalles || "",
        });
        setEditando(true);
    };

    const guardarFicha = async () => {
        if (!form) return;
        if (!form.name.trim()) {
            alert("El título no puede quedar vacío");
            return;
        }
        setSubiendo("ficha");
        try {
            const r = await updateProductFicha(productId, form);
            if (r.success) {
                setEditando(false);
                router.refresh();
            } else {
                alert(r.error || "No se pudo guardar la ficha");
            }
        } finally {
            setSubiendo(null);
        }
    };

    const campo = (etiqueta: string, clave: keyof FichaProducto, placeholder = "") => (
        <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">{etiqueta}</span>
            <input
                type="text"
                value={(form?.[clave] as string) || ""}
                onChange={(e) => setForm((f) => (f ? { ...f, [clave]: e.target.value } : f))}
                placeholder={placeholder}
                className="mt-0.5 w-full border border-amber-300 rounded-md px-2.5 py-1.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
        </label>
    );

    const alternarPausa = async () => {
        let nota: string | undefined;
        if (!pausado) {
            const respuesta = window.prompt("¿Motivo de la pausa? (opcional — Aceptar para pausar, Cancelar para abortar)", pausadoNota || "");
            if (respuesta === null) return; // canceló
            nota = respuesta;
        }
        setSubiendo("pausa");
        try {
            const r = await togglePausadoManual(productId, !pausado, nota);
            if (r.success) router.refresh();
            else alert("No se pudo cambiar el estado");
        } finally {
            setSubiendo(null);
        }
    };

    // Panel flotante pegado al borde izquierdo, a la altura de la imagen,
    // para que Diego no tenga que scrollear hasta debajo de la galería.
    const btn = "w-full flex items-center gap-1.5 bg-white border border-amber-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-md hover:bg-amber-100 transition-colors disabled:opacity-50";

    return (
        <div className={`fixed left-2 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 rounded-lg p-2.5 border shadow-xl max-h-[85vh] overflow-y-auto ${editando ? "w-80" : "w-56"} ${pausado ? "bg-orange-50 border-orange-300" : "bg-amber-50 border-amber-200"}`}>
            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-1 ${pausado ? "text-orange-700" : "text-amber-700"}`}>
                {pausado ? `Pausado${pausadoNota ? `: ${pausadoNota}` : ""}` : "Modo admin"}
            </span>
            <button onClick={() => inputPrincipal.current?.click()} disabled={!!subiendo} className={btn}>
                {subiendo === "principal" ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Cambiar imagen principal
            </button>
            <button onClick={() => inputAgregar.current?.click()} disabled={!!subiendo} className={btn}>
                {subiendo === "agregar" ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                Agregar imágenes
            </button>
            <button
                onClick={alternarPausa}
                disabled={!!subiendo}
                className={pausado ? "w-full flex items-center gap-1.5 bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50" : btn}
            >
                {subiendo === "pausa" ? <Loader2 size={14} className="animate-spin" /> : pausado ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
                {pausado ? "Reanudar" : "Pausar"}
            </button>
            {ficha && (
                <button onClick={() => (editando ? setEditando(false) : abrirEditor())} disabled={!!subiendo} className={btn}>
                    {editando ? <X size={14} /> : <Pencil size={14} />}
                    {editando ? "Cerrar editor" : "Editar ficha"}
                </button>
            )}
            <input ref={inputPrincipal} type="file" accept="image/*" className="hidden" onChange={cambiarPrincipal} />
            <input ref={inputAgregar} type="file" accept="image/*" multiple className="hidden" onChange={agregarImagenes} />

            {editando && form && (
                <div className="border-t border-amber-300 pt-2.5 space-y-2.5">
                    {campo("Título", "name")}
                    {campo("Ref (código)", "masterCode", "ej. RA-001")}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">Descripción</span>
                        <textarea
                            value={form.description || ""}
                            onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))}
                            rows={3}
                            className="mt-0.5 w-full border border-amber-300 rounded-md px-2.5 py-1.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </label>
                    {campo("Composición", "materials", "ej. 100% algodón")}
                    {campo("Composición dama", "damaCompo")}
                    {campo("Talles unisex", "talles", "ej. S M L XL XXL")}
                    {campo("Talles dama", "damaTalles")}
                    {campo("Talles niño", "ninoTalles")}
                    <div className="flex items-center gap-2 pt-1">
                        <button
                            onClick={guardarFicha}
                            disabled={!!subiendo}
                            className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {subiendo === "ficha" ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
                            Guardar cambios
                        </button>
                        <button
                            onClick={() => setEditando(false)}
                            disabled={!!subiendo}
                            className="text-xs font-bold text-slate-600 px-3 py-2 rounded-md hover:bg-amber-100 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
