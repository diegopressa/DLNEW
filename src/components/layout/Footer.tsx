// src/components/layout/Footer.tsx
import Link from "next/link";
import { Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";

export default function Footer({ settings }: { settings: any }) {
    const year = new Date().getFullYear();
    const contact = settings || {
        address: "Montevideo, Uruguay",
        phone: "+598 99 000 000",
        email: "info@dldiseno.uy"
    };

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <img
                                src="/logo.png"
                                alt="DL Diseño & Estampado"
                                className="h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Expertos en uniformes corporativos. Resolvemos todo: prenda, estampado y entrega para tu empresa.
                        </p>
                        <div className="flex gap-4">
                            {settings?.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {settings?.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    <Facebook size={20} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Empresa</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/categorias" className="hover:text-white transition-colors">Productos</Link></li>
                            <li><Link href="/trabajos" className="hover:text-white transition-colors">Galería de Trabajos</Link></li>
                            <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
                            <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
                            <li><Link href="/politicas-de-privacidad" className="hover:text-white transition-colors">Políticas de Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Categorías</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/categorias" className="hover:text-white transition-colors">Remeras y Polos</Link></li>
                            <li><Link href="/categorias" className="hover:text-white transition-colors">Buzos y Abrigo</Link></li>
                            <li><Link href="/categorias" className="hover:text-white transition-colors">Ropa de Trabajo</Link></li>
                            <li><Link href="/categorias" className="hover:text-white transition-colors">Accesorios</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contacto</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <MapPin size={18} className="text-blue-500" />
                                <span>{contact.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-500" />
                                <span>{contact.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-500" />
                                <span>{contact.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© {year} DL Diseño & Estampado - Diego Horacio Presa Berrondo. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <Link href="/politicas-de-privacidad" className="hover:text-white">Políticas de Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
