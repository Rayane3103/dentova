import type { Category, Course, FAQItem, Testimonial, WorkshopImage } from "@/types";

export const siteConfig = {
  name: "Dentova",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "dentovaevents@gmail.com",
  phone: "0540153806",
  location: "Alger, Algerie"
};

export const navItems = [
  { href: "/#hero", label: "Accueil", id: "home" },
  { href: "/#why-us", label: "Pourquoi nous ?", id: "why-us" },
  { href: "/#about", label: "Qui sommes-nous ?", id: "about" },
  { href: "/#courses", label: "Nos Formations", id: "courses" },
  { href: "/#faq", label: "FAQ", id: "faq" },
  { href: "/#feedback", label: "Votre avis", id: "feedback" },
  { href: "/#contact", label: "Contact", id: "contact" }
];

export const placeholderCategories: Category[] = [
  {
    id: "cat-endodontics",
    name: "Endodontics",
    slug: "endodontics",
    description: "Formations avancees en endodontie clinique.",
    sortOrder: 1
  },
  {
    id: "cat-orthodontie",
    name: "Orthodontie",
    slug: "orthodontie",
    description: "Cycles pratiques pour traitements orthodontiques.",
    sortOrder: 2
  },
  {
    id: "cat-prosthetics",
    name: "Dental Prosthetics",
    slug: "dental-prosthetics",
    description: "Gestion et prothese dentaire en cabinet.",
    sortOrder: 3
  },
  {
    id: "cat-advanced-prosthodontics",
    name: "Advanced Prosthodontics",
    slug: "advanced-prosthodontics",
    description: "Cas avances, esthetique et restaurations.",
    sortOrder: 4
  }
];

export const placeholderCourses: Course[] = [
  {
    id: "course-ledges",
    title: "Ledge-Broken File-Perforations",
    slug: "ledge-broken-file-perforations",
    subtitle: "Apprenez des meilleurs dans le domaine",
    description:
      "Nous avons le plaisir de vous proposer la formation d'endodontie avancee animee par Dr Waleed Kurdi a Alger. Options d'inscription: acces conference theorique et formation complete avec travaux pratiques.",
    excerpt:
      "Formation d'endodontie avancee animee par Dr Waleed Kurdi a Alger, avec conferences et travaux pratiques.",
    category: placeholderCategories[0],
    instructor: "Dr Waleed Kurdi",
    date: "2026-04-10",
    time: "10:00",
    location: "Alger",
    price: 100000,
    contactPhone: "0540153806",
    contactEmail: "dentovaevents@gmail.com",
    imageUrl: "/images/assets/course-endodontie.webp",
    featured: true,
    showOnHomepage: true,
    published: true,
    maxSeats: 24
  },
  {
    id: "course-orthocycle",
    title: "Dentova OrthoCycle - L'orthodontie repensee",
    slug: "dentova-orthocycle-orthodontie-repensee",
    subtitle: "Specialiste en orthopedie dento-faciale",
    description:
      "Dentova OrthoCycle propose une approche pratique et structuree de l'orthodontie moderne pour les praticiens qui veulent consolider leurs decisions cliniques.",
    excerpt:
      "Cycle pratique en orthodontie moderne avec protocole clinique, diagnostic et accompagnement expert.",
    category: placeholderCategories[1],
    instructor: "Dr Yasmina Akouche",
    date: "2026-05-20",
    time: "09:30",
    location: "Constantine",
    price: 80000,
    contactPhone: "0540153806",
    contactEmail: "dentovaevents@gmail.com",
    imageUrl: "/images/assets/course-orthocycle.webp",
    featured: false,
    showOnHomepage: true,
    published: true,
    maxSeats: 20
  },
  {
    id: "course-management",
    title: "Dental Clinic Management",
    slug: "dental-clinic-management",
    subtitle: "Organisation et performance du cabinet dentaire",
    description:
      "Un programme pour optimiser les espaces de travail, la gestion efficace de l'agenda et la fluidite des soins afin d'ameliorer l'experience patient.",
    excerpt:
      "Organisation strategique du cabinet, optimisation des espaces et gestion efficace de l'agenda.",
    category: placeholderCategories[2],
    instructor: "Dr Samad Khelil",
    date: "2026-06-25",
    time: "10:00",
    location: "Alger",
    price: 50000,
    contactPhone: "0540153806",
    contactEmail: "dentovaevents@gmail.com",
    imageUrl: "/images/assets/course-management.webp",
    featured: false,
    showOnHomepage: true,
    published: true,
    maxSeats: 35
  }
];

