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
    ChevronRight,
    Package,
    Info,
    Palette,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/login/actions";
import { useTransition } from "react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Nosotros", href: "/admin/nosotros", icon: Info },
    { name: "Contenido Home", href: "/admin/home", icon: FileText },
    { name: "Galería / Trabajos", href: "/admin/trabajos", icon: ImageIcon },
    { name: "Categorías", href: "/admin/categorias", icon: Briefcase },
    { name: "Artículos", href: "/admin/articulos", icon: Package },
    { name: "Colores", href: "/admin/colores", icon: Palette },
    { name: "Preguntas Frec.", href: "/admin/faq", icon: HelpCircle },
    { name: "Políticas Priv.", href: "/admin/politicas-de-privacidad", icon: FileText },
    { name: "SEO / Metadatos", href: "/admin/seo", icon: Search },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
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
        <div className="w-64 bg-slate-900 text-slate-400 flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <h1 className="text-white text-xl font-black tracking-tighter">
                    DL <span className="text-blue-500">ADMIN</span>
                </h1>
            </div>

            <nav className="flex-grow px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-lg transition-all group",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight size={16} />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={handleLogout}
                    disabled={isPending}
                    className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                    <LogOut size={20} />
                    {isPending ? "Saliendo..." : "Cerrar Sesión"}
                </button>
            </div>
        </div>
    );
}
