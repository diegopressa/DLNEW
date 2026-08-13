import Link from "next/link";
import Image from "next/image";
import { getProjectsSection, getProjects } from "@/actions/homeActions";

// Trabajos recientes: 6 curados en tarjetas tipo producto, con "Quiero algo así →".
export default async function WorksPreview() {
    const [data, sectionData] = await Promise.all([
        getProjects(),
        getProjectsSection(),
    ]);

    const works = (data || []).slice(0, 6);
    if (works.length === 0) return null;

    return (
        <section className="bg-[#F7F7F7] py-14 sm:py-20">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                <div className="flex flex-wrap justify-between items-baseline gap-4 mb-8 sm:mb-10">
                    <h2 className="font-display uppercase text-4xl sm:text-5xl text-grafito">
                        {sectionData?.title || "Trabajos recientes"}
                    </h2>
                    <Link
                        href="/trabajos"
                        className="font-bold text-sm text-grafito border-b-2 border-resalte pb-0.5 hover:text-primary transition-colors"
                    >
                        Ver todos →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {works.map((work: any) => (
                        <Link
                            key={work.id}
                            href="/trabajos"
                            className="group bg-white border border-slate-200 rounded-md overflow-hidden hover:border-grafito hover:shadow-lg transition-all"
                        >
                            <div className="relative aspect-[4/3]">
                                <Image
                                    src={work.imageUrl}
                                    alt={work.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <div className="p-4">
                                <span className="block text-primary text-[11px] font-bold uppercase tracking-[0.1em] mb-0.5">
                                    {work.title}
                                </span>
                                <h3 className="font-bold text-[15px] text-grafito mb-2 leading-snug">
                                    {work.category || work.title}
                                </h3>
                                <span className="text-[13px] font-bold text-grafito border-b-2 border-resalte pb-0.5">
                                    Quiero algo así →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
