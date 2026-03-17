import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Bienvenido al Panel de Control</h1>
                <p className="text-slate-500 mt-2">Gestioná el contenido de DL Diseño & Estampado de forma simple.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Trabajos en Galería", value: "24", color: "border-blue-500" },
                    { label: "Categorías Activas", value: "6", color: "border-green-500" },
                    { label: "Visitas este mes", value: "1.2k", color: "border-purple-500" },
                ].map((stat) => (
                    <div key={stat.label} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${stat.color}`}>
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="text-4xl font-black text-slate-900 mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600">Actualizar Hero</p>
                        <p className="text-xs text-slate-500">Cambiar título o imagen principal</p>
                    </button>
                    <Link href="/admin/articulos" className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600">Administrar Artículos</p>
                        <p className="text-xs text-slate-500">Crear, editar o eliminar productos</p>
                    </Link>
                    <button className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600">Subir nuevo trabajo</p>
                        <p className="text-xs text-slate-500">Agregar foto a la galería</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
