import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { getGlobalSettings } from "@/actions/settingsActions";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getGlobalSettings();
    const whatsapp = settings?.whatsapp || "59899000000";

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar whatsapp={whatsapp} />
            <main className="flex-grow">{children}</main>
            <Footer settings={settings} />
            <FloatingWhatsApp whatsapp={whatsapp} />
        </div>
    );
}
