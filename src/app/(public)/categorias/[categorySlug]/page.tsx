import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Package } from "lucide-react";
import { getCategoryBySlug, getVisibleCategories } from "@/actions/categoryActions";
import { getReflectiveProducts } from "@/actions/productActions";
import { getGlobalSettings } from "@/actions/settingsActions";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import CategoryGrid from "@/components/category/CategoryGrid";
import { textoPlano } from "@/lib/slugs";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 3600;

const slugify = (name: string) =>
    name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

export async function generateMetadata({ params }: { params: { categorySlug: string } }): Promise<Metadata> {
    const slug = params.categorySlug.startsWith("lista-") ? params.categorySlug.replace("lista-", "") : params.categorySlug;
    const category: any = await getCategoryBySlug(slug);
    if (!category) return {};

    const baseUrl = "https://dldisenoyestampado.uy";
    // Canonical siempre con el prefijo lista- (la URL sin prefijo redirige)
    const url = `${baseUrl}/categorias/lista-${slugify(category.name)}`;
    // Sin adjetivo con género ("Personalizados" quedaba mal en Camisas, etc.)
    const title = `${category.name} para Empresas con tu Logo | DL Uruguay`;
    const description = textoPlano(
        category.description ||
        `${category.name} para uniformes de empresa en Uruguay. Estampado, bordado y entrega en 24-48 Hs en Montevideo y todo el país.`
    );

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
        },
        twitter: { card: "summary_large_image", title, description },
    };
}

