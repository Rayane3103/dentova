import type { Metadata } from "next";
import { SignupForm } from "@/components/forms/SignupForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Inscription"
};

export default function SignupPage() {
  return (
    <main className="bg-gradient-to-b from-dentova-navy-50 to-white px-6 py-20">
      <Container className="max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-dentova-teal-700">
            Rejoindre Dentova
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-dentova-navy-900">
            Inscription aux formations
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-dentova-navy-600">
            Laissez-nous vos coordonnees et l&apos;equipe Dentova vous contactera
            pour confirmer votre place et repondre a vos questions.
          </p>
        </div>
        <div className="rounded-3xl border border-dentova-navy-100 bg-white p-8 shadow-card">
          <SignupForm />
        </div>
      </Container>
    </main>
  );
}
