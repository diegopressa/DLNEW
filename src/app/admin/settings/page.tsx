"use client";

import React, { useState, useEffect } from "react";
import { getGlobalSettings, updateGlobalSettings } from "@/actions/settingsActions";
import { Save, Loader2, Phone, Mail, MapPin, MessageSquare, Instagram, Facebook, Clock, Map, Image as ImageIcon, Trash2 } from "lucide-react";

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
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Configuración Global</h1>
                    <p className="text-slate-500">Datos de contacto y redes sociales.</p>
                </div>
            </header>

            <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="pb-8 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <ImageIcon size={22} className="text-blue-600" /> Logo del sitio
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mb-4">
                        Aparece en la cabecera de todas las páginas y en el pie. Preferiblemente PNG con fondo transparente.
                    </p>
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="relative h-28 w-56 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center">
                            <img
                                src={settings.logoUrl || "/logo.png"}
                                alt="Logo actual"
                                className="max-h-20 max-w-[180px] object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all cursor-pointer w-fit disabled:opacity-50">
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
                            <p className="text-xs text-slate-400 italic">Después de subir, hacé clic en "Guardar Configuración" abajo.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <MessageSquare size={16} className="text-blue-600" /> WhatsApp (número sin + ni espacios)
                        </label>
                        <input 
                            value={settings.whatsapp}
                            onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl"
                            placeholder="59899000000"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Mail size={16} className="text-blue-600" /> Email de contacto
                        </label>
                        <input 
                            value={settings.email}
                            onChange={e => setSettings({...settings, email: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl"
                            placeholder="info@empresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Phone size={16} className="text-blue-600" /> Teléfono Visible
                        </label>
                        <input 
                            value={settings.phone}
                            onChange={e => setSettings({...settings, phone: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl"
                            placeholder="+598 000 000"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" /> Dirección
                        </label>
                        <input 
                            value={settings.address}
                            onChange={e => setSettings({...settings, address: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl"
                            placeholder="Montevideo, Uruguay"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Instagram size={16} className="text-pink-600" /> Instagram URL
                        </label>
                        <input 
                            value={settings.instagramUrl || ""}
                            onChange={e => setSettings({...settings, instagramUrl: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl"
                            placeholder="https://instagram.com/tu-empresa"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Facebook size={16} className="text-blue-700" /> Facebook URL
                        </label>
                        <input 
                            value={settings.facebookUrl || ""}
                            onChange={e => setSettings({...settings, facebookUrl: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl"
                            placeholder="https://facebook.com/tu-empresa"
                        />
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-50">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock size={22} className="text-blue-600" /> Horarios de Atención
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Lunes a Viernes</label>
                            <input 
                                value={settings.hoursWeek || ""}
                                onChange={e => setSettings({...settings, hoursWeek: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                placeholder="09:00 - 18:00 hs"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Sábados</label>
                            <input 
                                value={settings.hoursSat || ""}
                                onChange={e => setSettings({...settings, hoursSat: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                placeholder="09:00 - 13:00 hs"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-50 space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Map size={22} className="text-blue-600" /> Mapa de Google (Iframe)
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Pegá el código de inserción (iframe) que te da Google Maps.
                    </p>
                    <textarea 
                        value={settings.mapEmbedUrl || ""}
                        onChange={e => setSettings({...settings, mapEmbedUrl: e.target.value})}
                        className="w-full bg-slate-900 text-green-400 p-4 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                        placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                    />
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center gap-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? "Guardando..." : "Guardar Configuración"}
                    </button>
                    {message && <span className="text-green-600 font-bold">{message}</span>}
                </div>
            </form>
        </div>
    );
}
