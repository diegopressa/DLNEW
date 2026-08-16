import Link from "next/link";

// 404 propio: antes cualquier URL rota mostraba la pantalla genérica de Next.
export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="max-w-md text-center">
                <img src="/logo.png" alt="DL Diseño & Estampado" className="h-12 w-auto object-contain mx-auto mb-8" />
                <p className="text-[80px] leading-none font-black text-[#0081D1]">404</p>
                <h1 className="mt-3 text-2xl font-extrabold text-[#14181C]">
                    Esta página no existe
                </h1>
                <p className="mt-3 text-slate-500">
                    Puede que el artículo haya cambiado de lugar o que el link esté mal escrito.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/categorias"
                        className="bg-[#0081D1] text-white px-6 py-3 rounded-md text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                    >
                        Ver el catálogo
                    </Link>
                    <Link
                        href="/"
                        className="border border-slate-300 text-[#14181C] px-6 py-3 rounded-md text-sm font-bold uppercase tracking-wide hover:border-[#14181C] transition-colors"
                    >
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
