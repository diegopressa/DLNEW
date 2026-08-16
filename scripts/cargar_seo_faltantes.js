// Siembra las filas de SeoMetadata que faltaban (16/08/2026): /categorias,
// /trabajos, /preguntas y /politicas-de-privacidad, con los textos por defecto
// que hoy están en el código. Editables después desde /admin/seo.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const filas = [
    {
        pageSlug: "/categorias",
        pageName: "Catálogo (índice de categorías)",
        metaTitle: "Catálogo de Uniformes y Prendas para Empresas | DL Diseño & Estampado",
        metaDesc: "Remeras, camisas, buzos, camperas, pantalones y más para uniformar a tu equipo. Con tu logo estampado o bordado. Entrega en todo Uruguay.",
    },
    {
        pageSlug: "/trabajos",
        pageName: "Trabajos realizados",
        metaTitle: "Trabajos Realizados para Empresas en Uruguay | DL Diseño & Estampado",
        metaDesc: "Casos reales de uniformes, estampado y bordado para empresas e instituciones en Uruguay. Mirá los trabajos que ya entregamos.",
    },
    {
        pageSlug: "/preguntas",
        pageName: "Preguntas frecuentes",
        metaTitle: "Preguntas Frecuentes | DL Diseño & Estampado",
        metaDesc: "Respondemos las dudas más comunes sobre pedidos mínimos, tiempos de entrega, formatos de diseño y más.",
    },
    {
        pageSlug: "/politicas-de-privacidad",
        pageName: "Políticas de privacidad",
        metaTitle: "Políticas de Privacidad | DL Diseño & Estampado",
        metaDesc: "Cómo tratamos tus datos personales en DL Diseño & Estampado: qué guardamos, para qué y tus derechos.",
    },
];

async function main() {
    for (const fila of filas) {
        await prisma.seoMetadata.upsert({
            where: { pageSlug: fila.pageSlug },
            update: {},
            create: fila,
        });
        console.log("OK", fila.pageSlug);
    }
}

main().finally(() => prisma.$disconnect());
