"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPrivacyPolicy() {
    try {
        let policy = await prisma.privacyPolicy.findFirst();
        if (!policy) {
            policy = await prisma.privacyPolicy.create({
                data: {
                    title: "Políticas de Privacidad",
                    content: "En DL Diseño & Estampado nos preocupamos por tu privacidad. Toda la información personal compartida será tratada con confidencialidad y solo con el fin de brindarte el mejor servicio posible."
                }
            });
        }
        return policy;
    } catch (error) {
        console.error("Error fetching Privacy Policy:", error);
        return null;
    }
}

export async function updatePrivacyPolicy(data: { title: string; content: string }) {
    try {
        const policy = await prisma.privacyPolicy.findFirst();
        if (policy) {
            await prisma.privacyPolicy.update({
                where: { id: policy.id },
                data
            });
        } else {
            await prisma.privacyPolicy.create({
                data
            });
        }
        revalidatePath("/politicas-de-privacidad");
        revalidatePath("/admin/politicas-de-privacidad");
        return { success: true };
    } catch (error) {
        console.error("Error updating Privacy Policy:", error);
        return { success: false, error: "Error al actualizar" };
    }
}
