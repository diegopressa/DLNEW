import Link from "next/link";
import Image from "next/image";
import { getCategoriesSection, getCategories } from "@/actions/homeActions";

// Mosaico de categorías con el nombre sobre la foto (estilo tienda workwear).
export default async function Categories() {
    const [data, sectionData] = await Promise.all([
        getCategories(),
        getCategoriesSection(),
    ]);

    if (!data || data.length === 0) return null;

    return (
        <section className="bg-white py-14 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="flex flex-wrap justify-between items-baseline gap-4 mb-8 sm:mb-10">
                    <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito">
                        {sectionData?.title || "Elegí por categoría"}
                    </h2>
                    <Link
                        href="/categorias"
                        className="font-bold text-sm text-grafito border-b-2 border-resalte pb-0.5 hover:text-primary transition-colors"
                    >
                        Ver catálogo completo →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {data.map((cat: any) => {
                        const slug = cat.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
                        return (
                            <Link
                                key={cat.id}
                                href={`/categorias/lista-${slug}`}
                                className="group relative rounded-md overflow-hidden"
                            >
                                <div className="relative aspect-[5/6]">
                                    <Image
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-grafito/90 to-transparent pt-9 pb-3.5 px-3.5">
                                    <span className="text-white font-bold text-sm border-b-2 border-resalte pb-0.5">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
