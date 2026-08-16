"use client";

import React, { useState, useEffect } from "react";
import { getAllFaqItems, createFaqItem, updateFaqItem, deleteFaqItem } from "@/actions/faqActions";
import { Save, Loader2, Plus, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    order: number;
    active: boolean;
}

const EMPTY_FORM = { question: "", answer: "" };

export default function FaqAdmin() {
    const [items, setItems] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [form, setForm] = useState(EMPTY_FORM);
    const [editing, setEditing] = useState<FaqItem | null>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        const data = await getAllFaqItems();
        setItems(data);
        setLoading(false);
    };

    const showMsg = (type: string, text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.question.trim() || !form.answer.trim()) {
            showMsg("error", "Completá pregunta y respuesta");
            return;
        }
        setSaving(true);

        if (editing) {
            const res = await updateFaqItem(editing.id, {
                question: form.question,
                answer: form.answer,
                order: editing.order,
                active: editing.active,
            });
            if (res.success) {
                showMsg("success", "Pregunta actualizada");
                setEditing(null);
                setForm(EMPTY_FORM);
                fetchItems();
            } else {
                showMsg("error", res.error || "Error al guardar");
            }
        } else {
            const res = await createFaqItem({ question: form.question, answer: form.answer });
            if (res.success) {
                showMsg("success", "Pregunta agregada");
                setForm(EMPTY_FORM);
                fetchItems();
            } else {
                showMsg("error", res.error || "Error al guardar");
            }
        }
        setSaving(false);
    };

    const handleEdit = (item: FaqItem) => {
        setEditing(item);
        setForm({ question: item.question, answer: item.answer });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
    };

    const handleToggleActive = async (item: FaqItem) => {
        await updateFaqItem(item.id, { ...item, active: !item.active });
        fetchItems();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar esta pregunta?")) return;
        setDeleting(id);
        const res = await deleteFaqItem(id);
        if (res.success) {
            showMsg("success", "Pregunta eliminada");
            fetchItems();
        } else {
            showMsg("error", res.error || "Error al eliminar");
        }
        setDeleting(null);
    };

    const portadaIds = items.filter(i => i.active).slice(0, 4).map(i => i.id);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Preguntas frecuentes</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Las primeras 4 por orden aparecen también en la portada (bloque desplegable); todas aparecen en la página Preguntas.
                </p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5"
            >
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {editing ? "Editar pregunta" : "Agregar nueva pregunta"}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {editing
                            ? "Cambiá el texto y guardá; mantiene su orden y si está activa."
                            : "Se agrega al final de la lista y queda activa (visible en la web)."}
                    </p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">Pregunta</label>
                    <input
                        value={form.question}
                        onChange={e => setForm({ ...form, question: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm"
                        placeholder="Ej: ¿Cuántas unidades es el pedido mínimo?"
                    />
                    <p className="text-xs text-slate-400">Escribila tal como la haría un cliente.</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">Respuesta</label>
                    <textarea
                        value={form.answer}
                        onChange={e => setForm({ ...form, answer: e.target.value })}
                        rows={4}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm leading-relaxed"
                        placeholder="Escribí la respuesta..."
                    />
                    <p className="text-xs text-slate-400">Respuesta corta y clara; se muestra al desplegar la pregunta.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar pregunta"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-5 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}

                    {message.text && (
                        <span className={`text-sm font-bold ${
                            message.type === "success" ? "text-green-600" : "text-red-600"
                        }`}>
                            {message.text}
                        </span>
                    )}
                </div>
            </form>

            {/* LIST */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Preguntas cargadas {!loading && <span className="text-slate-400 font-normal">({items.length})</span>}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Las marcadas con "Portada" son las 4 primeras activas: son las que se ven en la página de inicio.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-[#0081D1]" size={32} />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p className="font-bold text-slate-500">No hay preguntas todavía.</p>
                        <p className="text-xs mt-1">Usá el formulario de arriba para agregar la primera.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`rounded-xl border p-4 flex flex-col sm:flex-row gap-3 sm:items-start transition-all ${
                                    editing?.id === item.id
                                        ? "border-[#0081D1] ring-1 ring-[#0081D1] bg-blue-50/30"
                                        : item.active
                                            ? "border-slate-200 bg-white"
                                            : "border-slate-100 bg-slate-50 opacity-60"
                                }`}
                            >
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center">
                                    {item.order}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <p className="font-bold text-slate-900">{item.question}</p>
                                        {portadaIds.includes(item.id) && (
                                            <span className="text-[11px] font-bold uppercase tracking-wide bg-[#0081D1]/10 text-[#0081D1] rounded-full px-2 py-0.5">
                                                Portada
                                            </span>
                                        )}
                                        {!item.active && (
                                            <span className="text-[11px] font-bold uppercase tracking-wide bg-slate-200 text-slate-500 rounded-full px-2 py-0.5">
                                                Inactiva
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{item.answer}</p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => handleToggleActive(item)}
                                        title={item.active ? "Ocultar en la web" : "Mostrar en la web"}
                                        className={`p-2 rounded-xl transition-colors ${
                                            item.active
                                                ? "text-green-600 hover:bg-green-50"
                                                : "text-slate-400 hover:bg-slate-200"
                                        }`}
                                    >
                                        {item.active ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>

                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="px-3 py-2 text-sm font-bold text-[#0081D1] hover:bg-blue-50 rounded-xl transition-colors"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deleting === item.id}
                                        title="Eliminar"
                                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        {deleting === item.id
                                            ? <Loader2 size={18} className="animate-spin" />
                                            : <Trash2 size={18} />
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
