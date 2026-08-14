"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, RefreshCw, Loader2, PauseCircle, PlayCircle, Pencil, X, Plus } from "lucide-react";
import { changeMainProductImage, addProductImages, togglePausadoManual, updateProductFicha } from "@/actions/productActions";
import { getFeatureOptions, addFeatureOption } from "@/actions/featureOptionActions";

export type FichaProducto = {
    name: string;
    masterCode?: string | null;
    description?: string | null;
    materials?: string | null;
    damaCompo?: string | null;
    ninoCompo?: string | null;
    talles?: string | null;
    damaTalles?: string | null;
    ninoTalles?: string | null;
    versionDama?: boolean;
    versionNino?: boolean;
    features?: string[];
};

// El form maneja las características como lista de casilleros con desplegable
type FormFicha = FichaProducto & { featuresSel?: string[] };

// Diego pidió apagar las características por ahora (14/08/2026). Poner en true para reactivarlas
// acá y en la página del producto (MOSTRAR_CARACTERISTICAS en [productSlug]/page.tsx).
const MOSTRAR_CARACTERISTICAS = false;

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
    const [form, setForm] = useState<FormFicha | null>(null);
    const [opciones, setOpciones] = useState<string[]>([]);
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
            ninoCompo: ficha.ninoCompo || "",
            talles: ficha.talles || "",
            damaTalles: ficha.damaTalles || "",
            ninoTalles: ficha.ninoTalles || "",
            versionDama: !!ficha.versionDama,
            versionNino: !!ficha.versionNino,
            featuresSel: [...(ficha.features || [])],
        });
        setEditando(true);
        getFeatureOptions().then((ops: any[]) => setOpciones(ops.map((o) => o.text))).catch(() => {});
    };

    const cambiarCaracteristica = async (indice: number, valor: string) => {
        if (valor === "__nueva__") {
            const texto = window.prompt("Texto de la nueva característica:");
            if (!texto || !texto.trim()) return;
            const r = await addFeatureOption(texto.trim());
            const definitivo = r.success ? r.option.text : texto.trim();
            if (!r.success && r.error && !r.error.includes("ya existe")) {
                alert(r.error);
                return;
            }
            setOpciones((ops) => (ops.includes(definitivo) ? ops : [...ops, definitivo]));
            setForm((f) => {
                if (!f) return f;
                const lista = [...(f.featuresSel || [])];
                lista[indice] = definitivo;
                return { ...f, featuresSel: lista };
            });
            return;
        }
        setForm((f) => {
            if (!f) return f;
            const lista = [...(f.featuresSel || [])];
            lista[indice] = valor;
            return { ...f, featuresSel: lista };
        });
    };

    const guardarFicha = async () => {
        if (!form) return;
        if (!form.name.trim()) {
            alert("El título no puede quedar vacío");
            return;
        }
        setSubiendo("ficha");
        try {
            const { featuresSel, ...datos } = form;
            const r = await updateProductFicha(productId, {
                ...datos,
                // Con las características apagadas no se mandan: la acción no toca lo guardado
                ...(MOSTRAR_CARACTERISTICAS
                    ? { features: (featuresSel || []).map((t) => t.trim()).filter(Boolean) }
                    : {}),
            });
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
        <div className={`fixed left-2 top-28 z-50 flex flex-col gap-2 rounded-lg p-2.5 border shadow-xl max-h-[calc(100vh-14rem)] overflow-y-auto ${editando ? "w-80" : "w-56"} ${pausado ? "bg-orange-50 border-orange-300" : "bg-amber-50 border-amber-200"}`}>
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
                    {campo("Composición unisex", "materials", "ej. 100% algodón")}
                    {campo("Composición dama", "damaCompo")}
                    {campo("Composición niño", "ninoCompo")}
                    {campo("Talles unisex", "talles", "ej. S M L XL XXL")}
                    {campo("Talles dama", "damaTalles")}
                    {campo("Talles niño", "ninoTalles")}
                    {MOSTRAR_CARACTERISTICAS && (
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">Características</span>
                        <div className="mt-1 space-y-1.5">
                            {(form.featuresSel || []).map((valor, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <select
                                        value={valor}
                                        onChange={(e) => cambiarCaracteristica(i, e.target.value)}
                                        className="flex-1 min-w-0 border border-amber-300 rounded-md px-2 py-1.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    >
                                        <option value="">Elegí una característica…</option>
                                        {valor && !opciones.includes(valor) && <option value={valor}>{valor}</option>}
                                        {opciones.map((op) => (
                                            <option key={op} value={op}>{op}</option>
                                        ))}
                                        <option value="__nueva__">➕ Nueva característica…</option>
                                    </select>
                                    <button
                                        onClick={() => setForm((f) => (f ? { ...f, featuresSel: (f.featuresSel || []).filter((_, j) => j !== i) } : f))}
                                        title="Quitar esta característica"
                                        className="shrink-0 p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setForm((f) => (f ? { ...f, featuresSel: [...(f.featuresSel || []), ""] } : f))}
                                className="w-full flex items-center justify-center gap-1.5 border border-dashed border-amber-400 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-amber-100 transition-colors"
                            >
                                <Plus size={14} />
                                Agregar característica
                            </button>
                        </div>
                    </div>
                    )}
                    <div className="pt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">Disponible en versión</span>
                        <div className="mt-1 flex items-center gap-4">
                            <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!form.versionDama}
                                    onChange={(e) => setForm((f) => (f ? { ...f, versionDama: e.target.checked } : f))}
                                    className="w-4 h-4 accent-[#0081D1]"
                                />
                                Dama
                            </label>
                            <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!form.versionNino}
                                    onChange={(e) => setForm((f) => (f ? { ...f, versionNino: e.target.checked } : f))}
                                    className="w-4 h-4 accent-[#0081D1]"
                                />
                                Niño
                            </label>
                        </div>
                    </div>
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
