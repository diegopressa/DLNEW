import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Hero Section
    await prisma.heroSection.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: "Uniformes personalizados para empresas",
            subtitle: "Nos encargamos de todo: prenda, estampado y entrega. Presupuesto inmediato y entrega en 24-48 horas.",
            ctaPrimary: "Solicitar presupuesto por WhatsApp",
            ctaSecondary: "Ver trabajos realizados",
            imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000",
        },
    });

    // Global Settings
    await prisma.globalSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
            whatsapp: "59899000000",
            email: "info@dldiseno.uy",
            phone: "+598 99 000 000",
            address: "Montevideo, Uruguay",
        },
    });

    // Industries
    const industries = [
        { name: "Gastronomía", order: 1 },
        { name: "Construcción", order: 2 },
        { name: "Logística", order: 3 },
        { name: "Seguridad", order: 4 },
        { name: "Mantenimiento", order: 5 },
        { name: "Distribuidoras", order: 6 },
        { name: "Fábricas", order: 7 },
        { name: "Limpieza", order: 8 },
    ];

    for (const ind of industries) {
        await prisma.industry.create({ data: ind });
    }

    // Business Solutions
    const solutions = [
        { title: "Prenda", description: "Gran variedad de opciones de calidad.", order: 1 },
        { title: "Personalización", description: "Estampado y bordado profesional.", order: 2 },
        { title: "Entrega", description: "Envíos a todo el país sin demora.", order: 3 },
        { title: "Rapidez", description: "Producción ágil y respuesta inmediata.", order: 4 },
    ];

    for (const sol of solutions) {
        await prisma.businessSolution.create({ data: sol });
    }

    // Categories
    const categories = [
        { name: "Remeras y Polos", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", order: 1 },
        { name: "Buzos y Canguros", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7", order: 2 },
        { name: "Camperas y Abrigo", imageUrl: "https://images.unsplash.com/photo-1544022613-e87f73acc8f3", order: 3 },
        { name: "Pantalones y Ropa de Trabajo", imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1", order: 4 },
        { name: "Gorros y Accesorios", imageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346", order: 5 },
        { name: "Prendas para Eventos", imageUrl: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93", order: 6 },
    ];

    for (const cat of categories) {
        await prisma.productCategory.create({ data: cat });
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
