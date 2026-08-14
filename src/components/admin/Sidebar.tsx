"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Settings,
    Image as ImageIcon,
    Briefcase,
    Search,
    LogOut,
    Package,
    Info,
    Palette,
    HelpCircle,
    Quote,
    Mail,
    ExternalLink,
    ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/login/actions";
import { useTransition } from "react";

// Menú agrupado por temas: lo del día a día arriba, lo de configurar al final.
const grupos = [
    {
        titulo: "Principal",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { name: "Mensajes", href: "/admin/mensajes", icon: Mail },
        ],
    },
    {
        titulo: "Catálogo",
        items: [
            { name: "Artículos", href: "/admin/articulos", icon: Package },
            { name: "Categorías", href: "/admin/categorias", icon: Briefcase },
            { name: "Colores", href: "/admin/colores", icon: Palette },
        ],
    },
    {
        titulo: "Contenido",
        items: [
            { name: "Página de inicio", href: "/admin/home", icon: FileText },
            { name: "Galería / Trabajos", href: "/admin/trabajos", icon: ImageIcon },
            { name: "Testimonios", href: "/admin/testimonios", icon: Quote },
            { name: "Nosotros", href: "/admin/nosotros", icon: Info },
            { name: "Preguntas frecuentes", href: "/admin/faq", icon: HelpCircle },
            { name: "Políticas de privacidad", href: "/admin/politicas-de-privacidad", icon: ShieldCheck },
        ],
    },
    {
        titulo: "Sistema",
        items: [
            { name: "SEO / Metadatos", href: "/admin/seo", icon: Search },
            { name: "Configuración", href: "/admin/settings", icon: Settings },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <div className="w-64 bg-[#000306] text-slate-400 flex flex-col h-screen sticky top-0">
            <div className="p-6 pb-4">
                <h1 className="text-white text-xl font-black tracking-tight">
                    DL <span className="text-[#0081D1]">ADMIN</span>
                </h1>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
                >
                    <ExternalLink size={12} /> Ver la web
                </a>
            </div>

            <nav className="flex-grow px-3 pb-4 space-y-5 overflow-y-auto no-scrollbar">
                {grupos.map((grupo) => (
                    <div key={grupo.titulo}>
                        <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                            {grupo.titulo}
                        </p>
                        <div className="space-y-0.5">
                            {grupo.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
                                            isActive
                                                ? "bg-[#0081D1] text-white"
                                                : "hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon size={17} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-3 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                    <LogOut size={17} />
                    {isPending ? "Saliendo..." : "Cerrar sesión"}
                </button>
            </div>
        </div>
    );
}
