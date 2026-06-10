/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Course {
  id: string;
  title: string;
  category: 'implantology' | 'endodontics' | 'aesthetics' | 'orthodontics' | 'digital';
  categoryLabel: string;
  duration: string;
  location: 'Alger' | 'Oran' | 'Constantine';
  speaker: string;
  speakerTitle: string;
  speakerAvatar?: string;
  imageUrl?: string;
  description: string;
  syllabus: string[];
  features: string[];
  upcomingDate: string;
  seatsLeft: number;
  maxSeats: number;
  handsOn: boolean;
  price?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  text: string;
  rating: number;
  courseCategory: string;
  date: string;
}

export interface ContactInquiry {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseId?: string;
  city: 'Alger' | 'Oran' | 'Constantine';
  message: string;
}

export interface ParticipantOpinion {
  id: string;
  name: string;
  role: string;
  ratingImprovement: number; // Amélioration continue 1-5
  ratingSecurity: number; // Confidentialité totale 1-5
  ratingResponse: number; // Réponse rapide 1-5
  comment: string;
  date: string;
}
