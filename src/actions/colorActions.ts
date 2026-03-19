"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getColors(onlyActive = false) {
    try {
        return await (prisma as any).color.findMany({
            where: onlyActive ? { isActive: true } : undefined,
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        });
    } catch (error) {
        console.error("getColors error:", error);
        return [];
    }
}

export async function addColor(data: { name: string; hex: string }) {
    try {
        const slug = data.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        const last = await (prisma as any).color.findFirst({
            orderBy: { sortOrder: "desc" },
        });

        await (prisma as any).color.create({
            data: {
                name: data.name,
                slug,
                hex: data.hex,
                sortOrder: (last?.sortOrder ?? 0) + 1,
            },
        });

        revalidatePath("/admin/colores");
        return { success: true };
    } catch (error) {
        console.error("addColor error:", error);
        return { success: false, error: String(error) };
    }
}

export async function updateColor(id: number, data: { name?: string; hex?: string; isActive?: boolean; sortOrder?: number }) {
    try {
        await (prisma as any).color.update({ where: { id }, data });
        revalidatePath("/admin/colores");
        revalidatePath("/admin/articulos");
        return { success: true };
    } catch (error) {
        console.error("updateColor error:", error);
        return { success: false };
    }
}

export async function deleteColor(id: number) {
    try {
        await (prisma as any).color.delete({ where: { id } });
        revalidatePath("/admin/colores");
        return { success: true };
    } catch (error) {
        console.error("deleteColor error:", error);
        return { success: false };
    }
}
