"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Package, ArrowRight, Loader2, X } from "lucide-react";
import { searchProducts } from "@/actions/productActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                if (query === "") setIsExpanded(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [query]);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            const res = await searchProducts(query);
            setResults(res || []);
            setLoading(false);
            setIsOpen(true);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="relative" ref={containerRef}>
            <form onSubmit={handleSearch} className={`flex items-center transition-all duration-300 ${isExpanded ? "w-48 sm:w-64 bg-slate-100/80 backdrop-blur-sm rounded-full px-3 sm:px-4 border border-slate-200" : "w-10"}`}>
                <Search 
                    className={`w-5 h-5 cursor-pointer text-slate-500 hover:text-primary transition-colors ${isExpanded ? "mr-2" : ""}`} 
                    onClick={() => {
                        if (isExpanded && query) {
                            router.push(`/buscar?q=${encodeURIComponent(query)}`);
                            setIsOpen(false);
                        } else {
                            setIsExpanded(true);
                            setTimeout(() => inputRef.current?.focus(), 100);
                        }
                    }}
                />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscá..."
                    className={`bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 w-full py-2 transition-all ${isExpanded ? "opacity-100" : "opacity-0 invisible w-0"}`}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsExpanded(true)}
                />
                {isExpanded && query && (
                    <X 
                        className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer ml-2" 
                        onClick={() => { setQuery(""); setResults([]); }}
                    />
                )}
            </form>

            {/* Results Dropdown */}
            {isOpen && (query.trim() || loading) && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 max-h-[400px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-3 px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resultados</span>
                            {loading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                        </div>

                        {results.length > 0 ? (
                            <div className="space-y-2">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/categorias/lista-${product.category?.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}/${product.slug}`}
                                        className="flex gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                                    >
                                        <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                            {product.images[0] ? (
                                                <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Package size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="text-sm font-black text-slate-900 truncate leading-tight group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h4>
                                        </div>
                                        <div className="flex items-center pr-1">
                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                        </div>
                                    </Link>
                                ))}
                                <Link 
                                    href="/categorias"
                                    className="block text-center py-2 text-xs font-bold text-primary hover:underline mt-2 bg-primary/5 rounded-xl border border-primary/10"
                                >
                                    Ver todas las categorías
                                </Link>
                            </div>
                        ) : !loading && query.trim() !== "" ? (
                            <div className="py-6 text-center text-slate-400">
                                <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">No hay prendas que coincidan</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
