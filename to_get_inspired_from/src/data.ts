/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, FAQItem, Testimonial, ParticipantOpinion } from './types';

export const COURSES: Course[] = [
  {
    id: 'implant-101',
    title: 'Masterclass en Implantologie Clinique Fondamentale',
    category: 'implantology',
    categoryLabel: 'Implantologie',
    duration: '3 Jours Intensifs',
    location: 'Alger',
    speaker: 'Dr. Sofia Bensaïd',
    speakerTitle: "Chirurgien Implantologue, Experte UA, Conférencière Internationale",
    speakerAvatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop",
    description: "Une formation théorique et technique complète conçue pour maîtriser les bases fondamentales de la chirurgie implantaire guidée, de l'incision chirurgicale à la restauration prothétique finale.",
    syllabus: [
      "Principes fondamentaux de l'ostéointégration et biocompatibilité implantaire.",
      "Analyse radiologique 3D avancée (Cone Beam / CBCT).",
      "Planification virtuelle et conception de guides chirurgicaux.",
      "Incision clinique et techniques de suture avancées.",
      "Chirurgie en direct (Live Op) commentée en temps réel par le formateur.",
      "Atelier de travaux pratiques (TP) guidés individuels sur mâchoires animales."
    ],
    features: [
      "Matériels et implants de chirurgie premium fournis lors des ateliers.",
      "6 ateliers pratiques individuels dirigés.",
      "Support clinique complet en format PDF + accès vidéo exclusif.",
      "Accompagnement post-formation personnalisé sur vos premiers cas pendant 6 mois."
    ],
    upcomingDate: '25 - 27 Juin 2026',
    seatsLeft: 3,
    maxSeats: 12,
    handsOn: true,
    price: 'Sur Demande (Possibilité de paiement échelonné)'
  },
  {
    id: 'endo-202',
    title: 'Endodontie Moderne & Traitement Holistique des Canaux Courbes',
    category: 'endodontics',
    categoryLabel: 'Endodontie',
    duration: '2 Jours de Pratique',
    location: 'Oran',
    speaker: 'Prof. Salim Khelil',
    speakerTitle: "Docteur en Sciences Médicales Dentaires, Spécialiste Endodontiste",
    speakerAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop",
    description: "Améliorez votre efficience au cabinet. Maîtrisez l'anatomie canalaire complexe, la mise en forme rotative réciproque, l'irrigation dynamique activée et l'obturation thermoplastique.",
    syllabus: [
      "La cavité d'accès parfaite : minimiser la perte tissulaire.",
      "Instrumentation canalaire mécanique : rotation continue vs mouvement réciproque.",
      "Protocoles d'irrigation activée et désinfection chimique en profondeur.",
      "Obturation tridimensionnelle à la gutta-percha thermocompactée (méthodes directes).",
      "Ateliers pratiques intensifs sur blocs de résine transparents et dents extraites."
    ],
    features: [
      "Moteurs d'endodontie ultra-modernes et trousse de limes offerts.",
      "Démonstration détaillée au microscope clinique opératoire.",
      "Validation de cas clinique théorique et pratique par évaluation interactive."
    ],
    upcomingDate: '09 - 10 Juillet 2026',
    seatsLeft: 5,
    maxSeats: 16,
    handsOn: true,
    price: 'Sur Demande'
  },
  {
    id: 'aesthetic-303',
    title: 'Facettes Céramiques & Restaurations Esthétiques Antérieures',
    category: 'aesthetics',
    categoryLabel: 'Esthétique',
    duration: '3 Jours d’Élite',
    location: 'Alger',
    speaker: 'Dr. Amine Zerrouki',
    speakerTitle: "Dentiste Cosmétique, Membre de l'European Academy of Esthetic Dentistry",
    speakerAvatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=150&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop",
    description: "Affinez votre œil artistique et votre habileté manuelle. Apprenez l'analyse esthétique globale (Smile Design), la micro-préparation guidée ultra-conservatrice et la chimie du collage adhésif.",
    syllabus: [
      "Digital Smile Design (DSD) et planification esthétique assistée.",
      "Préparations de facettes minimales voire no-prep (mock-up guidé de précision).",
      "Techniques avancées de prise d'empreinte physique et scanner intra-oral.",
      "Protocoles scientifiques de collage adhésif étape par étape.",
      "Travaux pratiques intensifs d'isolation par la digue et collage individuel."
    ],
    features: [
      "Kit de fraises rotatives micro-préparation Dentova offert aux participants.",
      "Atelier de cas d'isolation complets en conditions réelles de cabinet.",
      "Livret clinique d'essais cliniques comparatifs des matériaux d'adhésion."
    ],
    upcomingDate: '22 - 24 Juillet 2026',
    seatsLeft: 2,
    maxSeats: 10,
    handsOn: true,
    price: 'Sur Demande (Comprend repas & matériels de prothèse)'
  },
  {
    id: 'ortho-404',
    title: 'Intégration Théorique & Clinique des Aligneurs Transparentes',
    category: 'orthodontics',
    categoryLabel: 'Orthodontie',
    duration: '2 Jours de Cursus',
    location: 'Constantine',
    speaker: 'Dr. Fairouz Menad',
    speakerTitle: "Chirurgien Dentiste Spécialiste ODF, Référente Aligneurs en Afrique du Nord",
    speakerAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop",
    description: "Sachez diagnostiquer et soigner en toute sécurité vos premiers cas d'orthodontie invisible avec aligneurs : sélection des cas cliniques et modélisation logicielle 3D.",
    syllabus: [
      "Critères fondamentaux d'indication et limites des aligneurs.",
      "Analyse céphalométrique moderne orientée omnipratique clinique.",
      "Protocole photographique de soumission de cas précis.",
      "Lecture critique du plan de traitement virtuel (CleanCheck/ClinCheck).",
      "Mise en place pratique d'attachements de composite, de stripping et auxiliaires."
    ],
    features: [
      "Prise en main de scanners optiques intra-oraux de dernière génération.",
      "Mise à disposition d'une licence d'essai de logiciel d'analyse orthodontique.",
      "Certificat d'accréditation clinique officielle."
    ],
    upcomingDate: '04 - 05 Septembre 2026',
    seatsLeft: 7,
    maxSeats: 15,
    handsOn: true,
    price: 'Sur Demande'
  },
  {
    id: 'digital-505',
    title: 'Dentisterie Numérique & Prise en Main du Flux CAD/CAM',
    category: 'digital',
    categoryLabel: 'Dentisterie Numérique',
    duration: '2 Jours de Laboratoire',
    location: 'Alger',
    speaker: 'Dr. Yanis Belhadj',
    speakerTitle: "Directeur de Laboratoire Numérique, Expert en Implantologie Guidée 3D",
    speakerAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop",
    description: "Apprenez le flux numérique intégré Chairside au cabinet dentaire: de la caméra intra-orale à l'impression 3D en cabinet de vos guides chirurgicaux et modèles provisoires.",
    syllabus: [
      "Initiation pratique aux caméras optiques intra-orales (techniques de scan rapide).",
      "Import des fichiers STL et conception CAO de restaurations esthétiques simples.",
      "Technologie de l'impression 3D appliquée au cabinet (matériaux, réglages et résines).",
      "Planification et impression de guides chirurgicaux d'implantologie en direct.",
      "Usinage en direct (fraisage de blocs céramique) et post-traitement de maquillage."
    ],
    features: [
      "Atelier d'impression 3D personnel avec résines biomédicales.",
      "Poste informatique individuel équipé d'un logiciel de CAO de pointe.",
      "Accès aux dernières caméras intra-orales du marché."
    ],
    upcomingDate: '18 - 19 Septembre 2026',
    seatsLeft: 4,
    maxSeats: 12,
    handsOn: true,
    price: 'Sur Demande'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Sarah Medjadji',
    title: 'Chirurgien-Dentiste, Cabinet Privé à Alger',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150&auto=format&fit=crop&q=80',
    text: "La formation en implantologie de Dentova a radicalement changé ma vision de la pratique quotidienne. L'approche ultra-pratique sur mâchoires animales m'a donné l'assurance nécessaire pour poser mes premiers implants en cabinet dès la semaine suivante. Un suivi exceptionnel !",
    rating: 5,
    courseCategory: 'Implantologie',
    date: 'Mai 2026'
  },
  {
    id: 'test-2',
    name: 'Dr. Adel Benboulaïd',
    title: 'Chirurgien-Dentiste Omnipraticien à Constantine',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    text: "Le professeur Salim Khelil est d'une générosité scientifique fantastique. Plus qu'une démonstration d'endodontie, la formation nous apprend à gérer méthodiquement les canaux courbes complexes sans stress. Organisation soignée, matériel au top.",
    rating: 5,
    courseCategory: 'Endodontie',
    date: 'Avril 2026'
  },
  {
    id: 'test-3',
    name: 'Dr. Meriem Cherif',
    title: 'Chirurgien-Dentiste Esthétique à Oran',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    text: "J'ai assisté à la formation sur les facettes en céramique à Alger. Dentova a réussi le pari de la rigueur professionnelle combinée à un cadre d'apprentissage luxueux et extrêmement stimulant. Je recommande absolument !",
    rating: 5,
    courseCategory: 'Esthétique',
    date: 'Mars 2026'
  }
];

