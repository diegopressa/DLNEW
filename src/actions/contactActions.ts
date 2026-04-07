"use server";

import prisma from "@/lib/prisma";

export async function submitContact(data: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    message: string;
}) {
    try {
        await (prisma as any).contactSubmission.create({ data });
        return { success: true };
    } catch (error) {
        console.error("Error saving contact submission:", error);
        return { success: false };
    }
}

export async function getContactSubmissions() {
    try {
        return await (prisma as any).contactSubmission.findMany({
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        return [];
    }
}

export async function markContactRead(id: number) {
    try {
        await (prisma as any).contactSubmission.update({ where: { id }, data: { read: true } });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteContactSubmission(id: number) {
    try {
        await (prisma as any).contactSubmission.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
