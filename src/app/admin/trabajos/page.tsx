"use client";

import React, { useState, useEffect } from "react";
import { getProjects, addProject, deleteProject, updateProject } from "@/actions/galleryActions";
import { Trash2, Plus, Image as ImageIcon, Loader2, Save, Pencil, Upload } from "lucide-react";

export default function GalleryEditor() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const [newProject, setNewProject] = useState({
        title: "",
        category: "",
        imageUrl: "",
        description: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getProjects();
        setProjects(data || []);
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "trabajos");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setNewProject({ ...newProject, imageUrl: data.url });
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        let result;
        if (isEditing && editId) {
            result = await updateProject(editId, newProject);
        } else {
            result = await addProject(newProject);
        }

        if (result.success) {
            setShowAdd(false);
            setIsEditing(false);
            setEditId(null);
            setNewProject({ title: "", category: "", imageUrl: "", description: "" });
            await loadData();
        } else {
            setLoading(false);
            alert("Error al guardar el trabajo");
        }
    };

    const handleEdit = (proj: any) => {
        setNewProject({
            title: proj.title,
            category: proj.category || "",
            imageUrl: proj.imageUrl,
            description: proj.description || ""
        });
        setEditId(proj.id);
        setIsEditing(true);
        setShowAdd(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este trabajo?")) {
            await deleteProject(id);
            loadData();
        }
    };

    if (loading && projects.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Galería de Trabajos</h1>
                    <p className="text-slate-500 font-medium">Gestioná las fotos que aparecen en la sección de trabajos realizados.</p>
                </div>
                <button 
                    onClick={() => {
                        setShowAdd(!showAdd);
                        if (showAdd) {
                            setIsEditing(false);
                            setEditId(null);
                        }
                    }}
                    className={`${showAdd ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white shadow-blue-200'} px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-xl active:scale-95`}
                >
                    {showAdd ? <Plus className="rotate-45" size={20} /> : <Plus size={20} />}
                    {showAdd ? "Cancelar" : "Nuevo Trabajo"}
                </button>
            </header>

            {showAdd && (
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            {isEditing ? <Pencil size={24} /> : <Plus size={24} />}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{isEditing ? "Editar Trabajo" : "Agregar Nuevo Trabajo"}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Título del Proyecto</label>
                                <input 
                                    placeholder="Ej: Uniformes Logística" 
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    value={newProject.title}
                                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Categoría / Servicios</label>
                                <input 
                                    placeholder="Ej: Chalecos y Gorros personalizados" 
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    value={newProject.category}
                                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Imagen del Proyecto</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-6 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
                                            <Upload className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                            <span className="text-sm font-bold text-slate-500">
                                                {uploading ? "Subiendo..." : "Click para subir foto"}
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                    {newProject.imageUrl && (
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                                            <img src={newProject.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                </div>
                                <input 
                                    placeholder="O pegá la URL directa aquí..." 
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs mt-2"
                                    value={newProject.imageUrl}
                                    onChange={e => setNewProject({...newProject, imageUrl: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Breve Descripción (Opcional)</label>
                        <textarea 
                            placeholder="Contanos un poco sobre este trabajo realizado..." 
                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 font-medium"
                            value={newProject.description}
                            onChange={e => setNewProject({...newProject, description: e.target.value})}
                        />
                    </div>

                    <button type="submit" disabled={uploading || loading} className="w-full md:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-50 active:translate-y-0">
                        {loading ? <Loader2 className="animate-spin" /> : (isEditing ? <Pencil size={24} /> : <Save size={24} />)} 
                        {isEditing ? "Actualizar Publicación" : "Guardar Trabajo"}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((proj) => (
                    <div key={proj.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group relative flex flex-col hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-2">
                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                            <img 
                                src={proj.imageUrl} 
                                alt={proj.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                onError={(e: any) => e.target.src = "https://placehold.co/600x400?text=Error+Cargando+Imagen"}
                            />
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                            <div className="absolute top-4 left-4">
                                <span className="text-[10px] uppercase font-black tracking-widest text-blue-700 bg-blue-50/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-blue-100/50">
                                    {proj.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{proj.title}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed">{proj.description || "Sin descripción adicional."}</p>
                            
                            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <button 
                                    onClick={() => handleEdit(proj)}
                                    className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    title="Editar"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(proj.id)}
                                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && !loading && (
                <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                    <ImageIcon className="mx-auto text-slate-200 mb-6" size={80} />
                    <h3 className="text-2xl font-black text-slate-400">No hay trabajos cargados</h3>
                    <p className="text-slate-400 font-medium">Comenzá cargando tu primer éxito en la galería.</p>
                </div>
            )}
        </div>
    );
}
