// Diagnóstico: textos con "mínimo"/"500"/"1000" + productos activos con ficha incompleta
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const RX = /(m[ií]nimo|500|1000|1\.000|10 unidades)/i;

function ver(etiqueta, obj, campos) {
    if (!obj) return;
    for (const c of campos) {
        const v = obj[c];
        if (typeof v === "string" && RX.test(v)) console.log(`  [${etiqueta}.${c}] ${v}`);
    }
}

async function main() {
    console.log("=== TEXTOS CON MÍNIMO / 500 / 1000 ===");
    ver("HeroSection", await prisma.heroSection.findFirst(), ["title", "subtitle", "minOrderText", "badgeLabel", "badgeTitle", "badgeSubtitle", "trustStat1", "trustStat2", "trustStat3", "ctaPrimary", "ctaSecondary"]);
    ver("CtaSection", await prisma.ctaSection.findFirst(), ["title", "subtitle", "buttonText", "smallText"]);
    ver("CategoriasHeader", await prisma.categoriasHeader.findFirst(), ["title", "subtitle", "volumeTitle", "volumeSubtitle", "volumeTier1", "volumeTier1Label", "volumeTier2", "volumeTier2Label", "volumeTier3", "volumeTier3Label"]);
    ver("AboutUs", await prisma.aboutUs.findFirst(), ["title", "content"]);
    ver("CategoriesSection", await prisma.categoriesSection.findFirst(), ["title", "subtitle"]);
    ver("ProjectsSection", await prisma.projectsSection.findFirst(), ["title", "subtitle"]);
    ver("ProcessSection", await prisma.processSection.findFirst(), ["title", "subtitle"]);
    ver("WhyUsSection", await prisma.whyUsSection.findFirst(), ["title", "subtitle"]);
    ver("SeoSettings", await prisma.seoSettings.findFirst(), ["siteName", "defaultTitleTemplate", "defaultMetaDesc"]);

    for (const f of await prisma.faqItem.findMany()) {
        if (RX.test(f.question) || RX.test(f.answer)) console.log(`  [Faq#${f.id} activo=${f.active}] P: ${f.question}\n      R: ${f.answer}`);
    }
    for (const s of await prisma.seoMetadata.findMany()) {
        for (const c of ["metaTitle", "metaDesc", "ogTitle", "ogDesc", "keywords"]) {
            if (s[c] && RX.test(s[c])) console.log(`  [Seo ${s.pageSlug}.${c}] ${s[c]}`);
        }
    }
    for (const p of await prisma.processStep.findMany()) {
        if (RX.test(p.title) || RX.test(p.description || "")) console.log(`  [ProcessStep#${p.id}] ${p.title} — ${p.description}`);
    }
    for (const w of await prisma.whyChooseUs.findMany()) {
        if (RX.test(w.title) || RX.test(w.description || "")) console.log(`  [WhyChooseUs#${w.id}] ${w.title} — ${w.description}`);
    }
    for (const b of await prisma.businessSolution.findMany()) {
        if (RX.test(b.title) || RX.test(b.description || "")) console.log(`  [BusinessSolution#${b.id}] ${b.title} — ${b.description}`);
    }
    for (const t of await prisma.testimonial.findMany()) {
        if (RX.test(t.content)) console.log(`  [Testimonial#${t.id}] ${t.name}: ${t.content}`);
    }
    const pol = await prisma.privacyPolicy.findFirst();
    if (pol) console.log(`  [PrivacyPolicy] largo del contenido: ${pol.content.length} caracteres`);

    console.log("\n=== PRODUCTOS ACTIVOS (no pausados) CON FICHA INCOMPLETA ===");
    const prods = await prisma.product.findMany({
        where: { isActive: true, pausadoManual: false },
        include: { category: true, colors: true },
        orderBy: [{ categoryId: "asc" }, { name: "asc" }],
    });
    const faltantes = [];
    for (const p of prods) {
        const falta = [];
        if (!p.colors || p.colors.length === 0) falta.push("colores");
        if (!p.talles || !p.talles.trim()) falta.push("talles");
        if (!p.materials || !p.materials.trim()) falta.push("composición");
        if (!p.masterCode || !p.masterCode.trim()) falta.push("código (Ref)");
        if (!p.description || !p.description.trim()) falta.push("descripción");
        if (falta.length) faltantes.push({ p, falta });
    }
    console.log(`Total activos no pausados: ${prods.length} · con algo faltante: ${faltantes.length}\n`);
    for (const { p, falta } of faltantes) {
        console.log(JSON.stringify({ nombre: p.name, categoria: p.category?.name || "", slugCat: null, slug: p.slug, falta }));
    }
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());
