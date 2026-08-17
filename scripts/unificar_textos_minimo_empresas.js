// Unifica los textos contradictorios: sin pedido mínimo + "+1000 empresas"
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const hero = await prisma.heroSection.findFirst();
    if (!hero) throw new Error("No hay HeroSection");
    await prisma.heroSection.update({
        where: { id: hero.id },
        data: {
            minOrderText: "Sin pedido mínimo · Atendemos empresas, instituciones y eventos en todo Uruguay.",
            trustStat1: "+1000 empresas atendidas",
        },
    });
    const h = await prisma.heroSection.findFirst();
    console.log("minOrderText:", h.minOrderText);
    console.log("trustStat1  :", h.trustStat1);
}

main().catch(console.error).finally(() => prisma.$disconnect());
