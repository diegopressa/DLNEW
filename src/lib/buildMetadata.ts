import { getPageSeo } from "@/actions/seoActions";
import type { Metadata } from "next";

/**
 * Call this inside any public page's generateMetadata() export.
 * Falls back gracefully if the DB has no data for the slug.
 * Siempre emite el canonical de la página (con o sin fila en la base):
 * sin esto las páginas quedaban sin canonical propio.
 */
export async function buildMetadata(slug: string, defaults?: { title?: string; description?: string }): Promise<Metadata> {
    const seo = await getPageSeo(slug).catch(() => null);

    const metadata: Metadata = {
        alternates: { canonical: (seo as any)?.canonical || slug || "/" },
    };

    const title = (seo as any)?.title || defaults?.title;
    const description = (seo as any)?.description || defaults?.description;

    if (title) metadata.title = title;
    if (description) metadata.description = description;
    if ((seo as any)?.keywords) metadata.keywords = (seo as any).keywords;
    if ((seo as any)?.robots) metadata.robots = (seo as any).robots;

    // OG/Twitter: usa los campos OG de la base si existen; si no, cae al título
    // y descripción normales (antes sin campos OG cargados no se emitía nada).
    if (title || description || (seo as any)?.ogTitle || (seo as any)?.ogImage) {
        const ogTitle = (seo as any)?.ogTitle || title;
        const ogDescription = (seo as any)?.ogDescription || description;
        metadata.openGraph = {
            title: ogTitle,
            description: ogDescription,
            images: (seo as any)?.ogImage ? [{ url: (seo as any).ogImage }] : undefined,
        };
        metadata.twitter = {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: (seo as any)?.ogImage ? [(seo as any).ogImage] : undefined,
        };
    }

    if ((seo as any)?.googleVerification) {
        metadata.verification = { google: (seo as any).googleVerification };
    }

    return metadata;
}
