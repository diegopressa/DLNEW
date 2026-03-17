import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoriesSection, getCategories } from "@/actions/homeActions";

export default async function Categories() {
    const data = await getCategories();
    const sectionData = await getCategoriesSection();

    const categories = data.length > 0 ? data : [
        { name: "Remeras y Polos", imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600" },
        { name: "Buzos y Canguros", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600" },
        { name: "Camperas y Abrigo", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600" },
        { name: "Ropa de Trabajo", imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600" },
        { name: "Gorros y Accesorios", imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&q=80&w=600" },
        { name: "Uniformes Clínicos", imageUrl: "https://images.unsplash.com/photo-1599493758267-c6c884c7071f?auto=format&fit=crop&q=80&w=600" }
    ];

    return (
        <section className="bg-slate-900 py-24 text-white">
            <div className="section-container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            {sectionData.title}
                        </h2>
                        <p className="text-slate-400">
                            {sectionData.subtitle}
                        </p>
                    </div>
                    <Link
                        href="/categorias"
                        className="text-primary font-bold flex items-center gap-2 hover:text-white transition-colors"
                    >
                        Ver catálogo completo <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.map((cat: any, index: number) => {
                        const slug = cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
                        return (
                            <Link
                                key={index}
                                href={`/categorias/lista-${slug}`}
                                className="group relative h-80 overflow-hidden rounded-2xl cursor-pointer"
                            >
                                <img
                                    src={cat.imageUrl}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        Ver opciones <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
