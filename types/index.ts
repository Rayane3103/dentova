export type CourseStatus = {
  featured: boolean;
  showOnHomepage: boolean;
  published: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
};

export type Course = CourseStatus & {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  excerpt: string;
  category: Category;
  instructor: string;
  date: string;
  time?: string;
  location: string;
  price: number;
  contactPhone: string;
  contactEmail: string;
  imageUrl: string;
  imagePublicId?: string;
  maxSeats?: number;
};

export type WorkshopImage = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imagePublicId?: string;
  order: number;
  active: boolean;
};

export type Testimonial = {
  id: string;
  fullName: string;
  role: string;
  message: string;
  rating: number;
};

export type FAQItem = {
  question: string;
  answer: string;
  category?: string;
};
