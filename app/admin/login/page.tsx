import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/auth/cookies";

export const metadata: Metadata = {
  title: "Connexion admin"
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-dentova-navy shadow-lg">
            <Image
              alt="Dentova"
              className="h-7 w-auto invert"
              height={28}
              src="/brand/logo.svg"
              width={98}
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Dentova Console</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Connectez-vous pour gérer votre activité
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Suspense fallback={null}>
            <AdminLoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link className="transition hover:text-slate-600" href="/">
            ← Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
