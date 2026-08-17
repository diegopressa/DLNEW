"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    getSeoPages, upsertSeoPage, getSeoSettings, updateSeoSettings, addSeoPage, deleteSeoPage
} from "@/actions/seoActions";
import {
    Search, Globe, CheckCircle, AlertTriangle, Loader2, Plus, Trash2, Save,
    Eye, Share2, Settings, ChevronRight, Info
} from "lucide-react";

// ─── Estilos compartidos ─────────────────────────────────────────────────────

const inputCls = "bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm";
const codeCls = "w-full bg-slate-900 text-green-400 border border-slate-800 rounded-xl p-3 font-mono text-xs outline-none focus:border-[#0081D1] resize-none";
const saveBtnCls = "bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors disabled:opacity-50";

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

// Tarjeta blanca con título y descripción
function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5 mb-5">{desc}</p>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

// ─── Vista previa en Google ──────────────────────────────────────────────────

function GooglePreview({ title, slug, description, siteName }: any) {
    const safeTitle = title || `Página | ${siteName}`;
    const safeDesc = description || "Sin descripción todavía.";
    const safeUrl = `dldisenoyestampado.uy${slug || "/"}`;
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Search size={12} /> Así se ve en Google
            </p>
            <div className="bg-white rounded-lg border border-slate-100 p-4">
                <p className="text-[13px] text-slate-500 mb-1 truncate">{safeUrl}</p>
                <p className="text-[19px] text-blue-700 font-medium leading-snug mb-1 line-clamp-1">{safeTitle}</p>
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">{safeDesc}</p>
            </div>
        </div>
    );
}

// ─── Vista previa en redes ───────────────────────────────────────────────────

