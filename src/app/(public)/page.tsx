import Hero from "@/components/landing/Hero";
import ServicesStrip from "@/components/landing/ServicesStrip";
import Categories from "@/components/landing/Categories";
import WorksPreview from "@/components/landing/WorksPreview";
import CategoryBanner from "@/components/landing/CategoryBanner";
import BrandSlider from "@/components/landing/BrandSlider";
import Testimonials from "@/components/landing/Testimonials";
import FAQTeaser from "@/components/landing/FAQTeaser";
import CTASection from "@/components/landing/CTASection";
import AdminEditButtonGate from "@/components/admin/AdminEditButtonGate";
import { getBrands } from "@/actions/homeActions";
import { getTestimonials } from "@/actions/testimonialActions";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/");
}

// Home nueva (rediseño 08/2026): 8 bloques en vez de 12 secciones.
// Orden: hero → datos de servicio → categorías → trabajos → banner → logos → testimonios → CTA.
export default async function HomePage() {
    const [brands, testimonials] = await Promise.all([
        getBrands(),
        getTestimonials(),
    ]);

    return (
        <>
            <Hero />
            <ServicesStrip />
            <Categories />
            <WorksPreview />
            <CategoryBanner />
            <BrandSlider brands={brands} />
            <Testimonials items={testimonials} />
            <FAQTeaser />
            <CTASection />
            <AdminEditButtonGate href="/admin/home" label="Editar Inicio" />
        </>
    );
}
