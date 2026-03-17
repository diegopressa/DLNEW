import { getProjects } from "@/actions/galleryActions";

export const dynamic = "force-dynamic";

export default async function TrabajosPage() {
    const dbProjects = await getProjects();
    
    // Fallback if no projects in DB yet
    const projects = dbProjects.length > 0 ? dbProjects : [];

    return (
        <div className="pt-32 pb-24">
            <div className="section-container">
                <header className="mb-16 text-center lg:text-left">
                    <h1 className="heading-lg mb-4">Empresas que ya cuentan con DL</h1>
                    <p className="text-lead mx-auto lg:mx-0">
                        Nuestra mayor garantía es el trabajo que realizamos día a día para empresas de todo el país.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project: any, idx: number) => (
                        <div key={project.id || idx} className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-lg">
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <p className="text-[#fbbf24] text-sm font-bold uppercase tracking-widest mb-2">
                                    {project.category}
                                </p>
                                <h3 className="text-2xl font-black text-white leading-tight">
                                    {project.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        Aún no se han cargado trabajos en la galería.
                    </div>
                )}
            </div>
        </div>
    );
}
