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
  courseType: "formation" | "cycle";
  cycleDates: string[];
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
  youtubeUrl?: string;
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

export type Sponsor = {
  id: string;
  name: string;
  imageUrl: string;
  imagePublicId?: string;
  websiteUrl?: string;
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

export type Mentor = {
  id: string;
  name: string;
  title: string;
  bio?: string;
  specialty?: string;
  imageUrl: string;
  imagePublicId?: string;
  order: number;
  active: boolean;
  showOnHomepage: boolean;
};

export type FAQItem = {
  question: string;
  answer: string;
  category?: string;
};

export type BlogPost = {
  id: string;
  caption: string;
  content: string;
  imageUrl: string;
  imagePublicId?: string;
  slug: string;
  published: boolean;
  likes: string[];
  createdAt: string;
  updatedAt: string;
};

export type PixelPlatform = "meta" | "tiktok";

export type Pixel = {
  id: string;
  platform: PixelPlatform;
  pixelId: string;
  label?: string;
  active: boolean;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type MarketerStats = {
  courses: number;
  publishedCourses: number;
  reservations: number;
  reservationsThisMonth: number;
  reservationsLastMonth: number;
  confirmedReservations: number;
  pendingReservations: number;
  signups: number;
  signupsThisMonth: number;
  subscribers: number;
  subscribersThisMonth: number;
  messages: number;
  newMessages: number;
  pendingFeedback: number;
  topCoursesByReservations: {
    courseId: string;
    title: string;
    count: number;
    imageUrl: string;
    date: string;
  }[];
  reservationsByMonth: {
    month: string;
    count: number;
  }[];
};
