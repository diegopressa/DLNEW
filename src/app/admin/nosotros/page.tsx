"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAboutUs, updateAboutUs } from "@/actions/aboutActions";
// uploadImage server action intentionally removed:
// Server Actions serialize args with their own protocol and drop File binaries
// when called programmatically. We use /api/upload (fetch + FormData) instead.
import { Save, Loader2, Image as ImageIcon, Upload, X, Link } from "lucide-react";

export default function AboutAdmin() {
    const [about, setAbout] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [urlMode, setUrlMode] = useState(false);

    // Pending file + local preview (before saving to server)
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAbout();
    }, []);

    // Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const fetchAbout = async () => {
        const data = await getAboutUs();
        setAbout(data);
    };

    // ─── File selection → immediate local preview, no server call yet ────────
    const handleFileSelect = (file: File | null | undefined) => {
        if (!file) return;

        // Validate type
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "El archivo debe ser una imagen (PNG, JPG, WEBP)." });
            return;
        }

        // Validate size (max 10 MB)
        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: "error", text: "La imagen no puede superar los 10 MB." });
            return;
        }

        // Clear any previous error and revoke old blob URL
        setMessage({ type: "", text: "" });
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setPendingFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files?.[0]);
        // Reset input so same file can be re-selected
        if (e.target) e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files?.[0]);
    };

    // ─── Save: upload pending file to server first, then persist data ────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let imageUrl = about.imageUrl;

        if (pendingFile) {
            setMessage({ type: "info", text: "Subiendo imagen..." });

            // Use fetch + native FormData so the browser sends real multipart/form-data.
            // DO NOT set Content-Type manually — the browser adds the correct boundary.
            const formData = new FormData();
            formData.append("file", pendingFile);
            formData.append("folder", "nosotros");

            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                    // No "Content-Type" header — browser sets multipart/form-data + boundary
                });

                const res = await response.json();

                if (res.success && res.url) {
                    imageUrl = res.url;
                    // Clean up blob URL now that we have the server URL
                    if (previewUrl && previewUrl.startsWith("blob:")) {
                        URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(null);
                    setPendingFile(null);
                } else {
                    setMessage({ type: "error", text: res.error || "Error al subir la imagen. Intentá de nuevo." });
                    setSaving(false);
                    return;
                }
            } catch {
                setMessage({ type: "error", text: "Error de conexión al subir la imagen." });
                setSaving(false);
                return;
            }
        }

        const res = await updateAboutUs({
            title: about.title,
            content: about.content,
            imageUrl,
            stat1Value: about.stat1Value,
            stat1Label: about.stat1Label,
            stat2Value: about.stat2Value,
            stat2Label: about.stat2Label,
        });

        setSaving(false);

        if (res.success) {
            setAbout({ ...about, imageUrl });
            setMessage({ type: "success", text: "Cambios guardados correctamente" });
        } else {
            setMessage({ type: "error", text: "Error al guardar los cambios" });
        }

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleClearImage = () => {
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setPendingFile(null);
        setAbout({ ...about, imageUrl: "" });
        setMessage({ type: "", text: "" });
    };

    if (!about) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-[#0081D1]" size={40} />
        </div>
    );

    // The URL shown in the preview: local blob while pending, server URL after save
    const displayImageUrl = previewUrl || about.imageUrl || "";
    // The label shown in the path row
    const displayImageLabel = pendingFile
        ? `Pendiente: ${pendingFile.name}`
        : about.imageUrl || "";

    // Shared field styles
    const inputClass = "bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm";

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900">Nosotros</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Acá editás lo que se muestra en la página &quot;Nosotros&quot; de tu web: la historia, la foto y los números.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* ─── Tarjeta 1: Historia ─────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Historia</h2>
                        <p className="text-sm text-slate-500">El título y el texto que cuentan la historia de tu empresa.</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 block">Título</label>
                        <input
                            value={about.title}
                            onChange={e => setAbout({ ...about, title: e.target.value })}
                            className={inputClass}
                            placeholder="Ej: Nuestra Historia"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 block">Texto principal</label>
                        <textarea
                            value={about.content}
                            onChange={e => setAbout({ ...about, content: e.target.value })}
                            className={`${inputClass} min-h-[220px] leading-relaxed`}
                            placeholder="Escribí acá la historia de tu empresa..."
                        />
                        <p className="text-xs text-slate-400">Este texto aparece a la izquierda de la foto.</p>
                    </div>
                </section>

                {/* ─── Tarjeta 2: Foto ─────────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Foto</h2>
                            <p className="text-sm text-slate-500">La imagen que acompaña al texto (se ve a la derecha).</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setUrlMode(!urlMode)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0081D1] transition-colors border border-slate-200 px-3 py-1.5 rounded-lg hover:border-[#0081D1] shrink-0"
                        >
                            <Link size={12} />
                            {urlMode ? "Cambiar a subir archivo" : "Usar URL externa"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-3">
                            {urlMode ? (
                                /* URL mode */
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 block">Dirección (URL) de la imagen</label>
                                    <input
                                        value={about.imageUrl || ""}
                                        onChange={e => {
                                            setMessage({ type: "", text: "" });
                                            setAbout({ ...about, imageUrl: e.target.value });
                                        }}
                                        className={`${inputClass} font-mono`}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                    <p className="text-xs text-slate-400">Recomendado: imágenes de 1200x800px o similar.</p>
                                </div>
                            ) : (
                                /* Upload mode */
                                <div className="space-y-3">
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={e => e.preventDefault()}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-[#0081D1]"
                                    >
                                        <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                        <p className="text-sm text-slate-600 font-bold">
                                            <span className="text-[#0081D1]">Click para cargar</span> o arrastrar y soltar
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">PNG, JPG o WEBP (Máx. 10MB)</p>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                    />

                                    {/* Current image path (read-only) */}
                                    {displayImageLabel && (
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                                            <p className={`text-xs font-mono truncate flex-1 ${pendingFile ? "text-[#0081D1] font-bold" : "text-slate-500"}`}>
                                                {displayImageLabel}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleClearImage}
                                                className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                                title="Quitar imagen"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Pending file badge */}
                                    {pendingFile && (
                                        <p className="text-xs text-[#0081D1] font-bold">
                                            La foto se sube al servidor cuando tocás &quot;Guardar cambios&quot;.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Preview */}
                        {displayImageUrl ? (
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 h-48">
                                <img
                                    src={displayImageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full transition-all">
                                        Vista previa
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 h-48 flex items-center justify-center">
                                <div className="text-center text-slate-300">
                                    <ImageIcon size={32} className="mx-auto mb-2" />
                                    <p className="text-xs font-bold">Sin imagen</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── Tarjeta 3: Números que se muestran ──────────────────── */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Números que se muestran</h2>
                        <p className="text-sm text-slate-500">Aparecen en grande debajo del texto. Ej: +10 / Años de experiencia.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <p className="text-sm font-bold text-slate-700">Número 1</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 block">Valor (ej: +10)</label>
                                    <input
                                        value={about.stat1Value || "+10"}
                                        onChange={e => setAbout({ ...about, stat1Value: e.target.value })}
                                        className={inputClass}
                                        placeholder="+10"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 block">Etiqueta (ej: Años de experiencia)</label>
                                    <input
                                        value={about.stat1Label || "Años de experiencia"}
                                        onChange={e => setAbout({ ...about, stat1Label: e.target.value })}
                                        className={inputClass}
                                        placeholder="Años de experiencia"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-sm font-bold text-slate-700">Número 2</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 block">Valor (ej: +500)</label>
                                    <input
                                        value={about.stat2Value || "+500"}
                                        onChange={e => setAbout({ ...about, stat2Value: e.target.value })}
                                        className={inputClass}
                                        placeholder="+500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 block">Etiqueta (ej: Empresas confían)</label>
                                    <input
                                        value={about.stat2Label || "Empresas confían"}
                                        onChange={e => setAbout({ ...about, stat2Label: e.target.value })}
                                        className={inputClass}
                                        placeholder="Empresas confían"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Guardar ─────────────────────────────────────────────── */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                    {message.text && (
                        <span className={`text-sm font-bold ${message.type === "success" ? "text-green-600" :
                            message.type === "error" ? "text-red-600" : "text-[#0081D1]"
                            }`}>
                            {message.text}
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
