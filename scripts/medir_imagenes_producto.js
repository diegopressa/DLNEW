// Mide el peso real de todas las imágenes de producto en Supabase
// Uso: node --dns-result-order=ipv4first scripts/medir_imagenes_producto.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function peso(url) {
    try {
        const r = await fetch(url, { method: "HEAD" });
        return {
            kb: Math.round(Number(r.headers.get("content-length") || 0) / 1024),
            cache: r.headers.get("cache-control") || "",
        };
    } catch {
        return { kb: -1, cache: "" };
    }
}

async function main() {
    const imgs = await prisma.productImage.findMany({ include: { product: { select: { name: true, isActive: true, pausadoManual: true } } } });
    const vivas = imgs.filter((i) => i.product?.isActive && !i.product?.pausadoManual);
    console.log(`imagenes totales: ${imgs.length} · de artículos publicados: ${vivas.length}`);

    const resultados = [];
    const tanda = 8;
    for (let i = 0; i < vivas.length; i += tanda) {
        const grupo = vivas.slice(i, i + tanda);
        const pesos = await Promise.all(grupo.map((g) => peso(g.url)));
        grupo.forEach((g, j) => resultados.push({ url: g.url, nombre: g.product?.name, ...pesos[j] }));
    }

    const ok = resultados.filter((r) => r.kb > 0);
    const total = ok.reduce((a, r) => a + r.kb, 0);
    const pesadas = ok.filter((r) => r.kb > 300).sort((a, b) => b.kb - a.kb);
    const sinCache = ok.filter((r) => !/max-age=\d{4,}/.test(r.cache));

    console.log(`\nPeso total: ${(total / 1024).toFixed(1)} MB · promedio: ${Math.round(total / ok.length)} KB`);
    console.log(`Pesadas (>300 KB): ${pesadas.length} · suman ${(pesadas.reduce((a, r) => a + r.kb, 0) / 1024).toFixed(1)} MB`);
    console.log(`Sin caché larga: ${sinCache.length} de ${ok.length}`);
    console.log("\nTOP 20 más pesadas:");
    for (const r of pesadas.slice(0, 20)) console.log(`  ${String(r.kb).padStart(5)} KB  ${r.nombre}  ${r.url.split("/").pop()}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
