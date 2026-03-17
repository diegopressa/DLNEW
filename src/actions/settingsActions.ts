"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGlobalSettings() {
    try {
        let settings = await prisma.globalSettings.findUnique({
            where: { id: 1 }
        });
        
        if (!settings) {
            settings = await prisma.globalSettings.create({
                data: {
                    id: 1,
                    whatsapp: "59899000000",
                    email: "info@dldiseno.uy",
                    phone: "+598 99 000 000",
                    address: "Montevideo, Uruguay"
                }
            });
        }
        return settings;
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
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
