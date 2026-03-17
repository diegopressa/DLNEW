import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { getGlobalSettings } from "@/actions/settingsActions";
import { getCtaSection } from "@/actions/homeActions";

export default async function CTASection() {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59899000000";
    const ctaData = await getCtaSection();

    // Determine target based on what buttonLink contains
    const rawLink = ctaData?.buttonLink || "#";
    const buttonLink = rawLink.startsWith('#') 
        ? rawLink 
        : (rawLink.includes('wa.me') || rawLink === '#whatsapp') 
            ? `https://wa.me/${whatsapp}` 
            : rawLink;

    return (
        <section className="py-24 bg-slate-50">
            <div className="section-container">
                <div 
                    className="rounded-[3rem] p-8 md:p-16 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl"
                    style={{ backgroundColor: ctaData.backgroundColor || "#1f2937" }}
                >
                    {/* Subtle glow effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            {ctaData.title}
                        </h2>
                        {ctaData.subtitle && (
                            <p className="text-white/80 text-lg md:text-xl">
                                {ctaData.subtitle}
                            </p>
                        )}
                        
                        <div className="pt-8 flex flex-col items-center">
                            <Link
                                href={buttonLink}
                                target={buttonLink.startsWith('#') ? undefined : "_blank"}
                                className="bg-white text-slate-900 px-10 py-5 rounded-2xl text-xl font-black hover:scale-105 transition-all shadow-xl flex items-center gap-4 group"
                            >
                                <div className="text-white p-2 rounded-lg" style={{ backgroundColor: ctaData.backgroundColor || "#1f2937" }}>
                                    <MessageCircle size={28} fill="currentColor" />
                                </div>
                                {ctaData.buttonText}
                            </Link>
                            
                            {ctaData.smallText && (
                                <p className="mt-6 text-sm text-white/60 font-medium italic">
                                    {ctaData.smallText}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
