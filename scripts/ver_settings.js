// Muestra los datos de contacto guardados en GlobalSettings (diagnóstico rápido)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

prisma.globalSettings
    .findFirst()
    .then((s) => {
        console.log("whatsapp: [" + s.whatsapp + "]");
        console.log("phone:    [" + s.phone + "]");
        console.log("email:    [" + s.email + "]");
        console.log("hoursWeek:[" + s.hoursWeek + "]");
        console.log("hoursSat: [" + s.hoursSat + "]");
    })
    .finally(() => prisma.$disconnect());
