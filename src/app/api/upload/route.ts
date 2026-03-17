import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const folder = formData.get("folder") || "general"; // Carpeta opcional (home, nosotros, etc)

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, error: "No se recibió un archivo válido." },
                { status: 400 }
            );
        }

        // Validaciones
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ success: false, error: "El archivo debe ser una imagen." }, { status: 400 });
        }
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: "La imagen no puede superar los 10 MB." }, { status: 400 });
        }

        // Nombre de archivo sanitizado y único
        const cleanName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
        const filename = `${folder}/${Date.now()}-${cleanName}`;
        const bucket = process.env.SUPABASE_BUCKET || "images";

        // Subida a Supabase
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Supabase storage error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // URL Pública
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filename);

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("[/api/upload] Error:", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
    }
}
