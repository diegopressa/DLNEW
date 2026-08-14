import Link from "next/link";
import prisma from "@/lib/prisma";
import { Mail, Package, Pause, AlertTriangle, ImageIcon, Briefcase, ArrowRight } from "lucide-react";

async function getStats() {
    try {
        const [mensajesSinLeer, activos, borradores, trabajos, categorias, categoriasOcultas, productosConFotos] = await Promise.all([
            prisma.contactSubmission.count({ where: { read: false } }),
            prisma.product.count({ where: { isActive: true } }),
            prisma.product.count({ where: { isActive: false } }),
            prisma.project.count(),
            prisma.productCategory.count(),
            (prisma as any).productCategory.count({ where: { isVisible: false } }),
            prisma.product.findMany({
                where: { isActive: true },
                select: { id: true, _count: { select: { images: true } } },
            }),
        ]);
        const faltanFotos = productosConFotos.filter((p) => p._count.images <= 1).length;
        return { mensajesSinLeer, activos, borradores, trabajos, categorias, categoriasOcultas, faltanFotos };
    } catch {
        return { mensajesSinLeer: 0, activos: 0, borradores: 0, trabajos: 0, categorias: 0, categoriasOcultas: 0, faltanFotos: 0 };
    }
}

export default async function AdminDashboard() {
    const s = await getStats();

    const tarjetas = [
        {
            label: "Mensajes sin leer",
            value: s.mensajesSinLeer,
            icon: Mail,
            href: "/admin/mensajes",
            urgente: s.mensajesSinLeer > 0,
            detalle: s.mensajesSinLeer > 0 ? "¡Hay consultas esperando respuesta!" : "Todo respondido",
        },
        {
            label: "Artículos activos",
            value: s.activos,
            icon: Package,
            href: "/admin/articulos",
            detalle: "visibles en la web",
        },
        {
            label: "En borrador / pausados",
            value: s.borradores,
            icon: Pause,
            href: "/admin/articulos",
            detalle: "invisibles al público — revisar y activar",
        },
        {
            label: "Artículos con pocas fotos",
            value: s.faltanFotos,
            icon: ImageIcon,
            href: "/admin/articulos",
            alerta: s.faltanFotos > 0,
            detalle: "activos con 1 sola foto",
        },
        {
            label: "Trabajos en galería",
            value: s.trabajos,
            icon: ImageIcon,
            href: "/admin/trabajos",
            detalle: "casos publicados",
        },
        {
            label: "Categorías",
            value: s.categorias,
            icon: Briefcase,
            href: "/admin/categorias",
            detalle: s.categoriasOcultas > 0 ? `${s.categoriasOcultas} ocultas hasta el lanzamiento` : "todas visibles",
        },
    ];

    const acciones = [
        { titulo: "Nuevo artículo", detalle: "Agregar una prenda al catálogo", href: "/admin/articulos" },
        { titulo: "Subir un trabajo", detalle: "Foto nueva para la galería", href: "/admin/trabajos" },
        { titulo: "Editar la portada", detalle: "Título, fotos y textos de la home", href: "/admin/home" },
        { titulo: "Datos de contacto", detalle: "WhatsApp, dirección, horarios, logo", href: "/admin/settings" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Panel de control</h1>
                <p className="text-slate-500 mt-1">Todo el contenido de la web se gestiona desde acá.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tarjetas.map((t) => (
                    <Link
                        key={t.label}
                        href={t.href}
                        className={`bg-white p-5 rounded-2xl border transition-all hover:shadow-md group ${
                            t.urgente ? "border-[#0081D1] ring-2 ring-[#0081D1]/20" : t.alerta ? "border-amber-300" : "border-slate-100"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className={`w-9 h-9 rounded-lg grid place-items-center ${t.urgente ? "bg-[#0081D1] text-white" : "bg-slate-100 text-slate-500"}`}>
                                <t.icon size={17} />
                            </span>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-[#0081D1] transition-colors" />
                        </div>
                        <p className="text-3xl font-black text-slate-900 leading-none">{t.value}</p>
                        <p className="text-sm font-bold text-slate-700 mt-1.5">{t.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.detalle}</p>
                    </Link>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
                <h2 className="text-lg font-bold mb-4 text-slate-900">Acciones rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {acciones.map((a) => (
                        <Link
                            key={a.titulo}
                            href={a.href}
                            className="p-4 border border-slate-100 rounded-xl hover:border-[#0081D1]/40 hover:bg-slate-50 transition-all group"
                        >
                            <p className="font-bold text-slate-900 group-hover:text-[#0081D1] transition-colors">{a.titulo}</p>
                            <p className="text-xs text-slate-500">{a.detalle}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
