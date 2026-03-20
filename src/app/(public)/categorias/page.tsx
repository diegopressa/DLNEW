import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/actions/categoryActions";
import { getGlobalSettings } from "@/actions/settingsActions";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
    const dbCategories = await getCategories();
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59899000000";
    
    // Fallback if no categories in DB yet
    const categories = dbCategories.length > 0 ? dbCategories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-'),
        image: c.imageUrl,
        items: "Ver modelos" // You can customize this
    })) : [];

    return (
        <div className="pt-32 pb-24">
            <div className="section-container">
                <header className="mb-16">
                    <h1 className="heading-lg mb-4">Nuestro Catálogo de Prendas</h1>
                    <p className="text-lead">
                        Seleccionamos las mejores telas y cortes para que tu equipo luzca impecable y trabaje con comodidad.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/categorias/lista-${cat.slug}`} className="group cursor-pointer">
                            <div className="aspect-square bg-slate-100 rounded-[2.5rem] mb-6 overflow-hidden relative shadow-sm border border-slate-100">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
                                {cat.name}
                                <ArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" size={20} />
                            </h3>
                            <p className="text-slate-500 mb-6 font-medium">{cat.items}</p>
                            <div
                                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary group-hover:underline"
                            >
                                Ver prendas disponibles
                            </div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        No se encontraron categorías.
                    </div>
                )}

                <div className="mt-24 bg-slate-900 rounded-[3rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                    <div className="max-w-xl relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-white">¿No encontrás lo que buscás?</h2>
                        <p className="text-slate-400 text-lg">
                            Tenemos acceso a cientos de proveedores de prendas. Decinos qué necesitás y nosotros lo resolvemos.
                        </p>
                    </div>
                    <Link
                        href={`https://wa.me/${whatsapp}`}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-primary/20 relative z-10"
                    >
                        Preguntar por otras prendas
                        <MessageCircle />
                    </Link>
                </div>
            </div>
        </div>
    );
}
