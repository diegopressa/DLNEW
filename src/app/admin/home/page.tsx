"use client";

import React, { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Type, Target, Sparkles, Loader2, Factory, Trash2, Plus, X, Settings } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { 
    getHeroData, 
    updateHeroTexts, 
    syncHeroImages,
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

export default function HomeEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [hero, setHero] = useState({
        title: "",
        subtitle: "",
        ctaPrimary: "",
    });
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const [industriesSection, setIndustriesSection] = useState({
        title: "",
        subtitle: ""
    });
    const [solutionsSection, setSolutionsSection] = useState({
        title: "",
        subtitle: ""
    });
    const [categoriesSection, setCategoriesSection] = useState({
        title: "",
        subtitle: ""
    });
    const [projectsSection, setProjectsSection] = useState({
        title: "",
        subtitle: ""
    });
    const [whyUsSection, setWhyUsSection] = useState({
        title: "",
        subtitle: "",
        backgroundColor: "#4b85c1"
    });
    const [processSection, setProcessSection] = useState({
        title: "",
        subtitle: ""
    });
    const [ctaSection, setCtaSection] = useState({
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        smallText: "",
        backgroundColor: "#1f2937"
    });
    const [industries, setIndustries] = useState<any[]>([]);
    const [solutions, setSolutions] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [whyUs, setWhyUs] = useState<any[]>([]);
    const [processSteps, setProcessSteps] = useState<any[]>([]);
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [heroData, indSection, solSection, catSection, projSection, whySection, procSection, ctaData, indData, solData, catData, projData, whyData, procData] = await Promise.all([
            getHeroData(),
            getIndustriesSection(),
            getSolutionsSection(),
            getCategoriesSection(),
            getProjectsSection(),
            getWhyUsSection(),
            getProcessSection(),
            getCtaSection(),
            getIndustries(),
            getSolutions(),
            getCategories(),
            getProjects(),
            getWhyUs(),
            getProcessSteps()
        ]);

        if (heroData) {
            setHero({
                title: heroData.title,
                subtitle: heroData.subtitle,
                ctaPrimary: heroData.ctaPrimary,
            });
            setHeroImages(heroData.images || []);
        }

        if (indSection) {
            setIndustriesSection({
                title: indSection.title,
                subtitle: indSection.subtitle
            });
        }

        if (solSection) {
            setSolutionsSection({
                title: solSection.title,
                subtitle: solSection.subtitle
            });
        }

        if (catSection) {
            setCategoriesSection({
                title: catSection.title,
                subtitle: catSection.subtitle
            });
        }

        if (projSection) {
            setProjectsSection({
                title: projSection.title,
                subtitle: projSection.subtitle
            });
        }

        if (whySection) {
            setWhyUsSection({
                title: whySection.title,
                subtitle: whySection.subtitle,
                backgroundColor: whySection.backgroundColor
            });
        }

        if (procSection) {
            setProcessSection({
                title: procSection.title,
                subtitle: procSection.subtitle
            });
        }

        if (ctaData) {
            setCtaSection({
                title: ctaData.title,
                subtitle: ctaData.subtitle,
                buttonText: ctaData.buttonText,
                buttonLink: ctaData.buttonLink,
                smallText: ctaData.smallText,
                backgroundColor: ctaData.backgroundColor
            });
        }

        setIndustries(indData || []);
        setSolutions(solData || []);
        setCategories(catData || []);
        setProjects(projData || []);
        setWhyUs(whyData || []);
        setProcessSteps(procData || []);
        setLoading(false);
    };

    // Cerrar modal con escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsProjectsModalOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSaveHeroTexts = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        
        try {
            // Save texts and gallery (sync list of URLs)
            const [textResult, imgResult] = await Promise.all([
                updateHeroTexts(hero),
                syncHeroImages(heroImages.map(img => img.url))
            ]);

            if (textResult.success && imgResult.success) {
                setMessage({ type: "success", text: "Hero actualizado correctamente (textos e imágenes)." });
            } else {
                setMessage({ type: "error", text: "Error al actualizar el Hero." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Error de conexión." });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handleAddHeroImage = () => {
        if (!newImageUrl) return;
        setHeroImages([...heroImages, { id: 'link_' + Date.now(), url: newImageUrl }]);
        setNewImageUrl("");
        setMessage({ type: "success", text: "Imagen agregada al borrador (clic en Guardar Textos para publicar)." });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setMessage({ type: "info", text: "Subiendo imagen..." });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "home/hero");

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const res = await response.json();

            if (res.success) {
                setHeroImages([...heroImages, { id: 'new_' + Date.now(), url: res.url }]);
                setMessage({ type: "success", text: "Imagen cargada (clic en Guardar Textos para publicar)." });
            } else {
                setMessage({ type: "error", text: res.error || "Error al subir la imagen." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Error en la conexión." });
        } finally {
            setUploadingImage(false);
            if (event.target) event.target.value = "";
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handleGenericUpload = async (file: File, folder: string = "home") => {
        setUploadingImage(true);
        setMessage({ type: "info", text: "Subiendo imagen..." });
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const res = await response.json();
            return res;
        } catch (error) {
            return { success: false, error: "Error de conexión" };
        } finally {
            setUploadingImage(false);
        }
    };

    const handleIndustryImageUpload = async (id: number, index: number, file: File) => {
        const res = await handleGenericUpload(file, "home/industries");
        if (res.success && res.url) {
            const newInds = [...industries];
            newInds[index].imageUrl = res.url;
            setIndustries(newInds);
            setMessage({ type: "success", text: "Imagen de industria cargada (clic en Guardar para publicar)." });
        } else {
            setMessage({ type: "error", text: "Error al subir imagen." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleCategoryImageUpload = async (id: number, index: number, file: File) => {
        const res = await handleGenericUpload(file, "home/categories");
        if (res.success && res.url) {
            const newCats = [...categories];
            newCats[index].imageUrl = res.url;
            setCategories(newCats);
            setMessage({ type: "success", text: "Imagen de categoría cargada (clic en Guardar para publicar)." });
        } else {
            setMessage({ type: "error", text: "Error al subir imagen." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleProjectImageUpload = async (id: number, index: number, file: File) => {
        const res = await handleGenericUpload(file, "home/projects");
        if (res.success && res.url) {
            const newProjs = [...projects];
            newProjs[index].imageUrl = res.url;
            setProjects(newProjs);
            setMessage({ type: "success", text: "Imagen de trabajo cargada (clic en Guardar para publicar)." });
        } else {
            setMessage({ type: "error", text: "Error al subir imagen." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleDeleteHeroImage = (id: any) => {
        setHeroImages(heroImages.filter(img => img.id !== id));
        setMessage({ type: "info", text: "Imagen quitada (clic en Guardar Textos para confirmar)." });
    };

    const handleSaveIndustriesSection = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        const result = await updateIndustriesSection(industriesSection);
        if (result.success) {
            setMessage({ type: "success", text: "Encabezado de industrias actualizado." });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveIndustry = async (id: number, index: number) => {
        const ind = industries[index];
        const result = await updateIndustry(id, {
            name: ind.name,
            description: ind.description,
            iconName: ind.iconName,
            imageUrl: ind.imageUrl
        });
        if (result.success) {
            setMessage({ type: "success", text: "Industria actualizada." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveSolutionsSection = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        const result = await updateSolutionsSection(solutionsSection);
        if (result.success) {
            setMessage({ type: "success", text: "Encabezado de soluciones actualizado." });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveSolution = async (id: number, index: number) => {
        const sol = solutions[index];
        const result = await updateSolution(id, {
            title: sol.title,
            description: sol.description,
            iconName: sol.iconName
        });
        if (result.success) {
            setMessage({ type: "success", text: "Solución actualizada." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveCategoriesSection = async () => {
        setSaving(true);
        const result = await updateCategoriesSection(categoriesSection);
        if (result.success) {
            setMessage({ type: "success", text: "Encabezado de categorías actualizado." });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveCategory = async (id: number, index: number) => {
        const cat = categories[index];
        const result = await updateCategory(id, {
            name: cat.name,
            imageUrl: cat.imageUrl
        });
        if (result.success) {
            setMessage({ type: "success", text: "Categoría actualizada." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveProjectsSection = async () => {
        setSaving(true);
        const result = await updateProjectsSection(projectsSection);
        if (result.success) {
            setMessage({ type: "success", text: "Encabezado de proyectos actualizado." });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveProject = async (id: number, index: number) => {
        const proj = projects[index];
        const result = await updateProject(id, {
            title: proj.title,
            category: proj.category,
            imageUrl: proj.imageUrl
        });
        if (result.success) {
            setMessage({ type: "success", text: "Proyecto actualizado." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleAddProject = async () => {
        const result = await addProject({
            title: "Nuevo Trabajo",
            category: "Categoría",
            imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
        });
        if (result.success) {
            setMessage({ type: "success", text: "Proyecto agregado." });
            loadData();
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("¿Seguro que querés eliminar este trabajo?")) return;
        const result = await deleteProject(id);
        if (result.success) {
            setMessage({ type: "success", text: "Proyecto eliminado." });
            loadData();
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveWhyUsSection = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        const result = await updateWhyUsSection(whyUsSection);
        if (result.success) {
            setMessage({ type: "success", text: "Encabezado de 'Por qué elegirnos' guardado." });
        } else {
            setMessage({ type: "error", text: "Error al guardar el encabezado." });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleAddWhyUs = async () => {
        const result = await addWhyUs({
            title: "Nuevo Ítem",
            description: "Descripción del nuevo beneficio."
        });
        if (result.success) {
            setMessage({ type: "success", text: "Ítem agregado." });
            loadData();
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleDeleteWhyUs = async (id: number) => {
        if (!confirm("¿Seguro que querés eliminar este ítem?")) return;
        const result = await deleteWhyUs(id);
        if (result.success) {
            setMessage({ type: "success", text: "Ítem eliminado." });
            loadData();
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveWhyUs = async (id: number, index: number) => {
        const item = whyUs[index];
        const result = await updateWhyUs(id, {
            title: item.title,
            description: item.description
        });
        if (result.success) {
            setMessage({ type: "success", text: "Beneficio actualizado." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveProcessSection = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        const result = await updateProcessSection(processSection);
        if (result.success) {
            setMessage({ type: "success", text: "Encabezado de Proceso guardado." });
        } else {
            setMessage({ type: "error", text: "Error al guardar el encabezado." });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleAddProcessStep = async () => {
        const result = await addProcessStep({
            title: "Nuevo Paso",
            description: "Descripción del nuevo paso."
        });
        if (result.success) {
            setMessage({ type: "success", text: "Paso agregado." });
            loadData();
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleDeleteProcessStep = async (id: number) => {
        if (!confirm("¿Seguro que querés eliminar este paso?")) return;
        const result = await deleteProcessStep(id);
        if (result.success) {
            setMessage({ type: "success", text: "Paso eliminado." });
            loadData();
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveProcess = async (id: number, index: number) => {
        const item = processSteps[index];
        const result = await updateProcessStep(id, {
            title: item.title,
            description: item.description
        });
        if (result.success) {
            setMessage({ type: "success", text: "Paso del proceso actualizado." });
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleSaveCtaSection = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        const result = await updateCtaSection(ctaSection);
        if (result.success) {
            setMessage({ type: "success", text: "Llamado a la acción guardado." });
        } else {
            setMessage({ type: "error", text: "Error al guardar llamado a la acción." });
        }
        setSaving(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="font-medium">Cargando editor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-50 border-b border-slate-200 -mx-4 px-4 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Editor de Inicio</h1>
                        <p className="text-slate-500">Modificá los textos y elementos visuales de la página principal.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {message.text && (
                            <span className={`text-sm font-bold animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </span>
                        )}
                    </div>
                </div>

                <nav className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                        { id: 'hero', label: 'Hero', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { id: 'industries', label: 'Industrias', icon: Factory, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { id: 'solutions', label: 'Soluciones', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { id: 'categories', label: 'Categorías', icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { id: 'projects', label: 'Trabajos', icon: ImageIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { id: 'whyus', label: 'Beneficios', icon: Sparkles, color: 'text-green-600', bg: 'bg-green-50' },
                        { id: 'process', label: 'Proceso', icon: Save, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { id: 'cta', label: 'CTA', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((sec) => (
                        <button
                            key={sec.id}
                            onClick={() => {
                                const el = document.getElementById(sec.id);
                                if (el) {
                                    const yOffset = -140; // Ajuste para el header sticky
                                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                    window.scrollTo({ top: y, behavior: 'smooth' });
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all text-sm font-bold whitespace-nowrap shadow-sm hover:shadow active:scale-95 group"
                        >
                            <span className={`${sec.bg} ${sec.color} p-1 rounded-md group-hover:scale-110 transition-transform`}>
                                <sec.icon size={14} />
                            </span>
                            {sec.label}
                        </button>
                    ))}
                </nav>
            </header>

            <section id="hero" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Sparkles size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección Hero (Principal)</h2>
                    </div>
                    <button 
                        onClick={handleSaveHeroTexts}
                        disabled={saving}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Guardar Textos
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Título Principal</label>
                            <input
                                type="text"
                                value={hero.title}
                                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Subtítulo / Bajada</label>
                            <textarea
                                rows={3}
                                value={hero.subtitle}
                                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Texto Botón WhatsApp</label>
                            <input
                                type="text"
                                value={hero.ctaPrimary}
                                onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <ImageIcon size={18} className="text-blue-600" /> 
                                Imágenes del Rotador (Carrusel)
                            </label>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Opción 1: Cargar desde mi computadora</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingImage ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-400'}`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploadingImage ? (
                                                    <Loader2 className="w-8 h-8 mb-3 text-blue-500 animate-spin" />
                                                ) : (
                                                    <Plus className="w-8 h-8 mb-3 text-slate-400" />
                                                )}
                                                <p className="mb-2 text-sm text-slate-500"><span className="font-bold">Click para cargar</span> o arrastrar y soltar</p>
                                                <p className="text-xs text-slate-400">PNG, JPG o WEBP (Máx. 10MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-slate-50 px-2 text-slate-400 font-bold">o también</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Opción 2: Pegar link de imagen externa</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            value={newImageUrl}
                                            onChange={(e) => setNewImageUrl(e.target.value)}
                                            className="flex-1 bg-white border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                                        />
                                        <button 
                                            onClick={handleAddHeroImage}
                                            disabled={saving || !newImageUrl}
                                            className="bg-slate-900 text-white px-4 rounded-xl hover:bg-black transition-all disabled:opacity-50"
                                            title="Agregar por URL"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                {heroImages.length === 0 ? (
                                    <div className="col-span-2 py-10 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <ImageIcon size={32} opacity={0.5} />
                                        <p className="text-xs font-bold uppercase tracking-wider">Sin imágenes</p>
                                    </div>
                                ) : (
                                    heroImages.map((img) => (
                                        <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 bg-white">
                                            <img src={img.url} className="w-full h-full object-cover" alt="Hero" />
                                            <button 
                                                onClick={() => handleDeleteHeroImage(img.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 italic">
                                * Las imágenes rotarán automáticamente cada 3 segundos en el sitio público.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industries Section Editor */}
            <section id="industries" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-50 text-orange-600 p-2 rounded-lg"><Factory size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección: Para quien es DL (Industrias)</h2>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Encabezado de Sección</h3>
                        <button 
                            onClick={handleSaveIndustriesSection}
                            disabled={saving}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={16} />
                            Guardar Encabezado
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Título de Sección</label>
                            <input
                                type="text"
                                value={industriesSection.title}
                                onChange={(e) => setIndustriesSection({ ...industriesSection, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-600/10 focus:border-orange-600 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo de Sección</label>
                            <textarea
                                rows={2}
                                value={industriesSection.subtitle}
                                onChange={(e) => setIndustriesSection({ ...industriesSection, subtitle: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-600/10 focus:border-orange-600 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {industries.map((ind, index) => (
                        <div key={ind.id} className="p-6 border border-slate-100 rounded-2xl space-y-4 hover:border-slate-200 transition-all group">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                    {(() => {
                                        const IconComp = (LucideIcons as any)[ind.iconName] || Factory;
                                        return <IconComp size={20} />;
                                    })()}
                                </div>
                                <input 
                                    className="font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                                    value={ind.name}
                                    onChange={(e) => {
                                        const newInds = [...industries];
                                        newInds[index].name = e.target.value;
                                        setIndustries(newInds);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Imagen de Fondo (Opcional)</label>
                                <div className="flex gap-2">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                        {ind.imageUrl ? (
                                            <img src={ind.imageUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                        {uploadingImage && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={16} /></div>}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            type="text" 
                                            placeholder="URL de imagen..." 
                                            className="w-full text-xs bg-slate-50 border border-slate-100 rounded-lg p-2 focus:ring-1 focus:ring-blue-600/10 outline-none"
                                            value={ind.imageUrl || ""}
                                            onChange={(e) => {
                                                const newInds = [...industries];
                                                newInds[index].imageUrl = e.target.value;
                                                setIndustries(newInds);
                                            }}
                                        />
                                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all">
                                            <Plus size={12} />
                                            Subir Imagen
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleIndustryImageUpload(ind.id, index, file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                                <textarea 
                                    className="w-full text-sm text-slate-500 bg-slate-50 border-none rounded-lg p-3 focus:ring-1 focus:ring-blue-600/10"
                                    value={ind.description || ""}
                                    rows={2}
                                    onChange={(e) => {
                                        const newInds = [...industries];
                                        newInds[index].description = e.target.value;
                                        setIndustries(newInds);
                                    }}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase flex justify-between items-baseline">
                                    <span>Icono</span>
                                    <span className="text-[9px] text-blue-500 lowercase font-normal italic">{ind.iconName}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["Utensils", "HardHat", "Truck", "Shield", "Wrench", "Warehouse", "PartyPopper", "Briefcase", "Factory", "Shirt", "Stethoscope", "ShoppingBag"].map((icon) => {
                                        const IconOption = (LucideIcons as any)[icon] || Factory;
                                        return (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => {
                                                    const newInds = [...industries];
                                                    newInds[index].iconName = icon;
                                                    setIndustries(newInds);
                                                }}
                                                className={`p-2 rounded-lg border transition-all ${
                                                    ind.iconName === icon 
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200" 
                                                        : "bg-white border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500"
                                                }`}
                                            >
                                                <IconOption size={18} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button 
                                onClick={() => handleSaveIndustry(ind.id, index)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 mt-4"
                            >
                                <Save size={18} />
                                Guardar Cambios
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Solutions Section Editor */}
            <section id="solutions" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><Target size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección: Que resuelve DL (Soluciones)</h2>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Encabezado de Sección</h3>
                        <button 
                            onClick={handleSaveSolutionsSection}
                            disabled={saving}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={16} />
                            Guardar Encabezado
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Título de Sección</label>
                            <input
                                type="text"
                                value={solutionsSection.title}
                                onChange={(e) => setSolutionsSection({ ...solutionsSection, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo de Sección</label>
                            <textarea
                                rows={2}
                                value={solutionsSection.subtitle}
                                onChange={(e) => setSolutionsSection({ ...solutionsSection, subtitle: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {solutions.map((sol, index) => (
                        <div key={sol.id} className="p-6 border border-slate-100 rounded-2xl space-y-4 hover:border-slate-200 transition-all group">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                    {(() => {
                                        const IconComp = (LucideIcons as any)[sol.iconName] || LucideIcons.Shirt || Sparkles;
                                        return <IconComp size={20} />;
                                    })()}
                                </div>
                                <input 
                                    className="font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                                    value={sol.title}
                                    onChange={(e) => {
                                        const newSols = [...solutions];
                                        newSols[index].title = e.target.value;
                                        setSolutions(newSols);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                                <textarea 
                                    className="w-full text-sm text-slate-500 bg-slate-50 border-none rounded-lg p-3 focus:ring-1 focus:ring-purple-600/10"
                                    value={sol.description || ""}
                                    rows={3}
                                    onChange={(e) => {
                                        const newSols = [...solutions];
                                        newSols[index].description = e.target.value;
                                        setSolutions(newSols);
                                    }}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase flex justify-between items-baseline">
                                    <span>Icono</span>
                                    <span className="text-[9px] text-purple-500 lowercase font-normal italic">{sol.iconName}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {["Shirt", "Scissors", "Package", "Zap", "Truck", "Star", "Heart", "Smile", "CheckCircle", "Target", "Box", "Layers"].map((icon) => {
                                        const IconOption = (LucideIcons as any)[icon] || LucideIcons.Shirt;
                                        return (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => {
                                                    const newSols = [...solutions];
                                                    newSols[index].iconName = icon;
                                                    setSolutions(newSols);
                                                }}
                                                className={`p-2 rounded-lg border transition-all ${
                                                    sol.iconName === icon 
                                                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200" 
                                                        : "bg-white border-slate-200 text-slate-400 hover:border-purple-300 hover:text-purple-500"
                                                }`}
                                            >
                                                <IconOption size={18} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button 
                                onClick={() => handleSaveSolution(sol.id, index)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200 mt-4"
                            >
                                <Save size={18} />
                                Guardar Cambios
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section Editor */}
            <section id="categories" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><ImageIcon size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección: Tipos de prendas (Categorías)</h2>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Encabezado de Sección</h3>
                        <button 
                            onClick={handleSaveCategoriesSection}
                            disabled={saving}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={16} />
                            Guardar Encabezado
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Título de Sección</label>
                            <input
                                type="text"
                                value={categoriesSection.title}
                                onChange={(e) => setCategoriesSection({ ...categoriesSection, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo de Sección</label>
                            <textarea
                                rows={2}
                                value={categoriesSection.subtitle}
                                onChange={(e) => setCategoriesSection({ ...categoriesSection, subtitle: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, index) => (
                        <div key={cat.id} className="p-6 border border-slate-100 rounded-2xl space-y-4 hover:border-slate-200 transition-all group">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 relative group-hover:shadow-md transition-all">
                                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 flex-col gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Pegar URL de imagen" 
                                        className="w-full bg-white/90 border-none rounded-lg p-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600" 
                                        value={cat.imageUrl}
                                        onChange={(e) => {
                                            const newCats = [...categories];
                                            newCats[index].imageUrl = e.target.value;
                                            setCategories(newCats);
                                        }}
                                    />
                                    <label className="w-full bg-blue-600 text-white py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-all">
                                        <Plus size={14} />
                                        Subir Archivo
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleCategoryImageUpload(cat.id, index, file);
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nombre de Categoría</label>
                                <input 
                                    className="w-full font-bold text-slate-900 bg-slate-50 border-none rounded-lg p-3 focus:ring-1 focus:ring-blue-600/10"
                                    value={cat.name}
                                    onChange={(e) => {
                                        const newCats = [...categories];
                                        newCats[index].name = e.target.value;
                                        setCategories(newCats);
                                    }}
                                />
                            </div>

                            <button 
                                onClick={() => handleSaveCategory(cat.id, index)}
                                className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                            >
                                <Save size={18} />
                                Guardar Categoría
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects Section Editor */}
            <section id="projects" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg"><ImageIcon size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección: Trabajos realizados (Empresas)</h2>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleAddProject}
                            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all active:scale-95"
                        >
                            <Plus size={16} />
                            Rápido
                        </button>
                        <button 
                            onClick={() => setIsProjectsModalOpen(true)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                        >
                            <Settings size={18} />
                            Configurar Galería
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Encabezado de Sección</h3>
                        <button 
                            onClick={handleSaveProjectsSection}
                            disabled={saving}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={16} />
                            Guardar Encabezado
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Título de Sección</label>
                            <input
                                type="text"
                                value={projectsSection.title}
                                onChange={(e) => setProjectsSection({ ...projectsSection, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo de Sección</label>
                            <textarea
                                rows={2}
                                value={projectsSection.subtitle}
                                onChange={(e) => setProjectsSection({ ...projectsSection, subtitle: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    {projects.slice(0, 4).map((proj) => (
                        <div key={proj.id} className="w-20 h-20 rounded-xl overflow-hidden grayscale opacity-50 border border-slate-200">
                            <img src={proj.imageUrl} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {projects.length > 4 && (
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                            +{projects.length - 4} más
                        </div>
                    )}
                </div>
            </section>

            {/* Why Us Section Editor */}
            <section id="whyus" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-50 text-green-600 p-2 rounded-lg"><Sparkles size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección: Por qué elegirnos</h2>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Encabezado y Estilo</h3>
                        <button 
                            onClick={handleSaveWhyUsSection}
                            disabled={saving}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={16} />
                            Guardar Encabezado
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                            <input
                                type="text"
                                value={whyUsSection.title}
                                onChange={(e) => setWhyUsSection({ ...whyUsSection, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo</label>
                            <textarea
                                rows={2}
                                value={whyUsSection.subtitle}
                                onChange={(e) => setWhyUsSection({ ...whyUsSection, subtitle: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Color de Fondo</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={whyUsSection.backgroundColor}
                                    onChange={(e) => setWhyUsSection({ ...whyUsSection, backgroundColor: e.target.value })}
                                    className="h-12 w-12 rounded-xl cursor-pointer border-0 p-1 bg-white"
                                />
                                <input
                                    type="text"
                                    value={whyUsSection.backgroundColor}
                                    onChange={(e) => setWhyUsSection({ ...whyUsSection, backgroundColor: e.target.value })}
                                    className="flex-1 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-600 transition-all text-sm uppercase"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ítems de Beneficios</h3>
                        <button 
                            onClick={handleAddWhyUs}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
                        >
                            <Plus size={16} />
                            Agregar Nuevo Beneficio
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {whyUs.map((item, index) => (
                            <div key={item.id} className="p-6 border border-slate-100 rounded-2xl space-y-4 bg-white hover:border-slate-200 transition-all group shadow-sm">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Título del Beneficio</label>
                                    <input 
                                        className="w-full font-bold text-slate-900 bg-slate-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-600/10"
                                        value={item.title}
                                        onChange={(e) => {
                                            const newData = [...whyUs];
                                            newData[index].title = e.target.value;
                                            setWhyUs(newData);
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Descripción</label>
                                    <textarea 
                                        className="w-full text-xs text-slate-600 bg-slate-50 border-none rounded-lg p-3 focus:ring-2 focus:ring-green-600/10"
                                        value={item.description}
                                        rows={3}
                                        onChange={(e) => {
                                            const newData = [...whyUs];
                                            newData[index].description = e.target.value;
                                            setWhyUs(newData);
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => handleSaveWhyUs(item.id, index)}
                                        className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                                    >
                                        <Save size={14} />
                                        Guardar
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteWhyUs(item.id)}
                                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section Editor */}
            <section id="process" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Save size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección: Así de simple es trabajar con DL</h2>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Encabezado</h3>
                        <button 
                            onClick={handleSaveProcessSection}
                            disabled={saving}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save size={16} />
                            Guardar Encabezado
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Título</label>
                            <input
                                type="text"
                                value={processSection.title}
                                onChange={(e) => setProcessSection({ ...processSection, title: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo (Opcional)</label>
                            <textarea
                                rows={2}
                                value={processSection.subtitle}
                                onChange={(e) => setProcessSection({ ...processSection, subtitle: e.target.value })}
                                className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pasos del Proceso</h3>
                        <button 
                            onClick={handleAddProcessStep}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                        >
                            <Plus size={16} />
                            Agregar Nuevo Paso
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {processSteps.map((step, index) => (
                            <div key={step.id} className="p-4 border border-slate-100 rounded-2xl space-y-4 text-center bg-white group hover:border-slate-200 transition-all shadow-sm flex flex-col items-center">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-blue-100">
                                    {step.number || index + 1}
                                </div>
                                <div className="w-full space-y-2">
                                    <input 
                                        className="font-bold text-slate-900 bg-slate-50 border-none p-2 rounded-lg focus:ring-2 focus:ring-blue-600/10 w-full text-center text-sm"
                                        value={step.title}
                                        onChange={(e) => {
                                            const newData = [...processSteps];
                                            newData[index].title = e.target.value;
                                            setProcessSteps(newData);
                                        }}
                                    />
                                    <textarea 
                                        className="w-full text-xs text-slate-500 bg-slate-50 border-none rounded-lg p-2 text-center focus:ring-2 focus:ring-blue-600/10"
                                        value={step.description || ""}
                                        rows={3}
                                        onChange={(e) => {
                                            const newData = [...processSteps];
                                            newData[index].description = e.target.value;
                                            setProcessSteps(newData);
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2 w-full mt-auto pt-2">
                                    <button 
                                        onClick={() => handleSaveProcess(step.id, index)}
                                        className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                                    >
                                        <Save size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteProcessStep(step.id)}
                                        className="w-10 h-10 shrink-0 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section Editor */}
            <section id="cta" className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 scroll-mt-40">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><Target size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-900">Sección: Llamado a la Acción</h2>
                    </div>
                    <button 
                        onClick={handleSaveCtaSection}
                        disabled={saving}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save size={16} />
                        Guardar Sección
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Título Principal</label>
                            <input
                                type="text"
                                value={ctaSection.title}
                                onChange={(e) => setCtaSection({ ...ctaSection, title: e.target.value })}
                                className="w-full bg-slate-50 border-none p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo Descripción</label>
                            <textarea
                                rows={3}
                                value={ctaSection.subtitle}
                                onChange={(e) => setCtaSection({ ...ctaSection, subtitle: e.target.value })}
                                className="w-full bg-slate-50 border-none p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Texto Pequeño (Bajo el botón)</label>
                            <input
                                type="text"
                                value={ctaSection.smallText}
                                onChange={(e) => setCtaSection({ ...ctaSection, smallText: e.target.value })}
                                className="w-full bg-slate-50 border-none p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 text-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">Configuración del Botón & Estilo</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Texto del Botón</label>
                                <input
                                    type="text"
                                    value={ctaSection.buttonText}
                                    onChange={(e) => setCtaSection({ ...ctaSection, buttonText: e.target.value })}
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">URL o Enlace (ej. #whatsapp)</label>
                                <input
                                    type="text"
                                    value={ctaSection.buttonLink}
                                    onChange={(e) => setCtaSection({ ...ctaSection, buttonLink: e.target.value })}
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Color de Fondo</label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        value={ctaSection.backgroundColor}
                                        onChange={(e) => setCtaSection({ ...ctaSection, backgroundColor: e.target.value })}
                                        className="h-12 w-12 rounded-xl cursor-pointer border-0 p-1 bg-white"
                                    />
                                    <input
                                        type="text"
                                        value={ctaSection.backgroundColor}
                                        onChange={(e) => setCtaSection({ ...ctaSection, backgroundColor: e.target.value })}
                                        className="flex-1 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600/10 text-sm uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Vista previa en miniatura */}
                        <div className="mt-4 p-4 rounded-2xl text-center" style={{ backgroundColor: ctaSection.backgroundColor }}>
                            <p className="text-white font-bold text-sm mb-2">{ctaSection.title}</p>
                            <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-sm pointer-events-none">
                                {ctaSection.buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Proyectos */}
            {isProjectsModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProjectsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Header Modal */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <Settings size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Gestionar Galería de Trabajos</h3>
                                    <p className="text-slate-500 text-sm">Agregá, editá o eliminá las fotos del carrusel</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAddProject}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-100 active:scale-95"
                                >
                                    <Plus size={20} />
                                    Nuevo Trabajo
                                </button>
                                <button
                                    onClick={() => setIsProjectsModalOpen(false)}
                                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content Modal */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {projects.map((proj, index) => (
                                    <div key={proj.id} className="group bg-slate-50/50 border border-slate-100 p-4 rounded-[2rem] space-y-4 hover:border-indigo-100 hover:bg-white transition-all hover:shadow-xl hover:shadow-slate-100/50 relative">
                                        <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-200 relative">
                                            <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3">
                                                <input 
                                                    type="text" 
                                                    placeholder="URL de imagen" 
                                                    className="w-full bg-white/95 border-none rounded-xl p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-600 shadow-lg" 
                                                    value={proj.imageUrl}
                                                    onChange={(e) => {
                                                        const newProjs = [...projects];
                                                        newProjs[index].imageUrl = e.target.value;
                                                        setProjects(newProjs);
                                                    }}
                                                />
                                                <label className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-700 transition-all shadow-lg">
                                                    <Plus size={16} />
                                                    Subir Foto
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleProjectImageUpload(proj.id, index, file);
                                                        }}
                                                    />
                                                </label>
                                                <p className="text-[10px] text-white/70 italic">Pega link o subí captura</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 px-1">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Título del Trabajo</label>
                                                <input 
                                                    className="w-full font-bold text-slate-900 bg-white border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none"
                                                    value={proj.title}
                                                    onChange={(e) => {
                                                        const newProjs = [...projects];
                                                        newProjs[index].title = e.target.value;
                                                        setProjects(newProjs);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Categoría / Ítems</label>
                                                <input 
                                                    className="w-full text-xs text-slate-500 bg-white border border-slate-100 rounded-xl p-3 focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all outline-none font-medium"
                                                    value={proj.category || ""}
                                                    onChange={(e) => {
                                                        const newProjs = [...projects];
                                                        newProjs[index].category = e.target.value;
                                                        setProjects(newProjs);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button 
                                                onClick={() => handleSaveProject(proj.id, index)}
                                                className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-100"
                                            >
                                                <Save size={14} />
                                                Guardar
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProject(proj.id)}
                                                className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all active:scale-95 group-hover:shadow-lg group-hover:shadow-red-50 mt-auto"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                            <p className="text-xs text-slate-400 font-medium">Pulsa ESC para cerrar o haz clic fuera del modal</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

