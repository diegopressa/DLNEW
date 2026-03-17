"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    try {
        return await (prisma as any).product.findMany({
            include: {
                category: true,
                images: { orderBy: { order: "asc" } },
                features: true,
                colors: true
            },
            orderBy: { order: "asc" }
        });
    } catch (error) {
        console.error("Error getProducts:", error);
        return [];
    }
}

export async function addProduct(data: any) {
    try {
        const { images, features, colors, categoryId, ...productData } = data;
        
        // Data cleaning: remove empty values
        const cleanImages = (images || []).filter((url: string) => url && url.trim() !== "");
        const cleanFeatures = (features || []).filter((text: string) => text && text.trim() !== "");
        const cleanColors = (colors || []).filter((c: any) => c.hex && c.hex.trim() !== "");

        const last = await (prisma as any).product.findFirst({ orderBy: { order: "asc" } });
        
        const product = await (prisma as any).product.create({
            data: {
                ...productData,
                slug: productData.slug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-'),
                categoryId: parseInt(categoryId) || 0,
                order: (last?.order || 0) + 1,
                images: {
                    create: cleanImages.map((url: string, index: number) => ({ url, order: index }))
                },
                features: {
                    create: cleanFeatures.map((text: string) => ({ text }))
                },
                colors: {
                    create: cleanColors.map((c: any) => ({ name: c.name || "", hex: c.hex }))
                }
            }
        });
        
        revalidatePath("/", "layout");
        return { success: true, product };
    } catch (error) {
        console.error("Error adding product:", error);
        return { success: false };
    }
}

export async function updateProduct(id: number, data: any) {
    try {
        const { images, features, colors, categoryId, ...productData } = data;
        
        // Data cleaning: remove empty values
        const cleanImages = (images || []).filter((url: string) => url && url.trim() !== "");
        const cleanFeatures = (features || []).filter((text: string) => text && text.trim() !== "");
        const cleanColors = (colors || []).filter((c: any) => c.hex && c.hex.trim() !== "");

        // Delete existing relations to recreate them
        await prisma.$transaction([
            (prisma as any).productImage.deleteMany({ where: { productId: id } }),
            (prisma as any).productFeature.deleteMany({ where: { productId: id } }),
            (prisma as any).productColor.deleteMany({ where: { productId: id } }),
            (prisma as any).product.update({
                where: { id },
                data: {
                    ...productData,
                    categoryId: parseInt(categoryId) || 0,
                    images: {
                        create: cleanImages.map((url: string, index: number) => ({ url, order: index }))
                    },
                    features: {
                        create: cleanFeatures.map((text: string) => ({ text }))
                    },
                    colors: {
                        create: cleanColors.map((c: any) => ({ name: c.name || "", hex: c.hex }))
                    }
                }
            })
        ]);
        
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteProduct(id: number) {
    try {
        await (prisma as any).product.delete({ where: { id } });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false };
    }
}

export async function getProductBySlug(slug: string) {
    try {
        const decodedSlug = decodeURIComponent(slug);
        const product = await (prisma as any).product.findUnique({
            where: { slug: decodedSlug },
            include: {
                category: true,
                images: { orderBy: { order: "asc" } },
                features: true,
                colors: true
            }
        });

        if (product) return product;

        // Fallback: Search all and match normalized slugs (in case of sync issues)
        const all = await (prisma as any).product.findMany({
            include: {
                category: true,
                images: { orderBy: { order: "asc" } },
                features: true,
                colors: true
            }
        });

        const normalizedRequested = decodedSlug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
        return all.find((p: any) => 
            p.slug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') === normalizedRequested
        );
    } catch (error) {
        console.error("Error getProductBySlug:", error);
        return null;
    }
}
