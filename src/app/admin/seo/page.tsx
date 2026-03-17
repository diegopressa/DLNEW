"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    getSeoPages, upsertSeoPage, getSeoSettings, updateSeoSettings, addSeoPage, deleteSeoPage
} from "@/actions/seoActions";
import {
    Search, Globe, CheckCircle, AlertTriangle, Loader2, Plus, Trash2, Save,
    Eye, Share2, Settings, ChevronRight, Info
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function CharCounter({ value, min, max }: { value: string; min: number; max: number }) {
    const len = (value || "").length;
    const ok = len >= min && len <= max;
    const warn = len > 0 && (len < min || len > max);
    return (
        <span className={`text-xs font-bold ml-2 ${ok ? "text-green-500" : warn ? "text-amber-500" : "text-slate-400"}`}>
            {len} / {max}
            {warn && (len < min ? ` (mín ${min})` : ` (máx ${max})`)}
        </span>
    );
}

function Warn({ msg }: { msg: string }) {
    return (
        <p className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-1">
            <AlertTriangle size={12} /> {msg}
        </p>
    );
}

// ─── Google Preview ──────────────────────────────────────────────────────────

function GooglePreview({ title, slug, description, siteName }: any) {
    const safeTitle = title || `Página | ${siteName}`;
    const safeDesc = description || "Sin descripción.";
    const safeUrl = `dldiseno.uy${slug || "/"}`;
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Search size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vista previa en Google</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 font-sans">
                <p className="text-[13px] text-slate-500 mb-1 truncate">{safeUrl}</p>
                <p className="text-[19px] text-blue-700 font-medium leading-snug mb-1 line-clamp-1 hover:underline cursor-pointer">{safeTitle}</p>
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">{safeDesc}</p>
            </div>
        </div>
    );
}

// ─── Social Preview ──────────────────────────────────────────────────────────

function SocialPreview({ title, description, image, siteName }: any) {
    const safeTitle = title || `Página | ${siteName}`;
    const safeDesc = description || "Sin descripción.";
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Share2 size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vista previa en redes sociales</span>
            </div>
            <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                {image ? (
                    <img src={image} alt="og" className="w-full h-40 object-cover" onError={(e: any) => e.target.style.display = "none"} />
                ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-slate-200">
                        <Globe size={40} className="text-slate-400" />
                    </div>
                )}
                <div className="p-4 bg-white">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">dldiseno.uy</p>
                    <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{safeTitle}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{safeDesc}</p>
                </div>
            </div>
            {!image && <Warn msg="No hay imagen Open Graph configurada. Las redes mostrarán una vista genérica." />}
        </div>
    );
}

// ─── Empty form ──────────────────────────────────────────────────────────────

