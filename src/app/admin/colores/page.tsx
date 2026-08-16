"use client";

import React, { useState, useEffect } from "react";
import { getColors, addColor, updateColor, deleteColor } from "@/actions/colorActions";
import { fondoColor } from "@/lib/colorUtils";
import { Plus, Trash2, Save, Loader2, Palette, Pencil, X, Check, ToggleLeft, ToggleRight } from "lucide-react";

export default function ColoresAdmin() {
    const [colors, setColors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const [newColor, setNewColor] = useState({ name: "", hex: "#000000", hex2: "" });
    const [editColor, setEditColor] = useState({ name: "", hex: "#000000", hex2: "" });

    useEffect(() => {
        loadColors();
    }, []);

    const loadColors = async () => {
        setLoading(true);
        const data = await getColors();
        setColors(data);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newColor.name.trim()) return;
        setSaving(true);
        const res = await addColor(newColor);
        if (res.success) {
            setNewColor({ name: "", hex: "#000000", hex2: "" });
            setShowAdd(false);
            await loadColors();
        } else {
            alert("Error al crear el color. Es posible que ya exista un color con ese nombre.");
        }
        setSaving(false);
    };

    const handleStartEdit = (color: any) => {
        setEditingId(color.id);
        setEditColor({ name: color.name, hex: color.hex, hex2: color.hex2 || "" });
    };

    const handleSaveEdit = async (id: number) => {
        setSaving(true);
        await updateColor(id, editColor);
        setEditingId(null);
        await loadColors();
        setSaving(false);
    };

    const handleToggleActive = async (color: any) => {
        await updateColor(color.id, { isActive: !color.isActive });
        await loadColors();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este color? Se quitará de todos los productos que lo usen.")) return;
        await deleteColor(id);
        await loadColors();
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Colores</h1>
                    <p className="text-sm text-slate-500 mt-1">La paleta global: estos colores se eligen después en cada artículo.</p>
                </div>
                {showAdd ? (
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                ) : (
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} />
                        Nuevo color
                    </button>
                )}
            </header>

            {/* Formulario de alta */}
            {showAdd && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-900">Agregar un color</h2>
                    <p className="text-sm text-slate-500 mt-1">Ponele un nombre claro y elegí el tono con el selector (o pegá el código hex si lo tenés).</p>

                    <div className="mt-5 flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px] space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 block">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej: Azul marino"
                                value={newColor.name}
                                onChange={e => setNewColor({ ...newColor, name: e.target.value })}
                                onKeyDown={e => e.key === "Enter" && handleAdd()}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm"
                            />
                        </div>
                        <div className="min-w-[200px] space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 block">Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={newColor.hex}
                                    onChange={e => setNewColor({ ...newColor, hex: e.target.value })}
                                    title="Abrir el selector de color"
                                    className="h-11 w-14 shrink-0 rounded-xl cursor-pointer border border-slate-200 bg-white p-1"
                                />
                                <input
                                    type="text"
                                    placeholder="#1A2B3C"
                                    value={newColor.hex}
                                    onChange={e => setNewColor({ ...newColor, hex: e.target.value })}
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm font-mono uppercase"
                                />
                            </div>
                        </div>
                        <div className="min-w-[220px] space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 block">2º color (combinado, opcional)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={newColor.hex2 || "#FBE200"}
                                    onChange={e => setNewColor({ ...newColor, hex2: e.target.value })}
                                    title="Elegir el segundo tono"
                                    className="h-11 w-14 shrink-0 rounded-xl cursor-pointer border border-slate-200 bg-white p-1"
                                />
                                <input
                                    type="text"
                                    placeholder="vacío = liso"
                                    value={newColor.hex2}
                                    onChange={e => setNewColor({ ...newColor, hex2: e.target.value })}
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm font-mono uppercase"
                                />
                                {newColor.hex2 && (
                                    <button
                                        onClick={() => setNewColor({ ...newColor, hex2: "" })}
                                        title="Quitar el segundo tono (queda liso)"
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 block">Vista previa</label>
                            <div
                                className="w-11 h-11 rounded-full border border-slate-200 shadow-sm"
                                style={{ background: fondoColor(newColor.hex, newColor.hex2) }}
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={saving || !newColor.name.trim()}
                            className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Guardar color
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">El cuadradito de la izquierda abre el selector; el código de al lado se completa solo. Para un color combinado (ej. "Negro y Amarillo") cargá también el 2º color: el círculo se muestra partido en dos mitades.</p>
                </div>
            )}

            {/* Lista de colores */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="mb-2">
                    <h2 className="text-lg font-bold text-slate-900">Tu paleta</h2>
                    <p className="text-sm text-slate-500 mt-1">{colors.length === 1 ? "1 color cargado." : `${colors.length} colores cargados.`}</p>
                    <p className="text-xs text-slate-400 mt-1">Desactivar un color lo oculta de los artículos sin borrarlo: lo podés volver a activar cuando quieras.</p>
                </div>

                {colors.length === 0 ? (
                    <div className="py-16 text-center">
                        <Palette className="mx-auto text-slate-200 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-400">No hay colores aún</h3>
                        <p className="text-slate-400 text-sm mt-1">Agregá el primero con el botón "Nuevo color" de arriba.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {colors.map(color => (
                            <li key={color.id} className={`py-4 transition-opacity ${!color.isActive && editingId !== color.id ? "opacity-45" : ""}`}>
                                {editingId === color.id ? (
                                    /* Fila en edición */
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div
                                            className="w-14 h-14 shrink-0 rounded-xl border border-slate-200 shadow-sm"
                                            style={{ background: fondoColor(editColor.hex, editColor.hex2) }}
                                        />
                                        <input
                                            type="text"
                                            value={editColor.name}
                                            onChange={e => setEditColor({ ...editColor, name: e.target.value })}
                                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0081D1] text-sm flex-1 min-w-[160px]"
                                            autoFocus
                                        />
                                        <input
                                            type="color"
                                            value={editColor.hex}
                                            onChange={e => setEditColor({ ...editColor, hex: e.target.value })}
                                            title="Abrir el selector de color"
                                            className="h-11 w-14 shrink-0 rounded-xl cursor-pointer border border-slate-200 bg-white p-1"
                                        />
                                        <input
                                            type="text"
                                            value={editColor.hex}
                                            onChange={e => setEditColor({ ...editColor, hex: e.target.value })}
                                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0081D1] text-sm font-mono uppercase w-32"
                                        />
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-slate-400">2º:</span>
                                            <input
                                                type="color"
                                                value={editColor.hex2 || "#FBE200"}
                                                onChange={e => setEditColor({ ...editColor, hex2: e.target.value })}
                                                title="Segundo tono (combinado)"
                                                className="h-11 w-14 shrink-0 rounded-xl cursor-pointer border border-slate-200 bg-white p-1"
                                            />
                                            <input
                                                type="text"
                                                placeholder="liso"
                                                value={editColor.hex2}
                                                onChange={e => setEditColor({ ...editColor, hex2: e.target.value })}
                                                className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#0081D1] text-sm font-mono uppercase w-28"
                                            />
                                            {editColor.hex2 && (
                                                <button
                                                    onClick={() => setEditColor({ ...editColor, hex2: "" })}
                                                    title="Quitar el segundo tono (queda liso)"
                                                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={15} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={() => handleSaveEdit(color.id)}
                                                disabled={saving}
                                                className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                                                title="Guardar cambios"
                                            >
                                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm transition-colors"
                                                title="Cancelar edición"
                                            >
                                                <X size={16} />
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Fila normal */
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div
                                            className="w-14 h-14 shrink-0 rounded-xl border border-slate-200 shadow-sm"
                                            style={{ background: fondoColor(color.hex, color.hex2) }}
                                        />
                                        <div className="flex-1 min-w-[140px]">
                                            <p className="font-bold text-slate-800 text-sm">{color.name}</p>
                                            <p className="font-mono text-xs text-slate-400 uppercase mt-0.5">{color.hex}{color.hex2 ? ` + ${color.hex2}` : ""}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleActive(color)}
                                            title={color.isActive ? "Desactivar: se deja de mostrar en los artículos" : "Activar: vuelve a estar disponible en los artículos"}
                                            className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                                        >
                                            {color.isActive ? (
                                                <>
                                                    <ToggleRight size={26} className="text-green-500" />
                                                    <span className="text-green-600">Activo</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft size={26} className="text-slate-400" />
                                                    <span className="text-slate-400">Inactivo</span>
                                                </>
                                            )}
                                        </button>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleStartEdit(color)}
                                                className="p-2.5 text-slate-400 hover:text-[#0081D1] hover:bg-blue-50 rounded-xl transition-colors"
                                                title="Editar nombre o color"
                                            >
                                                <Pencil size={17} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(color.id)}
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Eliminar definitivamente"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
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
