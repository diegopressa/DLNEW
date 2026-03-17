import * as LucideIcons from "lucide-react";
import prisma from "@/lib/prisma";
import { getSolutionsSection } from "@/actions/homeActions";

export default async function Solutions() {
    const solutions: any[] = await prisma.businessSolution.findMany({
        orderBy: { order: "asc" }
    });

    const sectionData = await getSolutionsSection();

    return (
        <section className="pt-12 pb-24">
            <div className="section-container">
                <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                    <h2 className="heading-lg">{sectionData.title}</h2>
                    <p className="text-slate-600">
                        {sectionData.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {solutions.map((item) => {
                        const IconComponent = (LucideIcons as any)[item.iconName || "Shirt"] || LucideIcons.Shirt;

                        return (
                            <div key={item.id} className="p-8 rounded-3xl border border-slate-100 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 group">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 text-primary group-hover:scale-110 transition-transform`}>
                                    <IconComponent size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
