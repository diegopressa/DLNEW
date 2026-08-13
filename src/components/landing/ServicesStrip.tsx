import * as LucideIcons from "lucide-react";
import prisma from "@/lib/prisma";

// Pilares de servicio bajo el hero (Prenda / Personalización / Entrega / Rapidez).
// El contenido sale del admin (/admin/home). Detalles visuales propios del rediseño:
// título en League Gothic, icono que se enciende, barra azul superior animada y
// marca de agua del icono en la esquina.
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
                            className="group relative overflow-hidden border border-slate-200 rounded-md p-6 bg-white shadow-sm hover:shadow-xl hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {/* Barra superior que se enciende al pasar el mouse */}
                            <span className="absolute top-0 left-0 h-1 w-8 bg-primary transition-all duration-300 group-hover:w-full" />

                            {/* Marca de agua del icono en la esquina */}
                            <IconComponent
                                aria-hidden
                                className="absolute -bottom-5 -right-5 w-28 h-28 text-primary/[0.06] -rotate-12 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110"
                            />

                            <div className="relative">
                                <div className="w-12 h-12 rounded-md bg-primary/10 text-primary grid place-items-center mb-4 transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                                    <IconComponent size={24} />
                                </div>
                                <h3 className="font-display uppercase text-[1.65rem] leading-none text-grafito mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
