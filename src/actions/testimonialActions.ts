"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
    try {
        return await (prisma as any).testimonial.findMany({
            where: { active: true },
            orderBy: { order: "asc" }
        });
    } catch (error) {
        return [];
    }
}

export async function getAllTestimonials() {
    try {
        return await (prisma as any).testimonial.findMany({
            orderBy: { order: "asc" }
        });
    } catch (error) {
        return [];
    }
}

export async function createTestimonial(data: { name: string; company: string; role?: string; content: string; imageUrl?: string }) {
    try {
        const last = await (prisma as any).testimonial.findFirst({ orderBy: { order: "desc" } });
        await (prisma as any).testimonial.create({
            data: { ...data, order: (last?.order || 0) + 1 }
        });
        revalidatePath("/");
        revalidatePath("/admin/testimonios");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function updateTestimonial(id: number, data: { name: string; company: string; role?: string; content: string; imageUrl?: string; active?: boolean }) {
    try {
        await (prisma as any).testimonial.update({ where: { id }, data });
        revalidatePath("/");
        revalidatePath("/admin/testimonios");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function toggleTestimonial(id: number, active: boolean) {
    try {
        await (prisma as any).testimonial.update({ where: { id }, data: { active } });
        revalidatePath("/");
        revalidatePath("/admin/testimonios");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteTestimonial(id: number) {
    try {
        await (prisma as any).testimonial.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/testimonios");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
