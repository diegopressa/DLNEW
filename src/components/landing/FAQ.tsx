"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "¿Cuántas unidades es el pedido mínimo?",
        answer: "El pedido mínimo es de 10 unidades por modelo. Para pedidos mayores a 50 unidades ofrecemos precio especial — consultanos."
    },
    {
        question: "¿En qué formatos aceptan el logo o diseño?",
        answer: "Aceptamos archivos en formato vectorial (AI, EPS, PDF, SVG) o imágenes de alta resolución (PNG o JPG a 300 dpi mínimo). Si no tenés el logo en ese formato, podemos vectorizarlo sin costo extra."
    },
    {
        question: "¿Cómo hago para pedir talles de un equipo grande?",
        answer: "Te enviamos una planilla simple donde completás nombre y talle de cada integrante. Trabajamos desde talle XS hasta 4XL según la prenda."
    },
    {
        question: "¿Hacen envíos al interior de Uruguay?",
        answer: "Sí, enviamos a todo el país a través de empresas de transporte. El costo y plazo de envío varía según la zona y el volumen del pedido."
    },
    {
        question: "¿Cuáles son los tiempos reales de entrega?",
        answer: "Para pedidos de hasta 50 unidades, el plazo es de 3 a 5 días hábiles desde que se confirma el diseño y el pago. Para pedidos más grandes, acordamos el plazo al momento del presupuesto."
    },
    {
        question: "¿Puedo pedir una muestra antes de hacer el pedido completo?",
        answer: "Sí, para pedidos de más de 50 unidades podemos coordinar una muestra física. Consultanos las condiciones por WhatsApp."
    },
    {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos transferencia bancaria, efectivo y tarjeta de crédito/débito. Emitimos factura a nombre de la empresa."
    },
    {
        question: "¿Qué pasa si un talle no queda bien en alguna prenda?",
        answer: "Antes de producir hacemos una revisión del pedido de talles con vos. Una vez confirmado y producido, los cambios dependen del caso — consultanos antes de confirmar si tenés dudas."
    }
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="py-14 bg-slate-50">
            <div className="section-container">
                <div className="text-center mb-10">
                    <h2 className="heading-lg text-slate-900 mb-3">Preguntas frecuentes</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Respuestas a las dudas más comunes antes de contactarnos.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto divide-y divide-slate-100">
                    {faqs.map((faq, idx) => (
                        <div key={idx}>
                            <button
                                onClick={() => setOpen(open === idx ? null : idx)}
                                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                            >
                                <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    size={20}
                                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${open === idx ? "rotate-180 text-primary" : ""}`}
                                />
                            </button>
                            {open === idx && (
                                <p className="pb-5 text-slate-500 leading-relaxed text-sm pr-8">
                                    {faq.answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <p className="text-slate-500 text-sm">
                        ¿Tenés otra pregunta?{" "}
                        <a
                            href="/contacto"
                            className="text-primary font-bold hover:underline"
                        >
                            Contactanos
                        </a>
                        {" "}y te respondemos.
                    </p>
                </div>
            </div>
        </section>
    );
}
