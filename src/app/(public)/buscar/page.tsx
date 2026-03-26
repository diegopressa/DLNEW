import { searchProducts } from "@/actions/productActions";
import Link from "next/link";
import { ArrowRight, Package, Search, ChevronRight, MessageCircle } from "lucide-react";
import { getGlobalSettings } from "@/actions/settingsActions";

export const dynamic = "force-dynamic";

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
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="section-container">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-400 mb-12 bg-white w-fit px-4 py-2 rounded-full shadow-sm border border-slate-100" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/categorias" className="hover:text-primary transition-colors">Productos</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-slate-900 font-bold">Búsqueda</span>
                </nav>

                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-4">
                        <Search className="text-primary w-10 h-10" />
                        Resultados para: <span className="text-primary">"{query}"</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        Hemos encontrado {results.length} coincidencias en nuestro catálogo.
                    </p>
                </header>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                    {results.map((product: any) => (
                        <Link 
                            key={product.id} 
                            href={`/categorias/lista-${product.category?.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}/${product.slug}`} 
                            className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                        >
                            <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 overflow-hidden relative border border-slate-50">
                                {product.images[0] ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <Package size={64} />
                                    </div>
                                )}

                                {product.highlight && (
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm z-30">
                                        {product.highlight}
                                    </div>
                                )}

                                {/* Customization Badges */}
                                {(product.hasScreenPrint || product.hasEmbroidery) && (
                                    <div className="absolute top-4 right-4 z-20 scale-[0.5] sm:scale-[0.6] origin-top-right">
                                        <div className="flex flex-col items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
                                                Personalización
                                            </span>
                                            <div className="flex flex-col gap-2 w-32">
                                                {product.hasScreenPrint && (
                                                    <div className="flex items-center justify-center gap-2 bg-[#10b981] text-white px-3 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 w-full">
                                                        <span className="text-sm">🎨</span>
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Estampado</span>
                                                    </div>
                                                )}
                                                {product.hasEmbroidery && (
                                                    <div className="flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-3 py-2.5 rounded-2xl shadow-lg shadow-violet-500/20 w-full">
                                                        <span className="text-sm">🧵</span>
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Bordado</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-4 pb-4">
                                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors flex items-center justify-between gap-2">
                                    {product.name}
                                    <ArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary flex-shrink-0" size={24} />
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                                    {product.description}
                                </p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex -space-x-2">
                                        {product.colors.slice(0, 3).map((pc: any, i: number) => {
                                            const color = pc.color;
                                            if (!color) return null;
                                            const hex = color.hex?.startsWith("#") ? color.hex : `#${color.hex}`;
                                            return (
                                                <div 
                                                    key={i} 
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                    style={{ backgroundColor: hex }}
                                                    title={color.name}
                                                />
                                            );
                                        })}
                                        {product.colors.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-slate-500 shadow-sm">
                                                +{product.colors.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Ver detalle</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {results.length === 0 && (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-100">
                            <Search size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No encontramos coincidencias</h2>
                        <p className="text-slate-500 text-lg mb-8">Probá con otras palabras clave o navegá por nuestras categorías.</p>
                        <Link 
                            href="/categorias" 
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-lg"
                        >
                            Ver Todas las Categorías
                        </Link>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-24 bg-slate-900 rounded-[3rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                    <div className="max-w-xl relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-white">¿Buscás algo más específico?</h2>
                        <p className="text-slate-400 text-lg">
                            Te ayudamos a encontrar el uniforme ideal para tu empresa.
                        </p>
                    </div>
                    <Link
                        href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+buscaba+%22${query}%22+y+queria+saber+m%C3%A1s+opciones.&type=phone_number&app_absent=0`}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-primary/20 relative z-10"
                    >
                        Preguntar por WhatsApp
                        <MessageCircle />
                    </Link>
                </div>
            </div>
        </div>
    );
}
