# Dentova Rebuild Plan

This is the implementation plan for rebuilding the Dentova events/course platform as a Vercel-ready full-stack Next.js project. It is based on the screenshots in `project-materials/screenshots/` and the brand package in `design_assets/`.

The goal is to reproduce the same functional product and visual language, then improve polish, responsiveness, performance, admin usability, and production readiness.

## 1. Source Materials

Use these local references before coding:

- `project-materials/screenshots/home_hero.png`
- `project-materials/screenshots/about_us.png`
- `project-materials/screenshots/courses.png`
- `project-materials/screenshots/course_page.png`
- `project-materials/screenshots/FAQ.png`
- `project-materials/screenshots/old_feedbacks.png`
- `project-materials/screenshots/give_feedback.png`
- `project-materials/screenshots/contact_us.png`
- `project-materials/screenshots/footer.png`
- `project-materials/screenshots/admin_dashboard.png`
- `project-materials/screenshots/new_course.png`
- `project-materials/screenshots/new_category.png`
- `project-materials/screenshots/new_show_image.png`

Brand assets:

- `design_assets/dentova delivrables/dentova delivrables/SVG/`
- `design_assets/dentova delivrables/dentova delivrables/logomark/`
- `design_assets/dentova delivrables/dentova delivrables/pattern/`
- `design_assets/dentova delivrables/dentova delivrables/Font/`
- `design_assets/dentova delivrables/dentova delivrables/dentova Brand Guideline.pdf`

Observed brand tokens from assets/screenshots:

- Deep navy: `#14123a`
- Deep violet: `#321246` or close
- Purple: `#3b378b`, `#8976c4`
- Magenta CTA: near `#a414ad` / `#9817a0`
- Cyan accent: `#73cbd5` / `#73cbe9`
- Font package: Darker Grotesque
- Style: premium dental education, clean white spacing, violet gradients, cyan highlights, soft shadows, large rounded cards, professional photo/course artwork.

## 2. Target Stack

Build as a full-stack Next.js application optimized for Vercel.

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react
- MongoDB Atlas
- Mongoose or MongoDB driver with cached serverless connection
- Cloudinary for image upload, storage, transformation, and CDN delivery
- Custom admin authentication with bcrypt + signed httpOnly JWT cookie, or Auth.js credentials if preferred
- Zod for validation
- React Hook Form for admin/public forms
- Sonner or react-hot-toast for notifications
- Next/Image with Cloudinary remote patterns

Do not use static export. This app needs API routes, authentication, admin CRUD, uploads, and database writes.

## 3. Project File Structure

Use this structure as the baseline. Keep `project-materials/` and `design_assets/` as reference folders; do not move or delete them.

