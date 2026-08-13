import Image from "next/image";

interface Brand {
    id: number;
    name: string;
    imageUrl: string;
}

// Logos de clientes: grilla estática en gris (toman color al pasar el mouse).
// Es el activo de confianza más fuerte; nada de carrusel.
export default function BrandSlider({ brands }: { brands: Brand[] }) {
    if (brands.length === 0) return null;

    return (
        <section className="bg-white py-14 sm:py-20 border-t border-slate-100">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito mb-8 sm:mb-10">
                    Confiaron en nosotros
                </h2>
                <div className="flex flex-wrap items-center gap-x-9 gap-y-6">
                    {brands.map((brand) => (
                        <div key={brand.id} className="relative h-10 sm:h-11 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200">
                            <Image
                                src={brand.imageUrl}
                                alt={`Logo ${brand.name}`}
                                width={160}
                                height={44}
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
