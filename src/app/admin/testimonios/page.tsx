"use client";

import React, { useState, useEffect } from "react";
import { getAllTestimonials, createTestimonial, updateTestimonial, toggleTestimonial, deleteTestimonial } from "@/actions/testimonialActions";
import { Plus, Save, Loader2, Trash2, Pencil, Eye, EyeOff, Quote } from "lucide-react";

const EMPTY = { name: "", company: "", role: "", content: "", imageUrl: "" };

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
        if (!form.name || !form.company || !form.content) return;
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

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Testimonios</h1>
                    <p className="text-slate-500">Lo que dicen tus clientes. Se muestran en el inicio.</p>
                </div>
                <button
                    onClick={() => showForm ? handleCancel() : setShowForm(true)}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                        showForm ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    }`}
                >
                    <Plus size={18} className={showForm ? "rotate-45" : ""} />
                    {showForm ? "Cancelar" : "Nuevo Testimonio"}
                </button>
            </div>

            {msg && <div className="bg-green-50 text-green-700 font-bold px-5 py-3 rounded-2xl animate-in fade-in">{msg}</div>}

            {showForm && (
                <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-black text-slate-900">{editingId ? "Editar testimonio" : "Nuevo testimonio"}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nombre *</label>
                            <input
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Empresa *</label>
                            <input
                                required
                                value={form.company}
                                onChange={e => setForm({ ...form, company: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Logística del Norte"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cargo (opcional)</label>
                            <input
                                value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Gerente de RRHH"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Foto (URL, opcional)</label>
                            <input
                                value={form.imageUrl}
                                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-700 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Testimonio *</label>
                        <textarea
                            required
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-700 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Qué dijo el cliente sobre tu servicio..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? "Guardando..." : "Guardar Testimonio"}
                    </button>
                </form>
            )}

            {items.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <Quote size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold">No hay testimonios todavía.</p>
                    <p className="text-sm">Agregá el primero con el botón de arriba.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className={`bg-white rounded-2xl border p-6 shadow-sm flex gap-4 items-start transition-all ${item.active ? "border-slate-100" : "border-slate-100 opacity-50"}`}>
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shrink-0" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-black text-lg flex items-center justify-center shrink-0">
                                    {item.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="font-black text-slate-900">{item.name}</p>
                                    <span className="text-slate-300">·</span>
                                    <p className="text-sm text-slate-500 font-medium">{item.role ? `${item.role}, ` : ""}{item.company}</p>
                                    {!item.active && <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Oculto</span>}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">&ldquo;{item.content}&rdquo;</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleToggle(item.id, item.active)} title={item.active ? "Ocultar" : "Mostrar"} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors">
                                    {item.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                <button onClick={() => handleEdit(item)} title="Editar" className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors">
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
    );
}
