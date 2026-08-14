"use client";

import React, { useState, useEffect } from "react";
import { getPrivacyPolicy, updatePrivacyPolicy } from "@/actions/privacyActions";
import { Save, Loader2 } from "lucide-react";

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
            <Loader2 className="animate-spin text-[#0081D1]" size={40} />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Políticas de privacidad</h1>
                <p className="text-sm text-slate-500 mt-1">Editá el título y el texto de la página de políticas de privacidad del sitio.</p>
            </div>

            {/* Tarjeta de edición */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                {/* Título */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">Título de la página</label>
                    <input
                        value={policy.title}
                        onChange={e => setPolicy({ ...policy, title: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm"
                        placeholder="Ej: Políticas de Privacidad"
                    />
                </div>

                {/* Contenido */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">Texto de las políticas</label>
                    <textarea
                        value={policy.content}
                        onChange={e => setPolicy({ ...policy, content: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm min-h-[480px] leading-relaxed resize-y"
                        placeholder="Escribí aquí el texto de tus políticas de privacidad..."
                    />
                    <p className="text-xs text-slate-400">Se muestra tal cual en /politicas-de-privacidad</p>
                </div>

                {/* Guardar */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
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
