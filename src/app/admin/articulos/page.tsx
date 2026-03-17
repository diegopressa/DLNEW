"use client";

import React, { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/actions/productActions";
import { getCategories } from "@/actions/categoryActions";
import { Plus, Trash2, Save, Loader2, Package, Image as ImageIcon, Pencil, Upload } from "lucide-react";

export default function ProductsEditor() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const [newProd, setNewProd] = useState({
        name: "",
        slug: "",
        description: "",
        highlight: "",
        materials: "",
        categoryId: "",
        images: [""],
        features: [""],
        colors: [{ name: "", hex: "#000000" }]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [prodData, catData] = await Promise.all([
            getProducts(),
            getCategories()
        ]);
        setProducts(prodData || []);
        setCategories(catData || []);
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
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

    const addColor = () => setNewProd({ ...newProd, colors: [...newProd.colors, { name: "", hex: "#000000" }] });
    const updateColor = (index: number, field: string, val: string) => {
        const updated = [...newProd.colors];
        updated[index] = { ...updated[index], [field]: val };
        setNewProd({ ...newProd, colors: updated });
    };
    const removeColor = (index: number) => {
        const updated = newProd.colors.filter((_, i) => i !== index);
        setNewProd({ ...newProd, colors: updated.length ? updated : [{ name: "", hex: "#000000" }] });
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
            setNewProd({
                name: "",
                slug: "",
                description: "",
                highlight: "",
                materials: "",
                categoryId: "",
                images: [""],
                features: [""],
                colors: [{ name: "", hex: "#000000" }]
            });
            await loadData();
        } else {
            alert("Error al guardar el producto");
        }
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
            colors: prod.colors.map((c: any) => ({ name: c.name, hex: c.hex }))
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
                        if (showAdd) {
                            setIsEditing(false);
                            setEditId(null);
                        }
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                >
                    <Plus size={20} /> {showAdd ? "Cancelar" : "Nuevo Artículo"}
                </button>
            </header>

            {showAdd && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">{isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nombre del Producto</label>
                            <input 
                                placeholder="Ej: Remera Algodón Premium" 
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.name}
                                onChange={e => setNewProd({...newProd, name: e.target.value, slug: e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Slug (URL)</label>
                            <input 
                                placeholder="remera-algodon-premium" 
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.slug}
                                onChange={e => setNewProd({...newProd, slug: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Categoría</label>
                            <select 
                                className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100"
                                value={newProd.categoryId}
                                onChange={e => setNewProd({...newProd, categoryId: e.target.value})}
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
                                onChange={e => setNewProd({...newProd, highlight: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Descripción</label>
                        <textarea 
                            placeholder="Descripción detallada del producto..." 
                            className="bg-slate-50 p-3 rounded-xl w-full border border-slate-100 h-24"
                            value={newProd.description}
                            onChange={e => setNewProd({...newProd, description: e.target.value})}
                        />
                    </div>

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
                                                    setNewProd({...newProd, images: updated});
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
                                <button type="button" onClick={addColor} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                                    <Plus size={14} /> Agregar Color
                                </button>
                            </div>
                            <div className="space-y-2">
                                {newProd.colors.map((color, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <input 
                                            placeholder="Nombre color" 
                                            className="bg-white p-2 rounded-lg flex-1 border border-slate-200 text-sm"
                                            value={color.name}
                                            onChange={e => updateColor(idx, "name", e.target.value)}
                                        />
                                        <input 
                                            type="color"
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none"
                                            value={color.hex}
                                            onChange={e => updateColor(idx, "hex", e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeColor(idx)} className="p-2 text-slate-300 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <button type="submit" disabled={uploading} className="w-full md:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-50">
                            <Save size={24} /> {isEditing ? "Actualizar Artículo" : "Guardar Producto"}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                    <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow">
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
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{prod.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{prod.description}</p>
                            
                            <div className="mt-auto flex justify-between items-center bg-slate-50 -mx-5 -mb-5 p-4 border-t border-slate-100">
                                <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">/{prod.slug}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(prod)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(prod.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {products.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Package className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-500">No hay artículos cargados</h3>
                        <p className="text-slate-400">Comenzá agregando tu primer producto al catálogo.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
