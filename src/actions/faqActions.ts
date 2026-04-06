"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFaqItems() {
    try {
        const items = await (prisma as any).faqItem.findMany({
            where: { active: true },
            orderBy: { order: "asc" },
        });
        return items;
    } catch {
        return [];
    }
}

export async function getAllFaqItems() {
    try {
        const items = await (prisma as any).faqItem.findMany({
            orderBy: { order: "asc" },
        });
        return items;
    } catch {
        return [];
    }
}

export async function createFaqItem(data: { question: string; answer: string; order?: number }) {
    try {
        const count = await (prisma as any).faqItem.count();
        await (prisma as any).faqItem.create({
            data: {
                question: data.question,
                answer: data.answer,
                order: data.order ?? count,
                active: true,
            },
        });
        revalidatePath("/");
        revalidatePath("/preguntas");
        revalidatePath("/admin/faq");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Error al crear la pregunta" };
    }
}

export async function updateFaqItem(id: number, data: { question: string; answer: string; order: number; active: boolean }) {
    try {
        await (prisma as any).faqItem.update({
            where: { id },
            data,
        });
        revalidatePath("/");
        revalidatePath("/preguntas");
        revalidatePath("/admin/faq");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Error al actualizar la pregunta" };
    }
}

export async function deleteFaqItem(id: number) {
    try {
        await (prisma as any).faqItem.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/preguntas");
        revalidatePath("/admin/faq");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Error al eliminar la pregunta" };
    }
}