function SocialPreview({ title, description, image, siteName }: any) {
    const safeTitle = title || `Página | ${siteName}`;
    const safeDesc = description || "Sin descripción todavía.";
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Share2 size={12} /> Así se ve al compartir el link
            </p>
            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 max-w-sm">
                {image ? (
                    <img src={image} alt="Vista previa" className="w-full h-36 object-cover" onError={(e: any) => e.target.style.display = "none"} />
                ) : (
                    <div className="w-full h-36 flex items-center justify-center bg-slate-100">
                        <Globe size={36} className="text-slate-300" />
                    </div>
                )}
                <div className="p-3">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">dldisenoyestampado.uy</p>
                    <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{safeTitle}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{safeDesc}</p>
                </div>
            </div>
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
        <div className="space-y-10 pb-12">
            {/* Aviso de guardado */}
            {saved && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-50 text-green-700 font-bold px-5 py-3 rounded-2xl border border-green-200 shadow-lg animate-in fade-in duration-300">
                    <CheckCircle size={18} /> Guardado correctamente
                </div>
            )}

            {/* Header */}
            <header>
                <h1 className="text-3xl font-black text-slate-900">SEO / Metadatos</h1>
                <p className="text-slate-500 font-medium mt-1 max-w-2xl">
                    Acá controlás cómo se ve tu web cuando aparece en Google y cuando compartís un link
                    por WhatsApp o redes. No hace falta saber de técnica: cada campo tiene su explicación.
                </p>
            </header>

            {/* ══ BLOQUE 1: CONFIGURACIÓN GENERAL ══ */}
            <section className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0081D1]/10 text-[#0081D1] flex items-center justify-center shrink-0">
                        <Settings size={18} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Configuración general</h2>
                        <p className="text-sm text-slate-500">
                            Datos que valen para toda la web. Se usan cuando una página no tiene sus propios textos.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl space-y-5">
                    <Card
                        title="Datos del sitio"
                        desc="El nombre y los textos por defecto de tu web."
                    >
                        <div>
                            <label className="text-sm font-bold text-slate-700">Nombre del sitio</label>
                            <p className="text-xs text-slate-400 mb-1.5">El nombre de tu negocio, tal como querés que aparezca en Google y en redes.</p>
                            <input className={inputCls} value={globalSettings.siteName || ""} onChange={g("siteName")} placeholder="DL Diseño & Estampado" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700">Plantilla de título</label>
                            <p className="text-xs text-slate-400 mb-1.5">
                                Cómo se arma el título de cada página. Dejá {"{{page_title}}"} donde va el nombre de la página; el resto se repite en todas.
                            </p>
                            <input className={`${inputCls} font-mono`} value={globalSettings.defaultTitleTemplate || ""} onChange={g("defaultTitleTemplate")} placeholder="{{page_title}} | DL Diseño & Estampado" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700">Descripción por defecto</label>
                                <CharCounter value={globalSettings.defaultMetaDesc || ""} min={1} max={160} />
                            </div>
                            <p className="text-xs text-slate-400 mb-1.5">El textito gris que aparece debajo del título en Google cuando una página no tiene descripción propia. Ideal hasta 160 caracteres.</p>
                            <textarea className={`${inputCls} h-24 resize-none`} value={globalSettings.defaultMetaDesc || ""} onChange={g("defaultMetaDesc")} placeholder="Uniformes y prendas personalizadas para empresas en Uruguay." />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700">Imagen para compartir por defecto</label>
                            <p className="text-xs text-slate-400 mb-1.5">La foto que se muestra al compartir un link de tu web, si la página no tiene una propia. Pegá acá el link (URL) de la imagen.</p>
                            <input className={`${inputCls} font-mono`} value={globalSettings.defaultOgImage || ""} onChange={g("defaultOgImage")} placeholder="https://..." />
                        </div>
                    </Card>

                    <Card
                        title="Verificaciones"
                        desc="Códigos que Google y Meta te dan para confirmar que la web es tuya. Pegalos tal cual te los dieron."
                    >
                        <div>
                            <label className="text-sm font-bold text-slate-700">Google Search Console</label>
                            <p className="text-xs text-slate-400 mb-1.5">
                                Pegá acá la etiqueta que te da Google (opción &quot;Etiqueta HTML&quot;), entera o solo el código —
                                nosotros nos quedamos con lo que hace falta. Guardá y recién ahí tocá &quot;Verificar&quot; en Google.
                            </p>
                            <input className={`${inputCls} font-mono`} value={globalSettings.googleSiteVerification || ""} onChange={g("googleSiteVerification")} placeholder='<meta name="google-site-verification" content="..." />' />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700">Facebook / Meta</label>
                            <p className="text-xs text-slate-400 mb-1.5">Código de verificación de dominio de Meta.</p>
                            <input className={`${inputCls} font-mono`} value={globalSettings.facebookDomainVerification || ""} onChange={g("facebookDomainVerification")} placeholder="facebook-domain-verification=..." />
                        </div>
                    </Card>

                    <Card
                        title="Código extra (avanzado)"
                        desc="Solo tocá esto si alguien técnico te pasó un código para pegar. Si no, dejalo como está."
                    >
                        <div>
                            <label className="text-sm font-bold text-slate-700">Código en el {"<head>"}</label>
                            <p className="text-xs text-slate-400 mb-1.5">Por ejemplo: Google Analytics, Meta Pixel.</p>
                            <textarea className={`${codeCls} h-28`} value={globalSettings.customHeadCode || ""} onChange={g("customHeadCode")} placeholder="<!-- Google Analytics, Meta Pixel, etc. -->" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700">Código antes del {"</body>"}</label>
                            <p className="text-xs text-slate-400 mb-1.5">Scripts que van al final de la página.</p>
                            <textarea className={`${codeCls} h-28`} value={globalSettings.customBodyEndCode || ""} onChange={g("customBodyEndCode")} placeholder="<!-- Scripts adicionales al final -->" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700">Robots.txt</label>
                            <p className="text-xs text-slate-400 mb-1.5">
                                Le dice a Google qué partes de la web puede recorrer. Se sirve automáticamente en /robots.txt. No lo cambies sin ayuda técnica.
                            </p>
                            <textarea className={`${codeCls} h-36`} value={globalSettings.robotsTxt || "User-agent: *\nAllow: /"} onChange={g("robotsTxt")} />
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <button onClick={saveGlobal} disabled={saving} className={saveBtnCls}>
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </section>

            <div className="border-t border-slate-200" />

            {/* ══ BLOQUE 2: POR PÁGINA ══ */}
            <section className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0081D1]/10 text-[#0081D1] flex items-center justify-center shrink-0">
                        <Globe size={18} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Por página</h2>
                        <p className="text-sm text-slate-500">
                            Elegí una página de la lista y editá cómo se muestra en Google y al compartirla.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Lista de páginas */}
                    <div className="w-full lg:w-72 shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Tus páginas</h3>
                                    <p className="text-sm text-slate-500">Tocá una para editarla.</p>
                                </div>
                                <button
                                    onClick={() => setShowAddPage(!showAddPage)}
                                    className="p-2 bg-[#0081D1]/10 text-[#0081D1] rounded-xl hover:bg-[#0081D1] hover:text-white transition-all shrink-0"
                                    title="Agregar página"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {showAddPage && (
                                <form onSubmit={handleAddPage} className="space-y-3 mt-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                                    <input
                                        placeholder="Nombre (ej: Contacto)"
                                        className={inputCls}
                                        value={newPage.pageName}
                                        onChange={e => setNewPage({ ...newPage, pageName: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="Dirección (ej: /contacto)"
                                        className={`${inputCls} font-mono`}
                                        value={newPage.pageSlug}
                                        onChange={e => setNewPage({ ...newPage, pageSlug: e.target.value })}
                                        required
                                    />
                                    <button type="submit" className="w-full bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center justify-center gap-2 text-sm transition-colors">
                                        <Plus size={16} /> Agregar página
                                    </button>
                                </form>
                            )}

                            <div className="space-y-2 mt-4">
                                {pages.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => selectPage(p)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${selected?.id === p.id ? "bg-[#0081D1] text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"}`}
                                    >
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm truncate">{p.pageName}</p>
                                            <p className={`text-xs truncate ${selected?.id === p.id ? "text-blue-100" : "text-slate-400"}`}>{p.pageSlug}</p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                            {!p.robotsIndex && <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded" title="No aparece en Google">OCULTA</span>}
                                            <ChevronRight size={14} className={selected?.id === p.id ? "text-blue-200" : "text-slate-300"} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Editor de la página elegida */}
                    {selected ? (
                        <div className="flex-1 min-w-0 space-y-5">
                            {/* Datos básicos */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{selected.pageName}</h3>
                                        <p className="text-sm text-slate-500">Datos básicos de esta página.</p>
                                    </div>
                                    <button onClick={() => handleDeletePage(selected.id)} className="p-2.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shrink-0" title="Eliminar página">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700">Nombre de la página</label>
                                        <p className="text-xs text-slate-400 mb-1.5">Solo para identificarla en esta lista. No se muestra en la web.</p>
                                        <input className={inputCls} value={form.pageName} onChange={f("pageName")} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-700">Dirección (URL)</label>
                                        <p className="text-xs text-slate-400 mb-1.5">La parte final del link, por ejemplo /contacto.</p>
                                        <input className={`${inputCls} font-mono`} value={form.pageSlug} onChange={f("pageSlug")} />
                                        {!form.pageSlug && <Warn msg="La dirección no puede estar vacía." />}
                                    </div>
                                </div>
                            </div>

                            {/* Google */}
                            <Card
                                title="Cómo se ve en Google"
                                desc="Estos son los textos que Google muestra cuando alguien encuentra esta página buscando."
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">Meta título</label>
                                        <CharCounter value={form.metaTitle} min={30} max={60} />
                                    </div>
                                    <p className="text-xs text-slate-400 mb-1.5">El título azul que aparece en Google. Ideal hasta 60 caracteres.</p>
                                    <input className={inputCls} value={form.metaTitle} onChange={f("metaTitle")} placeholder="Ej: Uniformes personalizados | DL Diseño" />
                                    {form.metaTitle && form.metaTitle.length < 30 && <Warn msg="El título es demasiado corto (mínimo 30 caracteres)." />}
                                    {form.metaTitle && form.metaTitle.length > 60 && <Warn msg="El título es demasiado largo (máximo 60 caracteres)." />}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">Meta descripción</label>
                                        <CharCounter value={form.metaDesc} min={120} max={160} />
                                    </div>
                                    <p className="text-xs text-slate-400 mb-1.5">El textito gris que aparece debajo del título azul. Ideal hasta 160 caracteres.</p>
                                    <textarea className={`${inputCls} h-24 resize-none`} value={form.metaDesc} onChange={f("metaDesc")} placeholder="Descripción breve de la página para Google..." />
                                    {form.metaDesc && form.metaDesc.length < 120 && <Warn msg="La descripción es muy corta (mínimo 120 caracteres)." />}
                                    {form.metaDesc && form.metaDesc.length > 160 && <Warn msg="La descripción es muy larga (máximo 160 caracteres)." />}
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Palabras clave</label>
                                    <p className="text-xs text-slate-400 mb-1.5">Términos con los que querés aparecer, separados por coma. Hoy Google casi no las usa, pero no molestan.</p>
                                    <input className={inputCls} value={form.keywords} onChange={f("keywords")} placeholder="uniformes uruguay, ropa de trabajo..." />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700">URL canónica <span className="font-normal text-slate-400">(opcional, avanzado)</span></label>
                                    <p className="text-xs text-slate-400 mb-1.5">Dejalo vacío salvo que alguien técnico te lo pida.</p>
                                    <input className={`${inputCls} font-mono`} value={form.canonicalUrl} onChange={f("canonicalUrl")} placeholder="https://dldisenoyestampado.uy/..." />
                                </div>
                                <GooglePreview
                                    title={form.metaTitle}
                                    slug={form.pageSlug}
                                    description={form.metaDesc}
                                    siteName={globalSettings.siteName || "DL Diseño & Estampado"}
                                />
                            </Card>

                            {/* Redes sociales */}
                            <Card
                                title="Cómo se ve al compartir en redes"
                                desc="Cuando compartís el link de esta página por WhatsApp, Facebook o Instagram, se arma una tarjeta con estos datos. Si los dejás vacíos, se usan los de Google."
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">Título al compartir</label>
                                        <CharCounter value={form.ogTitle} min={20} max={95} />
                                    </div>
                                    <p className="text-xs text-slate-400 mb-1.5">El título de la tarjetita que se arma al compartir el link.</p>
                                    <input className={inputCls} value={form.ogTitle} onChange={f("ogTitle")} placeholder="Ej: Uniformes personalizados para empresas" />
                                    {form.ogTitle && form.ogTitle.length > 95 && <Warn msg="El título es demasiado largo (máximo 95 caracteres)." />}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">Descripción al compartir</label>
                                        <CharCounter value={form.ogDesc} min={60} max={200} />
                                    </div>
                                    <p className="text-xs text-slate-400 mb-1.5">El texto que acompaña la tarjetita al compartir el link.</p>
                                    <textarea className={`${inputCls} h-20 resize-none`} value={form.ogDesc} onChange={f("ogDesc")} placeholder="Descripción para compartir en WhatsApp / LinkedIn..." />
                                    {form.ogDesc && form.ogDesc.length < 60 && <Warn msg="La descripción es muy corta (mínimo 60 caracteres recomendados)." />}
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Imagen al compartir</label>
                                    <p className="text-xs text-slate-400 mb-1.5">La foto de la tarjetita. Pegá acá el link (URL) de la imagen.</p>
                                    <input className={`${inputCls} font-mono`} value={form.ogImage} onChange={f("ogImage")} placeholder="https://..." />
                                    {!form.ogImage && <Warn msg="Sin imagen, las redes mostrarán una vista genérica." />}
                                </div>
                                <SocialPreview
                                    title={form.ogTitle || form.metaTitle}
                                    description={form.ogDesc || form.metaDesc}
                                    image={form.ogImage}
                                    siteName={globalSettings.siteName || "DL Diseño & Estampado"}
                                />
                            </Card>

                            {/* Visibilidad */}
                            <Card
                                title="Visibilidad en Google"
                                desc="Lo normal es dejar los dos prendidos. Apagalos solo si querés que esta página no aparezca en Google."
                            >
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={form.robotsIndex} onChange={fBool("robotsIndex")} />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${form.robotsIndex ? "bg-[#0081D1]" : "bg-slate-200"}`} />
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.robotsIndex ? "left-7" : "left-1"}`} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">Aparecer en Google</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={form.robotsFollow} onChange={fBool("robotsFollow")} />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${form.robotsFollow ? "bg-[#0081D1]" : "bg-slate-200"}`} />
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.robotsFollow ? "left-7" : "left-1"}`} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">Seguir los enlaces de esta página</span>
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Info size={12} />
                                    {form.robotsIndex ? "Esta página puede aparecer en los resultados de Google." : "Esta página está oculta: no va a aparecer en Google."}
                                </p>
                            </Card>

                            {/* Guardar */}
                            <div className="flex justify-end">
                                <button onClick={savePage} disabled={saving || !form.pageSlug} className={saveBtnCls}>
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 w-full flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-100 p-6">
                            <Globe size={48} className="text-slate-200 mb-5" />
                            <h3 className="text-lg font-bold text-slate-400">Elegí una página</h3>
                            <p className="text-sm text-slate-400">Tocá una página de la lista de la izquierda para editar cómo se ve en Google.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
