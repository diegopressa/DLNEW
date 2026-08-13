import Image from "next/image";

interface Brand {
    id: number;
    name: string;
    imageUrl: string;
}

// Logos de clientes en tarjetas blancas, a color y con buen tamaño:
// es el activo de confianza más fuerte y tiene que resaltar.
export default function BrandSlider({ brands }: { brands: Brand[] }) {
    if (brands.length === 0) return null;

    return (
        <section className="bg-grafito py-14 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="mb-8 sm:mb-10">
                    <h2 className="font-display uppercase text-4xl sm:text-5xl text-white">
                        Empresas que confiaron en nosotros
                    </h2>
                    <p className="mt-2 text-slate-400 font-medium max-w-[60ch]">
                        Instituciones, empresas y clubes de todo Uruguay ya uniformaron a sus equipos con DL.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-white rounded-md h-24 sm:h-28 grid place-items-center p-4 hover:ring-2 hover:ring-celeste transition-all"
                        >
                            <Image
                                src={brand.imageUrl}
                                alt={`Logo ${brand.name}`}
                                width={180}
                                height={72}
                                className="max-h-14 sm:max-h-16 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
