// Tira de servicios bajo el hero: los 4 datos clave, una sola vez en toda la home.
const SERVICIOS = [
    { icono: "48h", titulo: "Entrega rápida", detalle: "24–48 h según volumen" },
    { icono: "2h", titulo: "Presupuesto inmediato", detalle: "en horario laboral" },
    { icono: "UY", titulo: "Envíos a todo el país", detalle: "Montevideo e interior" },
    { icono: "1", titulo: "Un solo proveedor", detalle: "prenda, logo y entrega" },
];

export default function ServicesStrip() {
    return (
        <div className="bg-white border-b border-slate-100">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4">
                {SERVICIOS.map((s, i) => (
                    <div
                        key={s.titulo}
                        className={`flex items-start gap-3.5 py-5 px-2 sm:px-5 ${i > 0 ? "lg:border-l lg:border-slate-100" : ""} ${i % 2 === 1 ? "border-l border-slate-100 lg:border-l" : ""} ${i > 1 ? "border-t border-slate-100 lg:border-t-0" : ""}`}
                    >
                        <span className="w-10 h-10 shrink-0 rounded-full bg-resalte text-grafito grid place-items-center font-extrabold text-xs">
                            {s.icono}
                        </span>
                        <span>
                            <span className="block font-bold text-sm text-grafito">{s.titulo}</span>
                            <span className="block text-xs text-slate-500">{s.detalle}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
