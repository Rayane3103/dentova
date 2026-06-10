import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { adminCardClassName } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/Card";
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
    <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-[linear-gradient(180deg,#f7f8fc_0%,#eef1f8_100%)] px-4 py-10">
      <Card className={`${adminCardClassName} w-full max-w-sm p-6`}>
        <Image
          alt="Dentova"
          className="mx-auto h-auto w-32"
          height={53}
          src="/brand/logo.svg"
          width={130}
        />
        <h1 className="mt-6 text-center text-xl font-bold text-dentova-navy">
          Connexion admin
        </h1>
        <p className="mt-1.5 text-center text-sm text-dentova-muted">
          Connectez-vous pour gerer les formations Dentova.
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </Card>
    </main>
  );
}
