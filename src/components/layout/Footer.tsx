// src/components/layout/Footer.tsx
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer({ settings }: { settings: any }) {
    const year = new Date().getFullYear();
    const contact = settings || {
        address: "Montevideo, Uruguay",
        phone: "+598 97 534 866",
        email: "info@dldiseno.uy"
    };

    return (
        <footer className="bg-grafito text-slate-400">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 md:gap-12 py-14">
                <div>
                    <Link href="/" className="inline-block mb-4">
                        <img
                            src={settings?.logoUrl || "/logo.png"}
                            alt="DL Diseño & Estampado"
                            className="h-10 w-auto object-contain brightness-0 invert"
                        />
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Uniformes personalizados para empresas. Prenda, estampado o bordado y entrega en un solo lugar. {contact.address}.
                    </p>
                    <div className="flex gap-4 mt-5">
                        {settings?.instagramUrl && (
                            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-celeste transition-colors">
                                <Instagram size={20} />
                            </a>
                        )}
                        {settings?.facebookUrl && (
                            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-celeste transition-colors">
                                <Facebook size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-[0.1em] text-xs">Productos</h4>
                    <ul className="space-y-1.5 text-sm">
                        <li><Link href="/categorias" className="hover:text-celeste transition-colors">Catálogo completo</Link></li>
                        <li><Link href="/trabajos" className="hover:text-celeste transition-colors">Trabajos realizados</Link></li>
                        <li><Link href="/buscar" className="hover:text-celeste transition-colors">Buscar prendas</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 uppercase tracking-[0.1em] text-xs">Empresa</h4>
                    <ul className="space-y-1.5 text-sm">
                        <li><Link href="/nosotros" className="hover:text-celeste transition-colors">Nosotros</Link></li>
                        <li><Link href="/preguntas" className="hover:text-celeste transition-colors">Preguntas frecuentes</Link></li>
                        <li><Link href="/contacto" className="hover:text-celeste transition-colors">Contacto</Link></li>
                        <li><Link href="/politicas-de-privacidad" className="hover:text-celeste transition-colors">Políticas de privacidad</Link></li>
                    </ul>
                    <ul className="space-y-1.5 text-sm mt-5">
                        <li>{contact.phone}</li>
                        <li>{contact.email}</li>
                        <li>Lun–Vie, 9 a 18 hs</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-[#333B44]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                    <p>© {year} DL Diseño & Estampado — Diego Horacio Presa Berrondo. Todos los derechos reservados.</p>
                    <Link href="/politicas-de-privacidad" className="hover:text-celeste">Políticas de privacidad</Link>
                </div>
            </div>
        </footer>
    );
}
