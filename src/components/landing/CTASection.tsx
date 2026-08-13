import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { getGlobalSettings } from "@/actions/settingsActions";
import { getCtaSection } from "@/actions/homeActions";

// Cierre en banda azul de marca (nada de bloque negro).
export default async function CTASection() {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59897534866";
    const ctaData = await getCtaSection();

    // Cualquier link de WhatsApp guardado en la BD se reescribe al estándar
    const rawLink = ctaData?.buttonLink || "#";
    const isWhatsAppLink =
        rawLink === "#whatsapp" ||
        rawLink === "#" ||
        rawLink.includes("wa.me") ||
        rawLink.includes("api.whatsapp.com");
    const buttonLink = isWhatsAppLink
        ? `https://api.whatsapp.com/send/?phone=${whatsapp}&text=Hola%2C+quiero+consultar+por+uniformes+para+mi+empresa.&type=phone_number&app_absent=0`
        : rawLink;

    return (
        <section className="bg-primary text-white">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-wrap items-center justify-between gap-7">
                <div>
                    <h2 className="font-display uppercase text-4xl sm:text-5xl text-white">
                        {ctaData?.title || "¿Uniformamos a tu equipo?"}
                    </h2>
                    {ctaData?.subtitle && (
                        <p className="mt-2 text-white/90 font-medium max-w-[46ch]">{ctaData.subtitle}</p>
                    )}
                    {ctaData?.smallText && (
                        <p className="mt-3 text-sm text-white/75 font-semibold uppercase tracking-wide">{ctaData.smallText}</p>
                    )}
                </div>
                <Link
                    href={buttonLink}
                    target={buttonLink.startsWith("#") ? undefined : "_blank"}
                    className="bg-grafito text-white px-7 py-4 rounded-md font-bold uppercase tracking-wide text-sm hover:bg-black transition-colors flex items-center gap-2.5"
                >
                    <MessageCircle className="w-5 h-5" />
                    {ctaData?.buttonText || "Pedir presupuesto por WhatsApp"}
                </Link>
            </div>
        </section>
    );
}
