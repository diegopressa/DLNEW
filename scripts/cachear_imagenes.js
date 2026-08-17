// Re-sube las imágenes de Supabase Storage con Cache-Control largo (30 días).
// Sin esto, cada visita vuelve a descargar cada foto -> egress alto y sitio lento.
// La URL no cambia (mismo path + upsert), así que la base no se toca.
//
// Uso:
//   node --dns-result-order=ipv4first scripts/cachear_imagenes.js prueba   (1 sola)
//   node --dns-result-order=ipv4first scripts/cachear_imagenes.js listar   (qué falta)
//   node --dns-result-order=ipv4first scripts/cachear_imagenes.js aplicar  (todas)
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

// .env a mano: no hay dotenv instalado
for (const linea of fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8").split(/\r?\n/)) {
    const m = linea.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "images";
const CACHE = "2592000"; // 30 días
const BACKUP = path.join(__dirname, "..", ".backup-imagenes");

const prisma = new PrismaClient();

const tipoPorExt = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };

function rutaEnBucket(url) {
    const marca = `/storage/v1/object/public/${BUCKET}/`;
    const i = url.indexOf(marca);
    return i === -1 ? null : decodeURIComponent(url.slice(i + marca.length));
}

async function cabecera(url) {
    try {
        const r = await fetch(url, { method: "HEAD" });
        return { ok: r.ok, cache: r.headers.get("cache-control") || "", kb: Math.round(Number(r.headers.get("content-length") || 0) / 1024) };
    } catch {
        return { ok: false, cache: "", kb: 0 };
    }
}

async function recachear(url) {
    const ruta = rutaEnBucket(url);
    if (!ruta) return { estado: "no-es-de-supabase" };

    const bajada = await fetch(url);
    if (!bajada.ok) return { estado: `no-se-pudo-bajar-${bajada.status}` };
    const bytes = Buffer.from(await bajada.arrayBuffer());
    if (bytes.length < 100) return { estado: "archivo-vacio" };

    // copia de seguridad local antes de tocar nada
    const destino = path.join(BACKUP, ruta);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, bytes);

    const ext = (ruta.split(".").pop() || "").toLowerCase();
    const subida = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${ruta.split("/").map(encodeURIComponent).join("/")}`, {
        method: "PUT",
        headers: {
            authorization: `Bearer ${KEY}`,
            "content-type": bajada.headers.get("content-type") || tipoPorExt[ext] || "application/octet-stream",
            "cache-control": `max-age=${CACHE}`,
            "x-upsert": "true",
        },
        body: bytes,
    });
    if (!subida.ok) return { estado: `no-se-pudo-subir-${subida.status}`, detalle: (await subida.text()).slice(0, 200) };

    const despues = await cabecera(url);
    return { estado: despues.ok && /max-age=\d{4,}/.test(despues.cache) ? "ok" : "sin-cambio", cache: despues.cache, kb: despues.kb };
}

async function main() {
    const modo = process.argv[2] || "listar";
    if (!SUPABASE_URL || !KEY) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");

    const [imgs, cats, heroes, brands, projects] = await Promise.all([
        prisma.productImage.findMany({ select: { url: true } }),
        prisma.productCategory.findMany({ select: { imageUrl: true } }),
        prisma.heroImage.findMany({ select: { url: true } }),
        prisma.brand.findMany({ select: { imageUrl: true } }),
        prisma.project.findMany({ select: { imageUrl: true } }),
    ]);
    const urls = [
        ...imgs.map((i) => i.url),
        ...cats.map((c) => c.imageUrl),
        ...heroes.map((h) => h.url),
        ...brands.map((b) => b.imageUrl),
        ...projects.map((p) => p.imageUrl),
    ].filter((u) => u && u.includes("/storage/v1/object/public/"));
    const unicas = [...new Set(urls)];
    console.log(`Imágenes en Supabase referenciadas por la web: ${unicas.length}`);

    if (modo === "prueba") {
        const r = await recachear(unicas[0]);
        console.log("PRUEBA:", unicas[0].split("/").pop(), "->", JSON.stringify(r));
        return;
    }

    if (modo === "listar") {
        let sinCache = 0;
        for (let i = 0; i < unicas.length; i += 8) {
            const grupo = unicas.slice(i, i + 8);
            const heads = await Promise.all(grupo.map(cabecera));
            heads.forEach((h) => { if (h.ok && !/max-age=\d{4,}/.test(h.cache)) sinCache++; });
        }
        console.log(`Sin caché larga: ${sinCache} de ${unicas.length}`);
        return;
    }

    if (modo === "aplicar") {
        const resumen = {};
        const fallidas = [];
        for (let i = 0; i < unicas.length; i++) {
            const r = await recachear(unicas[i]);
            resumen[r.estado] = (resumen[r.estado] || 0) + 1;
            if (r.estado !== "ok") fallidas.push({ url: unicas[i], ...r });
            if ((i + 1) % 25 === 0 || i === unicas.length - 1) {
                console.log(`  ${i + 1}/${unicas.length} · ${JSON.stringify(resumen)}`);
            }
        }
        console.log("\nRESULTADO:", JSON.stringify(resumen));
        if (fallidas.length) {
            console.log("\nFALLIDAS:");
            for (const f of fallidas.slice(0, 25)) console.log(`  ${f.estado} · ${f.url.split("/").pop()} ${f.detalle || ""}`);
        }
        console.log(`\nCopia de seguridad local en: ${BACKUP}`);
    }
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());
