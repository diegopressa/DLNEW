"use client";

import React, { useState, useEffect } from "react";
import { getAllTestimonials, createTestimonial, updateTestimonial, toggleTestimonial, deleteTestimonial } from "@/actions/testimonialActions";
import { Plus, Save, Loader2, Trash2, Pencil, Eye, EyeOff, Quote } from "lucide-react";

const EMPTY = { name: "", company: "", role: "", content: "", imageUrl: "" };

const INPUT_CLASS = "bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm";

export default function TestimoniosAdmin() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => { load(); }, []);

    const load = async () => {
        const data = await getAllTestimonials();
        setItems(data);
        setLoading(false);
    };

    const flash = (text: string) => {
        setMsg(text);
        setTimeout(() => setMsg(""), 3000);
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setForm({ name: item.name, company: item.company, role: item.role || "", content: item.content, imageUrl: item.imageUrl || "" });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.content) return;
        setSaving(true);
        const res = editingId
            ? await updateTestimonial(editingId, form)
            : await createTestimonial(form);
        setSaving(false);
        if (res.success) {
            flash(editingId ? "Testimonio actualizado" : "Testimonio creado");
            handleCancel();
            load();
        }
    };

    const handleToggle = async (id: number, active: boolean) => {
        await toggleTestimonial(id, !active);
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este testimonio?")) return;
        await deleteTestimonial(id);
        load();
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#0081D1]" size={40} /></div>;

    // Los primeros 3 activos (por orden de la lista) son los que salen en la portada
    const featuredIds = items.filter((i) => i.active).slice(0, 3).map((i) => i.id);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Testimonios</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Aparecen en la portada con 5 estrellas; los primeros 3 por orden son los que se muestran.
                    </p>
                </div>
                <button
                    onClick={() => showForm ? handleCancel() : setShowForm(true)}
                    className={`shrink-0 font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors ${
                        showForm
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            : "bg-[#0081D1] hover:bg-[#006BAE] text-white"
                    }`}
                >
                    <Plus size={18} className={showForm ? "rotate-45 transition-transform" : "transition-transform"} />
                    {showForm ? "Cancelar" : "Nuevo testimonio"}
                </button>
            </div>

            {/* Mensaje de confirmación */}
            {msg && (
                <div className="bg-green-50 border border-green-100 text-green-700 text-sm font-bold px-5 py-3 rounded-xl">
                    {msg}
                </div>
            )}

            {/* Formulario de alta / edición */}
            {showForm && (
                <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{editingId ? "Editar testimonio" : "Nuevo testimonio"}</h2>
                        <p className="text-sm text-slate-500">
                            Los campos con * son obligatorios. El resto los podés dejar vacíos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Nombre *</label>
                            <input
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className={INPUT_CLASS}
                                placeholder="Ej: Juan Pérez"
                            />
                            <p className="text-xs text-slate-400">Nombre del cliente tal como querés que se vea.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Empresa (opcional)</label>
                            <input
                                value={form.company}
                                onChange={e => setForm({ ...form, company: e.target.value })}
                                className={INPUT_CLASS}
                                placeholder="Ej: Logística del Norte"
                            />
                            <p className="text-xs text-slate-400">Se muestra al lado del nombre.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Cargo (opcional)</label>
                            <input
                                value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value })}
                                className={INPUT_CLASS}
                                placeholder="Ej: Gerente de RRHH"
                            />
                            <p className="text-xs text-slate-400">Ej: Encargado de compras, Dueño, etc.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Foto (opcional)</label>
                            <input
                                value={form.imageUrl}
                                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                                className={INPUT_CLASS}
                                placeholder="https://..."
                            />
                            <p className="text-xs text-slate-400">Pegá el link de una foto. Si no ponés nada, se muestra la inicial del nombre.</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">Testimonio *</label>
                        <textarea
                            required
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            rows={4}
                            className={`${INPUT_CLASS} leading-relaxed resize-none`}
                            placeholder="Qué dijo el cliente sobre tu servicio..."
                        />
                        <p className="text-xs text-slate-400">Con 2 o 3 frases alcanza. No hace falta poner comillas, se agregan solas.</p>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-slate-500 hover:text-slate-700 text-sm font-bold px-4 py-3 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Lista de testimonios */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Testimonios cargados</h2>
                    <p className="text-sm text-slate-500">
                        El número indica el orden. Los marcados &ldquo;En portada&rdquo; son los que se ven en el inicio.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <Quote size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="font-bold">No hay testimonios todavía.</p>
                        <p className="text-sm">Agregá el primero con el botón de arriba.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {items.map((item, idx) => (
                            <div key={item.id} className={`py-4 first:pt-0 last:pb-0 flex gap-4 items-start transition-opacity ${item.active ? "" : "opacity-50"}`}>
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                                    {idx + 1}
                                </div>
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0" />
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-[#0081D1]/10 text-[#0081D1] font-bold text-lg flex items-center justify-center shrink-0">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <p className="font-bold text-slate-900">{item.name}</p>
                                        {(item.role || item.company) && (
                                            <>
                                                <span className="text-slate-300">·</span>
                                                <p className="text-sm text-slate-500">{item.role ? `${item.role}, ` : ""}{item.company}</p>
                                            </>
                                        )}
                                        {item.active ? (
                                            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Activo</span>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Inactivo</span>
                                        )}
                                        {featuredIds.includes(item.id) && (
                                            <span className="text-xs font-bold text-[#0081D1] bg-[#0081D1]/10 px-2 py-0.5 rounded-full">En portada</span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">&ldquo;{item.content}&rdquo;</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleToggle(item.id, item.active)} title={item.active ? "Ocultar de la portada" : "Volver a mostrar"} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-[#0081D1] hover:bg-[#0081D1]/10 flex items-center justify-center transition-colors">
                                        {item.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button onClick={() => handleEdit(item)} title="Editar" className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-[#0081D1] hover:bg-[#0081D1]/10 flex items-center justify-center transition-colors">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} title="Eliminar" className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors">
                                        <Trash2 size={16} />
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
