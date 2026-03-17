import React from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { getGlobalSettings } from "@/actions/settingsActions";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/contacto");
}

export default async function ContactoPage() {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59899000000";
    const email = settings?.email || "info@dldiseno.uy";
    const phone = settings?.phone || "+598 99 000 000";
    const address = settings?.address || "Montevideo, Uruguay";

    return (
        <div className="pt-32 pb-20 px-4 flex flex-col items-center bg-[#fafbfc]">
            <div className="max-w-7xl w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Card: Information */}
                    <div className="animate-in fade-in slide-in-from-left duration-700 delay-200">
                        <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
                            <h2 className="text-[2.2rem] font-black text-slate-800 text-center mb-10">Información de contacto</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mb-10">
                                {/* Teléfono */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-50 text-blue-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Teléfono</p>
                                        <p className="text-sm font-bold text-slate-800">{phone}</p>
                                    </div>
                                </div>

                                {/* WhatsApp */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WhatsApp</p>
                                        <p className="text-sm font-bold text-slate-800">{whatsapp}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3 md:col-span-2">
                                    <div className="w-10 h-10 bg-slate-50 text-pink-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                                        <p className="text-sm font-bold text-slate-800">{email}</p>
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="flex items-center gap-3 md:col-span-2">
                                    <div className="w-10 h-10 bg-slate-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dirección</p>
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map inside card */}
                            {(settings as any)?.mapEmbedUrl && (
                                <div className="mt-auto text-center space-y-4">
                                    <h3 className="text-sm font-black text-slate-900 leading-none">Visitanos en nuestro local</h3>
                                    
                                    <div 
                                        className="w-full h-72 rounded-[2rem] overflow-hidden shadow-inner border border-slate-100"
                                        dangerouslySetInnerHTML={{ 
                                            __html: (settings as any).mapEmbedUrl.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') 
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Card: CTA (The Dark Rectangle) */}
                    <div className="animate-in fade-in slide-in-from-right duration-700 delay-400">
                        <div className="bg-[#1e293b] p-12 lg:p-14 rounded-[3.5rem] text-white space-y-10 shadow-2xl shadow-blue-900/10 flex flex-col justify-center min-h-[500px]">
                            <h2 className="text-4xl lg:text-5xl font-black leading-tight text-center">
                                ¿Necesitás un presupuesto rápido para tu empresa?
                            </h2>
                            <p className="text-slate-400 text-lg font-medium text-center">
                                Atendemos consultas de empresas en tiempo real. Escribinos para coordinar muestras o presupuestos por volumen.
                            </p>
                            
                            <div className="space-y-8">
                                <a 
                                    href={`https://wa.me/${whatsapp}`} 
                                    target="_blank"
                                    className="block w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-center py-6 rounded-[1.8rem] text-2xl font-black shadow-xl shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <MessageCircle size={32} />
                                    Hablar ahora
                                </a>
                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                                            Operativo ahora
                                        </p>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                                        Respuesta inmediata por WhatsApp
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
