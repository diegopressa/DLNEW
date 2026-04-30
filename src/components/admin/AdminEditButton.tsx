"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export default function AdminEditButton({
    href,
    label = "Editar",
}: {
    href: string;
    label?: string;
}) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/check-session", { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => {
                if (!cancelled) setIsAdmin(!!d.isAdmin);
            })
            .catch(() => {
                if (!cancelled) setIsAdmin(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!isAdmin) return null;

    return (
        <Link
            href={href}
            className="fixed bottom-6 left-6 z-50 bg-amber-400 text-slate-900 px-5 py-3 rounded-full shadow-2xl hover:bg-amber-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-bold text-sm border-2 border-amber-500"
            title="Modo admin: editar esta sección"
        >
            <Pencil className="w-4 h-4" />
            {label}
        </Link>
    );
}
