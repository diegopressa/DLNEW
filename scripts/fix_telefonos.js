// Corrige whatsapp y phone de GlobalSettings a formato internacional (16/08/2026)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

prisma.globalSettings
    .update({
        where: { id: 1 },
        data: { whatsapp: "59897534866", phone: "59829250584" },
    })
    .then((s) => console.log("OK -> whatsapp:", s.whatsapp, "| phone:", s.phone))
    .finally(() => prisma.$disconnect());
