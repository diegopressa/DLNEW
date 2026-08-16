import { redirect } from "next/navigation";

// El login real vive en /login; esta ruta existe solo para que /admin/login
// (la dirección que uno intuye) no dé 404.
export default function AdminLoginRedirect() {
    redirect("/login");
}
