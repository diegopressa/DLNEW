"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAboutUs, updateAboutUs } from "@/actions/aboutActions";
import { uploadImage } from "@/actions/homeActions";
import { Save, Loader2, Image as ImageIcon, Type, FileText, Upload, X, Link } from "lucide-react";

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
            const formData = new FormData();
            formData.append("file", pendingFile);

            try {
                const res = await uploadImage(formData);
                if (res.success && res.url) {
                    imageUrl = res.url;
                    // Clean up the blob URL now that we have the real server URL
                    if (previewUrl && previewUrl.startsWith("blob:")) {
                        URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(null);
                    setPendingFile(null);
                } else {
                    setMessage({ type: "error", text: "Error al subir la imagen. Intentá de nuevo." });
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
            imageUrl
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
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    // The URL shown in the preview: local blob while pending, server URL after save
    const displayImageUrl = previewUrl || about.imageUrl || "";
    // The label shown in the path row
    const displayImageLabel = pendingFile
        ? `Pendiente: ${pendingFile.name}`
        : about.imageUrl || "";

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Editar Nosotros</h1>
                    <p className="text-slate-500">Configurá el contenido de la página &quot;Nosotros&quot;</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="space-y-6">
                    {/* Título */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Type size={14} className="text-blue-600" /> Título de la página
                        </label>
                        <input
                            value={about.title}
                            onChange={e => setAbout({ ...about, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg text-slate-800"
                            placeholder="Ej: Nuestra Historia"
                        />
                    </div>

                    {/* Contenido */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} className="text-blue-600" /> Contenido / Texto (Izquierda)
                        </label>
                        <textarea
                            value={about.content}
                            onChange={e => setAbout({ ...about, content: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[250px] text-slate-700 leading-relaxed"
                            placeholder="Escribí aquí la historia de tu empresa..."
                        />
                    </div>

                    {/* Imagen */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon size={14} className="text-blue-600" /> Imagen (Derecha)
                            </label>
                            <button
                                type="button"
                                onClick={() => setUrlMode(!urlMode)}
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-300"
                            >
                                <Link size={12} />
                                {urlMode ? "Cambiar a subir archivo" : "Usar URL externa"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-3">
                                {urlMode ? (
                                    /* URL mode */
                                    <div className="space-y-2">
                                        <input
                                            value={about.imageUrl || ""}
                                            onChange={e => {
                                                setMessage({ type: "", text: "" });
                                                setAbout({ ...about, imageUrl: e.target.value });
                                            }}
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                        <p className="text-[10px] text-slate-500 font-medium">Recomendado: Imágenes de 1200x800px o similar.</p>
                                    </div>
                                ) : (
                                    /* Upload mode */
                                    <div className="space-y-3">
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={e => e.preventDefault()}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-400"
                                        >
                                            <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                            <p className="text-sm text-slate-600 font-bold">
                                                <span className="text-blue-600">Click para cargar</span> o arrastrar y soltar
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
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                                                <p className={`text-xs font-mono truncate flex-1 ${pendingFile ? "text-blue-600 font-bold" : "text-slate-500"}`}>
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
                                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                                                ⬆ Se subirá al servidor al guardar
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            {displayImageUrl ? (
                                <div className="relative group rounded-3xl overflow-hidden border-4 border-slate-50 shadow-lg h-48">
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
                                <div className="rounded-3xl border-4 border-dashed border-slate-100 h-48 flex items-center justify-center">
                                    <div className="text-center text-slate-300">
                                        <ImageIcon size={32} className="mx-auto mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-wider">Sin imagen</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                    </button>
                    {message.text && (
                        <span className={`font-black text-sm uppercase animate-in fade-in slide-in-from-left duration-300 ${message.type === "success" ? "text-green-600" :
                            message.type === "error" ? "text-red-600" : "text-blue-600"
                            }`}>
                            {message.text}
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
