"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

// Catálogo maestro de características (se eligen por desplegable en la ficha).

export async function getFeatureOptions() {
    try {
        return await (prisma as any).featureOption.findMany({
            orderBy: [{ order: "asc" }, { text: "asc" }],
        });
    } catch (error) {
        console.error("Error getFeatureOptions:", error);
        return [];
    }
}

export async function addFeatureOption(text: string) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        const limpio = (text || "").trim();
        if (!limpio) return { success: false, error: "El texto no puede quedar vacío" };
        const last = await (prisma as any).featureOption.findFirst({ orderBy: { order: "desc" } });
        const option = await (prisma as any).featureOption.create({
            data: { text: limpio, order: (last?.order ?? 0) + 1 },
        });
        revalidatePath("/admin/caracteristicas");
        return { success: true, option };
    } catch (error: any) {
        console.error("Error addFeatureOption:", error);
        if (String(error?.code) === "P2002") {
            return { success: false, error: "Esa característica ya existe en el catálogo" };
        }
        return { success: false };
    }
}

// Renombrar propaga a todos los artículos que ya usan el texto viejo.
export async function updateFeatureOption(id: number, text: string) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        const limpio = (text || "").trim();
        if (!limpio) return { success: false, error: "El texto no puede quedar vacío" };
        const actual = await (prisma as any).featureOption.findUnique({ where: { id } });
        if (!actual) return { success: false, error: "No se encontró la característica" };
        const [, actualizados] = await prisma.$transaction([
            (prisma as any).featureOption.update({ where: { id }, data: { text: limpio } }),
            (prisma as any).productFeature.updateMany({
                where: { text: actual.text },
                data: { text: limpio },
            }),
        ]);
        revalidatePath("/", "layout");
        return { success: true, articulosActualizados: actualizados?.count ?? 0 };
    } catch (error: any) {
        console.error("Error updateFeatureOption:", error);
        if (String(error?.code) === "P2002") {
            return { success: false, error: "Ya existe otra característica con ese texto" };
        }
        return { success: false };
    }
}

// Borra solo del catálogo: los artículos que ya la tenían la conservan.
export async function deleteFeatureOption(id: number) {
    try {
        if (!(await getSession())) return { success: false, error: "Sin sesión" };
        await (prisma as any).featureOption.delete({ where: { id } });
        revalidatePath("/admin/caracteristicas");
        return { success: true };
    } catch (error) {
        console.error("Error deleteFeatureOption:", error);
        return { success: false };
    }
}
