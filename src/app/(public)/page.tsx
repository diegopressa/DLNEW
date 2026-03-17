import Hero from "@/components/landing/Hero";
import Industries from "@/components/landing/Industries";
import Solutions from "@/components/landing/Solutions";
import Categories from "@/components/landing/Categories";
import WorksPreview from "@/components/landing/WorksPreview";
import WhyUs from "@/components/landing/WhyUs";
import Process from "@/components/landing/Process";
import CTASection from "@/components/landing/CTASection";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/");
}

export default function HomePage() {
    return (
        <>
            <Hero />
            <Industries />
            <Solutions />
            <Categories />
            <WorksPreview />
            <WhyUs />
            <Process />
            <CTASection />
        </>
    );
}
