// Corrige el typo "en adelantes" en la FAQ del pedido mínimo
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const items = await prisma.faqItem.findMany();
    for (const f of items) {
        if (f.answer.includes("en adelantes")) {
            const nuevo = f.answer.replace("en adelantes", "en adelante");
            await prisma.faqItem.update({ where: { id: f.id }, data: { answer: nuevo } });
            console.log("Corregido FAQ#" + f.id + ": " + nuevo);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
