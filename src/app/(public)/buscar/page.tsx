import { searchProducts } from "@/actions/productActions";
import Link from "next/link";
import { Package, Search, MessageCircle } from "lucide-react";
import { getGlobalSettings } from "@/actions/settingsActions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const slugify = (name: string) =>
    name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
    const query = (searchParams.q || "").trim();
    const title = query
        ? `Buscar "${query}" | DL Diseño & Estampado`
        : `Buscar productos | DL Diseño & Estampado`;
    const description = query
        ? `Resultados para "${query}" en uniformes corporativos para empresas en Uruguay.`
        : `Encontrá productos para uniformes empresariales: remeras, polos, buzos, camperas y más. Estampado y bordado.`;

    return {
        title,
        description,
        robots: { index: false, follow: true },
    };
}

export default async function SearchResultsPage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    const query = searchParams.q || "";
    const results = query ? await searchProducts(query) : [];
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59897534866";

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                {/* ── Breadcrumb ── */}
                <nav className="pt-5 text-sm text-slate-500" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span className="mx-2">›</span>
                    <Link href="/categorias" className="hover:text-primary transition-colors">Productos</Link>
                    <span className="mx-2">›</span>
                    <span className="text-grafito font-semibold">Búsqueda</span>
                </nav>

                <header className="pt-6 pb-8">
                    <h1 className="font-display uppercase leading-none text-4xl sm:text-5xl lg:text-6xl text-grafito">
                        {query ? <>Resultados para “{query}”</> : "Buscar productos"}
                    </h1>
                    {/* Buscador de la página (útil sobre todo en celular) */}
                    <form action="/buscar" className="mt-5 flex max-w-xl border-2 border-grafito rounded-md overflow-hidden">
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="Buscar: remeras, camperas, chalecos…"
                            aria-label="Buscar productos"
                            className="flex-1 min-w-0 px-4 py-3 text-sm outline-none"
                        />
                        <button type="submit" className="bg-primary text-white font-bold text-sm px-5 hover:bg-primary/90 transition-colors">
                            Buscar
                        </button>
                    </form>
                    {query && (
                        <p className="mt-4 text-sm font-semibold text-slate-500">
                            <b className="text-grafito">{results.length}</b> {results.length === 1 ? "coincidencia" : "coincidencias"} en el catálogo
                        </p>
                    )}
                </header>

                {/* ── Resultados ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-10">
                    {results.map((product: any) => (
                        <Link
                            key={product.id}
                            href={`/categorias/lista-${slugify(product.category?.name || "")}/${product.slug}`}
                            className="group bg-white border border-slate-200 rounded-md overflow-hidden hover:border-grafito hover:shadow-lg transition-all"
                        >
                            <div className="relative aspect-square bg-[#F7F7F7]">
                                {product.images[0] ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Package size={56} />
                                    </div>
                                )}
                                {product.highlight && (
                                    <span className="absolute top-3 left-3 bg-primary text-white px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.08em]">
                                        {product.highlight}
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-[15px] text-grafito leading-snug mb-2">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="flex items-center gap-1">
                                        {product.colors.slice(0, 5).map((pc: any, i: number) => {
                                            const color = pc.color;
                                            if (!color) return null;
                                            const hex = color.hex?.startsWith("#") ? color.hex : `#${color.hex}`;
                                            return (
                                                <span
                                                    key={i}
                                                    className="w-[15px] h-[15px] rounded-full border border-grafito/20"
                                                    style={{ backgroundColor: hex }}
                                                    title={color.name}
                                                />
                                            );
                                        })}
                                        {product.colors.length > 5 && (
                                            <span className="text-[11px] font-bold text-slate-500 ml-0.5">
                                                +{product.colors.length - 5}
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-[13px] font-bold text-grafito border-b-2 border-primary pb-0.5">
                                        Ver prenda →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── Sin resultados ── */}
                {query && results.length === 0 && (
                    <div className="border border-dashed border-slate-300 rounded-md p-14 text-center mb-10">
                        <Search size={40} className="mx-auto mb-4 text-slate-300" />
                        <h2 className="font-bold text-lg text-grafito mb-1">No encontramos coincidencias</h2>
                        <p className="text-slate-500 text-sm mb-6">Probá con otras palabras o navegá por las categorías.</p>
                        <Link
                            href="/categorias"
                            className="inline-block bg-primary text-white px-6 py-3.5 rounded-md text-sm font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                        >
                            Ver todas las categorías
                        </Link>
                    </div>
                )}

                {/* ── CTA ── */}
                <div className="mb-14 bg-grafito rounded-md p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-white">
                    <div>
                        <h2 className="font-display uppercase text-3xl sm:text-4xl text-white mb-1.5">
                            ¿Buscás algo más específico?
                        </h2>
                        <p className="text-slate-300 text-sm max-w-[52ch]">
                            Te ayudamos a encontrar el uniforme ideal para tu empresa.
                        </p>
                    </div>
                    <a
                        href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=${encodeURIComponent(query ? `Hola, buscaba "${query}" y quería saber más opciones.` : "Hola, quiero consultar por uniformes para mi empresa.")}&type=phone_number&app_absent=0`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-white px-6 py-4 rounded-md text-sm font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors flex items-center gap-2.5 shrink-0"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Preguntar por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
