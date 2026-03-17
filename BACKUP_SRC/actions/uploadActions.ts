"use server";

import prisma from "@/lib/prisma";

export async function uploadImage(formData: FormData) {
    // This is a placeholder since we don't have a real upload service here.
    // In a real app, you'd save to S3, Cloudinary, or local storage.
    // For now, we'll return a random unsplash image to see a change.
    const images = [
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000"
    ];
    return images[Math.floor(Math.random() * images.length)];
}
