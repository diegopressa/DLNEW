"use client";

import React, { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Type, Target, Sparkles, Loader2, Factory, Trash2, Plus, X, Settings, Upload } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { 
    getHeroData, 
    updateHeroTexts, 
    addHeroImage,
    deleteHeroImage,
    getIndustriesSection,
    updateIndustriesSection,
    getIndustries, 
    getSolutionsSection,
    updateSolutionsSection,
    getSolutions, 
    getWhyUs, 
    getProcessSteps, 
    updateIndustry, 
    updateSolution, 
    updateWhyUs, 
    updateProcessStep,
    getCategoriesSection,
    updateCategoriesSection,
    getCategories,
    updateCategory,
    getProjectsSection,
    updateProjectsSection,
    getProjects,
    updateProject,
    addProject,
    deleteProject,
    getWhyUsSection,
    updateWhyUsSection,
    addWhyUs,
    deleteWhyUs,
    getProcessSection,
    updateProcessSection,
    addProcessStep,
    deleteProcessStep,
    getCtaSection,
    updateCtaSection
} from "@/actions/homeActions";

/**
 * HOME EDITOR - STANDARDIZED UPLOAD FLOW
 * Uses /api/upload (Supabase) for all image actions.
 */

export default function HomeEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [hero, setHero] = useState({ title: "", subtitle: "", ctaPrimary: "" });
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const [industriesSection, setIndustriesSection] = useState({ title: "", subtitle: "" });
    const [solutionsSection, setSolutionsSection] = useState({ title: "", subtitle: "" });
    const [categoriesSection, setCategoriesSection] = useState({ title: "", subtitle: "" });
    const [projectsSection, setProjectsSection] = useState({ title: "", subtitle: "" });
    const [whyUsSection, setWhyUsSection] = useState({ title: "", subtitle: "", backgroundColor: "#4b85c1" });
    const [processSection, setProcessSection] = useState({ title: "", subtitle: "" });
    const [ctaSection, setCtaSection] = useState({
        title: "", subtitle: "", buttonText: "", buttonLink: "", smallText: "", backgroundColor: "#1f2937"
    });
    
    const [industries, setIndustries] = useState<any[]>([]);
    const [solutions, setSolutions] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [whyUs, setWhyUs] = useState<any[]>([]);
    const [processSteps, setProcessSteps] = useState<any[]>([]);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const [heroData, indSection, solSection, catSection, projSection, whySection, procSection, ctaData, indData, solData, catData, projData, whyData, procData] = await Promise.all([
            getHeroData(), getIndustriesSection(), getSolutionsSection(), getCategoriesSection(), getProjectsSection(), getWhyUsSection(), getProcessSection(), getCtaSection(),
            getIndustries(), getSolutions(), getCategories(), getProjects(), getWhyUs(), getProcessSteps()
        ]);

        if (heroData) {
            setHero({ title: heroData.title, subtitle: heroData.subtitle, ctaPrimary: heroData.ctaPrimary });
            setHeroImages(heroData.images || []);
        }
        if (indSection) setIndustriesSection(indSection);
        if (solSection) setSolutionsSection(solSection);
        if (catSection) setCategoriesSection(catSection);
        if (projSection) setProjectsSection(projSection);
        if (whySection) setWhyUsSection(whySection);
        if (procSection) setProcessSection(procSection);
        if (ctaData) setCtaSection(ctaData);

        setIndustries(indData || []);
        setSolutions(solData || []);
        setCategories(catData || []);
        setProjects(projData || []);
        setWhyUs(whyData || []);
        setProcessSteps(procData || []);
        setLoading(false);
    };

    // Generic upload helper to use standard /api/upload
    const handleGenericUpload = async (file: File, folder: string) => {
        setUploadingImage(true);
        setMessage({ type: "info", text: "Subiendo imagen..." });
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            setUploadingImage(false);
            return data;
        } catch (error) {
            setUploadingImage(false);
            return { success: false, error: "Error de conexión" };
        }
    };

    const handleHeroFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const res = await handleGenericUpload(file, "home/hero");
        if (res.success) {
            await addHeroImage(res.url);
            const data = await getHeroData();
            setHeroImages(data?.images || []);
            setMessage({ type: "success", text: "Imagen agregada al Hero" });
        } else {
            setMessage({ type: "error", text: res.error });
        }
        if (event.target) event.target.value = "";
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleIndustryImageUpload = async (id: number, index: number, file: File) => {
        const res = await handleGenericUpload(file, "home/industries");
        if (res.success) {
            const newInds = [...industries];
            newInds[index].imageUrl = res.url;
            setIndustries(newInds);
            await updateIndustry(id, { imageUrl: res.url, name: newInds[index].name });
            setMessage({ type: "success", text: "Imagen actualizada" });
        } else setMessage({ type: "error", text: res.error });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleCategoryImageUpload = async (id: number, index: number, file: File) => {
        const res = await handleGenericUpload(file, "home/categories");
        if (res.success) {
            const newCats = [...categories];
            newCats[index].imageUrl = res.url;
            setCategories(newCats);
            await updateCategory(id, { imageUrl: res.url, name: newCats[index].name });
            setMessage({ type: "success", text: "Imagen actualizada" });
        } else setMessage({ type: "error", text: res.error });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleProjectImageUpload = async (id: number, index: number, file: File) => {
        const res = await handleGenericUpload(file, "home/projects");
        if (res.success) {
            const newProjs = [...projects];
            newProjs[index].imageUrl = res.url;
            setProjects(newProjs);
            await updateProject(id, { imageUrl: res.url, title: newProjs[index].title });
            setMessage({ type: "success", text: "Imagen actualizada" });
        } else setMessage({ type: "error", text: res.error });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveHeroTexts = async () => {
        setSaving(true);
        const result = await updateHeroTexts(hero);
        setMessage({ type: result.success ? "success" : "error", text: result.success ? "Textos actualizados" : "Error al guardar" });
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    // ... Repetir lógica de guardado similar para otras secciones
    const handleSaveIndustriesSection = async () => {
        setSaving(true);
        const result = await updateIndustriesSection(industriesSection);
        setMessage({ type: result.success ? "success" : "error", text: result.success ? "Encabezado actualizado" : "Error" });
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveIndustry = async (id: number, index: number) => {
        const ind = industries[index];
        const res = await updateIndustry(id, { name: ind.name, description: ind.description, iconName: ind.iconName });
        if (res.success) setMessage({ type: "success", text: "Guardado" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveSolutionsSection = async () => {
        setSaving(true);
        const res = await updateSolutionsSection(solutionsSection);
        setMessage({ type: res.success ? "success" : "error", text: res.success ? "Encabezado actualizado" : "Error" });
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveSolution = async (id: number, index: number) => {
        const sol = solutions[index];
        const res = await updateSolution(id, { title: sol.title, description: sol.description, iconName: sol.iconName });
        if (res.success) setMessage({ type: "success", text: "Guardado" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveCategoriesSection = async () => {
        setSaving(true);
        const res = await updateCategoriesSection(categoriesSection);
        setMessage({ type: res.success ? "success" : "error", text: res.success ? "Encabezado actualizado" : "Error" });
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveCategory = async (id: number, index: number) => {
        const cat = categories[index];
        const res = await updateCategory(id, { name: cat.name, imageUrl: cat.imageUrl });
        if (res.success) setMessage({ type: "success", text: "Guardado" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveProjectsSection = async () => {
        setSaving(true);
        const res = await updateProjectsSection(projectsSection);
        setMessage({ type: res.success ? "success" : "error", text: res.success ? "Encabezado actualizado" : "Error" });
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveProject = async (id: number, index: number) => {
        const proj = projects[index];
        const res = await updateProject(id, { title: proj.title, category: proj.category, imageUrl: proj.imageUrl });
        if (res.success) setMessage({ type: "success", text: "Guardado" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleAddProject = async () => {
        const res = await addProject({ title: "Nuevo Trabajo", category: "Categoría", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" });
        if (res.success) loadData();
    };

    const handleDeleteProject = async (id: number) => {
        if (confirm("¿Eliminar?")) { await deleteProject(id); loadData(); }
    };

    const handleSaveWhyUsSection = async () => {
        setSaving(true);
        const res = await updateWhyUsSection(whyUsSection);
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleAddWhyUs = async () => {
        const res = await addWhyUs({ title: "Nuevo", description: "..." });
        if (res.success) loadData();
    };

    const handleDeleteWhyUs = async (id: number) => {
        if (confirm("¿Eliminar?")) { await deleteWhyUs(id); loadData(); }
    };

    const handleSaveWhyUs = async (id: number, index: number) => {
        const item = whyUs[index];
        await updateWhyUs(id, { title: item.title, description: item.description });
    };

    const handleSaveProcessSection = async () => {
        setSaving(true);
        await updateProcessSection(processSection);
        setSaving(false);
    };

    const handleAddProcessStep = async () => {
        const res = await addProcessStep({ title: "Paso", description: "..." });
        if (res.success) loadData();
    };

    const handleDeleteProcessStep = async (id: number) => {
        if (confirm("¿Eliminar?")) { await deleteProcessStep(id); loadData(); }
    };

    const handleSaveProcess = async (id: number, index: number) => {
        const item = processSteps[index];
        await updateProcessStep(id, { title: item.title, description: item.description });
    };

    const handleSaveCtaSection = async () => {
        setSaving(true);
        await updateCtaSection(ctaSection);
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" size={48} /></div>;

    return (
        <div className="space-y-10 pb-20">
            <header className="sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-50 border-b border-slate-200 -mx-4 px-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Editor de Inicio</h1>
                    <p className="text-slate-500">Configurá el contenido principal del sitio.</p>
                </div>
                {message.text && (
                    <span className={`text-sm font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </span>
                )}
            </header>

            {/* SECCIÓN HERO */}
            <section id="hero" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-blue-600" /> Sección Hero</h2>
                    <button onClick={handleSaveHeroTexts} disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2">
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Guardar Textos
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <input className="w-full bg-slate-50 p-4 rounded-xl border" value={hero.title} onChange={e => setHero({...hero, title: e.target.value})} placeholder="Título" />
                        <textarea className="w-full bg-slate-50 p-4 rounded-xl border" rows={3} value={hero.subtitle} onChange={e => setHero({...hero, subtitle: e.target.value})} placeholder="Subtítulo" />
                    </div>
                    <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                        <label className="text-sm font-bold flex items-center gap-2"><ImageIcon size={18} /> Imágenes del Rotador</label>
                        <div className="grid grid-cols-2 gap-3">
                            {heroImages.map(img => (
                                <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden group border bg-white">
                                    <img src={img.url} className="w-full h-full object-cover" />
                                    <button onClick={() => deleteHeroImage(img.id).then(loadData)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                </div>
                            ))}
                            <label className="aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
                                <Upload className="text-slate-400" />
                                <span className="text-[10px] font-bold mt-1">SUBIR</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleHeroFileUpload} />
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* INDUSTRIAS */}
            <section id="industries" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <header className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                    <input className="font-bold bg-transparent border-none text-lg p-0" value={industriesSection.title} onChange={e => setIndustriesSection({...industriesSection, title: e.target.value})} />
                    <button onClick={handleSaveIndustriesSection} className="text-blue-600 hover:scale-110 transition-transform"><Save /></button>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {industries.map((ind, i) => (
                        <div key={ind.id} className="p-6 border rounded-2xl space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border bg-slate-50 relative group">
                                    {ind.imageUrl ? <img src={ind.imageUrl} className="w-full h-full object-cover" /> : <Factory className="m-auto mt-4 text-slate-300" />}
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                        <Upload className="text-white" size={20} />
                                        <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleIndustryImageUpload(ind.id, i, e.target.files[0])} />
                                    </label>
                                </div>
                                <input className="font-bold flex-1" value={ind.name} onChange={e => { const n = [...industries]; n[i].name = e.target.value; setIndustries(n); }} />
                                <button onClick={() => handleSaveIndustry(ind.id, i)}><Save size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORÍAS */}
            <section id="categories" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><ImageIcon className="text-blue-600" /> Categorías en Home</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <div key={cat.id} className="text-center space-y-2">
                            <div className="aspect-square rounded-2xl overflow-hidden border relative group shadow-sm">
                                <img src={cat.imageUrl} className="w-full h-full object-cover" />
                                <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                    <Upload className="text-white" />
                                    <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleCategoryImageUpload(cat.id, i, e.target.files[0])} />
                                </label>
                            </div>
                            <input className="text-sm font-bold text-center w-full bg-transparent" value={cat.name} onChange={e => { const n = [...categories]; n[i].name = e.target.value; setCategories(n); }} />
                            <button onClick={() => handleSaveCategory(cat.id, i)} className="text-[10px] font-bold text-blue-600">GUARDAR</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRABAJOS (PROYECTOS) */}
            <section id="projects" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Últimos Trabajos</h2>
                    <button onClick={handleAddProject} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 leading-none">
                        <Plus size={16} /> NUEVO TRABAJO
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((proj, i) => (
                        <div key={proj.id} className="flex gap-4 p-4 border rounded-2xl">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border relative group shrink-0">
                                <img src={proj.imageUrl} className="w-full h-full object-cover" />
                                <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                                    <Upload className="text-white" size={16} />
                                    <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleProjectImageUpload(proj.id, i, e.target.files[0])} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-2">
                                <input className="font-bold w-full" value={proj.title} onChange={e => { const n = [...projects]; n[i].title = e.target.value; setProjects(n); }} />
                                <input className="text-xs text-slate-500 w-full" value={proj.category} onChange={e => { const n = [...projects]; n[i].category = e.target.value; setProjects(n); }} />
                                <div className="flex gap-2">
                                    <button onClick={() => handleSaveProject(proj.id, i)} className="text-[10px] font-bold text-blue-600">GUARDAR</button>
                                    <button onClick={() => handleDeleteProject(proj.id)} className="text-[10px] font-bold text-red-500">ELIMINAR</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section id="cta" className="p-8 rounded-[2rem] border space-y-6" style={{ backgroundColor: ctaSection.backgroundColor }}>
                <h2 className="text-xl font-bold text-white">Sección Final (CTA)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className="bg-white/10 text-white p-4 rounded-xl border border-white/20" value={ctaSection.title} onChange={e => setCtaSection({...ctaSection, title: e.target.value})} />
                    <button onClick={handleSaveCtaSection} className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold">Guardar CTA</button>
                </div>
            </section>
        </div>
    );
}
