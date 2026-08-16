"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { submitContact } from "@/actions/contactActions";

const EMPTY = { name: "", company: "", email: "", phone: "", message: "" };

const inputClass =
    "w-full bg-white border border-slate-300 p-3 rounded-md text-sm text-grafito focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]";

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
            <div className="border border-slate-200 rounded-md p-8 text-center">
                <CheckCircle className="mx-auto text-primary mb-3" size={44} />
                <h3 className="font-bold text-lg text-grafito mb-1">¡Mensaje recibido!</h3>
                <p className="text-sm text-slate-500">Te respondemos en menos de 2 horas en horario laboral.</p>
                <button
                    onClick={() => setSent(false)}
                    className="mt-4 text-sm font-bold text-grafito border-b-2 border-primary pb-0.5 hover:text-primary transition-colors"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <div className="border border-slate-200 rounded-md p-6 sm:p-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-5">
                Envianos un mensaje
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className={labelClass}>Nombre *</label>
                        <input
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Empresa *</label>
                        <input
                            required
                            value={form.company}
                            onChange={e => setForm({ ...form, company: e.target.value })}
                            className={inputClass}
                            placeholder="Nombre de empresa"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Email *</label>
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className={inputClass}
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClass}>Teléfono</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className={inputClass}
                            placeholder="099 000 000"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={labelClass}>Mensaje *</label>
                    <textarea
                        required
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        rows={4}
                        className={`${inputClass} resize-none leading-relaxed`}
                        placeholder="Contanos qué necesitás: tipo de prenda, cantidad aproximada, empresa..."
                    />
                </div>

                {error && <p className="text-red-600 text-sm font-bold">{error}</p>}

                <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary text-white py-4 rounded-md font-bold uppercase tracking-wide text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {sending ? "Enviando..." : "Enviar mensaje"}
                </button>
            </form>
        </div>
    );
}
