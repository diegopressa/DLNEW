// Compara las tablas reales de la base con las del schema.prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const rows = await prisma.$queryRawUnsafe(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    const enDb = rows.map(r => r.table_name);
    console.log("TABLAS EN LA BASE (" + enDb.length + "):");
    console.log(enDb.join(", "));

    const esperadas = [
        "User", "GlobalSettings", "AboutUs", "SeoMetadata", "SeoSettings",
        "HeroSection", "HeroImage", "IndustriesSection", "Industry",
        "SolutionsSection", "BusinessSolution", "CategoriesSection",
        "ProductCategory", "Product", "ProductImage", "ProductFeature",
        "colors", "product_colors", "ProjectsSection", "Project",
        "WhyUsSection", "WhyChooseUs", "ProcessStep", "ProcessSection",
        "CtaSection", "CategoriasHeader", "Testimonial", "ContactSubmission",
        "Brand", "PrivacyPolicy", "FaqItem"
    ];
    const soloDb = enDb.filter(t => !esperadas.includes(t) && t !== "_prisma_migrations");
    const soloSchema = esperadas.filter(t => !enDb.includes(t));
    console.log("\nEn la base pero NO en el schema:", soloDb.length ? soloDb.join(", ") : "(ninguna)");
    console.log("En el schema pero NO en la base:", soloSchema.length ? soloSchema.join(", ") : "(ninguna)");

    const cols = await prisma.$queryRawUnsafe(
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'Product' ORDER BY ordinal_position"
    );
    console.log("\nColumnas de Product:", cols.map(c => c.column_name).join(", "));
    const cats = await prisma.productCategory.findMany({ orderBy: { order: "asc" } });
    console.log("\nCategorias actuales:", cats.map(c => `${c.id}:${c.name}`).join(" | "));
}

main().finally(() => prisma.$disconnect());
