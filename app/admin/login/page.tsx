import type { Metadata } from "next";
import Image from "next/image";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Connexion admin"
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-dentova-ice px-5 py-12">
      <Card className="w-full max-w-md p-8">
        <Image
          alt="Dentova"
          className="mx-auto h-auto w-40"
          height={66}
          src="/brand/logo.svg"
          width={162}
        />
        <h1 className="mt-8 text-center text-4xl font-extrabold text-dentova-navy">
          Admin Login
        </h1>
        <p className="mt-2 text-center text-lg text-dentova-ink/60">
          Connectez-vous pour gerer les formations Dentova.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </Card>
    </main>
  );
}
