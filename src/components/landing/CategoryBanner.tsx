import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/actions/homeActions";

// Banner intermedio estilo workwear: promociona la categoría de alta visibilidad.
export default async function CategoryBanner() {
    const categories = await getCategories();
    const cat = (categories || []).find((c: any) =>
        c.name.toLowerCase().includes("visibilidad")
    );
    if (!cat || !cat.imageUrl) return null;

    const slug = cat.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

    return (
        <section className="bg-white py-14 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="relative bg-grafito rounded-md overflow-hidden">
                    <Image
                        src={cat.imageUrl}
                        alt=""
                        fill
                        className="object-cover opacity-40"
                        sizes="100vw"
                    />
                    <div className="relative max-w-[560px] px-6 sm:px-14 py-12 sm:py-20 text-white">
                        <h2 className="font-display uppercase text-4xl sm:text-6xl text-white">
                            Alta visibilidad
                        </h2>
                        <p className="mt-3 mb-7 text-slate-200">
                            Seguridad y presencia para tu equipo en obra, depósito y calle. Con tu logo estampado o bordado.
                        </p>
                        <Link
                            href={`/categorias/lista-${slug}`}
                            className="inline-block bg-resalte text-grafito px-7 py-3.5 rounded-md font-bold uppercase tracking-wide text-sm hover:bg-[#EDD500] transition-colors"
                        >
                            Ver alta visibilidad
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
