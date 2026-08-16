// Apunta las imágenes de categoría a las versiones WebP optimizadas en public/
// (antes: PNG de 1.4-2.1 MB en Supabase; ahora: WebP de ~20 KB servidos por Vercel).
// Requiere scripts/mapeo_img_categorias.json generado por el optimizador.
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
    const mapeo = JSON.parse(fs.readFileSync(__dirname + "/mapeo_img_categorias.json", "utf8"));
    for (const m of mapeo) {
        await prisma.productCategory.update({ where: { id: m.id }, data: { imageUrl: m.ruta } });
        console.log("OK", m.id, "->", m.ruta);
    }
}

main().finally(() => prisma.$disconnect());
