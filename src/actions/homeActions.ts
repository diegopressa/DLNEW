"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";

export async function getHeroData() {
    try {
        const hero = await prisma.heroSection.findUnique({
            where: { id: 1 },
        });
        
        // Carga manual de imágenes para evitar error de 'include'
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

export async function addHeroImage(url: string) {
    try {
        const last = await prisma.heroImage.findFirst({
            where: { heroId: 1 },
            orderBy: { order: "desc" }
        });
        await prisma.heroImage.create({
            data: {
                url,
                order: (last?.order || 0) + 1,
                heroId: 1
            }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function uploadHeroImage(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No se proporcionó ningún archivo" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Asegurarse de que el directorio de uploads existe
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        } catch (err) {}

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filepath = path.join(uploadDir, filename);
        
        await writeFile(filepath, buffer as any);
        const url = `/uploads/${filename}`;

        // Guardar en la base de datos
        const last = await prisma.heroImage.findFirst({
            where: { heroId: 1 },
            orderBy: { order: "desc" }
        });
        
        await prisma.heroImage.create({
            data: {
                url,
                order: (last?.order || 0) + 1,
                heroId: 1
            }
        });

        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true, url };
    } catch (error) {
        console.error("Error uploading image:", error);
        return { success: false, error: "Error al subir la imagen" };
    }
}

// Generic image upload to /public/uploads
export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) return { success: false, error: "Sin archivo" };

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        } catch (err) {}

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer as any);
        return { success: true, url: `/uploads/${filename}` };
    } catch (error) {
        return { success: false, error: "Error al subir imagen" };
    }
}

// Function to delete a file from disk if it's a local upload
async function deleteLocalFile(url: string | null) {
    if (url && url.startsWith("/uploads/")) {
        const filepath = path.join(process.cwd(), "public", url);
        try {
            await fs.unlink(filepath);
        } catch (err) {}
    }
}

