"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
    if (!(await getSession())) return [];
    try {
        return await (prisma as any).contactSubmission.findMany({
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        return [];
    }
}

export async function markContactRead(id: number) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
    try {
        await (prisma as any).contactSubmission.update({ where: { id }, data: { read: true } });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteContactSubmission(id: number) {
    if (!(await getSession())) return { success: false, error: "Sin sesión" };
    try {
        await (prisma as any).contactSubmission.delete({ where: { id } });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
