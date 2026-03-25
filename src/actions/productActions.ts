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
                colors: { include: { color: true } }
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
        const { images, features, colorIds, categoryId, ...productData } = data;

        const cleanImages = (images || []).filter((url: string) => url && url.trim() !== "");
        const cleanFeatures = (features || []).filter((text: string) => text && text.trim() !== "");
        const cleanColorIds: number[] = (colorIds || []).map(Number).filter(Boolean);

        const last = await (prisma as any).product.findFirst({ orderBy: { order: "desc" } });

        const product = await (prisma as any).product.create({
            data: {
                ...productData,
                slug: productData.slug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-'),
                categoryId: parseInt(categoryId) || 0,
                order: productData.order !== undefined ? parseInt(productData.order) : (last?.order || 0) + 1,
                images: { create: cleanImages.map((url: string, index: number) => ({ url, order: index })) },
                features: { create: cleanFeatures.map((text: string) => ({ text })) },
                colors: { create: cleanColorIds.map((colorId) => ({ colorId })) }
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
        const { images, features, colorIds, categoryId, ...productData } = data;

        const cleanImages = (images || []).filter((url: string) => url && url.trim() !== "");
        const cleanFeatures = (features || []).filter((text: string) => text && text.trim() !== "");
        const cleanColorIds: number[] = (colorIds || []).map(Number).filter(Boolean);

        await prisma.$transaction([
            (prisma as any).productImage.deleteMany({ where: { productId: id } }),
            (prisma as any).productFeature.deleteMany({ where: { productId: id } }),
            (prisma as any).productColor.deleteMany({ where: { productId: id } }),
            (prisma as any).product.update({
                where: { id },
                data: {
                    ...productData,
                    categoryId: parseInt(categoryId) || 0,
                    images: { create: cleanImages.map((url: string, index: number) => ({ url, order: index })) },
                    features: { create: cleanFeatures.map((text: string) => ({ text })) },
                    colors: { create: cleanColorIds.map((colorId) => ({ colorId })) }
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
                colors: { include: { color: true } }
            }
        });

        if (product) return product;

        const all = await (prisma as any).product.findMany({
            include: {
                category: true,
                images: { orderBy: { order: "asc" } },
                features: true,
                colors: { include: { color: true } }
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

export async function searchProducts(query: string) {
    try {
        if (!query || query.trim() === "") return [];

        return await (prisma as any).product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } }
                ]
            },
            include: {
                category: true,
                images: { orderBy: { order: "asc" } },
                features: true,
                colors: { include: { color: true } }
            },
            orderBy: { order: "asc" },
            take: 10
        });
    } catch (error) {
        console.error("Error searchProducts:", error);
        return [];
    }
}
