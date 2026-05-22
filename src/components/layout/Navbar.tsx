"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductSearch from "@/components/product/ProductSearch";

type NavCategory = { name: string; href: string; image?: string | null };

const Navbar = ({
    whatsapp = "59899000000",
    categories = [],
    logoUrl,
}: {
    whatsapp?: string;
    categories?: NavCategory[];
    logoUrl?: string | null;
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/categorias", hasDropdown: true },
        { name: "Trabajos Realizados", href: "/trabajos" },
        { name: "Nosotros", href: "/nosotros" },
        { name: "Contacto", href: "/contacto" },
    ];

    const openProducts = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsProductsOpen(true);
    };
    const scheduleCloseProducts = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => setIsProductsOpen(false), 120);
    };

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
                            src={logoUrl || "/logo.png"}
                            alt="DL Diseño & Estampado"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            if (link.hasDropdown && categories.length > 0) {
                                return (
                                    <div
                                        key={link.name}
                                        className="relative"
                                        onMouseEnter={openProducts}
                                        onMouseLeave={scheduleCloseProducts}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            {link.name}
                                            <ChevronDown
                                                className={cn(
                                                    "w-3.5 h-3.5 transition-transform",
                                                    isProductsOpen && "rotate-180"
                                                )}
                                            />
                                        </Link>

                                        {isProductsOpen && (
                                            <div
                                                className="absolute left-1/2 -translate-x-1/2 top-full pt-3"
                                                onMouseEnter={openProducts}
                                                onMouseLeave={scheduleCloseProducts}
                                            >
                                                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-3 min-w-[260px] max-h-[70vh] overflow-y-auto">
                                                    <div className="flex flex-col">
                                                        {categories.map((cat) => (
                                                            <Link
                                                                key={cat.href}
                                                                href={cat.href}
                                                                onClick={() => setIsProductsOpen(false)}
                                                                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                                            >
                                                                {cat.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2 pt-2 border-t border-slate-100">
                                                        <Link
                                                            href="/categorias"
                                                            onClick={() => setIsProductsOpen(false)}
                                                            className="block px-4 py-2.5 rounded-lg text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                                                        >
                                                            Ver todas las categorías →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

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
                    {navLinks.map((link) => {
                        if (link.hasDropdown && categories.length > 0) {
                            return (
                                <div key={link.name}>
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={link.href}
                                            className="block text-base font-medium text-slate-900"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                        <button
                                            type="button"
                                            aria-label="Mostrar categorías"
                                            onClick={() => setIsMobileProductsOpen((v) => !v)}
                                            className="p-2 -mr-2 text-slate-500"
                                        >
                                            <ChevronDown
                                                className={cn(
                                                    "w-4 h-4 transition-transform",
                                                    isMobileProductsOpen && "rotate-180"
                                                )}
                                            />
                                        </button>
                                    </div>
                                    {isMobileProductsOpen && (
                                        <div className="mt-2 ml-3 pl-3 border-l-2 border-slate-100 flex flex-col gap-2">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.href}
                                                    href={cat.href}
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        setIsMobileProductsOpen(false);
                                                    }}
                                                    className="text-sm text-slate-600 py-1"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block text-base font-medium text-slate-900"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
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
