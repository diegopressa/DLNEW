"use client";

import React, { useState, useEffect } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/actions/categoryActions";
import { Plus, Trash2, Save, Loader2, Image as ImageIcon, Pencil } from "lucide-react";

export default function CategoriesEditor() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newCat, setNewCat] = useState({ name: "", imageUrl: "", description: "", showOnHome: false });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

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
        const data = await getCategories();
        setCategories(data || []);
        setLoading(false);
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
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Categorías de Productos</h1>
                    <p className="text-slate-500">Gestioná las categorías que se muestran en el inicio y en el catálogo.</p>
                </div>
                <button 
                    onClick={() => showAdd ? handleCancel() : setShowAdd(true)}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                        showAdd ? "bg-slate-200 text-slate-600 hover:bg-slate-300" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    }`}
                >
                    {showAdd ? <Plus size={20} className="rotate-45" /> : <Plus size={20} />} 
                    {showAdd ? "Cancelar" : "Nueva Categoría"}
                </button>
            </header>

            {showAdd && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-blue-600 rounded-full" />
                            <h2 className="text-xl font-black text-slate-900">
                                {editingId ? 'Editando Categoría' : 'Crear Nueva Categoría'}
                            </h2>
                        </div>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">¿Mostrar en Inicio?</span>
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={newCat.showOnHome}
                                    onChange={e => setNewCat({...newCat, showOnHome: e.target.checked})}
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${newCat.showOnHome ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${newCat.showOnHome ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </label>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Nombre</label>
                                <input 
                                    placeholder="Ej: Remeras y Polos" 
                                    className="bg-slate-50 p-4 rounded-2xl w-full font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all border border-transparent focus:border-blue-200"
                                    value={newCat.name}
                                    onChange={e => setNewCat({...newCat, name: e.target.value})}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">Imagen de Portada</label>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden flex items-center justify-center relative group">
                                        {newCat.imageUrl ? (
                                            <img src={newCat.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <ImageIcon className="text-slate-300" size={40} />
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 className="animate-spin text-blue-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            id="file-upload" 
                                            hidden 
                                            onChange={handleUpload}
                                        />
                                        <label 
                                            htmlFor="file-upload"
                                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold cursor-pointer hover:bg-slate-800 transition-all shadow-md active:scale-95"
                                        >
                                            <ImageIcon size={18} />
                                            {newCat.imageUrl ? "Cambiar Imagen" : "Subir Imagen"}
                                        </label>
                                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                            Se recomienda una imagen rectangular de alta resolución.<br />Formatos: JPG, PNG o WEBP.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Descripción (Opcional)</label>
                                <textarea 
                                    placeholder="Describe brevemente qué tipo de productos incluye esta categoría..." 
                                    className="bg-slate-50 p-4 rounded-2xl w-full h-[140px] resize-none focus:ring-2 focus:ring-blue-100 outline-none transition-all border border-transparent focus:border-blue-200 text-slate-600 leading-relaxed"
                                    value={newCat.description}
                                    onChange={e => setNewCat({...newCat, description: e.target.value})}
                                />
                            </div>
                            
                            <div className="flex items-end pt-4">
                                <button 
                                    type="submit" 
                                    disabled={!newCat.imageUrl || uploading}
                                    className="w-full bg-green-600 text-white px-8 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50 disabled:grayscale hover:-translate-y-1 active:translate-y-0"
                                >
                                {editingId ? <Pencil size={24} /> : <Save size={24} />} 
                                {editingId ? 'Actualizar Categoría' : 'Guardar Categoría'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex gap-5 items-center group hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-50">
                            <img src={cat.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-extrabold text-slate-900 text-lg mb-1">{cat.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 w-fit px-2 py-1 rounded-md border border-slate-100">
                                    ID: #{cat.id}
                                </p>
                                {cat.showOnHome && (
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 w-fit px-2 py-1 rounded-md border border-blue-100">
                                        En Inicio
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleEdit(cat)}
                                className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                title="Editar"
                            >
                                <Pencil size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(cat.id)}
                                className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <ImageIcon className="mx-auto text-slate-200 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-slate-400">No hay categorías creadas todavía</h3>
                    <p className="text-slate-400 mt-2">Usa el botón superior para empezar a organizar tus productos.</p>
                </div>
            )}
        </div>
    );
}
