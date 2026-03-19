import { ChevronRight, ArrowRight, Package, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getCategoryBySlug } from "@/actions/categoryActions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryListingPage({ params }: { params: { categorySlug: string } }) {
    const slug = params.categorySlug.startsWith("lista-") ? params.categorySlug.replace("lista-", "") : params.categorySlug;
    const category = await getCategoryBySlug(slug) as any;

    if (!category) {
        notFound();
    }

    return (
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="section-container">
                {/* ── Breadcrumbs ── */}
                <nav className="flex items-center gap-2 text-sm text-slate-400 mb-12 bg-white w-fit px-4 py-2 rounded-full shadow-sm border border-slate-100" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/categorias" className="hover:text-primary transition-colors">Productos</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-slate-900 font-bold">{category.name}</span>
                </nav>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        {category.name}
                    </h1>
                </div>

                {/* ── Products Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
                    {category.products.map((product: any) => (
                        <Link 
                            key={product.id} 
                            href={`/categorias/${params.categorySlug}/${product.slug}`} 
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
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                                        {product.highlight}
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
                                            const color = pc.color || pc;
                                            return (
                                                <div 
                                                    key={i} 
                                                    className="w-6 h-6 rounded-full border border-slate-200 shadow-sm"
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.name}
                                                />
                                            );
                                        })}
                                        {product.colors.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
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

                {/* ── Empty State ── */}
                {category.products.length === 0 && (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-100">
                            <Package size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Aún no hay prendas cargadas</h2>
                        <p className="text-slate-500 text-lg">Estamos actualizando nuestro catálogo para esta categoría.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