```text
detnova/
  app/
    layout.tsx
    globals.css
    not-found.tsx
    loading.tsx
    (site)/
      page.tsx
      about/
        page.tsx
      courses/
        page.tsx
        [slug]/
          page.tsx
      privacy/
        page.tsx
      terms/
        page.tsx
      cookies/
        page.tsx
    admin/
      layout.tsx
      page.tsx
      login/
        page.tsx
      courses/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      categories/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      workshop-images/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      reservations/
        page.tsx
      messages/
        page.tsx
      feedback/
        page.tsx
      newsletter/
        page.tsx
    api/
      courses/
        route.ts
        [slug]/
          route.ts
      reservations/
        route.ts
      contact/
        route.ts
      feedback/
        route.ts
      newsletter/
        route.ts
      admin/
        login/
          route.ts
        logout/
          route.ts
        upload/
          route.ts
        courses/
          route.ts
          [id]/
            route.ts
        categories/
          route.ts
          [id]/
            route.ts
        workshop-images/
          route.ts
          [id]/
            route.ts
  components/
    admin/
      AdminHeader.tsx
      AdminShell.tsx
      AdminTable.tsx
      CourseForm.tsx
      CategoryForm.tsx
      WorkshopImageForm.tsx
    forms/
      ContactForm.tsx
      FeedbackForm.tsx
      NewsletterForm.tsx
      ReservationForm.tsx
    layout/
      Footer.tsx
      Navbar.tsx
    public/
      AboutSection.tsx
      CourseCard.tsx
      CoursesSection.tsx
      FAQSection.tsx
      HeroSection.tsx
      ImageGallery.tsx
      PartnersSection.tsx
      TestimonialsSection.tsx
    ui/
      Badge.tsx
      Button.tsx
      Card.tsx
      Checkbox.tsx
      ConfirmDialog.tsx
      FileUpload.tsx
      Input.tsx
      Select.tsx
      Textarea.tsx
  lib/
    auth/
      cookies.ts
      password.ts
      session.ts
    db/
      connect.ts
    cloudinary.ts
    constants.ts
    format.ts
    slug.ts
    utils.ts
    validators/
      admin.ts
      category.ts
      contact.ts
      course.ts
      feedback.ts
      reservation.ts
      workshop-image.ts
  models/
    AdminUser.ts
    Category.ts
    ContactMessage.ts
    Course.ts
    Feedback.ts
    NewsletterSubscriber.ts
    Reservation.ts
    WorkshopImage.ts
  public/
    brand/
      logo.svg
      logomark.svg
      patterns/
    fonts/
      DarkerGrotesque-VariableFont_wght.ttf
    images/
      placeholders/
  scripts/
    seed-admin.ts
  types/
    index.ts
  middleware.ts
  next.config.ts
  package.json
  tailwind.config.ts
  tsconfig.json
  .env.local.example
  DENTOVA_BUILD_PLAN.md
  AGENT_START_PROMPT.md
  project-materials/
  design_assets/
```

Structure rules:

- Keep public marketing sections under `components/public/`.
- Keep admin-only UI under `components/admin/`.
- Keep reusable primitives under `components/ui/`.
- Keep all MongoDB models under `models/`.
- Keep validation schemas under `lib/validators/`.
- Keep API route handlers thin: validate input, call models/services, return JSON.
- Keep image upload logic centralized in `lib/cloudinary.ts`.
- Keep auth/session logic centralized in `lib/auth/` and protect admin routes with `middleware.ts`.
- Use route groups like `(site)` for organization without changing public URLs.

## 4. Product Scope

### Public Website

Build a marketing and booking funnel matching the screenshots:

- Sticky/top navigation with Dentova logo
- Public links: Accueil, A propos de nous, Contactez nous
- CTA: Reserver une formation
- Auth links: Connexion, Creer un compte, or admin-aware dashboard/logout state
- Hero section with violet gradient, Dentova event photo, benefit bullets, and dual CTAs
- About section
- Dynamic courses section with category filters
- Course cards with image, category, date, location, title, excerpt, price, and detail link
- Course detail page with:
  - category pill
  - title/subtitle
  - large course image
  - details card
  - description card
  - booking/reservation form
  - included-benefits card
  - workshop gallery carousel/grid
- Testimonials section based on existing screenshot
- FAQ accordion
- Partners/logo strip
- Feedback form
- Contact form
- Footer with quick links, contact details, newsletter form, social links, legal links
- Legal pages: privacy, terms, cookies, can be simple polished static pages initially

### Admin Dashboard

Build a protected admin area based on screenshots:

- Admin login
- Dashboard/course management page
- Course table with thumbnail, title, instructor, date, location, price, status, homepage visibility, actions
- Add/edit/delete courses
- Add/edit/delete categories
- Add/edit/delete workshop/gallery images
- View image previews
- Toggle course featured status
- Toggle show on homepage
- Toggle published/hidden status
- Optional but recommended:
  - View reservations
  - View contact messages
  - View feedback submissions
  - Approve feedback as testimonial
  - Newsletter subscribers list

## 5. Data Models

Use MongoDB collections with timestamps.

### AdminUser

