export const siteConfig = {
  name: "Dentova",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "dentovaevents@gmail.com",
  phone: "0540153806",
  location: "Alger, Algerie"
};

export const navItems = [
  { href: "/#hero", label: "Accueil", id: "home" },
  { href: "/#about", label: "Qui sommes-nous ?", id: "about" },
  { href: "/#courses", label: "Nos Formations", id: "courses" },
  { href: "/blog", label: "Blog", id: "blog" },
  { href: "/#faq", label: "FAQ", id: "faq" },
  { href: "/#feedback", label: "Votre avis", id: "feedback" },
  { href: "/#contact", label: "Contact", id: "contact" }
];

export const includedBenefits = [
  "Certificat de participation",
  "Materiel de formation pratique",
  "Session de questions-reponses avec l'expert",
  "Opportunites de reseautage",
  "Rafraichissements offerts"
];
