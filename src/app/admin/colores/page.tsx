"use client";

import React, { useState, useEffect } from "react";
import { getColors, addColor, updateColor, deleteColor } from "@/actions/colorActions";
import { Plus, Trash2, Save, Loader2, Palette, Pencil, X, Check, ToggleLeft, ToggleRight } from "lucide-react";

export default function ColoresAdmin() {
    const [colors, setColors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
    const [editColor, setEditColor] = useState({ name: "", hex: "#000000" });

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
            setNewColor({ name: "", hex: "#000000" });
            setShowAdd(false);
            await loadColors();
        } else {
            alert("Error al crear el color. Es posible que ya exista un color con ese nombre.");
        }
        setSaving(false);
    };

    const handleStartEdit = (color: any) => {
        setEditingId(color.id);
        setEditColor({ name: color.name, hex: color.hex });
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
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Colores</h1>
                    <p className="text-slate-500 mt-1">Gestioná la paleta de colores global. Estos colores se pueden asignar a cualquier producto.</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                >
                    {showAdd ? <X size={18} /> : <Plus size={18} />}
                    {showAdd ? "Cancelar" : "Nuevo Color"}
                </button>
            </header>

            {/* Add form */}
            {showAdd && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-bold text-slate-800 mb-4">Agregar nuevo color</h2>
                    <div className="flex items-end gap-4 flex-wrap">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Muestra</label>
                            <input
                                type="color"
                                value={newColor.hex}
                                onChange={e => setNewColor({ ...newColor, hex: e.target.value })}
                                className="h-12 w-12 rounded-xl cursor-pointer border border-slate-200 p-1 bg-white"
                            />
                        </div>
                        <div className="space-y-1 flex-1 min-w-[160px]">
                            <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej: Azul marino"
                                value={newColor.name}
                                onChange={e => setNewColor({ ...newColor, name: e.target.value })}
                                onKeyDown={e => e.key === "Enter" && handleAdd()}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1 min-w-[120px]">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hex</label>
                            <input
                                type="text"
                                placeholder="#1a2b3c"
                                value={newColor.hex}
                                onChange={e => setNewColor({ ...newColor, hex: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-mono uppercase"
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={saving || !newColor.name.trim()}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Guardar
                        </button>
                    </div>
                </div>
            )}

            {/* Colors grid */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                {colors.length === 0 ? (
                    <div className="py-20 text-center">
                        <Palette className="mx-auto text-slate-200 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-400">No hay colores aún</h3>
                        <p className="text-slate-400 text-sm mt-1">Agregá el primer color usando el botón de arriba.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Color</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Hex</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {colors.map(color => (
                                <tr key={color.id} className={`hover:bg-slate-50/60 transition-colors ${!color.isActive ? "opacity-40" : ""}`}>
                                    <td className="px-6 py-4">
                                        <div
                                            className="w-9 h-9 rounded-lg border border-slate-200 shadow-sm"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === color.id ? (
                                            <input
                                                type="text"
                                                value={editColor.name}
                                                onChange={e => setEditColor({ ...editColor, name: e.target.value })}
                                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-blue-500"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-semibold text-slate-800">{color.name}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === color.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={editColor.hex}
                                                    onChange={e => setEditColor({ ...editColor, hex: e.target.value })}
                                                    className="h-9 w-9 rounded cursor-pointer border-none p-0.5"
                                                />
                                                <input
                                                    type="text"
                                                    value={editColor.hex}
                                                    onChange={e => setEditColor({ ...editColor, hex: e.target.value })}
                                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono uppercase w-28 outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        ) : (
                                            <span className="font-mono text-slate-500 text-xs uppercase">{color.hex}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(color)}
                                            title={color.isActive ? "Desactivar" : "Activar"}
                                            className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                                        >
                                            {color.isActive ? (
                                                <>
                                                    <ToggleRight size={20} className="text-green-500" />
                                                    <span className="text-green-600">Activo</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft size={20} className="text-slate-400" />
                                                    <span className="text-slate-400">Inactivo</span>
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingId === color.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveEdit(color.id)}
                                                        disabled={saving}
                                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                                                        title="Guardar"
                                                    >
                                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"
                                                        title="Cancelar"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleStartEdit(color)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(color.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
