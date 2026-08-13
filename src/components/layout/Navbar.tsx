import Link from "next/link";
import { MessageCircle, Search } from "lucide-react";

type NavCategory = { name: string; href: string; image?: string | null };

// Header estilo tienda de workwear: barra superior grafito + logo/buscador/CTA + tira de categorías.
const Navbar = ({
    whatsapp = "59899000000",
    categories = [],
    logoUrl,
}: {
    whatsapp?: string;
    categories?: NavCategory[];
    logoUrl?: string | null;
}) => {
    const waHref = `https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`;

    return (
        <header className="relative z-50">
            {/* Barra superior */}
            <div className="bg-grafito text-slate-300 text-xs sm:text-[13px]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-2 flex justify-between items-center gap-4">
                    <span className="truncate">
                        Estamos en <b className="text-white font-semibold">Yaguarón 1838</b> esq. Nueva York
                        <span className="hidden sm:inline"> · Envíos en <b className="text-white font-semibold">Montevideo y todo el Uruguay</b></span>
                    </span>
                    <a href={waHref} target="_blank" rel="noopener noreferrer" className="shrink-0 hover:text-white transition-colors">
                        WhatsApp: <b className="text-white font-semibold">097 534 866</b>
                    </a>
                </div>
            </div>

            {/* Header principal: logo + buscador + CTA */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4 flex items-center gap-4 md:gap-8">
                    <Link href="/" className="shrink-0">
                        <img
                            src={logoUrl || "/logo.png"}
                            alt="DL Diseño & Estampado"
                            className="h-11 md:h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Buscador (desktop), centrado entre el logo y el CTA */}
                    <form action="/buscar" className="hidden md:flex flex-1 max-w-[560px] mx-auto border-2 border-grafito rounded-md overflow-hidden">
                        <input
                            type="text"
                            name="q"
                            placeholder="Buscar: remeras, camperas, chalecos…"
                            aria-label="Buscar productos"
                            className="flex-1 min-w-0 px-4 py-2.5 text-sm outline-none"
                        />
                        <button type="submit" className="bg-primary text-white font-bold text-sm px-5 hover:bg-primary/90 transition-colors">
                            Buscar
                        </button>
                    </form>

                    <div className="ml-auto md:ml-0 flex items-center gap-3 shrink-0">
                        {/* Lupa (mobile) */}
                        <Link href="/buscar" aria-label="Buscar" className="md:hidden p-2 text-grafito">
                            <Search className="w-5 h-5" />
                        </Link>
                        <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary text-white px-4 sm:px-5 py-2.5 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Pedir presupuesto</span>
                            <span className="sm:hidden">Presupuesto</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Tira de categorías */}
            <nav aria-label="Categorías" className="bg-grafito2">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex items-stretch overflow-x-auto no-scrollbar">
                    <Link
                        href="/categorias"
                        className="bg-primary text-white text-[13px] font-bold px-4 py-3 whitespace-nowrap"
                    >
                        ☰&nbsp; Todas las categorías
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.href}
                            href={cat.href}
                            className="text-slate-200 text-[13px] font-semibold px-4 py-3 whitespace-nowrap hover:bg-grafito hover:text-celeste transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                    <Link href="/trabajos" className="text-slate-200 text-[13px] font-semibold px-4 py-3 whitespace-nowrap hover:bg-grafito hover:text-celeste transition-colors">
                        Trabajos
                    </Link>
                    <Link href="/nosotros" className="text-slate-200 text-[13px] font-semibold px-4 py-3 whitespace-nowrap hover:bg-grafito hover:text-celeste transition-colors">
                        Nosotros
                    </Link>
                    <Link href="/contacto" className="text-slate-200 text-[13px] font-semibold px-4 py-3 whitespace-nowrap hover:bg-grafito hover:text-celeste transition-colors">
                        Contacto
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