export async function deleteHeroImage(id: number) {
    try {
        const image = await prisma.heroImage.findUnique({ where: { id } });
        await deleteLocalFile(image?.url || null);
        await prisma.heroImage.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// Industries
export async function getIndustriesSection() {
    try {
        let section = await (prisma as any).industriesSection.findUnique({ where: { id: 1 } });
        if (!section) {
            return {
                id: 1,
                title: "Trabajamos con empresas que necesitan uniformes para su equipo",
                subtitle: "Abastecemos a empresas en Montevideo, Canelones y Maldonado, brindando soluciones integrales de vestimenta corporativa."
            };
        }
        return section;
    } catch (error) {
        return {
            title: "Trabajamos con empresas que necesitan uniformes para su equipo",
            subtitle: "Abastecemos a empresas en Montevideo, Canelones y Maldonado, brindando soluciones integrales de vestimenta corporativa."
        };
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
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        console.error("Error updating industries section:", error);
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
        // If updating image, delete old local file
        if (data.imageUrl) {
            const old = await prisma.industry.findUnique({ where: { id } });
            if (old?.imageUrl && old.imageUrl !== data.imageUrl) {
                await deleteLocalFile(old.imageUrl);
            }
        }
        
        await prisma.industry.update({
            where: { id },
            data
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al actualizar industria" };
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
        return { success: false, error: "Error al agregar industria" };
    }
}

export async function deleteIndustry(id: number) {
    try {
        const item = await prisma.industry.findUnique({ where: { id } });
        await deleteLocalFile(item?.imageUrl || null);
        await prisma.industry.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al eliminar industria" };
    }
}

// Business Solutions
export async function getSolutionsSection() {
    try {
        let section = await (prisma as any).solutionsSection.findUnique({ where: { id: 1 } });
        if (!section) {
            return {
                id: 1,
                title: "Uniformes sin complicaciones para tu empresa",
                subtitle: "Simplificamos todo el proceso para que no tengas que preocuparte por nada más que elegir el diseño."
            };
        }
        return section;
    } catch (error) {
        return {
            title: "Uniformes sin complicaciones para tu empresa",
            subtitle: "Simplificamos todo el proceso para que no tengas que preocuparte por nada más que elegir el diseño."
        };
    }
}

export async function updateSolutionsSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).solutionsSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
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
    } catch (error) {
        return { success: false, error: "Error al actualizar solución" };
    }
}

// Why Choose Us
export async function getWhyUsSection() {
    try {
        let section = await (prisma as any).whyUsSection.findUnique({ where: { id: 1 } });
        if (!section) {
            return {
                id: 1,
                title: "Por qué las empresas nos eligen",
                subtitle: "Combinamos materiales de primera con un servicio enfocado en resolver las necesidades de tu negocio.",
                backgroundColor: "#4b85c1"
            };
        }
        return section;
    } catch (error) {
        return {
            title: "Por qué las empresas nos eligen",
            subtitle: "Combinamos materiales de primera con un servicio enfocado en resolver las necesidades de tu negocio.",
            backgroundColor: "#4b85c1"
        };
    }
}

export async function updateWhyUsSection(data: { title: string; subtitle: string; backgroundColor: string }) {
    try {
        await (prisma as any).whyUsSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        console.error("Error in updateWhyUsSection:", error);
        return { success: false };
    }
}

export async function getWhyUs() {
    return await prisma.whyChooseUs.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateWhyUs(id: number, data: { title: string; description: string }) {
    try {
        await prisma.whyChooseUs.update({
            where: { id },
            data
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function addWhyUs(data: { title: string; description: string }) {
    try {
        const last = await prisma.whyChooseUs.findFirst({ orderBy: { order: "desc" } });
        await prisma.whyChooseUs.create({
            data: { ...data, order: (last?.order || 0) + 1 }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteWhyUs(id: number) {
    try {
        await prisma.whyChooseUs.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// Process Steps
export async function getProcessSection() {
    try {
        let section = await (prisma as any).processSection.findUnique({ where: { id: 1 } });
        if (!section) {
            return {
                id: 1,
                title: "Así de simple es trabajar con DL",
                subtitle: ""
            };
        }
        return section;
    } catch (error) {
        return {
            title: "Así de simple es trabajar con DL",
            subtitle: ""
        };
    }
}

export async function updateProcessSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).processSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        console.error("Error in updateProcessSection:", error);
        return { success: false };
    }
}

export async function getProcessSteps() {
    return await prisma.processStep.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateProcessStep(id: number, data: { title: string; description?: string }) {
    try {
        await prisma.processStep.update({
            where: { id },
            data
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
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
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteProcessStep(id: number) {
    try {
        await prisma.processStep.delete({ where: { id } });
        // Optionally update the numbers of remaining steps here, but keeping it simple for now
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// Categories Section
export async function getCategoriesSection() {
    try {
        let section = await (prisma as any).categoriesSection.findUnique({ where: { id: 1 } });
        if (!section) {
            return {
                id: 1,
                title: "Prendas para uniformar a tu equipo",
                subtitle: "Contamos con una amplia línea de prendas seleccionadas por su durabilidad y calidad para el uso diario en empresas."
            };
        }
        return section;
    } catch (error) {
        return {
            title: "Prendas para uniformar a tu equipo",
            subtitle: "Contamos con una amplia línea de prendas seleccionadas por su durabilidad y calidad para el uso diario en empresas."
        };
    }
}

export async function updateCategoriesSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).categoriesSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function getCategories() {
    try {
        // Standard way (using any to bypass type linting)
        return await (prisma as any).productCategory.findMany({
            where: { showOnHome: true },
            orderBy: { order: "asc" }
        });
    } catch (error) {
        console.warn("Prisma Client out of sync, filtering showOnHome in JS", error);
        // Fallback: Fetch all and filter in JS if showOnHome is not recognized by Client yet
        try {
            const all = await prisma.productCategory.findMany({
                orderBy: { order: "asc" }
            });
            return all.filter((c: any) => c.showOnHome === true || c.showOnHome === 1);
        } catch (e2) {
            console.error("Critical error in getCategories home fallback:", e2);
            return [];
        }
    }
}

export async function updateCategory(id: number, data: { name: string; imageUrl: string }) {
    try {
        const old = await prisma.productCategory.findUnique({ where: { id } });
        if (old?.imageUrl && old.imageUrl !== data.imageUrl) {
            await deleteLocalFile(old.imageUrl);
        }
        
        await prisma.productCategory.update({
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

// Projects Section
export async function getProjectsSection() {
    try {
        let section = await (prisma as any).projectsSection.findUnique({ where: { id: 1 } });
        if (!section) {
            return {
                id: 1,
                title: "Empresas que ya confiaron en DL",
                subtitle: "Llevamos la identidad de tu marca a la vestimenta de tu equipo con acabados profesionales."
            };
        }
        return section;
    } catch (error) {
        return {
            title: "Empresas que ya confiaron en DL",
            subtitle: "Llevamos la identidad de tu marca a la vestimenta de tu equipo con acabados profesionales."
        };
    }
}

export async function updateProjectsSection(data: { title: string; subtitle: string }) {
    try {
        await (prisma as any).projectsSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function getProjects() {
    return await prisma.project.findMany({
        orderBy: { order: "asc" }
    });
}

export async function updateProject(id: number, data: { title: string; category?: string; imageUrl: string }) {
    try {
        const old = await prisma.project.findUnique({ where: { id } });
        if (old?.imageUrl && old.imageUrl !== data.imageUrl) {
            await deleteLocalFile(old.imageUrl);
        }
        
        await prisma.project.update({
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

export async function addProject(data: { title: string; category?: string; imageUrl: string }) {
    try {
        await prisma.project.create({
            data: {
                ...data,
                order: 99 // Se pone al final por defecto
            }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteProject(id: number) {
    try {
        const item = await prisma.project.findUnique({ where: { id } });
        await deleteLocalFile(item?.imageUrl || null);
        
        await prisma.project.delete({
            where: { id }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// CTA Section
export async function getCtaSection() {
    try {
        let section = await (prisma as any).ctaSection.findUnique({ where: { id: 1 } });
        if (!section) {
            return {
                id: 1,
                title: "¿Necesitás uniformes para tu empresa?",
                subtitle: "Te pasamos presupuesto inmediato y te ayudamos a resolver todo en un solo lugar. Calidad, rapidez y atención personalizada.",
                buttonText: "Pedir presupuesto por WhatsApp",
                buttonLink: "#whatsapp",
                smallText: "Respondemos en menos de 10 minutos",
                backgroundColor: "#1f2937"
            };
        }
        return section;
    } catch (error) {
        return {
            title: "¿Necesitás uniformes para tu empresa?",
            subtitle: "Te pasamos presupuesto inmediato y te ayudamos a resolver todo en un solo lugar. Calidad, rapidez y atención personalizada.",
            buttonText: "Pedir presupuesto por WhatsApp",
            buttonLink: "#whatsapp",
            smallText: "Respondemos en menos de 10 minutos",
            backgroundColor: "#1f2937"
        };
    }
}

export async function updateCtaSection(data: { title: string; subtitle: string; buttonText: string; buttonLink: string; smallText: string; backgroundColor: string }) {
    try {
        await (prisma as any).ctaSection.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/");
        revalidatePath("/admin/home");
        return { success: true };
    } catch (error) {
        console.error("Error in updateCtaSection:", error);
        return { success: false };
    }
}
