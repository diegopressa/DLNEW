import { getPageSeo } from "@/actions/seoActions";
import type { Metadata } from "next";

/**
 * Call this inside any public page's generateMetadata() export.
 * Falls back gracefully if the DB has no data for the slug.
 */
export async function buildMetadata(slug: string): Promise<Metadata> {
    const seo = await getPageSeo(slug);

    if (!seo) return {};

    const metadata: Metadata = {};

    if (seo.title)       metadata.title       = seo.title;
    if (seo.description) metadata.description = seo.description;
    if (seo.keywords)    metadata.keywords    = seo.keywords;
    if (seo.robots)      metadata.robots      = seo.robots;
    if (seo.canonical)   metadata.alternates  = { canonical: seo.canonical };

    if (seo.ogTitle || seo.ogDescription || seo.ogImage) {
        metadata.openGraph = {
            title:       seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images:      seo.ogImage ? [{ url: seo.ogImage }] : undefined,
        };
        metadata.twitter = {
            card:        "summary_large_image",
            title:       seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images:      seo.ogImage ? [seo.ogImage] : undefined,
        };
    }

    if (seo.googleVerification) {
        metadata.verification = { google: seo.googleVerification };
    }

    return metadata;
}
