"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

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
        const { images, features, colorIds, categoryId, isActive, ...productData } = data;

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
                isActive: isActive !== undefined ? Boolean(isActive) : true,
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
        const { images, features, colorIds, categoryId, isActive, ...productData } = data;

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
                    isActive: isActive !== undefined ? Boolean(isActive) : true,
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

// En previews de Vercel (y en dev local) se pueden ver los borradores; en producci\u00f3n no.
const esProduccionProd = process.env.VERCEL_ENV === "production";

export async function getProductBySlug(slug: string) {
    try {
        const decodedSlug = decodeURIComponent(slug);
        const filtroActivo = esProduccionProd ? { isActive: true, pausadoManual: false } : {};
        const product = await (prisma as any).product.findUnique({
            where: { slug: decodedSlug, ...filtroActivo },
            include: {
                category: true,
                images: { orderBy: { order: "asc" } },
                features: true,
                colors: { include: { color: true } }
            }
        });

        if (product) return product;

        const all = await (prisma as any).product.findMany({
            where: filtroActivo,
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

// Colección automática de "Alta visibilidad y seguridad": además de sus prendas
// físicas (EPP), la página suma toda prenda reflectiva/fluo de las otras categorías.
export async function getReflectiveProducts(excludeCategoryId: number) {
    try {
        return await (prisma as any).product.findMany({
            where: {
                categoryId: { not: excludeCategoryId },
                OR: [
                    { name: { contains: "reflectiv", mode: "insensitive" } },
                    { name: { contains: "alta visibilidad", mode: "insensitive" } },
                    { name: { contains: "hi vis", mode: "insensitive" } },
                    { name: { contains: "fluo", mode: "insensitive" } },
                ],
                ...(esProduccionProd ? { isActive: true, pausadoManual: false } : {}),
            },
            include: {
                images: { orderBy: { order: "asc" } },
                colors: { include: { color: true } },
                features: true,
                category: true,
            },
            orderBy: { order: "asc" },
        });
    } catch (error) {
        console.error("Error getReflectiveProducts:", error);
        return [];
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
                ],
                isActive: true,
                pausadoManual: false
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

export async function updateProductOrder(id: number, order: number) {
    try {
        await (prisma as any).product.update({
            where: { id },
            data: { order: parseInt(order as any) || 0 }
        });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error updating product order:", error);
        return { success: false };
    }
}

// ── Edición rápida de imágenes desde la web pública (modo admin) ──
// Ambas exigen sesión de admin porque se llaman desde páginas públicas.

export async function changeMainProductImage(productId: number, url: string) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        const first = await (prisma as any).productImage.findFirst({
            where: { productId },
            orderBy: { order: "asc" },
        });
        if (first) {
            await (prisma as any).productImage.update({ where: { id: first.id }, data: { url } });
        } else {
            await (prisma as any).productImage.create({ data: { productId, url, order: 0 } });
        }
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error changeMainProductImage:", error);
        return { success: false };
    }
}

export async function addProductImages(productId: number, urls: string[]) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        const last = await (prisma as any).productImage.findFirst({
            where: { productId },
            orderBy: { order: "desc" },
        });
        let order = (last?.order ?? -1) + 1;
        await prisma.$transaction(
            urls.map((url) =>
                (prisma as any).productImage.create({ data: { productId, url, order: order++ } })
            )
        );
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error addProductImages:", error);
        return { success: false };
    }
}

// Pausa manual de Diego: distinta del borrador. Se usa desde el admin
// y desde la ficha pública en modo admin. Exige sesión.
export async function togglePausadoManual(id: number, pausado: boolean, nota?: string) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        await (prisma as any).product.update({
            where: { id },
            data: {
                pausadoManual: pausado,
                pausadoNota: pausado ? (nota?.trim() || null) : null,
            },
        });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error togglePausadoManual:", error);
        return { success: false };
    }
}

