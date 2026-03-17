import { MessageCircle, ShieldCheck, Truck, Clock, Star, ChevronRight, ArrowRight, Package, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getGlobalSettings } from "@/actions/settingsActions";
import ProductGallery from "@/components/product/ProductGallery";
import ColorSwatches from "@/components/product/ColorSwatches";
import { getProductBySlug } from "@/actions/productActions";
import { getCategoryBySlug } from "@/actions/categoryActions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Reviews data (shared across products for consistency)
const REVIEWS = [
    {
        author: "Ibone Pereira",
        rating: 5,
        time: "Hace una semana",
        text: "Excelente!! Realmente son súper rápidos para realizar el trabajo, las chicas que nos atendieron por WhatsApp fueron muy atentas todo el tiempo, nos sacamos todas las dudas, el trabajo superó altamente nuestras expectativas.",
        company: "Empresa de Servicios",
    },
    {
        author: "Marcelo Domínguez",
        rating: 5,
        time: "Hace 6 meses",
        text: "Súper recomendable y confiable. Fueron rápidos y serviciales, aceptaron los cambios de diseño que hice y el resultado fue de primera. Ya hice 3 pedidos y siempre igual de bien.",
        company: "Constructora MD",
    },
    {
        author: "Laura Fernández",
        rating: 5,
        time: "Hace 3 meses",
        text: "Muy buena calidad y son muy responsables con las entregas. El estampado quedó perfecto. Los recomiendo 100%.",
        company: "Clínica Dental",
    },
];

export default async function ProductDetailPage({ params }: { params: { categorySlug: string; productSlug: string } }) {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59899000000";

    const product = await getProductBySlug(params.productSlug);

    if (!product) {
        notFound();
    }

    const category = product.category;

    const whatsappMessage = encodeURIComponent(
        `Hola! Me interesa el producto: ${product.name} de la categoría ${category.name}. ¿Pueden pasarme precio para uniformes corporativos?`
    );
    const waUrl = `https://wa.me/${whatsapp}?text=${whatsappMessage}`;

    // Simple logic for related products: other products in the same category
    // In a real scenario, we might want to fetch these from DB
    const relatedProducts = (category as any).products?.filter((p: any) => p.id !== product.id).slice(0, 3) || [];

    return (
        <div className="pt-28 pb-24 bg-white">
            <div className="section-container">

                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-10" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/categorias" className="hover:text-primary transition-colors">Productos</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href={`/categorias/${params.categorySlug}`} className="hover:text-primary transition-colors">{category.name}</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-slate-700 font-medium truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
                    {/* Left: Gallery */}
                    <div className="lg:sticky lg:top-24">
                        <ProductGallery images={product.images.map((img: any) => img.url)} />
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-7">
                        <div className="inline-flex items-center gap-2 bg-primary/8 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {category.name}
                        </div>

                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                {product.name}
                            </h1>
                            <p className="mt-3 text-lg text-slate-600">{product.description}</p>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 text-sm font-semibold">
                                <ShieldCheck className="w-4 h-4" />
                                Calidad Asegurada
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 text-sm font-semibold">
                                <Clock className="w-4 h-4" />
                                Entrega en 24-48hs
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
                            <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span className="text-primary">✦</span>
                                {product.name} para Empresas — {product.highlight}
                            </p>
                        </div>

                        {product.colors.length > 0 && <ColorSwatches colors={product.colors} />}

                        {product.features.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Características</p>
                                <ul className="space-y-2.5">
                                    {product.features.map((feat: any, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            {feat.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="space-y-3 pt-2">
                            <Link
                                href={waUrl}
                                target="_blank"
                                className="w-full bg-primary text-white px-8 py-5 rounded-2xl text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
                            >
                                <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                Consultar precio por WhatsApp
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <section className="mt-24">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden text-white">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                            {REVIEWS.map((review, i) => (
                                <div key={i} className="bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center gap-0.5 mb-3">
                                        {[...Array(review.rating)].map((_, j) => (
                                            <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-200 text-sm mb-4 italic">"{review.text}"</p>
                                    <p className="text-white font-bold text-sm">{review.author}</p>
                                    <p className="text-slate-400 text-xs">{review.company}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
