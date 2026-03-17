import AdminSidebar from "@/components/admin/Sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <AdminSidebar />
            <main className="flex-grow p-10 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
