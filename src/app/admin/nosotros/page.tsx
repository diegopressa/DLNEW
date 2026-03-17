"use client";

import React, { useState, useEffect } from "react";
import { getAboutUs, updateAboutUs } from "@/actions/aboutActions";
import { Save, Loader2, Image as ImageIcon, Type, FileText } from "lucide-react";

export default function AboutAdmin() {
    const [about, setAbout] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

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
            setMessage("Cambios guardados correctamente");
            setTimeout(() => setMessage(""), 3000);
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
                    <p className="text-slate-500">Configurá el contenido de la página "Nosotros"</p>
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

                    {/* Imagen URL */}
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon size={14} className="text-blue-600" /> Imagen (Derecha)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-4">
                                <input 
                                    value={about.imageUrl || ""}
                                    onChange={e => setAbout({...about, imageUrl: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono"
                                    placeholder="URL de la imagen (o pegá una de Unsplash)"
                                />
                                <p className="text-[10px] text-slate-500 font-medium">Recomendado: Imágenes de 1200x800px o similar.</p>
                            </div>
                            {about.imageUrl && (
                                <div className="relative group rounded-3xl overflow-hidden border-4 border-slate-50 shadow-lg h-40">
                                    <img src={about.imageUrl} alt="Preview" className="w-full h-full object-cover" />
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
                    {message && <span className="text-green-600 font-black text-sm uppercase animate-in fade-in slide-in-from-left duration-300">{message}</span>}
                </div>
            </form>
        </div>
    );
}
