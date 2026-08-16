// Siembra el catálogo FeatureOption con los textos distintos que ya existen
// en ProductFeature, ordenados por cuántos artículos los usan (más usados arriba).
// Uso: node --dns-result-order=ipv4first scripts/cargar_caracteristicas.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const filas = await prisma.$queryRawUnsafe(
        'SELECT TRIM(text) AS texto, COUNT(*)::int AS usos FROM "ProductFeature" WHERE TRIM(text) <> \'\' GROUP BY TRIM(text) ORDER BY COUNT(*) DESC, TRIM(text) ASC'
    );
    const existentes = await prisma.featureOption.findMany();
    const yaCargados = new Set(existentes.map((o) => o.text));

    let orden = existentes.length;
    let nuevos = 0;
    for (const fila of filas) {
        if (yaCargados.has(fila.texto)) continue;
        orden++;
        await prisma.featureOption.create({ data: { text: fila.texto, order: orden } });
        nuevos++;
        console.log(`+ (${String(fila.usos).padStart(3)} usos) ${fila.texto}`);
    }
    console.log(`\n${nuevos} característica(s) nuevas en el catálogo (había ${existentes.length}, textos distintos en artículos: ${filas.length}).`);
}

main().finally(() => prisma.$disconnect());
