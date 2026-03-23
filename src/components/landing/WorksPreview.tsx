import { getProjectsSection, getProjects } from "@/actions/homeActions";
import WorksCarousel from "./WorksCarousel";

export default async function WorksPreview() {
    const data = await getProjects();
    const sectionData = await getProjectsSection();

    const works = data.length > 0 ? data : [
        {
            id: -1,
            title: "Uniformes Logística",
            category: "Chalecos y Gorros",
            imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
        },
        {
            id: -2,
            title: "Equipo Gastronómico",
            category: "Delantales Bordados",
            imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600",
        },
        {
            id: -3,
            title: "Ropa de Seguridad",
            category: "Camperas Alta Visibilidad",
            imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6e56f29f?auto=format&fit=crop&q=80&w=600",
        },
        {
            id: -4,
            title: "Merchandising Evento",
            category: "Remeras Algodón",
            imageUrl: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&q=80&w=600",
        },
    ];

    return (
        <section className="pt-24 pb-4 overflow-hidden">
            <div className="section-container">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="heading-lg">{sectionData.title}</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {sectionData.subtitle}
                    </p>
                </div>

                <WorksCarousel works={works} />
            </div>
        </section>
    );
}
