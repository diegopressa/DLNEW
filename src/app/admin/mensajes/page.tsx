"use client";

import React, { useState, useEffect } from "react";
import { getContactSubmissions, markContactRead, deleteContactSubmission } from "@/actions/contactActions";
import { Loader2, Mail, MailOpen, Trash2, Building2, Phone } from "lucide-react";

export default function MensajesAdmin() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        const data = await getContactSubmissions();
        setItems(data);
        setLoading(false);
    };

    const handleRead = async (id: number) => {
        await markContactRead(id);
        setItems(items.map(i => i.id === id ? { ...i, read: true } : i));
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este mensaje?")) return;
        await deleteContactSubmission(id);
        setItems(items.filter(i => i.id !== id));
    };

    const unread = items.filter(i => !i.read).length;

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    Mensajes Recibidos
                    {unread > 0 && (
                        <span className="bg-blue-600 text-white text-sm font-black px-3 py-1 rounded-full">{unread} nuevo{unread > 1 ? "s" : ""}</span>
                    )}
                </h1>
                <p className="text-slate-500">Consultas enviadas desde el formulario de Contacto.</p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <Mail size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold">No hay mensajes todavía.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${!item.read ? "border-blue-200 bg-blue-50/30" : "border-slate-100"}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!item.read ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                                        {item.read ? <MailOpen size={18} /> : <Mail size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="font-black text-slate-900">{item.name}</p>
                                            {!item.read && <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase">Nuevo</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                                            <a href={`mailto:${item.email}`} className="hover:text-blue-600 font-medium">{item.email}</a>
                                            {item.company && <span className="flex items-center gap-1"><Building2 size={12} />{item.company}</span>}
                                            {item.phone && <span className="flex items-center gap-1"><Phone size={12} />{item.phone}</span>}
                                        </div>
                                        <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 rounded-xl p-3">{item.message}</p>
                                        <p className="text-xs text-slate-400 mt-2 font-medium">
                                            {new Date(item.createdAt).toLocaleDateString("es-UY", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {!item.read && (
                                        <button onClick={() => handleRead(item.id)} title="Marcar como leído" className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors">
                                            <MailOpen size={16} />
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(item.id)} title="Eliminar" className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
