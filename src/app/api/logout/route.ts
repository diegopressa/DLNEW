import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await logout();
    redirect("/login");
}

export async function POST(request: NextRequest) {
    await logout();
    redirect("/login");
}
