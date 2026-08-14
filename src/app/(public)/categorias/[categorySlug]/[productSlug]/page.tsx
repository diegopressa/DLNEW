import { CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getGlobalSettings } from "@/actions/settingsActions";
import ProductGallery from "@/components/product/ProductGallery";
import ColorSwatches from "@/components/product/ColorSwatches";
import { getProductBySlug } from "@/actions/productActions";
import { getCategoryBySlug } from "@/actions/categoryActions";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import AdminQuickImages from "@/components/admin/AdminQuickImages";
import AdminQuickColors from "@/components/admin/AdminQuickColors";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { categorySlug: string; productSlug: string } }): Promise<Metadata> {
    const product: any = await getProductBySlug(params.productSlug);
    if (!product) return {};

    const baseUrl = "https://dldisenoyestampado.uy";
    const url = `${baseUrl}/categorias/${params.categorySlug}/${product.slug}`;
    const categoryName = product.category?.name || "";
    const title = `${product.name} Personalizada para Empresas | DL`;
    const description = (product.description || `${product.name} para uniformes corporativos. Estampado, bordado y entrega en 24-48h. Pedido mínimo 10 unidades. Montevideo y todo Uruguay.`).slice(0, 160);
    const ogImage = product.images?.[0]?.url;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: "website",
            url,
            title,
            description,
            siteName: "DL Diseño & Estampado",
            images: ogImage ? [{ url: ogImage, width: 1200, height: 1200, alt: `${product.name} - ${categoryName}` }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

// Diego pidió apagar la sección Características por ahora (14/08/2026). Poner en true para reactivarla.
const MOSTRAR_CARACTERISTICAS = false;

const PASOS = [
    { n: 1, titulo: "Nos escribís", texto: "Por WhatsApp, con tu logo y la cantidad aproximada." },
    { n: 2, titulo: "Cotizamos", texto: "Presupuesto en menos de 2 horas, en horario laboral." },
    { n: 3, titulo: "Definimos", texto: "Colores, talles y dónde va el logo. Te asesoramos." },
    { n: 4, titulo: "Entregamos", texto: "En 24–48 Hs según volumen, en todo el país." },
];

export default async function ProductDetailPage({ params }: { params: { categorySlug: string; productSlug: string } }) {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59897534866";

    const product = await getProductBySlug(params.productSlug);

    if (!product) {
        notFound();
    }

    const category = product.category;

    // Mensaje de WhatsApp personalizado con la prenda
    const waProducto = `https://api.whatsapp.com/send/?phone=${whatsapp}&text=${encodeURIComponent(`Hola, quiero consultar por ${product.name} para mi empresa.`)}&type=phone_number&app_absent=0`;

    // Relacionados: otras prendas de la misma categoría (con fotos y colores)
    const catSlug = params.categorySlug.startsWith("lista-") ? params.categorySlug.replace("lista-", "") : params.categorySlug;
    const categoryFull = (await getCategoryBySlug(catSlug)) as any;
    const relatedProducts = (categoryFull?.products || [])
        .filter((p: any) => p.id !== product.id)
        .slice(0, 4);

    const baseUrl = "https://dldisenoyestampado.uy";
    const productUrl = `${baseUrl}/categorias/${params.categorySlug}/${product.slug}`;
    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images?.map((img: any) => img.url) || [],
        sku: product.slug,
        brand: { "@type": "Brand", "name": "DL Diseño & Estampado" },
        category: category?.name,
        url: productUrl,
        offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            priceCurrency: "UYU",
            url: productUrl,
            seller: { "@type": "Organization", "name": "DL Diseño & Estampado" },
        },
    };
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
            { "@type": "ListItem", position: 2, name: "Productos", item: `${baseUrl}/categorias` },
            { "@type": "ListItem", position: 3, name: category?.name, item: `${baseUrl}/categorias/${params.categorySlug}` },
            { "@type": "ListItem", position: 4, name: product.name, item: productUrl },
        ],
    };

    return (
        <div className="bg-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                {/* ── Breadcrumb ── */}
                <nav className="pt-5 text-sm text-slate-500 truncate" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span className="mx-2">›</span>
                    <Link href="/categorias" className="hover:text-primary transition-colors">Productos</Link>
                    <span className="mx-2">›</span>
                    <Link href={`/categorias/${params.categorySlug}`} className="hover:text-primary transition-colors">{category.name}</Link>
                    <span className="mx-2">›</span>
                    <span className="text-grafito font-semibold">{product.name}</span>
                </nav>

                {/* ── Producto ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 xl:gap-14 items-start py-7 sm:py-9">
                    <div className="lg:sticky lg:top-6">
                        <ProductGallery
                            images={[
                                ...product.images.map((img: any) => img.url),
                                ...(product.versionDama && product.damaImageUrl ? [product.damaImageUrl] : []),
                                ...(product.versionNino && product.ninoImageUrl ? [product.ninoImageUrl] : []),
                            ]}
                            hasScreenPrint={product.hasScreenPrint}
                            hasEmbroidery={product.hasEmbroidery}
                            productName={product.name}
                        />
                        <AdminQuickImages
                            productId={product.id}
                            pausado={product.pausadoManual ?? false}
                            pausadoNota={product.pausadoNota}
                            ficha={{
                                name: product.name,
                                masterCode: product.masterCode,
                                description: product.description,
                                materials: product.materials,
                                damaCompo: product.damaCompo,
                                ninoCompo: product.ninoCompo,
                                talles: product.talles,
                                damaTalles: product.damaTalles,
                                ninoTalles: product.ninoTalles,
                                versionDama: product.versionDama,
                                versionNino: product.versionNino,
                                features: (product.features || []).map((f: any) => f.text),
                            }}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-primary text-xs font-bold uppercase tracking-[0.12em]">
                                {category.name}
                            </span>
                            {product.masterCode && (
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.08em]">
                                    Ref. {product.masterCode}
                                </span>
                            )}
                            {!product.isActive && (
                                <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-sm">
                                    Borrador — no visible al público
                                </span>
                            )}
                        </div>
                        <h1 className="font-display uppercase leading-none text-5xl sm:text-6xl text-grafito mt-1.5">
                            {product.name}
                        </h1>
                        {product.description && (
                            <p className="mt-4 text-slate-600 max-w-[56ch]">{product.description}</p>
                        )}

                        {/* Ficha técnica (estilo catálogo por rubro) */}
                        <div className="mt-7 border-t border-slate-200">
                            {/* Los datos de dama/niño solo se muestran si la versión está habilitada (versionDama/versionNino) */}
                            {(product.materials || (product.versionDama && product.damaCompo) || (product.versionNino && product.ninoCompo)) && (
                                <div className="py-5 border-b border-slate-200">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-1.5">Composición</p>
                                    {product.materials && (
                                        <p className="text-sm font-semibold text-grafito"><b className="text-primary text-xs uppercase mr-1.5">Unisex</b>{product.materials}</p>
                                    )}
                                    {product.versionDama && product.damaCompo && (
                                        <p className="text-sm font-semibold text-grafito mt-1"><b className="text-primary text-xs uppercase mr-1.5">Dama</b>{product.damaCompo}</p>
                                    )}
                                    {product.versionNino && product.ninoCompo && (
                                        <p className="text-sm font-semibold text-grafito mt-1"><b className="text-primary text-xs uppercase mr-1.5">Niño</b>{product.ninoCompo}</p>
                                    )}
                                </div>
                            )}

                            {(product.talles || (product.versionDama && product.damaTalles) || (product.versionNino && product.ninoTalles)) && (
                                <div className="py-5 border-b border-slate-200">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-1.5">Talles</p>
                                    {product.talles && (
                                        <p className="text-sm font-semibold text-grafito"><b className="text-primary text-xs uppercase mr-1.5">Unisex</b>{product.talles}</p>
                                    )}
                                    {product.versionDama && product.damaTalles && (
                                        <p className="text-sm font-semibold text-grafito mt-1"><b className="text-primary text-xs uppercase mr-1.5">Dama</b>{product.damaTalles}</p>
                                    )}
                                    {product.versionNino && product.ninoTalles && (
                                        <p className="text-sm font-semibold text-grafito mt-1"><b className="text-primary text-xs uppercase mr-1.5">Niño</b>{product.ninoTalles}</p>
                                    )}
                                </div>
                            )}

                            {(product.versionDama || product.versionNino) && (
                                <div className="py-5 border-b border-slate-200">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-3">También disponible en</p>
                                    <div className="flex flex-wrap gap-3">
                                        {product.versionDama && (
                                            <span className="flex items-center gap-2.5 border border-slate-200 rounded-md p-2 pr-4">
                                                {product.damaImageUrl && (
                                                    <img src={product.damaImageUrl} alt="Versión dama" className="w-11 h-11 rounded object-cover" />
                                                )}
                                                <span className="text-sm font-bold text-grafito">DAMA<span className="block text-[11px] font-semibold text-slate-500">versión con corte de dama</span></span>
                                            </span>
                                        )}
                                        {product.versionNino && (
                                            <span className="flex items-center gap-2.5 border border-slate-200 rounded-md p-2 pr-4">
                                                {product.ninoImageUrl && (
                                                    <img src={product.ninoImageUrl} alt="Versión niño" className="w-11 h-11 rounded object-cover" />
                                                )}
                                                <span className="text-sm font-bold text-grafito">NIÑO<span className="block text-[11px] font-semibold text-slate-500">talles de niño</span></span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {product.colors.length > 0 ? (
                                <div className="py-5 border-b border-slate-200">
                                    <ColorSwatches colors={product.colors} />
                                    <AdminQuickColors
                                        productId={product.id}
                                        seleccionados={product.colors.map((pc: any) => pc.colorId ?? pc.color?.id).filter(Boolean)}
                                    />
                                </div>
                            ) : (
                                // Sin colores el bloque público no existe: el editor admin trae su propio marco
                                <AdminQuickColors productId={product.id} seleccionados={[]} conMarco />
                            )}

                            {/* Características DESACTIVADAS por pedido de Diego (14/08/2026)
                                hasta depurar el catálogo. Para reactivar: MOSTRAR_CARACTERISTICAS = true. */}
                            {MOSTRAR_CARACTERISTICAS && product.features.length > 0 && (
                                <div className="py-5 border-b border-slate-200">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-3">Características</p>
                                    <ul className="space-y-2">
                                        {product.features.map((feat: any, i: number) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                {feat.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {(product.hasScreenPrint || product.hasEmbroidery) && (
                                <div className="py-5 border-b border-slate-200">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-3">Personalización</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.hasScreenPrint && (
                                            <span className="border-2 border-grafito rounded-full px-4 py-1.5 text-sm font-bold text-grafito">Estampado</span>
                                        )}
                                        {product.hasEmbroidery && (
                                            <span className="border-2 border-grafito rounded-full px-4 py-1.5 text-sm font-bold text-grafito">Bordado</span>
                                        )}
                                    </div>
                                    <p className="mt-2.5 text-[13px] text-slate-500">Tu logo en frente, espalda y/o mangas. Sin límite de colores.</p>
                                </div>
                            )}
                        </div>

                        {/* Bloque de presupuesto */}
                        <div className="mt-7 border-2 border-primary rounded-md p-5 sm:p-6">
                            <p className="font-bold text-grafito">¿Cuántas necesitás para tu equipo?</p>
                            <p className="text-sm text-slate-500 mt-0.5 mb-4">
                                Decinos cantidad y colores, y te pasamos precio con tu logo incluido.
                            </p>
                            <a
                                href={waProducto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-primary text-white px-6 py-4 rounded-md font-bold uppercase tracking-wide text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2.5"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Pedir presupuesto de esta prenda
                            </a>
                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-xs font-semibold text-slate-500">
                                <span className="before:content-['✓_'] before:text-primary before:font-extrabold">Respuesta en menos de 2 Hs</span>
                                <span className="before:content-['✓_'] before:text-primary before:font-extrabold">Entrega 24–48 Hs</span>
                                <span className="before:content-['✓_'] before:text-primary before:font-extrabold">Sin compromiso</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Así de simple es pedirla ── */}
            <section className="bg-[#F7F7F7] py-12 sm:py-16">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito mb-7 sm:mb-9">
                        Así de simple es pedirla
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PASOS.map((paso) => (
                            <div key={paso.n} className="bg-white border border-slate-200 rounded-md p-5">
                                <span className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center font-extrabold mb-3">
                                    {paso.n}
                                </span>
                                <h3 className="font-bold text-grafito mb-1">{paso.titulo}</h3>
                                <p className="text-sm text-slate-600">{paso.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Otras prendas de la categoría ── */}
            {relatedProducts.length > 0 && (
                <section className="bg-white py-12 sm:py-16">
                    <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                        <div className="flex flex-wrap justify-between items-baseline gap-4 mb-7 sm:mb-9">
                            <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito">
                                Otras prendas de la categoría
                            </h2>
                            <Link
                                href={`/categorias/${params.categorySlug}`}
                                className="font-bold text-sm text-grafito border-b-2 border-primary pb-0.5 hover:text-primary transition-colors"
                            >
                                Ver toda la categoría →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((p: any) => (
                                <Link
                                    key={p.id}
                                    href={`/categorias/${params.categorySlug}/${p.slug}`}
                                    className="group bg-white border border-slate-200 rounded-md overflow-hidden hover:border-grafito hover:shadow-lg transition-all"
                                >
                                    <div className="relative aspect-square bg-[#F7F7F7]">
                                        {p.images?.[0] && (
                                            <img
                                                src={p.images[0].url}
                                                alt={p.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                            />
                                        )}
                                    </div>
                                    <div className="p-3.5">
                                        <h3 className="font-bold text-sm text-grafito leading-snug mb-2">{p.name}</h3>
                                        <span className="text-[13px] font-bold text-grafito border-b-2 border-primary pb-0.5">
                                            Ver prenda →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <AdminEditButtonGate href={`/admin/articulos?edit=${product.id}`} label={`Editar ${product.name}`} />
        </div>
    );
}
