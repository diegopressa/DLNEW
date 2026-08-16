"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getCategories() {
    return await prisma.productCategory.findMany({
        orderBy: { order: "asc" }
    });
}

// Solo categorías visibles al público. Las nuevas del rediseño 08/2026 se cargan
// con isVisible=false para que no aparezcan en el sitio hasta el lanzamiento.
export async function getVisibleCategories() {
    return await prisma.productCategory.findMany({
        where: { isVisible: true },
        orderBy: { order: "asc" }
    });
}

// En previews de Vercel (y en dev local) se muestran también los borradores
// (isActive=false) para poder revisarlos; en producción jamás.
const esProduccion = process.env.VERCEL_ENV === "production";

export async function getCategoryBySlug(slug: string) {
    // Pausados por Diego: NUNCA en el listado (ni en preview). Borradores: solo en preview, con sello.
    const filtroVisibles = esProduccion ? { isActive: true, pausadoManual: false } : { pausadoManual: false };
    const incluirDetalle = {
        // ordenadas para que images[0] sea SIEMPRE la imagen principal
        images: { orderBy: { order: "asc" as const } },
        colors: { include: { color: true } },
        features: true
    };

    // Try to find by name converted to slug
    const categories = await prisma.productCategory.findMany({
        include: {
            products: {
                where: filtroVisibles,
                include: incluirDetalle,
                orderBy: { order: "asc" }
            }
        }
    });

    const categoria: any = categories.find(c =>
        c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') === slug
    );
    if (!categoria) return categoria;

    // Sumar los art\u00edculos que tienen esta categor\u00eda como EXTRA (multi-categor\u00eda)
    try {
        const extras = await (prisma as any).productExtraCategory.findMany({
            where: { categoryId: categoria.id, product: filtroVisibles },
            include: { product: { include: incluirDetalle } }
        });
        const idsBase = new Set(categoria.products.map((p: any) => p.id));
        const productosExtra = extras.map((e: any) => e.product).filter((p: any) => !idsBase.has(p.id));
        if (productosExtra.length) {
            categoria.products = [...categoria.products, ...productosExtra].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        }
    } catch (e) {
        console.error("Error sumando categor\u00edas extra:", e);
    }

    return categoria;
}

// More precise search: normally categories should have slugs too. 
// Looking at schema, ProductCategory doesn't have a slug field yet. 
// I should probably add it or use a simple transform.

export async function addCategory(data: any) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
    try {
        const { name, description, imageUrl, showOnHome, showInNav } = data;
        const last = await prisma.productCategory.findFirst({ orderBy: { order: "asc" } });
        const order = (last?.order || 0) + 1;

        // Try standard Prisma update first
        const category = await (prisma as any).productCategory.create({
            data: {
                name,
                description,
                imageUrl,
                showOnHome: showOnHome || false,
                showInNav: showInNav !== false,
                order
            }
        });
        revalidatePath("/");
        revalidatePath("/admin/categorias");
        return { success: true, category };
    } catch (error) {
        // (Se eliminó un fallback con $executeRawUnsafe y placeholders "?" que en
        // Postgres no existen: era código roto que fallaba en silencio.)
        console.error("Error in addCategory:", error);
        return { success: false };
    }
}

export async function updateCategory(id: number, data: any) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
    try {
        const { name, description, imageUrl, showOnHome, showInNav } = data;

        // Use any to avoid type errors during compilation while the schema is updating
        await (prisma as any).productCategory.update({
            where: { id },
            data: {
                name,
                description,
                imageUrl,
                showOnHome: showOnHome === true || showOnHome === "true",
                ...(showInNav !== undefined && { showInNav: showInNav === true || showInNav === "true" }),
            }
        });

        revalidatePath("/");
        revalidatePath("/admin/categorias");
        return { success: true };
    } catch (error) {
        // (Fallback $executeRawUnsafe con "?" eliminado: sintaxis inválida en Postgres.)
        console.error("Error in updateCategory:", error);
        return { success: false };
    }
}

export async function deleteCategory(id: number) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
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
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
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
