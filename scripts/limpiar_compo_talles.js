// Limpia composición y talles "sucios" heredados de los PDF de catálogo:
// - materials/talles que traen pegados los segmentos "UNISEX ... DAMA ... NIÑO ..."
//   se parten: la parte unisex queda en el campo base, la de dama/niño va a
//   damaCompo/damaTalles/ninoCompo/ninoTalles SOLO si estaban vacíos.
// - damaCompo/ninoCompo/damaTalles/ninoTalles que empiezan con la palabra
//   DAMA/NIÑO la pierden (queda solo el dato).
// Uso: node --dns-result-order=ipv4first scripts/limpiar_compo_talles.js        (muestra sin tocar)
//      node --dns-result-order=ipv4first scripts/limpiar_compo_talles.js aplicar
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const APLICAR = process.argv[2] === "aplicar";
const MARCADOR = /\b(UNISEX|DAMA|NIÑO|NINO)\b/u;

// Parte un texto tipo "UNISEX 100% algodón DAMA 60% algodón" en sus segmentos.
function partir(texto) {
    const partes = { unisex: null, dama: null, nino: null };
    if (!texto) return partes;
    const trozos = texto.split(/\b(UNISEX|DAMA|NIÑO|NINO)\b/u);
    let claveActual = "unisex"; // lo que viene antes del primer marcador es unisex
    for (const trozo of trozos) {
        const t = trozo.trim().replace(/^[,;:\-]+|[,;:\-]+$/g, "").trim();
        if (trozo === "UNISEX") { claveActual = "unisex"; continue; }
        if (trozo === "DAMA") { claveActual = "dama"; continue; }
        if (trozo === "NIÑO" || trozo === "NINO") { claveActual = "nino"; continue; }
        if (t) partes[claveActual] = partes[claveActual] ? partes[claveActual] + " " + t : t;
    }
    return partes;
}

// Saca el marcador inicial de un campo de versión ("DAMA 60% algodón" -> "60% algodón")
function sinMarcadorInicial(texto) {
    if (!texto) return texto;
    return texto.replace(/^\s*(UNISEX|DAMA|NIÑO|NINO)\b[\s,;:\-]*/u, "").trim() || null;
}

async function main() {
    const productos = await prisma.$queryRawUnsafe(
        'SELECT id, name, materials, "damaCompo", "ninoCompo", talles, "damaTalles", "ninoTalles" FROM "Product" ORDER BY id'
    );
    let tocados = 0;

    for (const p of productos) {
        const cambios = {};

        // ── Composición ──
        if (p.materials && MARCADOR.test(p.materials)) {
            const s = partir(p.materials);
            if (s.unisex !== p.materials) cambios.materials = s.unisex;
            if (s.dama && !p.damaCompo) cambios.damaCompo = s.dama;
            if (s.dama && p.damaCompo) console.log(`  · #${p.id} ${p.name}: segmento DAMA de materials descartado (damaCompo ya tenía dato)`);
            if (s.nino && !p.ninoCompo) cambios.ninoCompo = s.nino;
            if (s.nino && p.ninoCompo) console.log(`  · #${p.id} ${p.name}: segmento NIÑO de materials descartado (ninoCompo ya tenía dato)`);
        }
        const dc = sinMarcadorInicial(p.damaCompo);
        if (p.damaCompo && dc !== p.damaCompo && !("damaCompo" in cambios)) cambios.damaCompo = dc;
        const nc = sinMarcadorInicial(p.ninoCompo);
        if (p.ninoCompo && nc !== p.ninoCompo && !("ninoCompo" in cambios)) cambios.ninoCompo = nc;

        // ── Talles ──
        if (p.talles && MARCADOR.test(p.talles)) {
            const s = partir(p.talles);
            if (s.unisex !== p.talles) cambios.talles = s.unisex;
            if (s.dama && !p.damaTalles) cambios.damaTalles = s.dama;
            if (s.dama && p.damaTalles) console.log(`  · #${p.id} ${p.name}: segmento DAMA de talles descartado (damaTalles ya tenía: "${p.damaTalles}")`);
            if (s.nino && !p.ninoTalles) cambios.ninoTalles = s.nino;
            if (s.nino && p.ninoTalles) console.log(`  · #${p.id} ${p.name}: segmento NIÑO de talles descartado (ninoTalles ya tenía: "${p.ninoTalles}")`);
        }
        const dt = sinMarcadorInicial(p.damaTalles);
        if (p.damaTalles && dt !== p.damaTalles && !("damaTalles" in cambios)) cambios.damaTalles = dt;
        const nt = sinMarcadorInicial(p.ninoTalles);
        if (p.ninoTalles && nt !== p.ninoTalles && !("ninoTalles" in cambios)) cambios.ninoTalles = nt;

        if (Object.keys(cambios).length === 0) continue;
        tocados++;
        console.log(`\n#${p.id} ${p.name}`);
        for (const [campo, nuevo] of Object.entries(cambios)) {
            console.log(`   ${campo}: "${p[campo] ?? ""}" -> "${nuevo ?? ""}"`);
        }
        if (APLICAR) {
            await prisma.product.update({ where: { id: p.id }, data: cambios });
        }
    }

    console.log(`\n${tocados} producto(s) ${APLICAR ? "actualizados" : "con cambios propuestos (corré con 'aplicar' para grabarlos)"} de ${productos.length}.`);
}

main().finally(() => prisma.$disconnect());
