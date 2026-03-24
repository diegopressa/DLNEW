import React from "react";
import { getPrivacyPolicy } from "@/actions/privacyActions";
import { buildMetadata } from "@/lib/buildMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata("/politicas-de-privacidad");
}

export default async function PrivacyPolicyPage() {
    const policy = await getPrivacyPolicy();

    if (!policy) return null;

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                            {policy.title}
                        </h1>
                        <div className="w-24 h-2 bg-blue-600 rounded-full" />
                    </div>
                    
                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="text-xl text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                            {policy.content}
                        </p>
                    </div>

                    <div className="pt-12 border-t border-slate-100 text-slate-400 text-sm">
                        <p>Última actualización: {new Date(policy.updatedAt).toLocaleDateString("es-UY")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
