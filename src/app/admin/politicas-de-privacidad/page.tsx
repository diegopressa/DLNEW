"use client";

import React, { useState, useEffect } from "react";
import { getPrivacyPolicy, updatePrivacyPolicy } from "@/actions/privacyActions";
import { Save, Loader2, Type, FileText } from "lucide-react";

export default function PrivacyAdmin() {
    const [policy, setPolicy] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchPolicy();
    }, []);

    const fetchPolicy = async () => {
        const data = await getPrivacyPolicy();
        setPolicy(data);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const res = await updatePrivacyPolicy({
            title: policy.title,
            content: policy.content,
        });

        setSaving(false);

        if (res.success) {
            setMessage({ type: "success", text: "Cambios guardados correctamente" });
        } else {
            setMessage({ type: "error", text: "Error al guardar los cambios" });
        }

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    if (!policy) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Editar Políticas de Privacidad</h1>
                    <p className="text-slate-500">Configurá el texto que aparecerá en la página de políticas de privacidad.</p>
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
                            value={policy.title}
                            onChange={e => setPolicy({ ...policy, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg text-slate-800"
                            placeholder="Ej: Políticas de Privacidad"
                        />
                    </div>

                    {/* Contenido */}
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} className="text-blue-600" /> Contenido / Texto
                        </label>
                        <textarea
                            value={policy.content}
                            onChange={e => setPolicy({ ...policy, content: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[400px] text-slate-700 leading-relaxed"
                            placeholder="Escribí aquí el texto de tus políticas de privacidad..."
                        />
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
