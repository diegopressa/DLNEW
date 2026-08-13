import * as LucideIcons from "lucide-react";
import prisma from "@/lib/prisma";

// Pilares de servicio bajo el hero: tarjetas con icono (Prenda / Personalización /
// Entrega / Rapidez). El contenido sale del admin (/admin/home), igual que antes.
export default async function ServicesStrip() {
    const solutions = (await prisma.businessSolution
        .findMany({ orderBy: { order: "asc" } })
        .catch(() => [])) as any[];

    if (!solutions || solutions.length === 0) return null;

    return (
        <div className="bg-white border-b border-slate-100">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {solutions.map((item) => {
                    const IconComponent = (LucideIcons as any)[item.iconName || "Shirt"] || LucideIcons.Shirt;
                    return (
                        <div
                            key={item.id}
                            className="border border-slate-200 rounded-md p-6 hover:border-primary/40 hover:shadow-md transition-all"
                        >
                            <div className="w-12 h-12 rounded-md bg-primary/10 text-primary grid place-items-center mb-4">
                                <IconComponent size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-grafito mb-1.5">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