const emptyForm = {
    pageSlug: "", pageName: "", metaTitle: "", metaDesc: "", keywords: "",
    ogTitle: "", ogDesc: "", ogImage: "", canonicalUrl: "",
    robotsIndex: true, robotsFollow: true,
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SeoAdminPage() {
    const [tab, setTab] = useState<"pages" | "global">("pages");
    const [pages, setPages] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [form, setForm] = useState<any>(emptyForm);
    const [globalSettings, setGlobalSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showAddPage, setShowAddPage] = useState(false);
    const [newPage, setNewPage] = useState({ pageSlug: "", pageName: "" });

    const loadData = useCallback(async () => {
        const [ps, gs] = await Promise.all([getSeoPages(), getSeoSettings()]);
        setPages(ps || []);
        setGlobalSettings(gs || {});
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const selectPage = (p: any) => {
        setSelected(p);
        setForm({
            pageSlug: p.pageSlug || "",
            pageName: p.pageName || "",
            metaTitle: p.metaTitle || "",
            metaDesc: p.metaDesc || "",
            keywords: p.keywords || "",
            ogTitle: p.ogTitle || "",
            ogDesc: p.ogDesc || "",
            ogImage: p.ogImage || "",
            canonicalUrl: p.canonicalUrl || "",
            robotsIndex: p.robotsIndex !== false,
            robotsFollow: p.robotsFollow !== false,
        });
        setSaved(false);
    };

    const f = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.value }));
    const fBool = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.checked }));

    const savePage = async () => {
        if (!form.pageSlug) return;
        setSaving(true);
        const res = await upsertSeoPage(form);
        setSaving(false);
        if (res.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
            await loadData();
        }
    };

    const saveGlobal = async () => {
        setSaving(true);
        const res = await updateSeoSettings(globalSettings);
        setSaving(false);
        if (res.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }
    };

    const handleAddPage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPage.pageSlug || !newPage.pageName) return;
        const slug = newPage.pageSlug.startsWith("/") ? newPage.pageSlug : "/" + newPage.pageSlug;
        const res = await addSeoPage({ ...newPage, pageSlug: slug });
        if (res.success) {
            setShowAddPage(false);
            setNewPage({ pageSlug: "", pageName: "" });
            await loadData();
        }
    };

    const handleDeletePage = async (id: number) => {
        if (!confirm("¿Eliminar esta página SEO?")) return;
        await deleteSeoPage(id);
        setSelected(null);
        await loadData();
    };

    const g = (field: string) => (e: any) =>
        setGlobalSettings((prev: any) => ({ ...prev, [field]: e.target.value }));

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">SEO / Metadatos</h1>
                    <p className="text-slate-500 font-medium mt-1">Administrá la visibilidad de tu web en Google y redes sociales.</p>
                </div>
                {saved && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 font-bold px-5 py-3 rounded-2xl border border-green-100 animate-in fade-in duration-300 shadow-sm">
                        <CheckCircle size={18} /> Guardado correctamente
                    </div>
                )}
            </header>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                {[
                    { key: "pages", label: "Páginas", icon: Globe },
                    { key: "global", label: "Config. Global", icon: Settings },
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key as any)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        <Icon size={16} /> {label}
                    </button>
                ))}
            </div>

            {/* ── TAB: PAGES ── */}
            {tab === "pages" && (
                <div className="flex gap-8 items-start">
                    {/* Left: page list */}
                    <div className="w-64 shrink-0 space-y-2">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Páginas</span>
                            <button
                                onClick={() => setShowAddPage(!showAddPage)}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                title="Agregar página"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {showAddPage && (
                            <form onSubmit={handleAddPage} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3 mb-3 animate-in fade-in duration-200">
                                <input
                                    placeholder="Nombre (ej: Contacto)"
                                    className="w-full bg-slate-50 p-2.5 rounded-xl text-sm border border-slate-100 font-medium"
                                    value={newPage.pageName}
                                    onChange={e => setNewPage({ ...newPage, pageName: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Slug (ej: /contacto)"
                                    className="w-full bg-slate-50 p-2.5 rounded-xl text-sm border border-slate-100 font-medium"
                                    value={newPage.pageSlug}
                                    onChange={e => setNewPage({ ...newPage, pageSlug: e.target.value })}
                                    required
                                />
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-bold">
                                    Agregar
                                </button>
                            </form>
                        )}

                        {pages.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => selectPage(p)}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center justify-between group ${selected?.id === p.id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-100"}`}
                            >
                                <div className="min-w-0">
                                    <p className="font-bold text-sm truncate">{p.pageName}</p>
                                    <p className={`text-xs truncate ${selected?.id === p.id ? "text-blue-100" : "text-slate-400"}`}>{p.pageSlug}</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                    {!p.robotsIndex && <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded">NOINDEX</span>}
                                    <ChevronRight size={14} className={selected?.id === p.id ? "text-blue-200" : "text-slate-300"} />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: form + preview */}
                    {selected ? (
                        <div className="flex-1 min-w-0 space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">{selected.pageName}</h2>
                                        <p className="text-slate-400 text-sm font-medium">{selected.pageSlug}</p>
                                    </div>
                                    <button onClick={() => handleDeletePage(selected.id)} className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all" title="Eliminar página">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Basic */}
                                <section className="space-y-5">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Información básica</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">Nombre de Página</label>
                                            <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={form.pageName} onChange={f("pageName")} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">Slug (URL)</label>
                                            <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.pageSlug} onChange={f("pageSlug")} />
                                            {!form.pageSlug && <Warn msg="El slug no puede estar vacío." />}
                                        </div>
                                    </div>
                                </section>

                                {/* Meta */}
                                <section className="space-y-5">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Meta (Google)</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center">
                                                <label className="text-sm font-bold text-slate-700">Meta Title</label>
                                                <CharCounter value={form.metaTitle} min={30} max={60} />
                                            </div>
                                            <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={form.metaTitle} onChange={f("metaTitle")} placeholder="Ej: Uniformes personalizados | DL Diseño" />
                                            {form.metaTitle && form.metaTitle.length < 30 && <Warn msg="El título es demasiado corto (mínimo 30 caracteres)." />}
                                            {form.metaTitle && form.metaTitle.length > 60 && <Warn msg="El título es demasiado largo (máximo 60 caracteres)." />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center">
                                                <label className="text-sm font-bold text-slate-700">Meta Description</label>
                                                <CharCounter value={form.metaDesc} min={120} max={160} />
                                            </div>
                                            <textarea className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" value={form.metaDesc} onChange={f("metaDesc")} placeholder="Descripcón breve de la página para Google..." />
                                            {form.metaDesc && form.metaDesc.length < 120 && <Warn msg="La descripción es muy corta (mínimo 120 caracteres)." />}
                                            {form.metaDesc && form.metaDesc.length > 160 && <Warn msg="La descripción es muy larga (máximo 160 caracteres)." />}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">Keywords <span className="font-normal text-slate-400">(separadas por coma)</span></label>
                                            <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={form.keywords} onChange={f("keywords")} placeholder="uniformes uruguay, ropa de trabajo..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">URL Canónica <span className="font-normal text-slate-400">(opcional)</span></label>
                                            <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.canonicalUrl} onChange={f("canonicalUrl")} placeholder="https://dldiseno.uy/..." />
                                        </div>
                                    </div>
                                </section>

                                {/* Open Graph */}
                                <section className="space-y-5">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Open Graph (redes sociales)</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center">
                                                <label className="text-sm font-bold text-slate-700">OG Title</label>
                                                <CharCounter value={form.ogTitle} min={20} max={95} />
                                            </div>
                                            <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={form.ogTitle} onChange={f("ogTitle")} placeholder="Ej: Uniformes personalizados para empresas" />
                                            {form.ogTitle && form.ogTitle.length > 95 && <Warn msg="El OG Title es demasiado largo (máximo 95 caracteres)." />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center">
                                                <label className="text-sm font-bold text-slate-700">OG Description</label>
                                                <CharCounter value={form.ogDesc} min={60} max={200} />
                                            </div>
                                            <textarea className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none" value={form.ogDesc} onChange={f("ogDesc")} placeholder="Descripción para compartir en WhatsApp / LinkedIn..." />
                                            {form.ogDesc && form.ogDesc.length < 60 && <Warn msg="OG Description muy corta (mínimo 60 caracteres recomendados)." />}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">OG Image <span className="font-normal text-slate-400">(URL de imagen)</span></label>
                                            <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.ogImage} onChange={f("ogImage")} placeholder="https://..." />
                                            {!form.ogImage && <Warn msg="Sin imagen OG, las redes mostrarán una vista genérica." />}
                                        </div>
                                    </div>
                                </section>

                                {/* Robots */}
                                <section className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Robots / Indexación</h3>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" checked={form.robotsIndex} onChange={fBool("robotsIndex")} />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${form.robotsIndex ? "bg-blue-600" : "bg-slate-200"}`} />
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.robotsIndex ? "left-7" : "left-1"}`} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">Indexar (index)</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" checked={form.robotsFollow} onChange={fBool("robotsFollow")} />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${form.robotsFollow ? "bg-blue-600" : "bg-slate-200"}`} />
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.robotsFollow ? "left-7" : "left-1"}`} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">Seguir enlaces (follow)</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <Info size={12} />
                                        Tag generado: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono ml-1">{`${form.robotsIndex ? "index" : "noindex"}, ${form.robotsFollow ? "follow" : "nofollow"}`}</code>
                                    </p>
                                </section>

                                {/* Save */}
                                <div className="pt-4 border-t border-slate-50">
                                    <button
                                        onClick={savePage}
                                        disabled={saving || !form.pageSlug}
                                        className="w-full md:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-50 active:translate-y-0"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                                        Guardar cambios
                                    </button>
                                </div>
                            </div>

                            {/* Previews */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GooglePreview
                                    title={form.metaTitle}
                                    slug={form.pageSlug}
                                    description={form.metaDesc}
                                    siteName={globalSettings.siteName || "DL Diseño & Estampado"}
                                />
                                <SocialPreview
                                    title={form.ogTitle || form.metaTitle}
                                    description={form.ogDesc || form.metaDesc}
                                    image={form.ogImage}
                                    siteName={globalSettings.siteName || "DL Diseño & Estampado"}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100">
                            <Globe size={60} className="text-slate-200 mb-6" />
                            <h3 className="text-xl font-black text-slate-400">Seleccioná una página</h3>
                            <p className="text-slate-400 font-medium">Elegí una página de la lista para editar su SEO.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── TAB: GLOBAL ── */}
            {tab === "global" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8 max-w-3xl">
                    <div className="border-b border-slate-50 pb-6">
                        <h2 className="text-2xl font-black text-slate-900">Configuración Global SEO</h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">Valores por defecto que se usan cuando una página no tiene datos SEO propios.</p>
                    </div>

                    <section className="space-y-5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Sitio</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Nombre del Sitio</label>
                                <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={globalSettings.siteName || ""} onChange={g("siteName")} placeholder="DL Diseño & Estampado" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Plantilla de Título por Defecto</label>
                                <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={globalSettings.defaultTitleTemplate || ""} onChange={g("defaultTitleTemplate")} placeholder="{{page_title}} | DL Diseño & Estampado" />
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Info size={12} /> Usá {"{{"} page_title {"}} "}como marcador para el título de cada página.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Meta Description por Defecto</label>
                                <textarea className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" value={globalSettings.defaultMetaDesc || ""} onChange={g("defaultMetaDesc")} placeholder="Uniformes y prendas personalizadas para empresas en Uruguay." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Imagen Open Graph por Defecto <span className="font-normal text-slate-400">(URL)</span></label>
                                <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={globalSettings.defaultOgImage || ""} onChange={g("defaultOgImage")} placeholder="https://..." />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Verificación y Analíticas</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Google Search Console — Código de verificación</label>
                                <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={globalSettings.googleSiteVerification || ""} onChange={g("googleSiteVerification")} placeholder="google-site-verification: xxxxxxxx..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Facebook / Meta — Verificación de dominio</label>
                                <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={globalSettings.facebookDomainVerification || ""} onChange={g("facebookDomainVerification")} placeholder="facebook-domain-verification=..." />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Código personalizado</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Código en el {"<head>"}</label>
                                <textarea className="w-full bg-slate-900 text-green-400 p-4 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none h-28 resize-none" value={globalSettings.customHeadCode || ""} onChange={g("customHeadCode")} placeholder="<!-- Google Analytics, Meta Pixel, etc. -->" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Código antes del {"</body>"}</label>
                                <textarea className="w-full bg-slate-900 text-green-400 p-4 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none h-28 resize-none" value={globalSettings.customBodyEndCode || ""} onChange={g("customBodyEndCode")} placeholder="<!-- Scripts adicionales al final -->" />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Robots.txt</h3>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Contenido de robots.txt</label>
                            <textarea className="w-full bg-slate-900 text-green-400 p-4 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none h-36 resize-none" value={globalSettings.robotsTxt || "User-agent: *\nAllow: /"} onChange={g("robotsTxt")} />
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Info size={12} /> El archivo robots.txt se sirve dinámicamente desde <code className="bg-slate-100 px-1.5 py-0.5 rounded">/robots.txt</code></p>
                        </div>
                    </section>

                    <div className="pt-4 border-t border-slate-50">
                        <button
                            onClick={saveGlobal}
                            disabled={saving}
                            className="w-full md:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-50 active:translate-y-0"
                        >
                            {saving ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                            Guardar configuración global
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
