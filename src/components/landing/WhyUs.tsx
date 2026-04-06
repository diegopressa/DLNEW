import { CheckCircle2 } from "lucide-react";
import { getWhyUs, getWhyUsSection } from "@/actions/homeActions";

export default async function WhyUs() {
    const data = await getWhyUs();
    const sectionData = await getWhyUsSection();

    // Fallback if DB is empty
    const reasons = data.length > 0 ? data : [
        { title: "Nos encargamos de todo", description: "Desde la selección de la prenda hasta el estampado final y la logística." },
        { title: "Presupuesto inmediato", description: "Te damos una respuesta rápida para que no pierdas tiempo en gestiones." },
        { title: "Entrega rápida", description: "Cumplimos con plazos de 24 a 48 horas en pedidos seleccionados." },
        { title: "Experiencia con empresas", description: "Entendemos las necesidades corporativas y los estándares de calidad." },
        { title: "Proceso simple y ágil", description: "Menos burocracia, más soluciones directas para tu equipo." }
    ];

    return (
        <section 
            className="py-24 text-white overflow-hidden relative"
            style={{ backgroundColor: sectionData.backgroundColor || "#4b85c1" }}
        >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="section-container relative z-10">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight text-white">
                        {sectionData.title}
                    </h2>
                    <p className="text-white/80 text-lg">
                        {sectionData.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((reason: any, index: number) => (
                        <div key={index} className="flex gap-4 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <CheckCircle2 className="w-8 h-8 text-white/40 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {reason.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