// Edición rápida de la ficha desde la página pública del artículo (modo admin):
// título, ref, descripción, composición y talles. El slug NO se toca para no romper URLs.
export async function updateProductFicha(id: number, data: {
    name: string;
    masterCode?: string | null;
    description?: string | null;
    materials?: string | null;
    damaCompo?: string | null;
    ninoCompo?: string | null;
    talles?: string | null;
    damaTalles?: string | null;
    ninoTalles?: string | null;
    versionUnisex?: boolean;
    versionDama?: boolean;
    versionNino?: boolean;
    features?: string[];
}) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        const name = (data.name || "").trim();
        if (!name) return { success: false, error: "El título no puede quedar vacío" };
        const opcional = (v?: string | null) => {
            const t = (v ?? "").trim();
            return t === "" ? null : t;
        };
        // features solo se reemplazan si vienen en el payload (array); undefined = no tocar
        const featureTexts = Array.isArray(data.features)
            ? data.features.map((t) => (t || "").trim()).filter(Boolean)
            : null;
        await prisma.$transaction([
            ...(featureTexts !== null
                ? [(prisma as any).productFeature.deleteMany({ where: { productId: id } })]
                : []),
            (prisma as any).product.update({
                where: { id },
                data: {
                    name,
                    masterCode: opcional(data.masterCode),
                    description: opcional(data.description),
                    materials: opcional(data.materials),
                    damaCompo: opcional(data.damaCompo),
                    ninoCompo: opcional(data.ninoCompo),
                    talles: opcional(data.talles),
                    damaTalles: opcional(data.damaTalles),
                    ninoTalles: opcional(data.ninoTalles),
                    versionDama: !!data.versionDama,
                    versionNino: !!data.versionNino,
                    // solo se toca si el editor la manda (default true en la base)
                    ...(data.versionUnisex !== undefined ? { versionUnisex: !!data.versionUnisex } : {}),
                },
            }),
            ...(featureTexts !== null && featureTexts.length
                ? [(prisma as any).productFeature.createMany({ data: featureTexts.map((text) => ({ productId: id, text })) })]
                : []),
        ]);
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error: any) {
        console.error("Error updateProductFicha:", error);
        if (String(error?.code) === "P2002") {
            return { success: false, error: "Ya existe otro artículo con esa Ref." };
        }
        return { success: false };
    }
}

// Duplica un artículo completo (fotos, colores, características y ficha).
// La copia arranca como BORRADOR, sin Ref (masterCode es unique) y con slug propio.
export async function duplicateProduct(id: number) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        const original = await (prisma as any).product.findUnique({
            where: { id },
            include: {
                images: { orderBy: { order: "asc" } },
                features: true,
                colors: true,
            },
        });
        if (!original) return { success: false, error: "No se encontró el artículo" };

        let slug = `${original.slug}-copia`;
        for (let n = 2; await (prisma as any).product.findUnique({ where: { slug } }); n++) {
            slug = `${original.slug}-copia-${n}`;
        }

        const last = await (prisma as any).product.findFirst({ orderBy: { order: "desc" } });
        const { id: _id, slug: _slug, name, masterCode: _ref, createdAt: _creado, images, features, colors, ...resto } = original;

        const copia = await (prisma as any).product.create({
            data: {
                ...resto,
                name: `${name} (copia)`,
                slug,
                masterCode: null,
                isActive: false,
                pausadoManual: false,
                pausadoNota: null,
                order: (last?.order || 0) + 1,
                images: { create: images.map((img: any, i: number) => ({ url: img.url, order: i })) },
                features: { create: features.map((f: any) => ({ text: f.text })) },
                colors: { create: colors.map((c: any) => ({ colorId: c.colorId })) },
            },
        });

        revalidatePath("/", "layout");
        return { success: true, product: copia };
    } catch (error) {
        console.error("Error duplicateProduct:", error);
        return { success: false };
    }
}

// Agrega o quita un color del artículo desde la página pública (modo admin).
export async function toggleProductColor(productId: number, colorId: number, agregar: boolean) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        if (agregar) {
            const existe = await (prisma as any).productColor.findFirst({ where: { productId, colorId } });
            if (!existe) {
                await (prisma as any).productColor.create({ data: { productId, colorId } });
            }
        } else {
            await (prisma as any).productColor.deleteMany({ where: { productId, colorId } });
        }
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error toggleProductColor:", error);
        return { success: false };
    }
}

// Guarda el orden de una lista completa de productos (modo "Ordenar" del admin):
// recibe los ids en el orden final y les asigna 1, 2, 3…
export async function reorderProducts(ids: number[]) {
    try {
        await prisma.$transaction(
            ids.map((id, i) =>
                (prisma as any).product.update({
                    where: { id },
                    data: { order: i + 1 },
                })
            )
        );
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error reorderProducts:", error);
        return { success: false };
    }
}

export async function toggleProductActive(id: number, isActive: boolean) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        await (prisma as any).product.update({
            where: { id },
            data: { isActive }
        });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error toggling product active:", error);
        return { success: false };
    }
}
