"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSeoPages() {
    try {
        return await (prisma as any).seoMetadata.findMany({ orderBy: { id: "asc" } });
    } catch { return []; }
}

export async function getSeoPageBySlug(slug: string) {
    try {
        return await (prisma as any).seoMetadata.findUnique({ where: { pageSlug: slug } });
    } catch { return null; }
}

export async function upsertSeoPage(data: {
    pageSlug: string;
    pageName: string;
    metaTitle?: string;
    metaDesc?: string;
    keywords?: string;
    ogTitle?: string;
    ogDesc?: string;
    ogImage?: string;
    canonicalUrl?: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
}) {
    try {
        await (prisma as any).seoMetadata.upsert({
            where: { pageSlug: data.pageSlug },
            update: { ...data, updatedAt: new Date() },
            create: { ...data },
        });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (e) {
        console.error("upsertSeoPage error:", e);
        return { success: false, error: String(e) };
    }
}

export async function addSeoPage(data: { pageSlug: string; pageName: string }) {
    try {
        await (prisma as any).seoMetadata.create({
            data: { ...data, robotsIndex: true, robotsFollow: true },
        });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (e) {
        console.error("addSeoPage error:", e);
        return { success: false, error: String(e) };
    }
}

export async function deleteSeoPage(id: number) {
    try {
        await (prisma as any).seoMetadata.delete({ where: { id } });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function getSeoSettings() {
    try {
        let settings = await (prisma as any).seoSettings.findFirst();
        if (!settings) {
            settings = await (prisma as any).seoSettings.create({
                data: {
                    siteName: "DL Diseño & Estampado",
                    defaultTitleTemplate: "{{page_title}} | DL Diseño & Estampado",
                    defaultMetaDesc: "Uniformes y prendas personalizadas para empresas en Uruguay.",
                }
            });
        }
        return settings;
    } catch { return null; }
}

export async function updateSeoSettings(data: any) {
    try {
        const existing = await (prisma as any).seoSettings.findFirst();
        if (existing) {
            await (prisma as any).seoSettings.update({ where: { id: existing.id }, data });
        } else {
            await (prisma as any).seoSettings.create({ data });
        }
        revalidatePath("/", "layout");
        return { success: true };
    } catch (e) {
        console.error("updateSeoSettings error:", e);
        return { success: false, error: String(e) };
    }
}

// Helper used by public pages to get merged SEO for a slug
export async function getPageSeo(slug: string) {
    try {
        const [page, global] = await Promise.all([
            (prisma as any).seoMetadata.findUnique({ where: { pageSlug: slug } }),
            (prisma as any).seoSettings.findFirst(),
        ]);
        if (!global && !page) return null;
        const template = global?.defaultTitleTemplate || "{{page_title}} | DL Diseño & Estampado";
        const resolveTitle = (t?: string) => t || (page?.pageName ? template.replace("{{page_title}}", page.pageName) : global?.siteName);
        return {
            title: resolveTitle(page?.metaTitle),
            description: page?.metaDesc || global?.defaultMetaDesc || "",
            keywords: page?.keywords || "",
            ogTitle: page?.ogTitle || resolveTitle(page?.metaTitle),
            ogDescription: page?.ogDesc || page?.metaDesc || global?.defaultMetaDesc || "",
            ogImage: page?.ogImage || global?.defaultOgImage || "",
            canonical: page?.canonicalUrl || "",
            robots: `${page?.robotsIndex !== false ? "index" : "noindex"}, ${page?.robotsFollow !== false ? "follow" : "nofollow"}`,
            customHeadCode: global?.customHeadCode || "",
            googleVerification: global?.googleSiteVerification || "",
        };
    } catch { return null; }
}
