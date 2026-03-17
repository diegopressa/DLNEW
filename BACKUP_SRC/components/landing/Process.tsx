import { getProcessSteps, getProcessSection } from "@/actions/homeActions";

export default async function Process() {
    const data = await getProcessSteps();
    const sectionData = await getProcessSection();

    const steps = data.length > 0 ? data : [
        { number: 1, title: "Nos escribís", description: "Contactanos por WhatsApp con tu idea inicial." },
        { number: 2, title: "Te asesoramos", description: "Elegimos juntos la prenda que mejor se adapte." },
        { number: 3, title: "Presupuesto", description: "Te enviamos una cotización formal inmediata." },
        { number: 4, title: "Definición", description: "Confirmamos diseño, talles y personalización." },
        { number: 5, title: "Entrega", description: "Producimos y enviamos tu pedido en 24-48h." },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="section-container">
                <h2 className="heading-lg text-center mb-6 text-slate-900">{sectionData.title}</h2>
                {sectionData.subtitle && (
                    <p className="text-center text-slate-600 mb-20 max-w-2xl mx-auto">{sectionData.subtitle}</p>
                )}

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10">
                        {steps.map((step: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-6 group">
                                <div className="w-24 h-24 rounded-full bg-white border-8 border-slate-50 flex items-center justify-center text-3xl font-black text-blue-600 shadow-xl group-hover:border-blue-50 transition-all z-10">
                                    {step.number || idx + 1}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed px-4">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
