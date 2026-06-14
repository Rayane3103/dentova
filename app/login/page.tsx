import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { UnifiedLoginForm } from "@/components/auth/UnifiedLoginForm";
import { getAdminSession, getMarketerSession } from "@/lib/auth/cookies";

export const metadata: Metadata = {
  title: "Connexion"
};

export default async function LoginPage() {
  // If already authenticated as either role, redirect accordingly
  const [adminSession, marketerSession] = await Promise.all([
    getAdminSession(),
    getMarketerSession()
  ]);

  if (adminSession) {
    redirect("/admin");
  }

  if (marketerSession) {
    redirect("/marketer");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-dentova-ice px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-dentova-gradient shadow-xl">
            <Image
              alt="Dentova"
              className="h-8 w-auto invert"
              height={32}
              src="/brand/logo.svg"
              width={112}
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Dentova
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Connectez-vous pour accéder à la console d&apos;administration
            ou au tableau de bord marketing.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <Suspense fallback={null}>
            <UnifiedLoginForm />
          </Suspense>
        </div>

        {/* Footer links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <Link
            className="transition hover:text-slate-600"
            href="/"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
