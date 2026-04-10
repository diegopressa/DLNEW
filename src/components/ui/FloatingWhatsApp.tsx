"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FloatingWhatsApp({ whatsapp = "59899000000" }: { whatsapp?: string }) {
    return (
        <Link
            href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`}
            target="_blank"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 active:scale-95 group flex items-center gap-2"
            aria-label="Contactar por WhatsApp"
        >
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
                Pedir Presupuesto
            </span>
            <MessageCircle size={28} fill="currentColor" className="text-white" />
        </Link>
    );
}
