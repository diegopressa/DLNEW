"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, X, Package, ArrowRight } from "lucide-react";
import { searchProducts } from "@/actions/productActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FeaturedProductSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            const res = await searchProducts(query);
            setResults(res || []);
            setLoading(false);
            setIsOpen(true);
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="relative w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative group">
                <div 
                    className="absolute inset-y-0 left-4 flex items-center cursor-pointer"
                    onClick={() => query.trim() && router.push(`/buscar?q=${encodeURIComponent(query)}`)}
                >
                    <Search className={`w-5 h-5 transition-colors ${query ? "text-primary hover:scale-110" : "text-slate-400"}`} />
                </div>
                <input
                    type="text"
                    placeholder="¿Qué prenda estás buscando?"
                    className="w-full bg-white border-2 border-slate-100 rounded-full py-3.5 pl-12 pr-10 text-base font-medium text-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-400 group-hover:border-slate-200"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <button 
                        type="button"
                        onClick={() => { setQuery(""); setIsOpen(false); }}
                        className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
                    </button>
                )}
            </form>

            {/* Results Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <span className="text-[12px] font-black uppercase tracking-widest text-slate-400">Resultados encontrados</span>
                            <span className="text-[12px] font-bold text-primary">{results.length} prendas</span>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/categorias/lista-${product.category?.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}/${product.slug}`}
                                        className="flex gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 transition-all group border border-slate-50 hover:border-primary/20"
                                    >
                                        <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                            {product.images[0] ? (
                                                <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                                            <h4 className="text-lg font-black text-slate-900 truncate group-hover:text-primary transition-colors mb-1">
                                                {product.name}
                                            </h4>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <Package className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">No encontramos nada</h3>
                                <p className="text-slate-500">Probá con palabras más generales o revisá las categorías abajo.</p>
                            </div>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                            <p className="text-sm text-slate-400 font-medium">
                                ¿No encontrás lo que buscás? <Link href="/contacto" className="text-primary font-black hover:underline">Escribinos por WhatsApp</Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
