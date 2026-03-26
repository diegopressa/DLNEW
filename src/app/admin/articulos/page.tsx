"use client";

import React, { useState, useEffect, useRef } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct, updateProductOrder, toggleProductActive } from "@/actions/productActions";
import { getCategories } from "@/actions/categoryActions";
import { getColors } from "@/actions/colorActions";
import { Plus, Trash2, Save, Loader2, Package, Image as ImageIcon, Pencil, Upload, X, Search, Palette, Pause, Play, Eye, EyeOff } from "lucide-react";

// ─── Color Multi-Select Picker ───────────────────────────────────────────────
function ColorPicker({
    allColors,
    selectedIds,
    onChange,
}: {
    allColors: any[];
    selectedIds: number[];
    onChange: (ids: number[]) => void;
}) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = allColors.filter(c =>
        c.isActive && c.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id: number) => {
        onChange(
            selectedIds.includes(id)
                ? selectedIds.filter(x => x !== id)
                : [...selectedIds, id]
        );
    };

    const selectedColors = allColors.filter(c => selectedIds.includes(c.id));

    return (
        <div className="space-y-2" ref={ref}>
            {/* Selected chips */}
            {selectedColors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedColors.map(c => (
                        <span
                            key={c.id}
                            className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700"
                        >
                            <span className="w-3 h-3 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: c.hex }} />
                            {c.name}
                            <button
                                type="button"
                                onClick={() => toggle(c.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(v => !v)}
                    className="w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:border-blue-400 transition-all text-left"
                >
                    <Palette size={16} className="text-slate-400 shrink-0" />
                    {selectedIds.length === 0
                        ? "Seleccionar colores..."
                        : `${selectedIds.length} color${selectedIds.length !== 1 ? "es" : ""} seleccionado${selectedIds.length !== 1 ? "s" : ""}`
                    }
                </button>

                {open && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-2 border-b border-slate-100">
                            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                                <Search size={14} className="text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Buscar color..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-52 overflow-y-auto py-1">
                            {filtered.length === 0 ? (
                                <p className="text-center text-xs text-slate-400 py-4">No hay colores activos</p>
                            ) : (
                                filtered.map(c => {
                                    const isSelected = selectedIds.includes(c.id);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => toggle(c.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                                isSelected
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            <span
                                                className="w-5 h-5 rounded-md border border-slate-200 shadow-sm shrink-0"
                                                style={{ backgroundColor: c.hex }}
                                            />
                                            <span className="flex-1 text-left font-medium">{c.name}</span>
                                            <span className="font-mono text-xs text-slate-400 uppercase">{c.hex}</span>
                                            {isSelected && (
                                                <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                                                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white fill-current">
                                                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                        {allColors.filter(c => !c.isActive).length > 0 && (
                            <div className="px-4 py-2 border-t border-slate-100 text-xs text-slate-400">
                                {allColors.filter(c => !c.isActive).length} colores inactivos ocultos. Activalos en la sección <strong>Colores</strong>.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Empty form state ─────────────────────────────────────────────────────────
const emptyForm = {
    name: "",
    slug: "",
    description: "",
    highlight: "",
    materials: "",
    categoryId: "",
    images: [""],
    features: [""],
    colorIds: [] as number[],
    hasEmbroidery: false,
    hasScreenPrint: false,
    isActive: true,
    order: 0,
};

// ─── Inline Order Input ───────────────────────────────────────────────────
function OrderInput({ initialOrder, productId, onUpdate }: { initialOrder: number, productId: number, onUpdate: () => void }) {
    const [order, setOrder] = useState(initialOrder);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setOrder(initialOrder);
    }, [initialOrder]);

    const handleSave = async () => {
        if (order === initialOrder) return;
        setSaving(true);
        const res = await updateProductOrder(productId, order);
        if (res.success) {
            onUpdate();
        } else {
            alert("Error al actualizar el orden");
            setOrder(initialOrder);
        }
        setSaving(false);
    };

    return (
        <div className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 hover:border-slate-200 transition-all group/order">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Orden de visualización</span>
            <div className="relative flex items-center">
                <input
                    type="number"
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value) || 0)}
                    onBlur={handleSave}
                    onKeyDown={e => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
                    className={`w-20 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm transition-all ${saving ? 'opacity-50' : ''}`}
                    disabled={saving}
                />
                {saving && (
                    <div className="absolute right-2">
                        <Loader2 size={14} className="animate-spin text-blue-500" />
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductsEditor() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [allColors, setAllColors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("todos");

    const [newProd, setNewProd] = useState(emptyForm);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const [prodData, catData, colorData] = await Promise.all([
            getProducts(),
            getCategories(),
            getColors(),
        ]);
        setProducts(prodData || []);
        setCategories(catData || []);
        setAllColors(colorData || []);
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "articulos");

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                const updatedImages = [...newProd.images];
                updatedImages[index] = data.url;
                setNewProd({ ...newProd, images: updatedImages });
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const addImageField = () => setNewProd({ ...newProd, images: [...newProd.images, ""] });
    const removeImageField = (index: number) => {
        const updated = newProd.images.filter((_, i) => i !== index);
        setNewProd({ ...newProd, images: updated.length ? updated : [""] });
    };

    const addFeature = () => setNewProd({ ...newProd, features: [...newProd.features, ""] });
    const updateFeature = (index: number, val: string) => {
        const updated = [...newProd.features];
        updated[index] = val;
        setNewProd({ ...newProd, features: updated });
    };
    const removeFeature = (index: number) => {
        const updated = newProd.features.filter((_, i) => i !== index);
        setNewProd({ ...newProd, features: updated.length ? updated : [""] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let res;
        if (isEditing && editId) {
            res = await updateProduct(editId, newProd);
        } else {
            res = await addProduct(newProd);
        }

        if (res.success) {
            setShowAdd(false);
            setIsEditing(false);
            setEditId(null);
            setNewProd(emptyForm);
            await loadData();
        } else {
            alert("Error al guardar el producto");
        }
        setLoading(false);
    };

    const handleEdit = (prod: any) => {
        setNewProd({
            name: prod.name,
            slug: prod.slug,
            description: prod.description || "",
            highlight: prod.highlight || "",
            materials: prod.materials || "",
            categoryId: prod.categoryId.toString(),
            images: prod.images.map((img: any) => img.url),
            features: prod.features.map((f: any) => f.text),
            // colors is now ProductColor[] with { color: Color }, extract the colorIds
            colorIds: prod.colors.map((c: any) => c.colorId ?? c.color?.id).filter(Boolean),
            hasEmbroidery: prod.hasEmbroidery ?? false,
            hasScreenPrint: prod.hasScreenPrint ?? false,
            isActive: prod.isActive ?? true,
            order: prod.order ?? 0,
        });
        setEditId(prod.id);
        setIsEditing(true);
        setShowAdd(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Eliminar este artículo?")) {
            await deleteProduct(id);
            loadData();
        }
    };

    const handleToggleActive = async (id: number, isActive: boolean) => {
        await toggleProductActive(id, isActive);
        loadData();
    };

    const filteredProducts = products.filter(p => {
        if (activeTab === "pausados") return !p.isActive;
        if (activeTab === "todos") return p.isActive;
        return p.isActive && p.categoryId.toString() === activeTab;
    });

    if (loading && products.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Artículos / Productos</h1>
                    <p className="text-slate-500">Gestioná el catálogo de prendas de la empresa.</p>
                </div>
                <button
                    onClick={() => {
                        setShowAdd(!showAdd);
                        if (showAdd) { setIsEditing(false); setEditId(null); }
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                >
                    <Plus size={20} /> {showAdd ? "Cancelar" : "Nuevo Artículo"}
                </button>
            </header>

            {/* ── Product form ─────────────────────────────────────────── */}
            {showAdd && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">{isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}</h2>

                    {/* Basic fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nombre del Producto</label>
                            <input
                                placeholder="Ej: Remera Algodón Premium"
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.name}
                                onChange={e => setNewProd({ ...newProd, name: e.target.value, slug: e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Slug (URL)</label>
                            <input
                                placeholder="remera-algodon-premium"
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.slug}
                                onChange={e => setNewProd({ ...newProd, slug: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Categoría</label>
                            <select
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.categoryId}
                                onChange={e => setNewProd({ ...newProd, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Destacado (Highlight)</label>
                            <input
                                placeholder="Ej: Entrega en 24hs"
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.highlight}
                                onChange={e => setNewProd({ ...newProd, highlight: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Orden de visualización</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.order}
                                onChange={e => setNewProd({ ...newProd, order: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Descripción</label>
                        <textarea
                            placeholder="Descripción detallada del producto..."
                            className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100 h-24"
                            value={newProd.description}
                            onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                        />
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700">Galería de Imágenes</label>
                            <button type="button" onClick={addImageField} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                                <Plus size={14} /> Agregar otra imagen
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {newProd.images.map((img, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                placeholder="https://..."
                                                className="bg-white p-2 rounded-lg w-full border border-slate-200 text-xs"
                                                value={img}
                                                onChange={e => {
                                                    const updated = [...newProd.images];
                                                    updated[idx] = e.target.value;
                                                    setNewProd({ ...newProd, images: updated });
                                                }}
                                            />
                                            {newProd.images.length > 1 && (
                                                <button type="button" onClick={() => removeImageField(idx)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <label className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-2 hover:border-blue-400 hover:bg-white cursor-pointer transition-all">
                                            <Upload className="text-slate-400 mr-2" size={14} />
                                            <span className="text-[10px] font-bold text-slate-500">
                                                {uploading ? "Subiendo..." : "Subir archivo"}
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, idx)} />
                                        </label>
                                    </div>
                                    {img && (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                            <img src={img} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features + Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Características */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Características</label>
                                <button type="button" onClick={addFeature} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                                    <Plus size={14} /> Nueva Característica
                                </button>
                            </div>
                            <div className="space-y-2">
                                {newProd.features.map((feat, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            placeholder="Detalle técnico, material, talle..."
                                            className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100 italic"
                                            value={feat}
                                            onChange={e => updateFeature(idx, e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-slate-300 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Colores */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Colores Disponibles</label>
                                <a 
                                    href="/admin/colores" 
                                    target="_blank" 
                                    className="text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline bg-blue-50 px-2 py-1 rounded-lg"
                                >
                                    <Palette size={12} /> Gestionar Panel de Colores
                                </a>
                            </div>

                            {allColors.filter(c => c.isActive).length === 0 ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                                    No hay colores activos. <a href="/admin/colores" className="font-bold underline">Ir a Colores</a> para crear la paleta global.
                                </div>
                            ) : (
                                <ColorPicker
                                    allColors={allColors}
                                    selectedIds={newProd.colorIds}
                                    onChange={ids => setNewProd({ ...newProd, colorIds: ids })}
                                />
                            )}
                        </div>
                    </div>

                    {/* Personalización */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Personalización disponible</label>
                        <p className="text-xs text-slate-400">Activá las técnicas de personalización que aplican a este producto. Se mostrarán como etiquetas en la página del producto.</p>
                        <div className="flex flex-wrap gap-3">
                            {/* Estampado toggle */}
                            <button
                                type="button"
                                onClick={() => setNewProd({ ...newProd, hasScreenPrint: !newProd.hasScreenPrint })}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                    newProd.hasScreenPrint
                                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-emerald-300"
                                }`}
                            >
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                    newProd.hasScreenPrint ? "border-white bg-white" : "border-slate-300"
                                }`}>
                                    {newProd.hasScreenPrint && <span className="w-2 h-2 rounded-full bg-emerald-500 block" />}
                                </span>
                                🎨 Estampado
                            </button>

                            {/* Bordado toggle */}
                            <button
                                type="button"
                                onClick={() => setNewProd({ ...newProd, hasEmbroidery: !newProd.hasEmbroidery })}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                    newProd.hasEmbroidery
                                        ? "bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-200"
                                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-violet-300"
                                }`}
                            >
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                    newProd.hasEmbroidery ? "border-white bg-white" : "border-slate-300"
                                }`}>
                                    {newProd.hasEmbroidery && <span className="w-2 h-2 rounded-full bg-violet-500 block" />}
                                </span>
                                🧵 Bordado
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-50"
                        >
                            <Save size={24} /> {isEditing ? "Actualizar Artículo" : "Guardar Producto"}
                        </button>
                        
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                            <input 
                                type="checkbox"
                                checked={newProd.isActive}
                                onChange={e => setNewProd({...newProd, isActive: e.target.checked})}
                                className="w-5 h-5 accent-blue-600"
                            />
                            <span className="text-sm font-bold text-slate-700">Producto Activo (Visible en la web)</span>
                        </label>
                    </div>
                </form>
            )}

            {/* ── Tabs ── */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-1">
                <button
                    onClick={() => setActiveTab("todos")}
                    className={`px-4 py-2 rounded-t-xl text-sm font-bold transition-all border-b-2 ${
                        activeTab === "todos" 
                        ? "text-blue-600 border-blue-600 bg-blue-50/50" 
                        : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}
                >
                    Todos Activos ({products.filter(p => p.isActive).length})
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id.toString())}
                        className={`px-4 py-2 rounded-t-xl text-sm font-bold transition-all border-b-2 ${
                            activeTab === cat.id.toString() 
                            ? "text-blue-600 border-blue-600 bg-blue-50/50" 
                            : "text-slate-400 border-transparent hover:text-slate-600"
                        }`}
                    >
                        {cat.name} ({products.filter(p => p.isActive && p.categoryId === cat.id).length})
                    </button>
                ))}
                <button
                    onClick={() => setActiveTab("pausados")}
                    className={`ml-auto px-4 py-2 rounded-t-xl text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                        activeTab === "pausados" 
                        ? "text-amber-600 border-amber-600 bg-amber-50" 
                        : "text-slate-400 border-transparent hover:text-amber-500"
                    }`}
                >
                    <Pause size={14} /> Pausados ({products.filter(p => !p.isActive).length})
                </button>
            </div>

            {/* ── Product list ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                    <div key={prod.id} className={`bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow ${!prod.isActive ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                        <div className="aspect-video bg-slate-50 relative overflow-hidden">
                            {prod.images?.[0]?.url ? (
                                <img src={prod.images[0].url} className="w-full h-full object-cover" alt={prod.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                                {prod.category?.name}
                            </div>
                            {/* Color swatches on the card */}
                            {prod.colors?.length > 0 && (
                                <div className="absolute bottom-3 left-3 flex gap-1">
                                    {prod.colors.slice(0, 6).map((pc: any) => (
                                        <span
                                            key={pc.id}
                                            className="w-4 h-4 rounded-full border border-slate-200 shadow-sm"
                                            style={{ backgroundColor: pc.color?.hex ?? "#ccc" }}
                                            title={pc.color?.name}
                                        />
                                    ))}
                                    {prod.colors.length > 6 && (
                                        <span className="text-[10px] text-white font-bold leading-4">+{prod.colors.length - 6}</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{prod.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{prod.description}</p>

                            <div className="mt-auto space-y-4">
                                <OrderInput 
                                    initialOrder={prod.order} 
                                    productId={prod.id} 
                                    onUpdate={loadData} 
                                />

                                <div className="flex justify-between items-center bg-slate-50 -mx-5 -mb-5 p-4 border-t border-slate-100">
                                    <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">/{prod.slug}</span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleToggleActive(prod.id, !prod.isActive)} 
                                            className={`p-2 rounded-lg transition-all ${prod.isActive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-amber-600 bg-amber-50 hover:bg-amber-100'}`} 
                                            title={prod.isActive ? "Pausar" : "Reactivar"}
                                        >
                                            {prod.isActive ? <Pause size={18} /> : <Play size={18} />}
                                        </button>
                                        <button onClick={() => handleEdit(prod)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(prod.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Package className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-500">
                            {activeTab === "pausados" ? "No hay artículos pausados" : "No hay artículos en esta sección"}
                        </h3>
                        <p className="text-slate-400">
                            {activeTab === "pausados" ? "Todos tus productos están visibles en la web." : "Probá seleccionando otra categoría o agregá un producto nuevo."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
