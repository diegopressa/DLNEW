"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAboutUs, updateAboutUs } from "@/actions/aboutActions";
import { uploadImage } from "@/actions/homeActions";
import { Save, Loader2, Image as ImageIcon, Type, FileText, Upload, X, Link } from "lucide-react";

export default function AboutAdmin() {
    const [about, setAbout] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [urlMode, setUrlMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        const data = await getAboutUs();
        setAbout(data);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await updateAboutUs({
            title: about.title,
            content: about.content,
            imageUrl: about.imageUrl
        });
        setSaving(false);
        if (res.success) {
            setMessage({ type: "success", text: "Cambios guardados correctamente" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } else {
            setMessage({ type: "error", text: "Error al guardar los cambios" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage({ type: "info", text: "Subiendo imagen..." });

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await uploadImage(formData);
            if (res.success && res.url) {
                setAbout({ ...about, imageUrl: res.url });
                setMessage({ type: "success", text: "Imagen subida. Recordá guardar los cambios." });
            } else {
                setMessage({ type: "error", text: "Error al subir la imagen." });
            }
        } catch {
            setMessage({ type: "error", text: "Error en la conexión." });
        } finally {
            setUploading(false);
            if (e.target) e.target.value = "";
            setTimeout(() => setMessage({ type: "", text: "" }), 4000);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;

        setUploading(true);
        setMessage({ type: "info", text: "Subiendo imagen..." });

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await uploadImage(formData);
            if (res.success && res.url) {
                setAbout({ ...about, imageUrl: res.url });
                setMessage({ type: "success", text: "Imagen subida. Recordá guardar los cambios." });
            } else {
                setMessage({ type: "error", text: "Error al subir la imagen." });
            }
        } catch {
            setMessage({ type: "error", text: "Error en la conexión." });
        } finally {
            setUploading(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 4000);
        }
    };

    if (!about) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

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
                            onChange={e => setAbout({...about, title: e.target.value})}
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
                            onChange={e => setAbout({...about, content: e.target.value})}
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
                                            onChange={e => setAbout({...about, imageUrl: e.target.value})}
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
                                            onClick={() => !uploading && fileInputRef.current?.click()}
                                            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                                                ${uploading 
                                                    ? 'bg-slate-100 border-slate-300 cursor-not-allowed' 
                                                    : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-400'
                                                }`}
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader2 className="w-8 h-8 mb-2 text-blue-500 animate-spin" />
                                                    <p className="text-sm text-slate-500 font-bold">Subiendo imagen...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                                    <p className="text-sm text-slate-600 font-bold">
                                                        <span className="text-blue-600">Click para cargar</span> o arrastrar y soltar
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG o WEBP (Máx. 10MB)</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />

                                        {/* Show current URL as read-only if it's a local file */}
                                        {about.imageUrl && (
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                                                <p className="text-xs text-slate-500 font-mono truncate flex-1">{about.imageUrl}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setAbout({...about, imageUrl: ""})}
                                                    className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                                    title="Quitar imagen"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            {about.imageUrl ? (
                                <div className="relative group rounded-3xl overflow-hidden border-4 border-slate-50 shadow-lg h-48">
                                    <img src={about.imageUrl} alt="Preview" className="w-full h-full object-cover" />
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
                        disabled={saving || uploading}
                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                    </button>
                    {message.text && (
                        <span className={`font-black text-sm uppercase animate-in fade-in slide-in-from-left duration-300 ${
                            message.type === "success" ? "text-green-600" : 
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
