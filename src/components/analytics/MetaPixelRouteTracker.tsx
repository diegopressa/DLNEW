"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Dispara `fbq('track','PageView')` en cada navegación SPA del App Router.
// El primer PageView lo dispara el snippet base del pixel; este componente
// cubre los cambios de ruta posteriores que ese snippet no captura.
export default function MetaPixelRouteTracker() {
    const pathname = usePathname();
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const fbq = (window as any).fbq;
        if (typeof fbq === "function") {
            fbq("track", "PageView");
        }
    }, [pathname]);

    return null;
}