export default async function CategoryListingPage({
    params,
    searchParams,
}: {
    params: { categorySlug: string };
    searchParams: { version?: string };
}) {
    // Una sola URL indexable por categoría: sin el prefijo "lista-" se redirige
    if (!params.categorySlug.startsWith("lista-")) {
        permanentRedirect(`/categorias/lista-${params.categorySlug}`);
    }

    const slug = params.categorySlug.replace("lista-", "");
    const [category, allCategories, settings] = await Promise.all([
        getCategoryBySlug(slug) as any,
        getVisibleCategories() as any, // sidebar: solo categorías visibles
        getGlobalSettings() as any,
    ]);

    if (!category) {
        notFound();
    }

    // "Alta visibilidad y seguridad" es una colección: además de sus prendas
    // físicas (EPP), suma automáticamente toda prenda reflectiva del catálogo.
    const esAltaVisibilidad = category.name.toLowerCase().includes("alta visibilidad");
    const extrasReflectivos = esAltaVisibilidad ? await getReflectiveProducts(category.id) : [];
    // Dedupe: un artículo puede llegar por categoría extra Y por la colección reflectiva
    const idsYaListados = new Set((category.products as any[]).map((p: any) => p.id));
    const todosLosProductos = [
        ...(category.products as any[]),
        ...extrasReflectivos.filter((p: any) => !idsYaListados.has(p.id)),
    ];

    // Filtro por versión (?version=dama | nino)
    const filtroVersion = searchParams?.version;
    const productosFiltrados = todosLosProductos.filter((p: any) => {
        if (filtroVersion === "dama") return p.versionDama;
        if (filtroVersion === "nino") return p.versionNino;
        return true;
    });

    const whatsapp = settings?.whatsapp || "59897534866";
    const waAsesoria = `https://api.whatsapp.com/send/?phone=${whatsapp}&text=${encodeURIComponent(`Hola, necesito ayuda para elegir ${category.name.toLowerCase()} para mi equipo.`)}&type=phone_number&app_absent=0`;
    const waPedido = `https://api.whatsapp.com/send/?phone=${whatsapp}&text=${encodeURIComponent("Hola, quiero armar un pedido de uniformes para mi equipo.")}&type=phone_number&app_absent=0`;

    const baseUrl = "https://dldisenoyestampado.uy";
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
            { "@type": "ListItem", position: 2, name: "Productos", item: `${baseUrl}/categorias` },
            { "@type": "ListItem", position: 3, name: category.name, item: `${baseUrl}/categorias/${params.categorySlug}` },
        ],
    };

    return (
        <div className="bg-white min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            {/* ── Banner de categoría ── */}
            <section className="relative bg-grafito overflow-hidden">
                {category.imageUrl && (
                    <Image
                        src={category.imageUrl}
                        alt=""
                        fill
                        priority
                        className="object-cover opacity-40"
                        sizes="100vw"
                    />
                )}
                <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-white">
                    <h1 className="font-display uppercase leading-none text-5xl sm:text-6xl lg:text-7xl text-white">
                        {category.name}
                    </h1>
                    <p className="mt-3 text-slate-200 max-w-[52ch]">
                        {esAltaVisibilidad
                            ? "Todo lo reflectivo y de seguridad del catálogo en un solo lugar: remeras, camperas, pantalones y equipos de protección."
                            : "Con tu logo estampado o bordado. Presupuesto en menos de 2 horas y entrega en todo Uruguay."}
                    </p>
                </div>
            </section>

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                {/* ── Breadcrumb ── */}
                <nav className="pt-5 text-sm text-slate-500" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span className="mx-2">›</span>
                    <Link href="/categorias" className="hover:text-primary transition-colors">Productos</Link>
                    <span className="mx-2">›</span>
                    <span className="text-grafito font-semibold">{category.name}</span>
                </nav>

                {/* ── Sidebar + grilla ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 lg:gap-11 py-7 sm:py-9">
                    <aside className="hidden lg:flex flex-col gap-5 self-start sticky top-6">
                        <div className="border border-slate-200 rounded-md p-5">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-3">
                                Categorías
                            </h2>
                            {allCategories.map((c: any) => {
                                const cSlug = `lista-${slugify(c.name)}`;
                                const activa = c.id === category.id;
                                return (
                                    <Link
                                        key={c.id}
                                        href={`/categorias/${cSlug}`}
                                        className={
                                            activa
                                                ? "block py-2 pl-3 border-l-[3px] border-primary font-bold text-grafito text-sm"
                                                : "block py-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                                        }
                                    >
                                        {c.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="border border-slate-200 rounded-md p-5">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-3">
                                Versiones
                            </h2>
                            {[
                                { valor: undefined, etiqueta: "Todas las prendas" },
                                { valor: "dama", etiqueta: "Disponible en dama" },
                                { valor: "nino", etiqueta: "Disponible en niño" },
                            ].map((f) => {
                                const activa = filtroVersion === f.valor || (!filtroVersion && !f.valor);
                                return (
                                    <Link
                                        key={f.etiqueta}
                                        href={f.valor ? `/categorias/${params.categorySlug}?version=${f.valor}` : `/categorias/${params.categorySlug}`}
                                        className={
                                            activa
                                                ? "block py-2 pl-3 border-l-[3px] border-primary font-bold text-grafito text-sm"
                                                : "block py-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                                        }
                                    >
                                        {f.etiqueta}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="bg-[#F7F7F7] rounded-md p-5">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
                                ¿No sabés cuál elegir?
                            </h2>
                            <p className="text-sm text-slate-600 mb-4">
                                Contanos el rubro y el uso, y te recomendamos la prenda justa.
                            </p>
                            <a
                                href={waAsesoria}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center bg-primary text-white px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors"
                            >
                                Pedir asesoramiento
                            </a>
                        </div>
                    </aside>

                    <div>
                        <div className="flex items-center justify-between gap-4 mb-5">
                            <span className="text-sm font-semibold text-slate-500">
                                <b className="text-grafito">{productosFiltrados.length}</b> {productosFiltrados.length === 1 ? "prenda" : "prendas"}
                                {filtroVersion && (
                                    <> · filtro: <b className="text-grafito">{filtroVersion === "dama" ? "dama" : "niño"}</b></>
                                )}
                            </span>
                        </div>

                        {/* Grilla con arrastre en modo admin (el público la ve igual que siempre) */}
                        <CategoryGrid products={productosFiltrados} categorySlug={params.categorySlug} />

                        {productosFiltrados.length === 0 && (
                            <div className="border border-dashed border-slate-300 rounded-md p-14 text-center">
                                <Package size={40} className="mx-auto mb-4 text-slate-300" />
                                <h2 className="font-bold text-lg text-grafito mb-1">
                                    {filtroVersion ? "Ninguna prenda de esta categoría tiene esa versión" : "Aún no hay prendas cargadas"}
                                </h2>
                                <p className="text-slate-500 text-sm">Estamos actualizando el catálogo de esta categoría. Escribinos y te pasamos las opciones por WhatsApp.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Banda de consulta ── */}
            <div className="bg-[#F7F7F7] border-t border-slate-100">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-7 flex flex-wrap items-center justify-between gap-4">
                    <p className="font-semibold text-grafito">
                        ¿Necesitás mezclar prendas en un mismo pedido?
                        <span className="block text-sm font-normal text-slate-500">Combinamos categorías, talles y colores en una sola entrega.</span>
                    </p>
                    <a
                        href={waPedido}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-grafito text-white px-6 py-3.5 rounded-md text-sm font-bold uppercase tracking-wide hover:bg-black transition-colors"
                    >
                        Armar mi pedido
                    </a>
                </div>
            </div>

            <AdminEditButtonGate href={`/admin/categorias?edit=${category.id}`} label={`Editar ${category.name}`} />
        </div>
    );
}
