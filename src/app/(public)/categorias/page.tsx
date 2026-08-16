import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { getCategories, getCategoriasHeader } from "@/actions/categoryActions";
import { getGlobalSettings } from "@/actions/settingsActions";
import FeaturedProductSearch from "@/components/product/FeaturedProductSearch";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
    const dbCategories = await getCategories();
    const settings = await getGlobalSettings();
    const headers = await getCategoriasHeader();
    const whatsapp = settings?.whatsapp || "59897534866";

    const categories = dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-"),
        image: c.imageUrl,
    }));

    const waUrl = `https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                {/* ── Encabezado ── */}
                <header className="pt-10 sm:pt-14 pb-8 sm:pb-10">
                    <h1 className="font-display uppercase leading-none text-5xl sm:text-6xl lg:text-7xl text-grafito">
                        {headers.title}
                    </h1>
                    <p className="mt-3 text-slate-600 max-w-[62ch]">
                        {headers.subtitle}
                    </p>
                    <div className="mt-6 max-w-2xl">
                        <FeaturedProductSearch />
                    </div>
                </header>

                {/* ── Categorías ── */}
                <div className="flex items-baseline justify-between gap-4 mb-5">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Categorías principales
                    </h2>
                    <span className="text-sm font-semibold text-slate-500">
                        <b className="text-grafito">{categories.length}</b> categorías
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/categorias/lista-${cat.slug}`} className="group relative rounded-md overflow-hidden">
                            <div className="relative aspect-[5/6] bg-[#F7F7F7]">
                                {cat.image && (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-grafito/90 to-transparent pt-10 pb-4 px-4">
                                <span className="text-white font-bold text-[15px] border-b-2 border-celeste pb-0.5">
                                    {cat.name}
                                </span>
                                <span className="block mt-1.5 text-slate-300 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ver prendas →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        No se encontraron categorías.
                    </div>
                )}

                {/* ── Precio por volumen ── */}
                <div className="mt-12 border border-slate-200 rounded-md p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="font-display uppercase text-3xl text-grafito mb-1">
                            {(headers as any).volumeTitle || "Precio especial por volumen"}
                        </h3>
                        <p className="text-slate-500 text-sm max-w-[52ch]">
                            {(headers as any).volumeSubtitle || "Cuantas más unidades pedís, mejor precio por prenda. Consultanos para un presupuesto según tu cantidad."}
                        </p>
                    </div>
                    <div className="flex gap-6 sm:gap-8 text-center shrink-0">
                        <div>
                            <p className="font-display text-4xl text-primary">{(headers as any).volumeTier1 || "10–50"}</p>
                            <p className="text-xs text-slate-500 font-semibold">{(headers as any).volumeTier1Label || "unidades"}</p>
                        </div>
                        <div>
                            <p className="font-display text-4xl text-primary">{(headers as any).volumeTier2 || "51–200"}</p>
                            <p className="text-xs text-slate-500 font-semibold">{(headers as any).volumeTier2Label || "precio mejor"}</p>
                        </div>
                        <div>
                            <p className="font-display text-4xl text-primary">{(headers as any).volumeTier3 || "+200"}</p>
                            <p className="text-xs text-slate-500 font-semibold">{(headers as any).volumeTier3Label || "precio especial"}</p>
                        </div>
                    </div>
                </div>

                {/* ── ¿No encontrás lo que buscás? ── */}
                <div className="mt-6 mb-14 bg-grafito rounded-md p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-white">
                    <div>
                        <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-1.5">
                            ¿No encontrás lo que buscás?
                        </h2>
                        <p className="text-slate-300 text-sm max-w-[52ch]">
                            Tenemos acceso a cientos de proveedores de prendas. Decinos qué necesitás y nosotros lo resolvemos.
                        </p>
                    </div>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-white px-6 py-4 rounded-md text-sm font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors flex items-center gap-2.5 shrink-0"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Preguntar por otras prendas
                    </a>
                </div>
            </div>
            <AdminEditButtonGate href="/admin/categorias" label="Editar Categorías" />
        </div>
    );
}
