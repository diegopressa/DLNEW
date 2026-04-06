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

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Preguntas Frecuentes</h1>
                <p className="text-slate-500">Administrá las preguntas que aparecen en la web y en /preguntas</p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5"
            >
                <h2 className="text-lg font-black text-slate-800">
                    {editing ? "Editar pregunta" : "Agregar nueva pregunta"}
                </h2>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pregunta</label>
                    <input
                        value={form.question}
                        onChange={e => setForm({ ...form, question: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-800"
                        placeholder="Ej: ¿Cuántas unidades es el pedido mínimo?"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Respuesta</label>
                    <textarea
                        value={form.answer}
                        onChange={e => setForm({ ...form, answer: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 leading-relaxed"
                        placeholder="Escribí la respuesta..."
                    />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar pregunta"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                        >
                            Cancelar
                        </button>
                    )}

                    {message.text && (
                        <span className={`font-black text-sm uppercase animate-in fade-in ${
                            message.type === "success" ? "text-green-600" : "text-red-600"
                        }`}>
                            {message.text}
                        </span>
                    )}
                </div>
            </form>

            {/* LIST */}
            <div className="space-y-3">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">
                    {items.length} {items.length === 1 ? "pregunta" : "preguntas"} cargadas
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600" size={36} />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <p className="font-bold">No hay preguntas todavía.</p>
                        <p className="text-sm mt-1">Usá el formulario de arriba para agregar la primera.</p>
                    </div>
                ) : (
                    items.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl border p-5 flex gap-4 items-start transition-all ${
                                !item.active ? "opacity-50 border-slate-100" : "border-slate-100 shadow-sm"
                            } ${editing?.id === item.id ? "ring-2 ring-blue-500" : ""}`}
                        >
                            <div className="text-slate-300 mt-1 cursor-grab shrink-0">
                                <GripVertical size={18} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 mb-1">{item.question}</p>
                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{item.answer}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleToggleActive(item)}
                                    title={item.active ? "Ocultar en la web" : "Mostrar en la web"}
                                    className={`p-2 rounded-xl transition-colors ${
                                        item.active
                                            ? "text-green-600 hover:bg-green-50"
                                            : "text-slate-400 hover:bg-slate-100"
                                    }`}
                                >
                                    {item.active ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>

                                <button
                                    onClick={() => handleEdit(item)}
                                    className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deleting === item.id}
                                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {deleting === item.id
                                        ? <Loader2 size={18} className="animate-spin" />
                                        : <Trash2 size={18} />
                                    }
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
