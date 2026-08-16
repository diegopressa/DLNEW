"use client";

import React, { useState, useEffect } from "react";
import { getFeatureOptions, addFeatureOption, updateFeatureOption, deleteFeatureOption } from "@/actions/featureOptionActions";
import { Plus, Trash2, Save, Loader2, ListChecks, Pencil, X, Check } from "lucide-react";

export default function CaracteristicasAdmin() {
    const [opciones, setOpciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [filtro, setFiltro] = useState("");

    const [nuevoTexto, setNuevoTexto] = useState("");
    const [editTexto, setEditTexto] = useState("");

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        setLoading(true);
        const data = await getFeatureOptions();
        setOpciones(data);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!nuevoTexto.trim()) return;
        setSaving(true);
        const res = await addFeatureOption(nuevoTexto);
        if (res.success) {
            setNuevoTexto("");
            setShowAdd(false);
            await cargar();
        } else {
            alert(res.error || "No se pudo crear la característica.");
        }
        setSaving(false);
    };

    const handleSaveEdit = async (id: number) => {
        setSaving(true);
        const res = await updateFeatureOption(id, editTexto);
        if (res.success) {
            setEditingId(null);
            await cargar();
            if (res.articulosActualizados) {
                alert(`Texto actualizado también en ${res.articulosActualizados} artículo(s) que la usaban.`);
            }
        } else {
            alert(res.error || "No se pudo guardar.");
        }
        setSaving(false);
    };

    const handleDelete = async (op: any) => {
        if (!confirm(`¿Sacar "${op.text}" del catálogo?\n\nLos artículos que ya la tienen NO la pierden; solo deja de aparecer en el desplegable.`)) return;
        await deleteFeatureOption(op.id);
        await cargar();
    };

    const visibles = filtro.trim()
        ? opciones.filter((o) => o.text.toLowerCase().includes(filtro.trim().toLowerCase()))
        : opciones;

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Características</h1>
                    <p className="text-sm text-slate-500 mt-1">El catálogo de frases que elegís por desplegable al editar la ficha de un artículo.</p>
                </div>
                {showAdd ? (
                    <button
                        onClick={() => setShowAdd(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                ) : (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} />
                        Nueva característica
                    </button>
                )}
            </header>

            {/* Formulario de alta */}
            {showAdd && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-900">Agregar una característica</h2>
                    <p className="text-sm text-slate-500 mt-1">Escribila una sola vez acá y después la elegís en cualquier artículo.</p>
                    <div className="mt-5 flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[260px] space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 block">Texto</label>
                            <input
                                type="text"
                                placeholder="Ej: Logo estampado: frente, espalda o mangas"
                                value={nuevoTexto}
                                onChange={(e) => setNuevoTexto(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={saving || !nuevoTexto.trim()}
                            className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Guardar
                        </button>
                    </div>
                </div>
            )}

            {/* Lista */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Tu catálogo</h2>
                        <p className="text-sm text-slate-500 mt-1">{opciones.length === 1 ? "1 característica cargada." : `${opciones.length} características cargadas.`}</p>
                        <p className="text-xs text-slate-400 mt-1">Al renombrar una, se corrige automáticamente en todos los artículos que la usan — ideal para unificar frases casi iguales. Borrarla solo la saca del desplegable.</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en el catálogo…"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0081D1] text-sm w-64"
                    />
                </div>

                {visibles.length === 0 ? (
                    <div className="py-16 text-center">
                        <ListChecks className="mx-auto text-slate-200 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-400">{filtro ? "Nada coincide con la búsqueda" : "No hay características aún"}</h3>
                        {!filtro && <p className="text-slate-400 text-sm mt-1">Agregá la primera con el botón "Nueva característica".</p>}
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {visibles.map((op) => (
                            <li key={op.id} className="py-3">
                                {editingId === op.id ? (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <input
                                            type="text"
                                            value={editTexto}
                                            onChange={(e) => setEditTexto(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(op.id)}
                                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0081D1] text-sm flex-1 min-w-[220px]"
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={() => handleSaveEdit(op.id)}
                                                disabled={saving}
                                                className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm transition-colors"
                                            >
                                                <X size={16} />
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <p className="flex-1 text-sm font-medium text-slate-800">{op.text}</p>
                                        <button
                                            onClick={() => { setEditingId(op.id); setEditTexto(op.text); }}
                                            className="p-2.5 text-slate-400 hover:text-[#0081D1] hover:bg-blue-50 rounded-xl transition-colors"
                                            title="Renombrar (se actualiza en todos los artículos que la usan)"
                                        >
                                            <Pencil size={17} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(op)}
                                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Sacar del catálogo (los artículos que la usan no cambian)"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
