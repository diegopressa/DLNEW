import { getProjects } from "@/actions/galleryActions";
import { getGlobalSettings } from "@/actions/settingsActions";
import { buildMetadata } from "@/lib/buildMetadata";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import type { Metadata } from "next";

export const revalidate = 3600;

// Editable desde /admin/seo (fila "/trabajos"); estos son los textos por defecto
export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/trabajos", {
        title: "Trabajos Realizados para Empresas en Uruguay | DL Diseño & Estampado",
        description: "Casos reales de uniformes, estampado y bordado para empresas e instituciones en Uruguay. Mirá los trabajos que ya entregamos.",
    });
}

export default async function TrabajosPage() {
    const [projects, settings] = await Promise.all([
        getProjects(),
        getGlobalSettings(),
    ]);
    const whatsapp = (settings as any)?.whatsapp || "59897534866";

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <header className="pt-10 sm:pt-14 pb-8 sm:pb-10">
                    <h1 className="font-display uppercase leading-none text-5xl sm:text-6xl lg:text-7xl text-grafito">
                        Trabajos realizados
                    </h1>
                    <p className="mt-3 text-slate-600 max-w-[62ch]">
                        Nuestra mayor garantía es el trabajo que entregamos día a día a empresas de todo el país. Tocá cualquiera y pedí algo así para tu equipo.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-14">
                    {projects.map((project: any) => (
                        <a
                            key={project.id}
                            href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=${encodeURIComponent(`Hola, vi el trabajo de ${project.title} en la web y quiero algo así para mi empresa.`)}&type=phone_number&app_absent=0`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white border border-slate-200 rounded-md overflow-hidden hover:border-grafito hover:shadow-lg transition-all"
                        >
                            <div className="relative aspect-[4/3] bg-[#F7F7F7] overflow-hidden">
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                            </div>
                            <div className="p-4">
                                <span className="block text-primary text-[11px] font-bold uppercase tracking-[0.1em] mb-0.5">
                                    {project.title}
                                </span>
                                {project.category && (
                                    <h3 className="font-bold text-[15px] text-grafito leading-snug mb-2">
                                        {project.category}
                                    </h3>
                                )}
                                <span className="text-[13px] font-bold text-grafito border-b-2 border-primary pb-0.5">
                                    Quiero algo así →
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        Aún no se han cargado trabajos en la galería.
                    </div>
                )}
            </div>
            <AdminEditButtonGate href="/admin/trabajos" label="Editar Trabajos" />
        </div>
    );
}
