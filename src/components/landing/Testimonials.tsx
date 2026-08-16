import { Star } from "lucide-react";

interface Testimonial {
    id: number;
    name: string;
    company: string;
    role?: string;
    content: string;
    imageUrl?: string;
}

// Perfil de Google Business de DL (place_id encontrado en el listado del negocio).
// VERIFICAR con Diego que abre su ficha correcta antes del lanzamiento.
const GOOGLE_REVIEWS_URL =
    "https://www.google.com/maps/place/?q=place_id:ChIJaQbG8iuBn5URN69g_bK4BRk";

function Estrellas() {
    return (
        <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#FBBC04] text-[#FBBC04]" />
            ))}
        </div>
    );
}

// Testimonios con 5 estrellas tipo Google; cada tarjeta linkea a las reseñas reales.
export default function Testimonials({ items }: { items: Testimonial[] }) {
    if (!items || items.length === 0) return null;
    const destacados = items.slice(0, 3);

    return (
        <section className="bg-[#F7F7F7] py-14 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito">
                            Lo que dicen nuestros clientes
                        </h2>
                        <div className="mt-3 flex items-center gap-2.5">
                            <Estrellas />
                            <span className="text-sm font-semibold text-slate-500">Opiniones reales de empresas que ya pidieron</span>
                        </div>
                    </div>
                    <a
                        href={GOOGLE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-grafito border-b-2 border-primary pb-0.5 hover:text-primary transition-colors"
                    >
                        Ver todas las opiniones en Google →
                    </a>
                </div>

                {/* En celular: carrusel horizontal; en pantallas grandes: grilla */}
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 md:gap-5 md:grid md:grid-cols-3 md:overflow-visible">
                    {destacados.map((t) => (
                        <a
                            key={t.id}
                            href={GOOGLE_REVIEWS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver las reseñas en Google"
                            className="bg-white border border-slate-200 rounded-md p-6 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all flex flex-col min-w-[85%] snap-start md:min-w-0"
                        >
                            <Estrellas />
                            <p className="mt-4 mb-5 text-[15px] font-medium text-grafito leading-relaxed flex-1">
                                “{t.content}”
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                {t.imageUrl ? (
                                    <img
                                        src={t.imageUrl}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm grid place-items-center shrink-0">
                                        {t.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-sm text-grafito">{t.name}</p>
                                    {(t.company || t.role) && (
                                        <p className="text-xs text-slate-500">
                                            {t.role && t.company ? `${t.role} · ${t.company}` : t.role || t.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