export const workshopImages: WorkshopImage[] = [
  {
    id: "gallery-session",
    title: "Blender for dental",
    description: "Moments forts d'une session Dentova avec nos experts.",
    imageUrl: "/images/assets/hero-academy.webp",
    order: 1,
    active: true
  },
  {
    id: "gallery-clinical-screen",
    title: "Demonstration clinique",
    description: "Visualisation detaillee pendant un atelier Dentova.",
    imageUrl: "/images/assets/gallery-clinical-screen.webp",
    order: 2,
    active: true
  },
  {
    id: "gallery-mentoring",
    title: "Mentorat au fauteuil",
    description: "Accompagnement de praticiens pendant la pratique guidee.",
    imageUrl: "/images/assets/gallery-mentoring.webp",
    order: 3,
    active: true
  },
  {
    id: "gallery-practice",
    title: "Gestes pratiques",
    description: "Mise en pratique sur modeles et materiel clinique.",
    imageUrl: "/images/assets/gallery-practice.webp",
    order: 4,
    active: true
  },
  {
    id: "gallery-networking",
    title: "Rencontres professionnelles",
    description: "Moments d'echange entre participants et intervenants.",
    imageUrl: "/images/assets/gallery-networking.webp",
    order: 5,
    active: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "feedback-1",
    fullName: "Dr Amine Benali",
    role: "Chirurgien dentiste",
    rating: 5,
    message:
      "Une formation dense, pratique et parfaitement organisee. Les cas cliniques etaient directement applicables au cabinet."
  },
  {
    id: "feedback-2",
    fullName: "Dr Sarah K.",
    role: "Omnipraticienne",
    rating: 5,
    message:
      "Dentova reunit des experts accessibles et une vraie qualite pedagogique. Je recommande les evenements sans hesitation."
  },
  {
    id: "feedback-3",
    fullName: "Dr Karim Hadj",
    role: "Endodontiste",
    rating: 5,
    message:
      "Le format est professionnel, les supports sont clairs et l'ambiance favorise les echanges entre praticiens."
  }
];

export const faqs: FAQItem[] = [
  {
    question: "Qui peut participer aux evenements et formations de Dentova ?",
    answer:
      "Nos formations s'adressent a l'ensemble de la communaute bucco-dentaire en Algerie : chirurgiens-dentistes praticiens, specialistes, residents universitaires et etudiants de fin de cycle clinique.",
    category: "General"
  },
  {
    question: "En quoi consiste le volet pratique (Hands-on) de vos programmes ?",
    answer:
      "L'essentiel du temps de nos formations est consacre a des ateliers de travaux pratiques guides. Les participants travaillent sur simulateurs anatomiques, fantomes ou mâchoires d'entrainement sous le controle direct du formateur expert.",
    category: "Formations"
  },
  {
    question: "Est-ce que je serai certifie a la suite de la formation ?",
    answer:
      "Chaque participant ayant valide l'integralite du cursus se voit remettre une attestation officielle de formation certifiee, co-validee par Dentova Events et le formateur conférencier.",
    category: "Certification"
  },
  {
    question: "Comment s'organisent les sessions de paiement et d'inscription ?",
    answer:
      "Remplissez notre formulaire en ligne en choisissant votre theme d'interet. Un delegue Dentova vous recontacte sous 24h. Nous acceptons virements bancaires, versements CCP ou acompte direct, avec possibilite de paiement echelonne.",
    category: "Paiement"
  },
  {
    question: "Quels services logistiques sont inclus dans vos evenements ?",
    answer:
      "L'inscription comprend l'acces aux seminaires theoriques, le materiel de TP individuel, les pauses cafe, les dejeuners buffet et la documentation scientifique complementaire.",
    category: "General"
  },
  {
    question: "Assurez-vous un suivi post-formation des cas cliniques ?",
    answer:
      "Pour chaque cohorte de formation clinique, un groupe de suivi ferme est cree avec le formateur. Les participants peuvent y soumettre leurs premiers cas cliniques pendant 6 mois.",
    category: "Formations"
  }
];

export const partners = ["Zumax", "DBA", "Orodent", "B4D", "ODA"];

export const includedBenefits = [
  "Certificat de participation",
  "Materiel de formation pratique",
  "Session de questions-reponses avec l'expert",
  "Opportunites de reseautage",
  "Rafraichissements offerts"
];
