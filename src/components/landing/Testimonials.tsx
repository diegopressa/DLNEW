interface Testimonial {
    id: number;
    name: string;
    company: string;
    role?: string;
    content: string;
    imageUrl?: string;
}

// Dos citas grandes con borde amarillo; sin carrusel ni estrellitas.
export default function Testimonials({ items }: { items: Testimonial[] }) {
    if (!items || items.length === 0) return null;
    const destacados = items.slice(0, 2);

    return (
        <section className="bg-[#F7F7F7] py-14 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito mb-8 sm:mb-10">
                    Lo que dicen los clientes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {destacados.map((t) => (
                        <blockquote
                            key={t.id}
                            className="bg-white border border-slate-200 border-l-4 border-l-resalte rounded-md p-6"
                        >
                            <p className="text-lg font-semibold text-grafito leading-snug mb-3">
                                “{t.content}”
                            </p>
                            <footer className="text-sm text-slate-500">
                                {t.name}
                                {t.company ? ` — ${t.company}` : ""}
                            </footer>
                        </blockquote>
                    ))}
                </div>
            </div>
        </section>
    );
}
