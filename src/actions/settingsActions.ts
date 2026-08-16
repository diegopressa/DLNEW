"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Normaliza un número uruguayo a formato internacional (59897534866):
// tolera que Diego cargue "097 534 866", "97534866" o "29250584" en el admin.
// Sin esto, el link de WhatsApp da "número inválido".
function normalizarNumeroUy(valor?: string | null): string {
    if (!valor) return "";
    let digitos = String(valor).replace(/\D/g, "").replace(/^0+/, "");
    if (digitos && !digitos.startsWith("598")) digitos = "598" + digitos;
    return digitos;
}

export async function getGlobalSettings() {
    try {
        let settings = await prisma.globalSettings.findUnique({
            where: { id: 1 }
        });

        if (!settings) {
            settings = await prisma.globalSettings.create({
                data: {
                    id: 1,
                    whatsapp: "59897534866",
                    email: "info@dldiseno.uy",
                    phone: "59829250584",
                    address: "Montevideo, Uruguay"
                }
            });
        }
        return {
            ...settings,
            whatsapp: normalizarNumeroUy(settings.whatsapp) || "59897534866",
            phone: normalizarNumeroUy(settings.phone) || settings.phone,
        };
    } catch (error) {
        return null;
    }
}

export async function updateGlobalSettings(data: any) {
    try {
        await prisma.globalSettings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
