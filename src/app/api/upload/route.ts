import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        // 1. Parse the incoming multipart/form-data
        const formData = await request.formData();

        // 2. Extract the file field
        const file = formData.get("file");

        // 3. Validate: must exist and be a File instance
        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, error: "No se recibió ningún archivo válido." },
                { status: 400 }
            );
        }

        // Validate MIME type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { success: false, error: "El archivo debe ser una imagen." },
                { status: 400 }
            );
        }

        // Validate size (max 10 MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: "La imagen no puede superar los 10 MB." },
                { status: 400 }
            );
        }

        // 4. Generate unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
        const bucket = process.env.SUPABASE_BUCKET || "images";

        // 5. Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Supabase storage error:", error);
            return NextResponse.json(
                { success: false, error: `Error en Supabase: ${error.message}` },
                { status: 500 }
            );
        }

        // 6. Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filename);

        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error) {
        console.error("[/api/upload] Error:", error);
        return NextResponse.json(
            { success: false, error: "Error interno al procesar el archivo." },
            { status: 500 }
        );
    }
}
