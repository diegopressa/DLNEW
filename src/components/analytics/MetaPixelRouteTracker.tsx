"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Único disparador de `fbq('track','PageView')` para el pixel de Meta.
// Cubre la carga inicial y cada navegación del App Router, evitando el doble
// hit que ocurre cuando el snippet base también dispara PageView en SPAs.
export default function MetaPixelRouteTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const fbq = (window as any).fbq;
        if (typeof fbq === "function") {
            fbq("track", "PageView");
        }
    }, [pathname]);

    return null;
}
