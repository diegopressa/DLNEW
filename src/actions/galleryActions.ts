"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getProjects() {
    try {
        return await (prisma as any).project.findMany({
            orderBy: { order: "asc" }
        });
    } catch (error) {
        console.error("Error getProjects:", error);
        return [];
    }
}

export async function addProject(data: {
    title: string;
    category?: string;
    imageUrl: string;
    description?: string;
}) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
    try {
        const last = await (prisma as any).project.findFirst({ orderBy: { order: "desc" } });
        const project = await (prisma as any).project.create({
            data: {
                ...data,
                order: (last?.order || 0) + 1
            }
        });
        revalidatePath("/trabajos");
        revalidatePath("/admin/trabajos");
        return { success: true, project };
    } catch (error) {
        console.error("Error addProject:", error);
        return { success: false, error: "Error al agregar proyecto" };
    }
}

export async function deleteProject(id: number) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
    try {
        await (prisma as any).project.delete({ where: { id } });
        revalidatePath("/trabajos");
        revalidatePath("/admin/trabajos");
        return { success: true };
    } catch (error) {
        console.error("Error deleteProject:", error);
        return { success: false, error: "Error al eliminar proyecto" };
    }
}

export async function updateProject(id: number, data: any) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
    try {
        await (prisma as any).project.update({
            where: { id },
            data
        });
        revalidatePath("/trabajos");
        revalidatePath("/admin/trabajos");
        return { success: true };
    } catch (error) {
        console.error("Error updateProject:", error);
        return { success: false };
    }
}
