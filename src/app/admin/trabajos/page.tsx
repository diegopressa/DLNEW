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

    if (loading && projects.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#0081D1]" /></div>;

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Galería / Trabajos</h1>
                    <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                        Los casos que se muestran en la portada y en la página Trabajos; cada tarjeta que el cliente toca abre WhatsApp.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowAdd(!showAdd);
                        if (showAdd) {
                            setIsEditing(false);
                            setEditId(null);
                        }
                    }}
                    className={showAdd
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl px-6 py-3 flex items-center gap-2 text-sm shrink-0"
                        : "bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 text-sm shrink-0"}
                >
                    <Plus size={18} className={showAdd ? "rotate-45 transition-transform" : "transition-transform"} />
                    {showAdd ? "Cancelar" : "Subir un trabajo"}
                </button>
            </header>

            {/* Aviso: qué se ve en la portada */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
                <ImageIcon size={18} className="text-[#0081D1] mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600">
                    <span className="font-bold text-slate-700">Los primeros 6 trabajos de esta lista salen en la portada del sitio.</span>{" "}
                    Los que tienen la etiqueta <span className="font-bold text-[#0081D1]">En portada</span> son los que el cliente ve al entrar.
                </p>
            </div>

            {/* Formulario de alta / edición */}
            {showAdd && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {isEditing ? <Pencil size={18} className="text-[#0081D1]" /> : <Upload size={18} className="text-[#0081D1]" />}
                            {isEditing ? "Editar trabajo" : "Subir un trabajo nuevo"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Con la foto, el título y la categoría alcanza. La descripción es opcional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna: foto */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 block">Foto del trabajo</label>
                            <p className="text-xs text-slate-400">Una foto clara del producto terminado.</p>
                            <div className="flex items-start gap-4 pt-1">
                                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-[#0081D1] hover:bg-slate-50 cursor-pointer transition-colors">
                                    {uploading
                                        ? <Loader2 size={20} className="animate-spin text-[#0081D1] mb-1" />
                                        : <Upload size={20} className="text-slate-400 mb-1" />}
                                    <span className="text-sm font-bold text-slate-500">
                                        {uploading ? "Subiendo la foto..." : "Tocá acá para elegir la foto"}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                                {newProject.imageUrl && (
                                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                        <img src={newProject.imageUrl} className="w-full h-full object-cover" alt="Vista previa" />
                                    </div>
                                )}
                            </div>
                            <input
                                placeholder="O pegá acá el link de una foto que ya está online"
                                className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm mt-2"
                                value={newProject.imageUrl}
                                onChange={e => setNewProject({ ...newProject, imageUrl: e.target.value })}
                            />
                        </div>

                        {/* Columna: título y categoría */}
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 block">Título</label>
                                <input
                                    placeholder="Ej: Cervecería artesanal"
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm"
                                    value={newProject.title}
                                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-slate-400">El rubro o el cliente, en pocas palabras: &quot;Equipo de fútbol&quot;, &quot;Empresa de limpieza&quot;.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 block">Categoría</label>
                                <input
                                    placeholder="Ej: Remeras estampadas"
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm"
                                    value={newProject.category}
                                    onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                                />
                                <p className="text-xs text-slate-400">Qué prenda se hizo: remeras, buzos, gorros, chalecos, uniformes...</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 block">Descripción (opcional)</label>
                        <textarea
                            placeholder="Ej: 50 remeras con estampado al frente para el personal del local."
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm h-24 resize-none"
                            value={newProject.description}
                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                        />
                        <p className="text-xs text-slate-400">Una línea contando qué se hizo. Si no la ponés, no pasa nada.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || loading}
                        className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isEditing ? "Guardar los cambios" : "Guardar el trabajo"}
                    </button>
                </form>
            )}

            {/* Grilla de trabajos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj, index) => (
                    <div key={proj.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
                        <div className="aspect-[4/3] bg-slate-100 relative">
                            <img
                                src={proj.imageUrl}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                                onError={(e: any) => e.target.src = "https://placehold.co/600x400?text=Error+Cargando+Imagen"}
                            />
                            {index < 6 && (
                                <span className="absolute top-3 left-3 text-xs font-bold text-white bg-[#0081D1] px-3 py-1 rounded-full">
                                    En portada
                                </span>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            {proj.category && (
                                <span className="text-xs font-bold text-[#0081D1] uppercase tracking-wide mb-1">{proj.category}</span>
                            )}
                            <h3 className="text-lg font-bold text-slate-900 truncate">{proj.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{proj.description || "Sin descripción."}</p>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                                <button
                                    onClick={() => handleEdit(proj)}
                                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2"
                                    title="Editar este trabajo"
                                >
                                    <Pencil size={15} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(proj.id)}
                                    className="flex items-center justify-center gap-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl px-4 py-2"
                                    title="Eliminar este trabajo"
                                >
                                    <Trash2 size={15} /> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Estado vacío */}
            {projects.length === 0 && !loading && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 py-16 text-center">
                    <ImageIcon className="mx-auto text-slate-200 mb-4" size={56} />
                    <h3 className="text-lg font-bold text-slate-700">Todavía no hay trabajos cargados</h3>
                    <p className="text-sm text-slate-500 mt-1">Subí el primero con el botón de arriba. Los primeros 6 van a salir en la portada.</p>
                </div>
            )}
        </div>
    );
}
