import * as LucideIcons from "lucide-react";
import prisma from "@/lib/prisma";
import { getIndustriesSection } from "@/actions/homeActions";

export default async function Industries() {
    const industries: any[] = await prisma.industry.findMany({
        orderBy: { order: "asc" }
    });

    const sectionData = await getIndustriesSection();

    return (
        <section className="bg-slate-50 pt-10 pb-12">
            <div className="section-container">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="heading-lg">
                        {sectionData.title}
                    </h2>
                    <p className="text-slate-600 max-w-3xl mx-auto">
                        {sectionData.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {industries.map((industry) => (
                        <div
                            key={industry.id}
                            className="bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group hover:-translate-y-2 flex flex-col items-center text-left"
                        >
                            <div className="w-full aspect-square rounded-full overflow-hidden mb-8 border-8 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                {industry.imageUrl ? (
                                    <img 
                                        src={industry.imageUrl} 
                                        alt={industry.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <LucideIcons.Image size={64} />
                                    </div>
                                )}
                            </div>
                            <div className="w-full px-2">
                                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
                                    {industry.name}
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {industry.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
