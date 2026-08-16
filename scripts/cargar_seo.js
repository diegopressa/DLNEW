// Carga inicial del SEO por página (14/08/2026): Inicio, Nosotros y Contacto.
// Son las 3 páginas que leen de SeoMetadata vía buildMetadata() y estaban vacías.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BASE = "https://dldisenoyestampado.uy";

const PAGINAS = [
    {
        pageSlug: "/",
        pageName: "Inicio",
        metaTitle: "Uniformes para Empresas en Uruguay | DL Diseño & Estampado",
        metaDesc: "Uniformes con tu logo: estampado, bordado y entrega en todo el país. Presupuesto en menos de 2 horas y entrega en 24-48 Hs. Más de 1.000 empresas confiaron.",
        keywords: "uniformes empresas uruguay, uniformes personalizados, ropa de trabajo, estampado, bordado",
        canonicalUrl: BASE,
    },
    {
        pageSlug: "/nosotros",
        pageName: "Quiénes Somos",
        metaTitle: "Quiénes Somos | DL Diseño & Estampado",
        metaDesc: "Más de 10 años uniformando empresas uruguayas. Prenda, personalización y entrega en un solo lugar, desde nuestro taller en Montevideo.",
        keywords: "dl diseño y estampado, empresa de uniformes montevideo",
        canonicalUrl: `${BASE}/nosotros`,
    },
    {
        pageSlug: "/contacto",
        pageName: "Contacto",
        metaTitle: "Contacto | DL Diseño & Estampado",
        metaDesc: "Escribinos por WhatsApp al 097 534 866 o visitanos en Yaguarón 1838, Montevideo. Respondemos presupuestos en menos de 2 horas.",
        keywords: "contacto uniformes montevideo, presupuesto uniformes",
        canonicalUrl: `${BASE}/contacto`,
    },
];

async function main() {
    for (const p of PAGINAS) {
        await prisma.seoMetadata.upsert({
            where: { pageSlug: p.pageSlug },
            update: p,
            create: p,
        });
        console.log(`OK ${p.pageSlug} — "${p.metaTitle}" (${p.metaTitle.length} chars título, ${p.metaDesc.length} descripción)`);
    }
    const total = await prisma.seoMetadata.count();
    console.log(`\nTotal de páginas con SEO cargado: ${total}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
