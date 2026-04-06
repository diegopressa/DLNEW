import Hero from "@/components/landing/Hero";
import Industries from "@/components/landing/Industries";
import BrandSlider from "@/components/landing/BrandSlider";
import { getBrands } from "@/actions/homeActions";
import { getFaqItems } from "@/actions/faqActions";
import Solutions from "@/components/landing/Solutions";
import Categories from "@/components/landing/Categories";
import WorksPreview from "@/components/landing/WorksPreview";
import WhyUs from "@/components/landing/WhyUs";
import Process from "@/components/landing/Process";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/");
}

export default async function HomePage() {
    const brands = await getBrands();
    const faqItems = await getFaqItems();

    return (
        <>
            <Hero />
            <Industries />
            <Solutions />
            <Categories />
            <WorksPreview />
            <BrandSlider brands={brands} />
            <WhyUs />
            <Process />
            <FAQ items={faqItems} />
            <CTASection />
        </>
    );
}