export const INITIAL_OPINIONS: ParticipantOpinion[] = [
  {
    id: 'op-1',
    name: 'Dr. Lotfi Amrani',
    role: 'Dentiste Généraliste (Setif)',
    ratingImprovement: 5,
    ratingSecurity: 5,
    ratingResponse: 5,
    comment: "Excellent niveau de formation. Amélioration indiscutable de ma pratique clinique !",
    date: '02 Juin 2026'
  },
  {
    id: 'op-2',
    name: 'Dr. Yasmina Belkacem',
    role: 'Résidente en ODF (Alger)',
    ratingImprovement: 5,
    ratingSecurity: 5,
    ratingResponse: 4,
    comment: "Équipe organisatrice très professionnelle et à l'écoute. Les démonstrations pratiques en direct sont un vrai plus.",
    date: '28 Mai 2026'
  },
  {
    id: 'op-3',
    name: 'Dr. Ryad Haddad',
    role: 'Chirurgien Bucal (Tizi Ouzou)',
    ratingImprovement: 4,
    ratingSecurity: 5,
    ratingResponse: 5,
    comment: "Confidentialité totale respectée lors de notre inscription et réactivité exceptionnelle des coordinateurs.",
    date: '15 Mai 2026'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Qui peut participer aux événements et formations de Dentova ?',
    answer: "Nos formations s'adressent à l'ensemble de la communauté bucco-dentaire en Algérie : chirurgiens-dentistes praticiens (omnipraticiens en cabinet libéral ou public), chirurgiens-dentistes spécialistes (orthodontistes, parodontologues, implantologues, etc.), résidents universitaires, étudiants de fin de cycle clinique (5ème et 6ème année) ainsi que les prothésistes dentaires selon le programme abordé.",
    category: 'Général'
  },
  {
    id: 'faq-2',
    question: 'En quoi consiste le volet pratique (Hands-on) de vos programmes ?',
    answer: "Chez Dentova, nous sommes convaincus que l'excellence clinique passe par le geste. L'essentiel du temps de nos formations est consacré à des ateliers de travaux pratiques guidés (TP). Selon le thème, les chirurgiens-dentistes travaillent sur des simulateurs anatomiques avancés, des fantômes (typodontes), des microscopes optiques ou encore des mâchoires d'entraînement d'origine animale, sous le contrôle direct du formateur expert.",
    category: 'Formations'
  },
  {
    id: 'faq-3',
    question: 'Est-ce que je serai certifié à la suite de la formation ?',
    answer: "Absolument. Chaque participant ayant validé l'intégralité du cursus théorique et pratique se voit remettre une attestation officielle de formation certifiée de haut niveau. Cette attestation est co-validée de façon prestigieuse par Dentova Events, le formateur conférencier et, le cas échéant, nos partenaires universitaires académiques internationaux.",
    category: 'Certification'
  },
  {
    id: 'faq-4',
    question: 'Comment s\'organisent les sessions de paiement et d\'inscription ?',
    answer: "Pour vous inscrire, il suffit de remplir notre formulaire de demande en ligne en choisissant votre thème d'intérêt et votre ville de préférence (Alger, Oran ou Constantine). Un délégué Dentova vous recontacte alors sous 24h par téléphone pour valider votre place. Pour le paiement, nous acceptons les virements bancaires, les versements CCP ou l'acompte direct, avec possibilité d'aménagement de paiement échelonné sans frais.",
    category: 'Paiement & Inscriptions'
  },
  {
    id: 'faq-5',
    question: 'Quels services logistiques sont inclus dans vos événements ?',
    answer: "Toutes nos formations en présentiel se tiennent dans des cadres luxueux et spacieux propices à l'étude (Hôtels 5 étoiles ou structures prévues à cet effet). L'inscription comprend systématiquement : l'accès aux séminaires théoriques, tout le matériel de TP individuel clinique, les pauses café gastronomiques, les déjeuners buffet complets ainsi que la documentation scientifique complémentaire en version numérique.",
    category: 'Général'
  },
  {
    id: 'faq-6',
    question: 'Assurez-vous un suivi post-formation des cas cliniques vécus ?',
    answer: "Oui, c'est l'une des forces majeures de Dentova Events. Pour chaque cohorte de formation clinique (notamment en Implantologie et Orthodontie), un groupe de suivi fermé (via WhatsApp ou plateforme sécurisée) est créé avec le formateur. Les participants peuvent y soumettre leurs propres premiers cas cliniques vécus en cabinet, poser des questions sur des radiographies ou demander conseil pour un plan de traitement pendant 6 mois.",
    category: 'Formations'
  }
];
