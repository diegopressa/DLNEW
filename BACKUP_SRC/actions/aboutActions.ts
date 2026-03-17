"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAboutUs() {
    try {
        let about = await prisma.aboutUs.findFirst();
        if (!about) {
            about = await prisma.aboutUs.create({
                data: {
                    title: "Sobre Nosotros",
                    content: "En DL Diseño & Estampado nos apasiona crear prendas que representen la identidad de tu empresa. Con años de experiencia en el mercado uruguayo, nos especializamos en uniformes, remeras personalizadas y bordados de alta calidad.",
                    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000"
                }
            });
        }
        return about;
    } catch (error) {
        console.error("Error fetching About Us:", error);
        return null;
    }
}

export async function updateAboutUs(data: { title: string; content: string; imageUrl?: string }) {
    try {
        const about = await prisma.aboutUs.findFirst();
        if (about) {
            await prisma.aboutUs.update({
                where: { id: about.id },
                data
            });
        } else {
            await prisma.aboutUs.create({
                data
            });
        }
        revalidatePath("/nosotros");
        revalidatePath("/admin/nosotros");
        return { success: true };
    } catch (error) {
        console.error("Error updating About Us:", error);
        return { success: false, error: "Error al actualizar" };
    }
}
