// Reorganización de categorías (14/08/2026, aprobada por Diego):
// - "Ropa de trabajo y Alta Visibilidad" -> "Alta visibilidad y seguridad" (solo EPP físico)
// - "Accesorios" -> "Gorros"; se crea "Merchandising" para bolsas/mochilas/banderas/etc.
// - Camisas, Pantalones y bermudas, Casacas y delantales pasan a VISIBLES
// - Prendas movidas a su categoría por tipo; nombres rotos corregidos
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const cats = await prisma.productCategory.findMany();
    const porNombre = (n) => cats.find((c) => c.name === n);

    const remeras = porNombre("Remeras y Polos");
    const camperas = porNombre("Camperas y Abrigos");
    const buzos = porNombre("Buzos y Canguros");
    const accesorios = porNombre("Accesorios");
    const ropaTrabajo = porNombre("Ropa de trabajo y Alta Visibilidad");
    const camisas = porNombre("Camisas");
    const pantalones = porNombre("Pantalones y bermudas");
    const casacas = porNombre("Casacas y delantales");
    if (!remeras || !camperas || !buzos || !accesorios || !ropaTrabajo || !camisas || !pantalones || !casacas) {
        throw new Error("Falta alguna categoría esperada — abortando sin tocar nada.");
    }

    // 1. Renombres + visibilidad + orden final del menú
    await prisma.productCategory.update({ where: { id: remeras.id }, data: { order: 1 } });
    await prisma.productCategory.update({ where: { id: camisas.id }, data: { order: 2, isVisible: true } });
    await prisma.productCategory.update({ where: { id: buzos.id }, data: { order: 3 } });
    await prisma.productCategory.update({ where: { id: camperas.id }, data: { order: 4 } });
    await prisma.productCategory.update({ where: { id: pantalones.id }, data: { order: 5, isVisible: true } });
    await prisma.productCategory.update({ where: { id: casacas.id }, data: { order: 6, isVisible: true } });
    await prisma.productCategory.update({
        where: { id: ropaTrabajo.id },
        data: { name: "Alta visibilidad y seguridad", order: 7 },
    });
    await prisma.productCategory.update({
        where: { id: accesorios.id },
        data: { name: "Gorros", order: 8 },
    });

    let merch = porNombre("Merchandising");
    if (!merch) {
        merch = await prisma.productCategory.create({
            data: {
                name: "Merchandising",
                imageUrl: "",
                order: 9,
                showOnHome: false,
                isVisible: true,
            },
        });
    }
    console.log("Categorías renombradas y ordenadas. Merchandising id:", merch.id);

    // 2. Movimientos de prendas
    // Preferimos masterCode; si no hay, nombre exacto.
    const movimientos = [
        // Del cajón "Ropa de trabajo" a Camisas
        { code: "CT-001", a: camisas.id }, { code: "CT-002", a: camisas.id }, { code: "CT-005", a: camisas.id },
        // Del cajón a Pantalones y bermudas
        { code: "PT-001", a: pantalones.id }, { code: "PT-003", a: pantalones.id },
        { nombre: "Pantalón de Trabajo Cargo", a: pantalones.id },
        { nombre: "Bermuda de Trabajo Deluxe", a: pantalones.id },
        { nombre: "Bermuda de Trabajo Industrial Básica", a: pantalones.id },
        // Del cajón a Camperas
        { nombre: "Campera Premium Deluxe con Reflectivo", a: camperas.id },
        { nombre: "Campera Polar con Reflectivo", a: camperas.id },
        // A Alta visibilidad y seguridad (EPP físico)
        { code: "CR-002", a: ropaTrabajo.id }, // Chaleco Reflectivo 2 Tiras (estaba en Camperas)
        { code: "EL-001", a: ropaTrabajo.id }, // Equipo de Lluvia
        { code: "ZT-001", a: ropaTrabajo.id }, { code: "ZT-002", a: ropaTrabajo.id }, // Zapatos de trabajo
        // A Casacas y delantales
        { nombre: "Delantal con Bolsillo", a: casacas.id },
        // A Pantalones (estaba en Buzos)
        { code: "PF-001", a: pantalones.id },
        // A Merchandising (estaban en Accesorios/Gorros)
        { nombre: "Mochila para Notebook", a: merch.id },
        { nombre: "Bolsa de Algodón", a: merch.id },
        { nombre: "Banderas", a: merch.id },
        { code: "PS-001", a: merch.id }, // Paraguas / Sombrilla
        { code: "TD-001", a: merch.id }, // Toalla Deportiva
        { code: "TB-001", a: merch.id }, // Tote Bag
    ];

    let movidos = 0;
    for (const m of movimientos) {
        const where = m.code ? { masterCode: m.code } : { name: m.nombre };
        const prod = await prisma.product.findFirst({ where });
        if (!prod) {
            console.log("  AVISO: no encontrado ->", m.code || m.nombre);
            continue;
        }
        await prisma.product.update({ where: { id: prod.id }, data: { categoryId: m.a } });
        movidos++;
    }
    console.log("Prendas movidas:", movidos, "de", movimientos.length);

    // 3. Nombres rotos / typos
    const renombres = [
        { code: "CA-001", nuevo: "Remera de Alta Visibilidad Manga Corta" },
        { code: "GN-001", nuevo: "Gorro con Cubrenuca" },
        { code: "CN-004", nuevo: "Campera Nylon con Polar Niño" },
        { nombre: "Remera Polo Manga Largarga con Reflectivo", nuevo: "Remera Polo Manga Larga con Reflectivo" },
    ];
    for (const r of renombres) {
        const where = r.code ? { masterCode: r.code } : { name: r.nombre };
        const prod = await prisma.product.findFirst({ where });
        if (!prod) {
            console.log("  AVISO renombre: no encontrado ->", r.code || r.nombre);
            continue;
        }
        await prisma.product.update({ where: { id: prod.id }, data: { name: r.nuevo } });
        console.log(`  Renombrado: "${prod.name}" -> "${r.nuevo}"`);
    }

    // 4. Imagen para Merchandising (la de la mochila o bolsa si existe)
    const conFoto = await prisma.product.findFirst({
        where: { categoryId: merch.id },
        include: { images: true },
    });
    const foto = conFoto?.images?.[0]?.url;
    if (foto && !merch.imageUrl) {
        await prisma.productCategory.update({ where: { id: merch.id }, data: { imageUrl: foto } });
        console.log("Foto de Merchandising asignada.");
    }

    // Resumen final
    const resumen = await prisma.productCategory.findMany({
        orderBy: { order: "asc" },
        include: { _count: { select: { products: true } } },
    });
    console.log("\n== RESULTADO ==");
    for (const c of resumen) {
        console.log(`  ${c.order}. ${c.name}${c.isVisible === false ? " [OCULTA]" : ""} — ${c._count.products} prendas`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
