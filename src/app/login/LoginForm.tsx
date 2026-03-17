"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "./actions";
import { LogIn, Lock, User, AlertCircle } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group disabled:opacity-50"
        >
            {pending ? "Iniciando sesión..." : "Acceder al Panel"}
            {!pending && <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
        </button>
    );
}

export default function LoginForm() {
    const [state, formAction] = useFormState(loginAction, undefined);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-10 space-y-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                        DL <span className="text-blue-600">ADMIN</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Ingresá para gestionar el sitio</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                name="username"
                                type="text"
                                placeholder="Usuario"
                                className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                name="password"
                                type="password"
                                placeholder="Contraseña"
                                className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle size={18} />
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <p className="text-center text-xs text-slate-400">
                    Uso restringido para personal de DL Diseño & Estampado.
                </p>
            </div>
        </div>
    );
}
