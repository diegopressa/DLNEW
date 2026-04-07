"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    return await prisma.productCategory.findMany({
        orderBy: { order: "asc" }
    });
}

export async function getCategoryBySlug(slug: string) {
    // Try to find by name converted to slug
    const categories = await prisma.productCategory.findMany({
        include: {
            products: {
                where: { isActive: true },
                include: {
                    images: true,
                    colors: {
                        include: {
                            color: true
                        }
                    },
                    features: true
                },
                orderBy: { order: "asc" }
            }
        }
    });
    
    return categories.find(c => 
        c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') === slug
    );
}

// More precise search: normally categories should have slugs too. 
// Looking at schema, ProductCategory doesn't have a slug field yet. 
// I should probably add it or use a simple transform.

export async function addCategory(data: any) {
    try {
        const { name, description, imageUrl, showOnHome } = data;
        const last = await prisma.productCategory.findFirst({ orderBy: { order: "asc" } });
        const order = (last?.order || 0) + 1;
        
        // Try standard Prisma update first
        const category = await (prisma as any).productCategory.create({
            data: {
                name,
                description,
                imageUrl,
                showOnHome: showOnHome || false,
                order
            }
        });
        revalidatePath("/");
        revalidatePath("/admin/categorias");
        return { success: true, category };
    } catch (error) {
        console.error("Error in addCategory:", error);
        
        // Fallback for when Client is not generated
        try {
            const { name, description, imageUrl, showOnHome } = data;
            const last = await prisma.productCategory.findFirst({ orderBy: { order: "asc" } });
            const order = (last?.order || 0) + 1;
            const val = (showOnHome === true || showOnHome === "true") ? 1 : 0;
            
            await prisma.$executeRawUnsafe(
                `INSERT INTO ProductCategory (name, description, imageUrl, showOnHome, "order") VALUES (?, ?, ?, ?, ?)`,
                name, description || "", imageUrl, val, order
            );
            
            revalidatePath("/");
            revalidatePath("/admin/categorias");
            return { success: true };
        } catch (e2) {
            console.error("Critical error in addCategory fallback:", e2);
            return { success: false };
        }
    }
}

export async function updateCategory(id: number, data: any) {
    try {
        const { name, description, imageUrl, showOnHome } = data;
        
        // Use any to avoid type errors during compilation while the schema is updating
        await (prisma as any).productCategory.update({
            where: { id },
            data: {
                name,
                description,
                imageUrl,
                showOnHome: showOnHome === true || showOnHome === "true",
            }
        });

        revalidatePath("/");
        revalidatePath("/admin/categorias");
        return { success: true };
    } catch (error) {
        console.error("Error in updateCategory:", error);
        
        // Fallback: If Prisma client is not generated but the field exists in DB
        try {
            const { name, description, imageUrl, showOnHome } = data;
            const val = (showOnHome === true || showOnHome === "true") ? 1 : 0;
            await prisma.$executeRawUnsafe(
                `UPDATE ProductCategory SET name = ?, description = ?, imageUrl = ?, showOnHome = ? WHERE id = ?`,
                name, description || "", imageUrl, val, id
            );
            revalidatePath("/");
            revalidatePath("/admin/categorias");
            return { success: true };
        } catch (e2) {
            console.error("Critical error in updateCategory fallback:", e2);
            return { success: false };
        }
    }
}

export async function deleteCategory(id: number) {
    try {
        await prisma.productCategory.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/categorias");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function getCategoriasHeader() {
    try {
        let header = await (prisma as any).categoriasHeader.findUnique({ where: { id: 1 } });
        if (!header) {
            header = await (prisma as any).categoriasHeader.create({
                data: {
                    id: 1,
                    title: "Nuestro Catálogo de Prendas",
                    subtitle: "Seleccionamos las mejores telas y cortes para que tu equipo luzca impecable y trabaje con comodidad."
                }
            });
        }
        return header;
    } catch (error) {
        return {
            title: "Nuestro Catálogo de Prendas",
            subtitle: "Seleccionamos las mejores telas y cortes para que tu equipo luzca impecable y trabaje con comodidad."
        };
    }
}

export async function updateCategoriasHeader(data: {
    title: string;
    subtitle: string;
    volumeTitle?: string;
    volumeSubtitle?: string;
    volumeTier1?: string;
    volumeTier1Label?: string;
    volumeTier2?: string;
    volumeTier2Label?: string;
    volumeTier3?: string;
    volumeTier3Label?: string;
}) {
    try {
        await (prisma as any).categoriasHeader.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/categorias");
        revalidatePath("/admin/categorias");
        return { success: true };
    } catch (error) {
        console.error("Error updating categorias header:", error);
        return { success: false };
    }
}
