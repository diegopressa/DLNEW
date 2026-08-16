import React from "react";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { getGlobalSettings } from "@/actions/settingsActions";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/contacto");
}

export default async function ContactoPage() {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59897534866";
    const email = settings?.email || "contacto@dldisenoyestampado.uy";
    const phone = settings?.phone || "59829250584";
    const address = settings?.address || "Montevideo, Uruguay";

    const formattedPhone = phone.startsWith("598") ? `+598 ${phone.slice(3, 7)} ${phone.slice(7)}` : phone;
    const formattedWhatsapp = whatsapp.startsWith("598") ? `+598 0${whatsapp.slice(3, 5)} ${whatsapp.slice(5, 8)} ${whatsapp.slice(8)}` : whatsapp;
    const waUrl = `https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`;

    const datos = [
        { icono: Phone, etiqueta: "Teléfono", valor: formattedPhone, href: `tel:${phone}` },
        { icono: MessageCircle, etiqueta: "WhatsApp", valor: formattedWhatsapp, href: waUrl },
        { icono: Mail, etiqueta: "Email", valor: email, href: `mailto:${email}` },
        { icono: MapPin, etiqueta: "Dirección", valor: address, href: null },
        {
            icono: Clock,
            etiqueta: "Horario de atención",
            // El horario sale del admin (Configuración → Horarios); si hay de sábado, se suma
            valor: `Lunes a Viernes, ${settings?.hoursWeek || "09:00 - 18:00 hs"}${settings?.hoursSat ? ` · Sábados, ${settings.hoursSat}` : ""}`,
            href: null,
        },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <header className="pt-10 sm:pt-14 pb-8 sm:pb-10">
                    <h1 className="font-display uppercase leading-none text-5xl sm:text-6xl lg:text-7xl text-grafito">
                        Contacto
                    </h1>
                    <p className="mt-3 text-slate-600 max-w-[62ch]">
                        Escribinos por donde te quede más cómodo. Respondemos en menos de 2 horas en horario laboral.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start pb-14">
                    {/* Información + mapa */}
                    <div className="border border-slate-200 rounded-md p-6 sm:p-8">
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-5">
                            Información de contacto
                        </h2>
                        <div className="flex flex-col divide-y divide-slate-100 mb-7">
                            {datos.map((d) => (
                                <div key={d.etiqueta} className="flex items-center gap-4 py-3.5 min-w-0">
                                    <span className="w-10 h-10 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
                                        <d.icono size={18} />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-0.5">{d.etiqueta}</span>
                                        {d.href ? (
                                            <a
                                                href={d.href}
                                                target={d.href.startsWith("http") ? "_blank" : undefined}
                                                rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                                className="block text-sm font-bold text-grafito hover:text-primary transition-colors break-words"
                                            >
                                                {d.valor}
                                            </a>
                                        ) : (
                                            <span className="block text-sm font-bold text-grafito break-words">{d.valor}</span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {(settings as any)?.mapEmbedUrl && (
                            <div
                                className="w-full h-72 rounded-md overflow-hidden border border-slate-200"
                                dangerouslySetInnerHTML={{
                                    __html: (settings as any).mapEmbedUrl.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"')
                                }}
                            />
                        )}
                    </div>

                    {/* Formulario + WhatsApp directo */}
                    <div className="space-y-6">
                        <ContactForm />

                        <div className="bg-grafito rounded-md p-6 sm:p-8 text-center">
                            <p className="text-slate-400 text-sm mb-4">¿Preferís hablar directo?</p>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-md font-bold uppercase tracking-wide text-sm transition-colors flex items-center justify-center gap-2.5"
                            >
                                <MessageCircle size={20} />
                                Hablar por WhatsApp ahora
                            </a>
                            <p className="mt-4 text-slate-400 font-semibold text-[11px] uppercase tracking-[0.14em]">
                                Respondemos en menos de 2 Hs en horario laboral
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <AdminEditButtonGate href="/admin/settings" label="Editar Contacto" />
        </div>
    );
}
