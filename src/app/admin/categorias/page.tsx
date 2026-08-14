"use client";

import React, { useState, useEffect } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory, getCategoriasHeader, updateCategoriasHeader } from "@/actions/categoryActions";
import { Plus, Trash2, Save, Loader2, Image as ImageIcon, Pencil, Layout } from "lucide-react";

const inputClass = "bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm";
const labelClass = "text-sm font-bold text-slate-700";
const helpClass = "text-xs text-slate-400";
const saveButtonClass = "bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors disabled:opacity-50";

export default function CategoriesEditor() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newCat, setNewCat] = useState({ name: "", imageUrl: "", description: "", showOnHome: false });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [header, setHeader] = useState({ title: "", subtitle: "", volumeTitle: "", volumeSubtitle: "", volumeTier1: "", volumeTier1Label: "", volumeTier2: "", volumeTier2Label: "", volumeTier3: "", volumeTier3Label: "" });
    const [savingHeader, setSavingHeader] = useState(false);
    const [headerMsg, setHeaderMsg] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    // Auto-open edit modal if ?edit=ID is present in the URL
    useEffect(() => {
        if (loading || categories.length === 0) return;
        const params = new URLSearchParams(window.location.search);
        const editParam = params.get("edit");
        if (!editParam) return;
        const id = parseInt(editParam, 10);
        if (Number.isNaN(id)) return;
        const cat = categories.find((c) => c.id === id);
        if (cat) {
            handleEdit(cat);
            const url = new URL(window.location.href);
            url.searchParams.delete("edit");
            window.history.replaceState({}, "", url.toString());
        }
    }, [loading, categories]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "categorias");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setNewCat({ ...newCat, imageUrl: data.url });
            }
        } catch (error) {
            console.error("Upload error:", error);
            setError("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const loadData = async () => {
        const [cats, head] = await Promise.all([
            getCategories(),
            getCategoriasHeader()
        ]);
        setCategories(cats || []);
        setHeader(head);
        setLoading(false);
    };

    const handleSaveHeader = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingHeader(true);
        const res = await updateCategoriasHeader(header);
        if (res.success) {
            setHeaderMsg("Encabezado actualizado");
            setTimeout(() => setHeaderMsg(""), 3000);
        }
        setSavingHeader(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!newCat.imageUrl) {
            setError("Debe subir una imagen");
            return;
        }

        try {
            let res;
            if (editingId) {
                res = await updateCategory(editingId, newCat);
            } else {
                res = await addCategory(newCat);
            }

            if (res.success) {
                setShowAdd(false);
                setEditingId(null);
                setNewCat({ name: "", imageUrl: "", description: "", showOnHome: false });
                loadData();
            } else {
                setError("Ocurrió un error al guardar");
            }
        } catch (err) {
            setError("Error de conexión");
        }
    };

    const handleEdit = (cat: any) => {
        setEditingId(cat.id);
        setNewCat({
            name: cat.name,
            imageUrl: cat.imageUrl,
            description: cat.description || "",
            showOnHome: cat.showOnHome || false
        });
        setShowAdd(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Eliminar categoría?")) {
            await deleteCategory(id);
            loadData();
        }
    };

    const handleCancel = () => {
        setShowAdd(false);
        setEditingId(null);
        setNewCat({ name: "", imageUrl: "", description: "", showOnHome: false });
        setError("");
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            {/* ── Encabezado de la página del admin ─────────────────────── */}
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Categorías</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Acá gestionás las categorías que agrupan tus productos y los textos que encabezan la página del catálogo.
                </p>
            </header>

            {/* ── Bloque 1: categorías (lista + formulario) ─────────────── */}
            <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Categorías de productos</h2>
                        <p className="text-sm text-slate-500">
                            Cada tarjeta es una categoría del catálogo. Podés editarla o eliminarla con los botones de la derecha.
                        </p>
                    </div>
                    <button
                        onClick={() => showAdd ? handleCancel() : setShowAdd(true)}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${
                            showAdd
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-[#0081D1] hover:bg-[#006BAE] text-white"
                        }`}
                    >
                        <Plus size={18} className={`transition-transform ${showAdd ? "rotate-45" : ""}`} />
                        {showAdd ? "Cancelar" : "Nueva categoría"}
                    </button>
                </div>

                {showAdd && (
                    <form onSubmit={handleSubmit} className="border border-slate-200 rounded-xl p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h3 className="text-sm font-bold text-slate-900">
                            {editingId ? "Editando categoría" : "Nueva categoría"}
                        </h3>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Nombre</label>
                                    <input
                                        placeholder="Ej: Remeras y Polos"
                                        className={inputClass}
                                        value={newCat.name}
                                        onChange={e => setNewCat({...newCat, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className={labelClass}>Imagen de portada</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden flex items-center justify-center relative flex-shrink-0">
                                            {newCat.imageUrl ? (
                                                <img src={newCat.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <ImageIcon className="text-slate-300" size={32} />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-[#0081D1]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-upload"
                                                hidden
                                                onChange={handleUpload}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                                            >
                                                <ImageIcon size={16} />
                                                {newCat.imageUrl ? "Cambiar imagen" : "Subir imagen"}
                                            </label>
                                            <p className={helpClass}>
                                                Usá una imagen rectangular de buena resolución (JPG, PNG o WEBP).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Descripción</label>
                                    <textarea
                                        placeholder="Contá brevemente qué tipo de productos incluye esta categoría..."
                                        className={`${inputClass} h-[104px] resize-none leading-relaxed`}
                                        value={newCat.description}
                                        onChange={e => setNewCat({...newCat, description: e.target.value})}
                                    />
                                    <p className={helpClass}>Opcional. Se ve debajo del nombre en el catálogo.</p>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={newCat.showOnHome}
                                            onChange={e => setNewCat({...newCat, showOnHome: e.target.checked})}
                                        />
                                        <div className={`block w-12 h-7 rounded-full transition-colors ${newCat.showOnHome ? 'bg-[#0081D1]' : 'bg-slate-200'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${newCat.showOnHome ? 'translate-x-5' : ''}`}></div>
                                    </div>
                                    <div>
                                        <span className={labelClass}>Mostrar en el inicio</span>
                                        <p className={helpClass}>Mostrarla en el mosaico de la portada</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={!newCat.imageUrl || uploading}
                                className={saveButtonClass}
                            >
                                <Save size={18} />
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="text-sm font-bold text-slate-500 hover:text-slate-700 px-4 py-3 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {categories.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
                        <ImageIcon className="mx-auto text-slate-200 mb-3" size={48} />
                        <h3 className="text-lg font-bold text-slate-400">No hay categorías creadas todavía</h3>
                        <p className="text-sm text-slate-400 mt-1">Usá el botón &quot;Nueva categoría&quot; para empezar a organizar tus productos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="border border-slate-100 rounded-xl p-4 flex gap-4 items-center hover:border-[#0081D1]/40 transition-colors">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                                    <img src={cat.imageUrl} className="w-full h-full object-cover" alt={cat.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 truncate">{cat.name}</h3>
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {cat.showOnHome && (
                                            <span className="bg-blue-50 text-[#0081D1] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                En la portada
                                            </span>
                                        )}
                                        {cat.isVisible === false && (
                                            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                Oculta hasta el lanzamiento
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-2.5 text-[#0081D1] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Bloque 2: textos de la página del catálogo ────────────── */}
            <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-[#0081D1] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Layout size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Textos de la página del catálogo</h2>
                        <p className="text-sm text-slate-500">
                            El título, el subtítulo y el bloque de precios por volumen que se ven arriba de todo en la página pública de categorías.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSaveHeader} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className={labelClass}>Título principal</label>
                        <input
                            value={header.title}
                            onChange={e => setHeader({...header, title: e.target.value})}
                            className={inputClass}
                            placeholder="Nuestro Catálogo de Prendas"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className={labelClass}>Subtítulo</label>
                        <textarea
                            value={header.subtitle}
                            onChange={e => setHeader({...header, subtitle: e.target.value})}
                            className={`${inputClass} h-24 resize-none leading-relaxed`}
                            placeholder="Seleccionamos las mejores telas..."
                        />
                        <p className={helpClass}>Texto corto que acompaña al título.</p>
                    </div>

                    <div className="border-t border-slate-100 pt-5 space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-700">Precios por volumen</h3>
                            <p className={helpClass}>El bloque que muestra los rangos de cantidades y sus precios.</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Título del bloque</label>
                            <input
                                value={header.volumeTitle}
                                onChange={e => setHeader({...header, volumeTitle: e.target.value})}
                                className={inputClass}
                                placeholder="Precio especial por volumen"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Descripción del bloque</label>
                            <input
                                value={header.volumeSubtitle}
                                onChange={e => setHeader({...header, volumeSubtitle: e.target.value})}
                                className={inputClass}
                                placeholder="Cuantas más unidades pedís, mejor precio..."
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Rango 1</label>
                                <input value={header.volumeTier1} onChange={e => setHeader({...header, volumeTier1: e.target.value})} className={inputClass} placeholder="10–50" />
                                <input value={header.volumeTier1Label} onChange={e => setHeader({...header, volumeTier1Label: e.target.value})} className={inputClass} placeholder="unidades" />
                                <p className={helpClass}>Cantidad y texto de abajo.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Rango 2</label>
                                <input value={header.volumeTier2} onChange={e => setHeader({...header, volumeTier2: e.target.value})} className={inputClass} placeholder="51–200" />
                                <input value={header.volumeTier2Label} onChange={e => setHeader({...header, volumeTier2Label: e.target.value})} className={inputClass} placeholder="precio mejor" />
                                <p className={helpClass}>Cantidad y texto de abajo.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Rango 3</label>
                                <input value={header.volumeTier3} onChange={e => setHeader({...header, volumeTier3: e.target.value})} className={inputClass} placeholder="+200" />
                                <input value={header.volumeTier3Label} onChange={e => setHeader({...header, volumeTier3Label: e.target.value})} className={inputClass} placeholder="precio especial" />
                                <p className={helpClass}>Cantidad y texto de abajo.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                        <button
                            type="submit"
                            disabled={savingHeader}
                            className={saveButtonClass}
                        >
                            {savingHeader ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Guardar cambios
                        </button>
                        {headerMsg && <span className="text-green-600 text-sm font-bold animate-in fade-in slide-in-from-left-2">{headerMsg}</span>}
                    </div>
                </form>
            </section>
        </div>
    );
}