Fields:

- `email: string`
- `passwordHash: string`
- `name?: string`
- `role: "admin"`
- `createdAt`
- `updatedAt`

Seed one admin account through a script or temporary protected setup route. Never hardcode real credentials.

### Category

Fields:

- `name: string`
- `slug: string`
- `description?: string`
- `sortOrder?: number`
- `createdAt`
- `updatedAt`

Validation:

- `name` required
- unique slug

### Course

Fields:

- `title: string`
- `slug: string`
- `description: string`
- `categoryId: ObjectId`
- `instructor: string`
- `date: Date`
- `time?: string`
- `location: string`
- `price: number`
- `contactPhone: string`
- `contactEmail: string`
- `imageUrl: string`
- `imagePublicId?: string`
- `featured: boolean`
- `showOnHomepage: boolean`
- `published: boolean`
- `maxSeats?: number`
- `createdAt`
- `updatedAt`

Validation:

- required fields should match `new_course.png`
- slug generated from title
- price stored as number and formatted as DA in UI

### WorkshopImage

Fields:

- `title: string`
- `description?: string`
- `imageUrl: string`
- `imagePublicId?: string`
- `order: number`
- `active: boolean`
- `createdAt`
- `updatedAt`

Based on `new_show_image.png`.

### Reservation

Fields:

- `courseId: ObjectId`
- `fullName: string`
- `email: string`
- `phone: string`
- `wilaya: string`
- `profession?: string`
- `message?: string`
- `status: "pending" | "confirmed" | "cancelled"`
- `createdAt`
- `updatedAt`

Based on the course detail reservation form.

### Feedback

Fields:

- `fullName: string`
- `email: string`
- `phone?: string`
- `message: string`
- `rating?: number`
- `courseName?: string`
- `approved: boolean`
- `createdAt`
- `updatedAt`

Approved feedback can render as testimonials.

### ContactMessage

Fields:

- `fullName: string`
- `email: string`
- `phone?: string`
- `message: string`
- `status: "new" | "read" | "archived"`
- `createdAt`
- `updatedAt`

### NewsletterSubscriber

Fields:

- `email: string`
- `createdAt`

## 6. Route Plan

Public routes:

- `/`
- `/about`
- `/courses`
- `/courses/[slug]`
- `/auth/login`
- `/auth/register` optional if participant accounts are implemented
- `/privacy`
- `/terms`
- `/cookies`

Admin routes:

- `/admin/login`
- `/admin`
- `/admin/courses/new`
- `/admin/courses/[id]/edit`
- `/admin/categories`
- `/admin/categories/new`
- `/admin/categories/[id]/edit`
- `/admin/workshop-images`
- `/admin/workshop-images/new`
- `/admin/workshop-images/[id]/edit`
- `/admin/reservations`
- `/admin/messages`
- `/admin/feedback`
- `/admin/newsletter`

API routes:

