"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductSearch from "@/components/product/ProductSearch";

const Navbar = ({ whatsapp = "59899000000" }: { whatsapp?: string }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/categorias" },
        { name: "Trabajos Realizados", href: "/trabajos" },
        { name: "Nosotros", href: "/nosotros" },
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
                    : "bg-transparent py-4"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="DL Diseño & Estampado"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {/* Desktop Search */}
                        <div className="border-l border-slate-200 pl-6 flex items-center">
                            <ProductSearch />
                        </div>

                        <Link
                            href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`}
                            target="_blank"
                            className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Presupuesto
                        </Link>
                    </div>

                    {/* Mobile Search Icon & Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <ProductSearch />
                        <button
                            className="text-slate-900"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-xl border-t border-slate-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block text-base font-medium text-slate-900"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`}
                        target="_blank"
                        className="w-full bg-primary text-white px-5 py-3 rounded-xl text-center font-bold flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
