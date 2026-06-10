import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Confidentialite"
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de confidentialite"
      paragraphs={[
        "Dentova collecte uniquement les informations necessaires au traitement des reservations, messages, avis et inscriptions newsletter.",
        "Les donnees sont conservees de maniere securisee et ne sont pas vendues a des tiers.",
        "Vous pouvez demander la correction ou la suppression de vos informations en contactant l'equipe Dentova."
      ]}
    />
  );
}