- `GET /api/courses`
- `GET /api/courses/[slug]`
- `POST /api/reservations`
- `POST /api/contact`
- `POST /api/feedback`
- `POST /api/newsletter`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET/POST /api/admin/categories`
- `GET/PATCH/DELETE /api/admin/categories/[id]`
- `GET/POST /api/admin/courses`
- `GET/PATCH/DELETE /api/admin/courses/[id]`
- `GET/POST /api/admin/workshop-images`
- `GET/PATCH/DELETE /api/admin/workshop-images/[id]`
- `POST /api/admin/upload`

## 7. Performance Strategy

Recreate the speed of the original Vercel/Next site:

- Use Vercel deployment with Next.js App Router.
- Use server-rendered public pages where useful.
- Cache public course reads where safe, with revalidation after admin mutations.
- Use `next/image` for local and Cloudinary media.
- Use Cloudinary for uploads and image transformations.
- Give hero images `priority`.
- Use accurate `sizes` attributes for cards, avatars, logos, gallery images.
- Lazy-load below-the-fold images.
- Use skeleton states for dynamic course/gallery sections.
- Keep JS modest: avoid heavy UI libraries unless necessary.
- Prefer static server components for marketing sections.
- Use client components only for interactivity: forms, filters, carousel, accordion, admin tables.

## 8. Design System Plan

Create reusable primitives:

- `Container`
- `SectionHeader`
- `Button`
- `Card`
- `Badge`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `FileUpload`
- `Modal` if needed
- `ConfirmDialog`
- `AdminTable`
- `CourseCard`
- `CourseDetailReservationForm`
- `ImageGallery`
- `FAQAccordion`

Tailwind theme:

- Add Dentova colors.
- Add Darker Grotesque via `next/font/local`.
- Use consistent radius: 10 to 18 px for public cards, 8 to 12 px for admin controls.
- Keep public pages spacious.
- Keep admin pages dense, readable, and fast.

Animation:

- Framer Motion fade/slide reveal for hero/about/cards.
- FAQ accordion animation.
- Course cards hover lift.
- Gallery carousel transition.
- Keep animations subtle and professional.

## 9. Implementation Phases

### Phase 0: Project Setup

- Scaffold Next.js + TypeScript + Tailwind in the current folder while preserving `project-materials/` and `design_assets/`.
- Add dependencies.
- Configure path alias.
- Configure ESLint.
- Add `.env.local.example`.
- Add Vercel-ready `next.config`.
- Copy/prepare selected logo/font assets into `public/` or app asset folders.

### Phase 1: Brand and Layout

- Load Darker Grotesque.
- Define Tailwind theme tokens.
- Build shared navbar/footer.
- Build responsive layout shell.
- Implement public static sections from screenshots.

### Phase 2: Database and Auth

- Connect MongoDB Atlas.
- Add models.
- Add validation.
- Add admin auth.
- Protect admin routes with middleware.
- Add seed admin script.

### Phase 3: Courses and Categories

- Build category CRUD.
- Build course CRUD with Cloudinary image upload.
- Build public course list and filters.
- Build course detail page.
- Add publish/homepage/featured toggles.

### Phase 4: Gallery and Public Forms

- Build workshop image CRUD.
- Build public gallery.
- Build reservation form.
- Build contact form.
- Build feedback form.
- Build newsletter form.

### Phase 5: Admin Enhancements

- Add admin lists for reservations, messages, feedback, newsletter.
- Add status updates and delete/archive actions.
- Add feedback approval to testimonials.
- Add table search/filter/sort.

### Phase 6: Polish and Production

- Full responsive QA.
- Loading, empty, and error states.
- SEO metadata.
- Open Graph image.
- Sitemap and robots.
- Accessibility checks.
- Vercel env setup instructions.
- Final build/lint verification.

## 10. Environment Variables

Create `.env.local.example` with:

```env
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_JWT_SECRET=
NEXT_PUBLIC_SITE_URL=
```

Optional:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=
```

Never commit real secrets.

## 11. Acceptance Criteria

The build is ready when:

- `npm run lint` passes.
- `npm run build` passes.
- Public homepage matches or improves the screenshots.
- Courses are dynamic from MongoDB.
- Categories are dynamic from admin input.
- Admin can add/edit/delete courses and categories.
- Admin can upload course images to Cloudinary.
- Course cards and detail pages render uploaded images quickly through Next/Image.
- Reservation/contact/feedback/newsletter forms validate and store submissions.
- Admin dashboard is protected.
- Empty states exist for no courses, no categories, no images, no submissions.
- Mobile layout is polished.
- Vercel deployment instructions are documented.

## 12. Important Decisions

- Use Vercel for hosting.
- Use MongoDB Atlas for dynamic content.
- Use Cloudinary for uploaded images.
- Build the product as a full-stack Next.js app, not a static site.
- Screenshots are the design baseline, but tasteful improvements are allowed.
- Do not start implementation until the user explicitly says to start.
