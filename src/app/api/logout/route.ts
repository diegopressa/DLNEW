import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// Solo POST: un logout por GET permitía desloguear al admin con un simple
// link/imagen maliciosa (CSRF). El botón del sidebar usa la server action.
export async function POST(request: NextRequest) {
    await logout();
    redirect("/login");
}
