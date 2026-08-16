// Slug canónico de una categoría a partir de su nombre — el MISMO patrón que se
// repite por toda la web. Usar este helper en código nuevo para no divergir.
export function slugifyNombre(nombre: string): string {
    return nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "-");
}

// URL pública de una categoría: /categorias/lista-{slug}
export function slugCategoria(nombre: string): string {
    return `lista-${slugifyNombre(nombre)}`;
}

// Limpia un texto para meta descriptions / JSON-LD (sin saltos de línea)
export function textoPlano(texto?: string | null, max = 160): string {
    return (texto || "").replace(/\s+/g, " ").trim().slice(0, max);
}
