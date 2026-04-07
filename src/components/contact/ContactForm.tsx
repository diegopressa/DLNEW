"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { submitContact } from "@/actions/contactActions";

const EMPTY = { name: "", company: "", email: "", phone: "", message: "" };

export default function ContactForm() {
    const [form, setForm] = useState(EMPTY);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSending(true);
        const res = await submitContact(form);
        setSending(false);
        if (res.success) {
            setSent(true);
            setForm(EMPTY);
        } else {
            setError("Hubo un error al enviar. Intentá de nuevo o escribinos por WhatsApp.");
        }
    };

    if (sent) {
        return (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-4">
                <CheckCircle className="mx-auto text-green-500" size={48} />
                <h3 className="text-2xl font-black text-slate-900">¡Mensaje recibido!</h3>
                <p className="text-slate-500">Te respondemos en menos de 2 horas en horario laboral.</p>
                <button
                    onClick={() => setSent(false)}
                    className="text-sm font-bold text-blue-600 hover:underline mt-2"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Envianos un mensaje</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nombre *</label>
                        <input
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Empresa</label>
                        <input
                            value={form.company}
                            onChange={e => setForm({ ...form, company: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Nombre de empresa"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email *</label>
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Teléfono</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="099 000 000"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mensaje *</label>
                    <textarea
                        required
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-700 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        placeholder="Contanos qué necesitás: tipo de prenda, cantidad aproximada, empresa..."
                    />
                </div>

                {error && <p className="text-red-600 text-sm font-bold">{error}</p>}

                <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {sending ? "Enviando..." : "Enviar mensaje"}
                </button>
            </form>
        </div>
    );
}
