import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Cookies"
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politique de cookies"
      paragraphs={[
        "Le site peut utiliser des cookies techniques pour maintenir les sessions admin et mesurer la stabilite du service.",
        "Les cookies strictement necessaires permettent au tableau de bord admin de fonctionner correctement.",
        "Les outils d'analyse ou de marketing, s'ils sont ajoutes plus tard, devront etre documentes dans cette page."
      ]}
    />
  );
}
