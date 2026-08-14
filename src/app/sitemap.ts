import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const slugify = (name: string) =>
    name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://dldisenoyestampado.uy";

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${baseUrl}/categorias`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/trabajos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/preguntas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];

    // Categorías y productos desde la BD.
    // Arreglado 08/2026: antes usaba prisma.category (modelo inexistente) y el
    // catch dejaba el sitemap SIN ninguna URL dinámica desde siempre.
    let categoryPages: MetadataRoute.Sitemap = [];
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const [categories, products] = await Promise.all([
            (prisma as any).productCategory.findMany({
                where: { isVisible: true },
                select: { name: true },
            }),
            (prisma as any).product.findMany({
                where: { isActive: true },
                select: { slug: true, createdAt: true, category: { select: { name: true, isVisible: true } } },
            }),
        ]);
        categoryPages = categories.map((cat: any) => ({
            url: `${baseUrl}/categorias/lista-${slugify(cat.name)}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
        productPages = products
            .filter((p: any) => p.category?.name && p.category?.isVisible && p.slug)
            .map((p: any) => ({
                url: `${baseUrl}/categorias/lista-${slugify(p.category.name)}/${p.slug}`,
                lastModified: p.createdAt,
                changeFrequency: "monthly" as const,
                priority: 0.6,
            }));
    } catch (e) {
        // DB no disponible: el sitemap sale solo con las estáticas
    }

    return [...staticPages, ...categoryPages, ...productPages];
}
