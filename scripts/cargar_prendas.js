// Carga masiva del rediseño 08/2026: 94 prendas de la planilla maestra.
// - Prendas nuevas: se crean con isActive=false (borrador, invisibles al público).
// - Prendas ya en la web: solo se les agrega masterCode, talles, rubros y versiones.
// - Categorías nuevas: se crean con isVisible=false (la web vieja las ignora).
// Lee el manifiesto carga.json generado por la extracción de fotos.
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

const CARGA = path.join(
    process.env.LOCALAPPDATA || "",
    "Temp/claude/c--Users-diego-OneDrive-Desktop-CLAUDIO-dl-web/5140cf06-b115-4bfb-a98a-3401095df196/scratchpad/carga.json"
);

// Categoría de la planilla -> id existente, o null si hay que crearla
const MAPA_EXISTENTES = {
    "Remeras y polos": 7,
    "Camperas y abrigos": 9,
    "Buzos y canguros": 8,
    "Ropa de trabajo y alta visibilidad": 10,
    "Accesorios y calzado": 11, // se mapea a la actual "Accesorios"
};
const NUEVAS = ["Camisas", "Pantalones y bermudas", "Casacas y delantales"];

function slugify(s) {
    return (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function arreglarNombre(n) {
    // La planilla viene en Title Case; bajamos los conectores
    return (n || "").replace(/ (De|Del|Y|Con|Para|El|La|A|En) /g, (m) => m.toLowerCase());
}

async function main() {
    const carga = JSON.parse(fs.readFileSync(CARGA, "utf-8"));
    const resumen = { catsNuevas: 0, creadas: 0, actualizadas: 0, saltadas: [], avisos: [] };

    // 1. Categorías nuevas (ocultas)
    const idsCategoria = { ...MAPA_EXISTENTES };
    for (const nombreCat of NUEVAS) {
        let cat = await prisma.productCategory.findFirst({ where: { name: nombreCat } });
        if (!cat) {
            const fotoDeLaCat = carga.find((c) => c.categoria === nombreCat && c.fotoUrl)?.fotoUrl || "";
            cat = await prisma.productCategory.create({
                data: {
                    name: nombreCat,
                    imageUrl: fotoDeLaCat,
                    order: 50 + NUEVAS.indexOf(nombreCat),
                    showOnHome: false,
                    isVisible: false,
                },
            });
            resumen.catsNuevas++;
        }
        idsCategoria[nombreCat] = cat.id;
    }

    // 2. Prendas
    const slugsUsados = new Set();
    let orden = 100;
    for (const item of carga) {
        const versiones = {
            versionDama: item.dama,
            damaTalles: item.dama ? item.tallesDama || null : null,
            damaCompo: item.dama ? item.compoDama || null : null,
            damaImageUrl: item.fotoDamaUrl || null,
            versionNino: item.nino,
            ninoTalles: item.nino ? item.tallesNino || null : null,
            ninoImageUrl: item.fotoNinoUrl || null,
        };

        if (item.slugWeb) {
            // Prenda que ya existe en la web
            if (slugsUsados.has(item.slugWeb)) {
                resumen.saltadas.push(`${item.codigo} ${item.nombre} (match duplicado con ${item.slugWeb} — revisar a mano)`);
                continue;
            }
            slugsUsados.add(item.slugWeb);
            const prod = await prisma.product.findUnique({ where: { slug: item.slugWeb } });
            if (!prod) {
                resumen.saltadas.push(`${item.codigo} ${item.nombre} (slug ${item.slugWeb} no encontrado)`);
                continue;
            }
            await prisma.product.update({
                where: { id: prod.id },
                data: {
                    masterCode: item.codigo,
                    rubros: item.rubros || null,
                    talles: prod.talles || item.talles || null,
                    materials: prod.materials || item.compo || null,
                    ...versiones,
                },
            });
            resumen.actualizadas++;
        } else {
            // Prenda nueva → borrador oculto
            let slug = slugify(item.nombre) || slugify(item.codigo);
            const existe = await prisma.product.findUnique({ where: { slug } });
            if (existe) slug = `${slug}-${item.codigo.toLowerCase()}`;
            const catId = idsCategoria[item.categoria];
            if (!catId) {
                resumen.saltadas.push(`${item.codigo} ${item.nombre} (categoría desconocida: ${item.categoria})`);
                continue;
            }
            const creado = await prisma.product.create({
                data: {
                    slug,
                    name: arreglarNombre(item.nombre),
                    description: item.descripcion || null,
                    materials: item.compo || null,
                    talles: item.talles || null,
                    rubros: item.rubros || null,
                    masterCode: item.codigo,
                    categoryId: catId,
                    isActive: false, // BORRADOR: invisible hasta que se active
                    hasScreenPrint: true,
                    hasEmbroidery: true,
                    order: orden++,
                    ...versiones,
                },
            });
            if (item.fotoUrl) {
                await prisma.productImage.create({
                    data: { url: item.fotoUrl, order: 0, productId: creado.id },
                });
            } else {
                resumen.avisos.push(`${item.codigo} ${creado.name}: sin foto (completar desde admin)`);
            }
            resumen.creadas++;
        }
    }

    console.log("Categorías nuevas creadas:", resumen.catsNuevas);
    console.log("Prendas nuevas (borrador):", resumen.creadas);
    console.log("Prendas existentes actualizadas:", resumen.actualizadas);
    if (resumen.avisos.length) {
        console.log("\nAvisos:");
        resumen.avisos.forEach((s) => console.log("  -", s));
    }
    if (resumen.saltadas.length) {
        console.log("\nSaltadas (revisar a mano):");
        resumen.saltadas.forEach((s) => console.log("  -", s));
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
