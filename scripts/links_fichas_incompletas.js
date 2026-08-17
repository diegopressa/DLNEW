// Links de los artículos ACTIVOS (no pausados) con ficha incompleta
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SITIO = "https://dldisenoyestampado.uy";

function slugCategoria(nombre) {
    return "lista-" + nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
}

async function main() {
    const prods = await prisma.product.findMany({
        where: { isActive: true, pausadoManual: false },
        include: { category: true, colors: true },
        orderBy: [{ categoryId: "asc" }, { name: "asc" }],
    });

    const porCategoria = {};
    for (const p of prods) {
        const falta = [];
        if (!p.colors || p.colors.length === 0) falta.push("colores");
        if (!p.talles || !p.talles.trim()) falta.push("talles");
        if (!p.materials || !p.materials.trim()) falta.push("composición");
        if (!p.masterCode || !p.masterCode.trim()) falta.push("Ref");
        if (!p.description || !p.description.trim()) falta.push("descripción");
        if (!falta.length) continue;

        const cat = p.category?.name || "Sin categoría";
        (porCategoria[cat] = porCategoria[cat] || []).push({
            nombre: p.name,
            url: `${SITIO}/categorias/${slugCategoria(cat)}/${p.slug}`,
            falta,
        });
    }

    for (const [cat, items] of Object.entries(porCategoria)) {
        console.log("\n### " + cat);
        for (const it of items) {
            console.log(`- ${it.nombre} — falta: ${it.falta.join(", ")}\n  ${it.url}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
