// Fondo CSS de un color de la paleta: liso, o partido en diagonal si es
// combinado (hex2 cargado). Usar con style={{ background: fondoColor(...) }}.
export function fondoColor(hex?: string | null, hex2?: string | null): string {
    const h = hex ? (hex.startsWith("#") ? hex : `#${hex}`) : "#cccccc";
    if (!hex2) return h;
    const h2 = hex2.startsWith("#") ? hex2 : `#${hex2}`;
    return `linear-gradient(135deg, ${h} 50%, ${h2} 50%)`;
}
