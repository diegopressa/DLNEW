import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://dldisenoyestampado.uy";

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/categorias`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/trabajos`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/nosotros`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/preguntas`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Categorías y productos dinámicos desde la DB
    let categoryPages: MetadataRoute.Sitemap = [];
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const [categories, products] = await Promise.all([
            prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
            (prisma as any).product.findMany({
                where: { isActive: true },
                select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
            }),
        ]);
        categoryPages = categories.map((cat) => ({
            url: `${baseUrl}/categorias/lista-${cat.slug}`,
            lastModified: cat.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
        productPages = products
            .filter((p: any) => p.category?.slug && p.slug)
            .map((p: any) => ({
                url: `${baseUrl}/categorias/lista-${p.category.slug}/${p.slug}`,
                lastModified: p.updatedAt,
                changeFrequency: "monthly" as const,
                priority: 0.6,
            }));
    } catch (e) {
        // DB not ready
    }

    return [...staticPages, ...categoryPages, ...productPages];
}
