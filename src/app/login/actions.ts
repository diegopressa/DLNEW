"use server";

import { login, logout, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(state: any, formData: FormData) {
    const success = await login(formData);
    if (success) {
        redirect("/admin");
    } else {
        return { error: "Credenciales incorrectas" };
    }
}

export async function logoutAction() {
    await logout();
    redirect("/login");
}

export async function checkSession() {
    return await getSession();
}
