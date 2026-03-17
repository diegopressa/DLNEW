"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * HOME ACTIONS - COMPLETELY STANDARDIZED
 * All file storage logic (fs/mkdir) removed.
 * Persistence now relies on external Supabase URLs.
 */

export async function getHeroData() {
    try {
        const hero = await prisma.heroSection.findUnique({
            where: { id: 1 },
        });
        
        let images: any[] = [];
        try {
            images = await (prisma as any).heroImage.findMany({
                where: { heroId: 1 },
                orderBy: { order: "asc" }
            });
        } catch (e) {}

        if (!hero) {
            const newHero = await prisma.heroSection.create({
                data: {
                    id: 1,
                    title: "Uniformes personalizados para empresas",
                    subtitle: "Nos encargamos de todo: prenda, estampado y entrega. Presupuesto inmediato y entrega en 24-48 horas.",
                    ctaPrimary: "Solicitar presupuesto por WhatsApp"
                },
            });
            return { ...newHero, images: [] };
        }
        return { ...hero, images };
    } catch (error) {
        console.error("Error fetching hero data:", error);
        return null;
    }
}

export async function updateHeroTexts(data: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
}) {
    try {
        await prisma.heroSection.update({
            where: { id: 1 },
            data: {
                title: data.title,
                subtitle: data.subtitle,
                ctaPrimary: data.ctaPrimary,
            }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function syncHeroImages(imageUrls: string[]) {
    try {
        await prisma.heroImage.deleteMany({ where: { heroId: 1 } });
        
        if (imageUrls.length > 0) {
            await prisma.$transaction(
                imageUrls.map((url, i) => 
                    prisma.heroImage.create({
                        data: { url, order: i, heroId: 1 }
                    })
                )
            );
        }

        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        console.error("syncHeroImages error:", error);
        return { success: false };
    }
}

export async function addHeroImage(url: string) {
    try {
        const last = await prisma.heroImage.findFirst({
            where: { heroId: 1 },
            orderBy: { order: "desc" }
        });
        await prisma.heroImage.create({
            data: { url, order: (last?.order || 0) + 1, heroId: 1 }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function deleteHeroImage(id: number) {
    try {
        await prisma.heroImage.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

// Industries
export async function getIndustriesSection() {
    try {
        let section = await (prisma as any).industriesSection.findUnique({ where: { id: 1 } });
        return section || {
            title: "Trabajamos con empresas que necesitan uniformes para su equipo",
            subtitle: "Abastecemos a empresas en Montevideo, Canelones y Maldonado."
        };
    } catch (error) {
        return null;
    }
}

export async function updateIndustriesSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).industriesSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function getIndustries() {
    return await prisma.industry.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateIndustry(id: number, data: { name: string; description?: string; iconName?: string; imageUrl?: string }) {
    try {
        await prisma.industry.update({
            where: { id },
            data
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function addIndustry(data: { name: string; description: string; iconName: string }) {
    try {
        const last = await prisma.industry.findFirst({ orderBy: { order: "desc" } });
        await prisma.industry.create({
            data: { ...data, order: (last?.order || 0) + 1 }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteIndustry(id: number) {
    try {
        await prisma.industry.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// Business Solutions
export async function getSolutionsSection() {
    try {
        let section = await (prisma as any).solutionsSection.findUnique({ where: { id: 1 } });
        return section || { title: "Soluciones", subtitle: "Descripción" };
    } catch (error) { return null; }
}

export async function updateSolutionsSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).solutionsSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function getSolutions() {
    return await prisma.businessSolution.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateSolution(id: number, data: { title: string; description: string; iconName?: string }) {
    try {
        await prisma.businessSolution.update({
            where: { id },
            data
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

// Why Choose Us
export async function getWhyUsSection() {
    try {
        let section = await (prisma as any).whyUsSection.findUnique({ where: { id: 1 } });
        return section || { title: "Por qué elegirnos", subtitle: "..." };
    } catch (error) { return null; }
}

export async function updateWhyUsSection(data: { title: string; subtitle: string; backgroundColor: string }) {
    try {
        await (prisma as any).whyUsSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function getWhyUs() {
    return await prisma.whyChooseUs.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateWhyUs(id: number, data: { title: string; description: string }) {
    try {
        await prisma.whyChooseUs.update({ where: { id }, data });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function addWhyUs(data: { title: string; description: string }) {
    try {
        const last = await prisma.whyChooseUs.findFirst({ orderBy: { order: "desc" } });
        await prisma.whyChooseUs.create({
            data: { ...data, order: (last?.order || 0) + 1 }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function deleteWhyUs(id: number) {
    try {
        await prisma.whyChooseUs.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

// Process Steps
export async function getProcessSection() {
    try {
        let section = await (prisma as any).processSection.findUnique({ where: { id: 1 } });
        return section || { title: "Proceso", subtitle: "" };
    } catch (error) { return null; }
}

export async function updateProcessSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).processSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function getProcessSteps() {
    return await prisma.processStep.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateProcessStep(id: number, data: { title: string; description?: string }) {
    try {
        await prisma.processStep.update({ where: { id }, data });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function addProcessStep(data: { title: string; description: string }) {
    try {
        const last = await prisma.processStep.findFirst({ orderBy: { order: "desc" } });
        await prisma.processStep.create({
            data: { 
                ...data, 
                order: (last?.order || 0) + 1,
                number: (last?.number || 0) + 1 
            }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function deleteProcessStep(id: number) {
    try {
        await prisma.processStep.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

// Categories Section
export async function getCategoriesSection() {
    try {
        let section = await (prisma as any).categoriesSection.findUnique({ where: { id: 1 } });
        return section || { title: "Categorías", subtitle: "" };
    } catch (error) { return null; }
}

export async function updateCategoriesSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).categoriesSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function getCategories() {
    try {
        return await (prisma as any).productCategory.findMany({
            where: { showOnHome: true },
            orderBy: { order: "asc" }
        });
    } catch (error) {
        return [];
    }
}

export async function updateCategory(id: number, data: { name: string; imageUrl: string }) {
    try {
        await prisma.productCategory.update({
            where: { id },
            data
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) { return { success: false }; }
}

// Projects Section
export async function getProjectsSection() {
    try {
        let section = await (prisma as any).projectsSection.findUnique({ where: { id: 1 } });
        return section || { title: "Proyectos", subtitle: "" };
    } catch (error) { return null; }
}

export async function updateProjectsSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).projectsSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function getProjects() {
    return await prisma.project.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateProject(id: number, data: { title: string; category?: string; imageUrl: string }) {
    try {
        await prisma.project.update({
            where: { id },
            data
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function addProject(data: { title: string; category?: string; imageUrl: string }) {
    try {
        await prisma.project.create({
            data: { ...data, order: 99 }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) { return { success: false }; }
}

export async function deleteProject(id: number) {
    try {
        await prisma.project.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}

// CTA Section
export async function getCtaSection() {
    try {
        let section = await (prisma as any).ctaSection.findUnique({ where: { id: 1 } });
        return section || { title: "CTA", subtitle: "" };
    } catch (error) { return null; }
}

export async function updateCtaSection(data: { title: string; subtitle: string; buttonText: string; buttonLink: string; smallText: string; backgroundColor: string }) {
    try {
        await (prisma as any).ctaSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) { return { success: false }; }
}
