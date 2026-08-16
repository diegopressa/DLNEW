"use client";

import React, { useState, useEffect } from "react";
import { getGlobalSettings, updateGlobalSettings } from "@/actions/settingsActions";
import { Save, Loader2, Phone, Mail, MapPin, MessageSquare, Instagram, Facebook, Clock, Map, Image as ImageIcon, Trash2 } from "lucide-react";

const inputClass = "bg-slate-50 border border-slate-200 rounded-xl p-3 w-full outline-none focus:border-[#0081D1] text-sm";
const labelClass = "text-sm font-bold text-slate-700 flex items-center gap-2";
const helpClass = "text-xs text-slate-400";

export default function SettingsEditor() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogoUpload = async (file: File) => {
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "branding");
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success && data.url) {
                setSettings((prev: any) => ({ ...prev, logoUrl: data.url }));
                setMessage("Logo subido. Acordate de guardar.");
                setTimeout(() => setMessage(""), 4000);
            } else {
                setMessage("Error al subir el logo: " + (data.error || "desconocido"));
            }
        } catch (err) {
            setMessage("Error al subir el logo.");
        } finally {
            setUploadingLogo(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getGlobalSettings();
        setSettings(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const result = await updateGlobalSettings(settings);
        if (result.success) {
            setMessage("Configuración guardada");
            setTimeout(() => setMessage(""), 3000);
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
                <p className="text-slate-500">Datos de contacto, redes, horarios, mapa y logo del sitio.</p>
            </header>

            <form onSubmit={handleSave} className="space-y-6">

                {/* Tarjeta 1: Contacto */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Contacto</h2>
                        <p className="text-sm text-slate-500">Cómo te encuentran y te escriben los clientes.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <MessageSquare size={16} className="text-[#0081D1]" /> WhatsApp
                            </label>
                            <input
                                value={settings.whatsapp}
                                onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                                className={inputClass}
                                placeholder="59897534866"
                            />
                            <p className={helpClass}>Sin + ni espacios, ej: 59897534866</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <Phone size={16} className="text-[#0081D1]" /> Teléfono visible
                            </label>
                            <input
                                value={settings.phone}
                                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                                className={inputClass}
                                placeholder="+598 000 000"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <Mail size={16} className="text-[#0081D1]" /> Email de contacto
                            </label>
                            <input
                                value={settings.email}
                                onChange={e => setSettings({ ...settings, email: e.target.value })}
                                className={inputClass}
                                placeholder="info@empresa.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <MapPin size={16} className="text-[#0081D1]" /> Dirección
                            </label>
                            <input
                                value={settings.address}
                                onChange={e => setSettings({ ...settings, address: e.target.value })}
                                className={inputClass}
                                placeholder="Montevideo, Uruguay"
                            />
                            <p className={helpClass}>Aparece en el pie, en Contacto y en Google.</p>
                        </div>
                    </div>
                </section>

                {/* Tarjeta 2: Redes sociales */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Redes sociales</h2>
                        <p className="text-sm text-slate-500">Links a tus perfiles. Se muestran en el pie del sitio.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <Instagram size={16} className="text-pink-600" /> Instagram (URL)
                            </label>
                            <input
                                value={settings.instagramUrl || ""}
                                onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                                className={inputClass}
                                placeholder="https://instagram.com/tu-empresa"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <Facebook size={16} className="text-blue-700" /> Facebook (URL)
                            </label>
                            <input
                                value={settings.facebookUrl || ""}
                                onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                                className={inputClass}
                                placeholder="https://facebook.com/tu-empresa"
                            />
                        </div>
                    </div>
                </section>

                {/* Tarjeta 3: Horarios */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Horarios</h2>
                        <p className="text-sm text-slate-500">Horarios de atención que ve el cliente en la web.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <Clock size={16} className="text-[#0081D1]" /> Lunes a viernes
                            </label>
                            <input
                                value={settings.hoursWeek || ""}
                                onChange={e => setSettings({ ...settings, hoursWeek: e.target.value })}
                                className={inputClass}
                                placeholder="09:00 - 18:00 hs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                <Clock size={16} className="text-[#0081D1]" /> Sábados
                            </label>
                            <input
                                value={settings.hoursSat || ""}
                                onChange={e => setSettings({ ...settings, hoursSat: e.target.value })}
                                className={inputClass}
                                placeholder="09:00 - 13:00 hs"
                            />
                        </div>
                    </div>
                </section>

                {/* Tarjeta 4: Mapa */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Mapa</h2>
                        <p className="text-sm text-slate-500">El mapa de Google que se muestra en la página de Contacto.</p>
                    </div>
                    <div className="space-y-1.5">
                        <label className={labelClass}>
                            <Map size={16} className="text-[#0081D1]" /> Código del mapa (iframe)
                        </label>
                        <textarea
                            value={settings.mapEmbedUrl || ""}
                            onChange={e => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                            className={inputClass + " h-32 resize-none font-mono text-xs"}
                            placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                        />
                        <p className={helpClass}>
                            Cómo obtenerlo: entrá a Google Maps, buscá tu dirección, tocá "Compartir" → "Insertar un mapa" → "Copiar HTML", y pegá acá todo el código que empieza con &lt;iframe&gt;.
                        </p>
                    </div>
                </section>

                {/* Tarjeta 5: Logo del sitio */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Logo del sitio</h2>
                        <p className="text-sm text-slate-500">Aparece en la cabecera de todas las páginas y en el pie. Preferiblemente PNG con fondo transparente.</p>
                    </div>
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="relative h-28 w-56 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center">
                            <img
                                src={settings.logoUrl || "/logo.png"}
                                alt="Logo actual"
                                className="max-h-20 max-w-[180px] object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all cursor-pointer w-fit">
                                {uploadingLogo ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                                {uploadingLogo ? "Subiendo..." : "Subir nuevo logo"}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    disabled={uploadingLogo}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleLogoUpload(file);
                                        if (e.target) e.target.value = "";
                                    }}
                                />
                            </label>
                            {settings.logoUrl && (
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, logoUrl: null })}
                                    className="text-sm text-red-600 font-semibold flex items-center gap-1 hover:text-red-700 w-fit"
                                >
                                    <Trash2 size={14} /> Volver al logo por defecto
                                </button>
                            )}
                            <p className={helpClass}>Después de subir, hacé clic en "Guardar cambios" abajo.</p>
                        </div>
                    </div>
                </section>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#0081D1] hover:bg-[#006BAE] text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                    {message && <span className="text-green-600 font-bold">{message}</span>}
                </div>
            </form>
        </div>
    );
}
