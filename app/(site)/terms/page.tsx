import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Conditions"
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions d'utilisation"
      paragraphs={[
        "Les contenus du site Dentova presentent les formations disponibles, leurs informations pratiques et les modalites de reservation.",
        "Une demande de reservation ne garantit la place qu'apres confirmation par l'equipe Dentova.",
        "Dentova peut mettre a jour les programmes, dates ou conditions lorsque l'organisation de l'evenement le demande."
      ]}
    />
  );
}
