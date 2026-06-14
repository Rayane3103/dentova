# Dentova — CLAUDE.md

> **Last updated:** 2026-06-14
> **App version:** 0.2.0

## Project Purpose & Goals

**Dentova** is a premium dental education platform serving the Algerian market. It allows dental practitioners to discover, register for, and attend high-end clinical training courses, workshops, and masterclasses. The platform includes a full-featured admin console for managing course catalogs, client relationships (CRM-like reservations), blog content, and moderation workflows.

Key business goals:
- Promote dental training events across Algeria (Algiers, Oran, Constantine)
- Capture course reservations with attendee details
- Build a newsletter subscriber base
- Collect and moderate testimonials/feedback
- Publish blog content to engage the practitioner community
- Provide a professional admin dashboard for non-technical staff

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.3 |
| Runtime | React + TypeScript | 19.0 / 5.7 |
| Styling | Tailwind CSS | 3.4.17 |
| Database | MongoDB (Atlas) + Mongoose | 8.9 |
| Auth | JWT via `jose` + `bcryptjs` | — |
| Forms | react-hook-form + zod | 7.54 / 3.24 |
| Animation | framer-motion | 11.15 |
| Icons | lucide-react | 0.468 |
| Toasts | sonner | 1.7 |
| Media | Cloudinary SDK | 2.5 |
| Email | Nodemailer | 8.0 |

**No state management library** — the app uses React Server Components for data fetching (no client-side store). Client state is local (`useState`/`useForm`).

---

## Project Structure (Full Tree)

```
app/
  globals.css                    → Global styles, CSS variables, scrollbar, marquee animation
  layout.tsx                     → Root layout: fonts (Inter + DarkerGrotesque), Toaster, metadata
  loading.tsx                    → Global loading spinner
  not-found.tsx                  → 404 page
  (site)/                        → PUBLIC-FACING PAGES (route group)
    layout.tsx                   → Navbar + Footer wrapper, force-dynamic
    page.tsx                     → Homepage (Hero, About, Courses, Blog, Testimonials, FAQ, Contact, Gallery)
    about/page.tsx               → About page
    blog/page.tsx                → Blog listing (all published posts)
    blog/[slug]/page.tsx         → Single blog post with like button
    courses/page.tsx             → Course catalog with category/location filters
    courses/[slug]/page.tsx      → Course detail with reservation form
    cookies/page.tsx             → Cookie policy
    inscription/page.tsx         → Standalone signup/registration page
    privacy/page.tsx             → Privacy policy
    terms/page.tsx               → Terms of service
  admin/                         → ADMIN CONSOLE (protected by middleware)
    layout.tsx                   → AdminShell wrapper, force-dynamic
    loading.tsx                  → Admin loading skeleton
    page.tsx                     → Dashboard (stats cards, recent courses, quick actions)
    login/page.tsx               → Login page (redirects if already authed)
    categories/page.tsx          → Category list
    categories/new/page.tsx      → Create category form
    categories/[id]/edit/page.tsx → Edit category form
    courses/page.tsx             → Course list table
    courses/new/page.tsx         → Create course form
    courses/[id]/edit/page.tsx   → Edit course form
    faqs/page.tsx                → FAQ list
    faqs/new/page.tsx            → Create FAQ form
    faqs/[id]/edit/page.tsx      → Edit FAQ form
    feedback/page.tsx            → Feedback moderation panel
    mentors/page.tsx             → Mentor list
    mentors/new/page.tsx         → Create mentor form
    mentors/[id]/edit/page.tsx   → Edit mentor form
    messages/page.tsx            → Contact messages inbox
    newsletter/page.tsx          → Newsletter subscriber list
    posts/page.tsx               → Blog post list
    posts/new/page.tsx           → Create blog post form
    posts/[id]/edit/page.tsx     → Edit blog post form
    reservations/page.tsx        → CRM-style reservations management
    signups/page.tsx             → Client signup records
    workshop-images/page.tsx     → Gallery image list
    workshop-images/new/page.tsx → Create gallery image form
    workshop-images/[id]/edit/page.tsx → Edit gallery image form
  api/
    courses/route.ts             → GET public courses
    courses/[slug]/route.ts      → GET single course by slug
    contact/route.ts             → POST contact form (DB + email notification)
    feedback/route.ts            → POST feedback/testimonial
    newsletter/route.ts          → POST newsletter subscription
    reservations/route.ts        → POST course reservation
    signup/route.ts              → POST client signup
    admin/
      login/route.ts             → POST admin login (JWT cookie)
      logout/route.ts            → POST admin logout (clear cookie)
      upload/route.ts            → POST image upload to Cloudinary
      categories/route.ts        → GET/POST admin categories
      categories/[id]/route.ts   → PATCH/DELETE single category
      courses/route.ts           → GET/POST admin courses
      courses/[id]/route.ts      → PATCH/DELETE single course
      faqs/route.ts              → GET/POST admin FAQs
      faqs/[id]/route.ts         → PATCH/DELETE single FAQ
      feedback/route.ts          → GET/PATCH/DELETE admin feedback
      mentors/route.ts           → GET/POST admin mentors
      mentors/[id]/route.ts      → PATCH/DELETE single mentor
      messages/route.ts          → GET/PATCH admin messages
      newsletter/route.ts        → GET admin newsletter subscribers
      posts/route.ts             → GET/POST admin posts
      posts/[id]/route.ts        → PATCH/DELETE single post
      posts/like/route.ts        → POST toggle like (auth required)
      reservations/route.ts      → GET/PATCH admin reservations
      signups/route.ts           → GET admin signups
      workshop-images/route.ts   → GET/POST admin gallery images
      workshop-images/[id]/route.ts → PATCH/DELETE single image

components/
  admin/                         → Admin console components
    admin-ui.ts                  → Shared CSS class strings for admin forms/tables/badges
    AdminDeleteButton.tsx         → Reusable delete button with confirmation dialog
    AdminHeader.tsx               → Page header with title, description, optional action slot
    AdminLoginForm.tsx            → Login form (client component, react-hook-form)
    AdminMobileDrawer.tsx         → Mobile slide-in navigation drawer
    AdminNavLinks.tsx             → Sidebar navigation links grouped by section
    AdminShell.tsx                → Admin layout shell (sidebar + topbar + content area)
    AdminSidebar.tsx              → Desktop sidebar
    AdminStatCard.tsx             → Dashboard stat card with accent color, icon, value, link
    AdminTable.tsx                → Generic admin data table
    AdminTopBar.tsx               → Top bar with mobile menu toggle, user info, logout
    CategoryForm.tsx              → Create/edit category form
    ConfirmDialog.tsx             → Generic confirmation modal
    CourseForm.tsx                → Create/edit course form (with category select, image upload)
    CoursesTableClient.tsx        → Courses data table with search, publish toggle, actions
    DataTable.tsx                 → Low-level reusable table component
    EmptyAdminState.tsx           → Empty state placeholder
    FAQForm.tsx                   → Create/edit FAQ form
    FeedbackAdminPanel.tsx        → Feedback moderation with approve/reject/delete
    ImageUploadField.tsx          → File upload input with Cloudinary integration
    MentorForm.tsx                → Create/edit mentor form
    PostForm.tsx                  → Create/edit blog post form
    ReservationsCRM.tsx           → Full CRM: search, filter, expand rows, inline edit, status update
    StatusBadge.tsx               → Colored status badge (pending/confirmed/cancelled/etc.)
    WorkshopImageForm.tsx         → Create/edit gallery image form

  forms/                         → Public-facing forms
    ContactForm.tsx               → Contact form (name, email, phone, message)
    FeedbackForm.tsx              → Testimonial/feedback form with star rating
    FormField.tsx                 → Reusable labeled form field wrapper
    NewsletterForm.tsx            → Email-only newsletter signup
    ReservationForm.tsx           → Course reservation form (name, email, phone, wilaya, etc.)
    SignupForm.tsx                → Client registration/interest form
    StarRating.tsx                → Clickable star rating component

  layout/                        → Site-wide layout
    Footer.tsx                    → Footer with navigation, contact info, legal links
    Navbar.tsx                    → Top navigation bar (mobile drawer, auth-aware, contact bar)

  public/                        → Public page sections (composable)
    AboutSection.tsx              → "Qui sommes-nous ?" section
    BlogSection.tsx               → Blog posts grid teaser
    ContactSection.tsx            → Contact form section
    CourseCard.tsx                → Course card (image, category, date, location, price)
    CoursesSection.tsx            → Full courses catalog with filters (category + city)
    FAQSection.tsx                → Accordion FAQ list
    HeroSection.tsx               → Hero with upcoming courses card, stats bar, CTA buttons
    ImageGallery.tsx              → Photo gallery grid with lightbox
    LegalPage.tsx                 → Reusable legal page wrapper
    MotionCounter.tsx             → Animated number counter (scroll-triggered)
    MotionReveal.tsx              → Scroll-reveal wrapper using framer-motion
    ParallaxBlob.tsx              → Decorative animated gradient blob
    PostLikeButton.tsx            → Like/unlike button for blog posts
    SectionHeader.tsx             → Reusable section heading with eyebrow, title, accent, description
    StaggerContainer.tsx          → Staggered children animation container
    TestimonialsSection.tsx       → Testimonials carousel/grid
    WhyParticipateSection.tsx     → Benefits list section

  ui/                            → Generic UI primitives
    Badge.tsx                     → Pill/badge component
    Button.tsx                    → Polymorphic button (button + Link via asChild), 5 variants, 4 sizes
    Card.tsx                      → Simple card wrapper
    Checkbox.tsx                  → Styled checkbox
    ConfirmDialog.tsx             → Modal confirmation dialog
    Container.tsx                 → Max-width centered container
    FileUpload.tsx                → File input with drag-and-drop
    Input.tsx                     → Styled text input (sm/md sizes)
    Select.tsx                    → Styled select dropdown
    SuccessDialog.tsx             → Success confirmation modal
    Textarea.tsx                  → Styled textarea (sm/md sizes)

lib/
  admin/
    navigation.ts                 → Admin sidebar navigation groups, items, and active-path logic
  auth/
    admin-user.ts                 → Admin authentication: upsertAdminFromEnv(), authenticateAdmin()
    cookies.ts                    → getAdminSession(), setSessionCookie(), clearSessionCookie()
    password.ts                   → bcrypt hash/verify wrappers
    session.ts                    → JWT sign/verify using jose (HS256, 7d expiry)
  data/
    queries.ts                    → All server-side data fetching functions (getCategories, getPublishedCourses, etc.)
    serialize.ts                  → Mongoose doc → TypeScript type converters (serializeCourse, serializePost, etc.)
  db/
    connect.ts                    → MongoDB connection singleton with global caching and tryConnect fallback
  validators/                     → Zod schemas shared between API routes and client forms
    admin.ts                      → adminLoginSchema
    admin-reservation.ts          → reservationStatusSchema, adminReservationUpdateSchema
    category.ts                   → categorySchema
    contact.ts                    → contactSchema
    content.ts                    → faqSchema, mentorSchema (FAQ + mentor validators)
    course.ts                     → courseSchema
    feedback.ts                   → feedbackSchema
    newsletter.ts                 → newsletterSchema
    post.ts                       → postSchema
    reservation.ts                → reservationSchema
    signup.ts                     → signupSchema
    workshop-image.ts             → workshopImageSchema
  cloudinary.ts                   → Cloudinary v2 config helper (throws if env vars missing)
  constants.ts                    → siteConfig, navItems, includedBenefits
  format.ts                       → Formatting utilities: formatPrice (DZD), formatCourseDate (fr-FR), formatShortDate
  mail.ts                         → Nodemailer transport: sendContactNotification (silently skips if unconfigured)
  slug.ts                         → slugify() — French-aware URL slug generator
  utils.ts                        → cn() — clsx + tailwind-merge class merging

models/                          → Mongoose schemas (all with timestamps)
  AdminUser.ts                    → email, name, passwordHash, role
  Category.ts                     → name, slug, description, sortOrder
  ClientSignup.ts                 → courseInterest, email, fullName, message, newsletterOptIn, phone, profession, status, wilaya
  ContactMessage.ts               → email, fullName, message, phone, status
  Course.ts                       → categoryId (ref Category), contactEmail/Phone, date, description, excerpt, featured, imageUrl/PublicId, instructor, location, maxSeats, price, published, showOnHomepage, slug, subtitle, time, title
  FAQ.ts                          → answer, category, published, question, sortOrder
  Feedback.ts                     → approved, courseName, email, fullName, message, phone, rating, role, showOnHomepage
  Mentor.ts                       → active, bio, imageUrl/PublicId, name, order, showOnHomepage, specialty, title
  NewsletterSubscriber.ts         → email (unique)
  Post.ts                         → content, caption, imageUrl/PublicId, published, slug, likes (ObjectId[] ref AdminUser)
  Reservation.ts                  → courseId (ref Course), email, fullName, message, phone, profession, status, wilaya
  WorkshopImage.ts                → active, description, imageUrl/PublicId, order, title

types/
  index.ts                        → Shared TypeScript interfaces: CourseStatus, Category, Course, WorkshopImage, Testimonial, Mentor, FAQItem, BlogPost

middleware.ts                     → Edge middleware: JWT cookie check on /admin/*, /api/admin/*, /marketer/*, /api/marketer/* (except /login)
scripts/
  seed-admin.ts                   → Seeds admin user from env vars (MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD)
assets/                           → Static image assets (WebP photos for courses, hero, gallery)
public/
  brand/                          → Logo SVGs (logo, logomark, white variants), pattern SVGs
  fonts/                          → DarkerGrotesque variable font file
  images/                         → Organized into assets/, partners/, placeholders/
```

---

## Marketer View (v0.2.0)

A dedicated marketing dashboard with its own authentication, separate from the admin console.

### Authentication
- **Parallel to admin:** Uses same JWT secret (`ADMIN_JWT_SECRET`), different cookie (`dentova_marketer_session`)
- **Credential bootstrap:** `MARKETER_EMAIL`, `MARKETER_PASSWORD`, `MARKETER_NAME` in `.env.local`
- **Seed script:** `npm run seed:admin` now seeds both admin AND marketer accounts
- **Middleware:** Protects `/marketer/:path*` and `/api/marketer/:path*` (except `/login`)
- **Session payload:** `{ marketerId, email, role: "marketer" }`

### Files Added
```
models/
  MarketerUser.ts                 → email (unique), passwordHash, name, role: "marketer"
  Pixel.ts                        → platform (meta|tiktok, unique), pixelId, label, active, verifiedAt, notes

lib/auth/
  marketer-user.ts                → authenticateMarketer(), upsertMarketerFromEnv()
  session.ts                      → Extended: ADMIN_SESSION_COOKIE_NAME + MARKETER_SESSION_COOKIE_NAME
  cookies.ts                      → Extended: getMarketerSession(), setMarketerSessionCookie(), clearMarketerSessionCookie()

lib/validators/
  marketer.ts                     → marketerLoginSchema, pixelSchema, pixelUpdateSchema

lib/data/
  queries.ts                      → getMarketerStats() — aggregated marketing KPIs
  serialize.ts                    → serializePixel()

lib/marketer/
  navigation.ts                   → marketerNavGroups (Principal, Analytique, Aperçu rapide)

components/marketer/
  MarketerShell.tsx                → Dark-themed layout shell with gradient sidebar
  MarketerSidebar.tsx              → Navigation sidebar with dentova-gradient background
  MarketerTopBar.tsx               → Breadcrumbs, notifications, user menu
  MarketerMobileDrawer.tsx         → Mobile slide-in navigation
  MarketerNavLinks.tsx             → Collapsible nav groups with active states
  MarketerHeader.tsx               → Page header with optional icon and action slot
  MarketerLoginForm.tsx            → Login form (client component, react-hook-form)
  MarketerStatCard.tsx             → Enhanced stat card with gradient accent bar
  TrendIndicator.tsx               → Up/down percentage trend badges
  AnalyticsChart.tsx               → BarChart + TopCoursesList (ranked with progress bars)
  PixelManager.tsx                 → Full CRUD for Meta/TikTok pixels (add, edit, toggle, delete, verify, code preview)

components/layout/
  PixelScripts.tsx                 → Server component: fetches active pixels from DB, injects <script> tags

app/marketer/
  layout.tsx                       → MarketerShell wrapper, force-dynamic
  loading.tsx                      → Spinner
  page.tsx                         → Marketing dashboard (stats, charts, top courses, quick links)
  login/page.tsx                   → Login page with gradient background
  pixels/page.tsx                  → Pixel management page
  pixels/loading.tsx               → Skeleton
  reservations/page.tsx            → Stub pointing to admin console
  subscribers/page.tsx             → Stub pointing to admin console
  feedback/page.tsx                → Stub pointing to admin console
  messages/page.tsx                → Stub pointing to admin console

app/api/marketer/
  login/route.ts                   → POST — authenticate marketer, set cookie
  logout/route.ts                  → POST — clear cookie, redirect to /
  pixels/route.ts                  → GET (list) / POST (create with uniqueness check)
  pixels/[id]/route.ts             → PATCH (update/verify) / DELETE
  stats/route.ts                   → GET — aggregated marketing KPIs

middleware.ts                      → Updated: protects /marketer/* and /api/marketer/*
app/layout.tsx                     → Updated: includes PixelScripts for pixel injection
scripts/seed-admin.ts              → Updated: seeds marketer account if env vars set
types/index.ts                     → Added: PixelPlatform, Pixel, MarketerStats
```

### Dashboard Metrics
- Total/published courses count
- Reservations with monthly trend comparison
- Top 5 courses by reservation count (aggregation pipeline)
- Signups this month
- Newsletter subscribers with monthly growth
- Pending feedback count
- New/unread messages count
- Reservations-by-month bar chart (last 6 months)

### Pixel Management
- **Platforms:** Meta (Facebook/Instagram) and TikTok
- **Validation:** Meta: 15–16 digit numeric IDs; TikTok: 15–24 alphanumeric IDs
- **Uniqueness:** One pixel per platform — enforced at API and DB level (unique index)
- **Activation:** Toggle active/inactive; activation timestamps verifiedAt
- **Code preview:** Shows the exact `<script>` block being injected
- **Injection:** `PixelScripts` server component in root layout fetches active pixels and injects their tracking code on every page
- **Graceful degradation:** Silently skips if DB unavailable — never breaks the page

### Design
- **Sidebar:** Dark gradient background (`bg-dentova-gradient`) with white/teal text
- **Cards:** Rounded-2xl, subtle gradient accent bar at top, soft shadows
- **Typography:** `font-display` for headings, consistent with public site
- **Colors:** Same `dentova-*` palette — navy, teal, magenta, lavender
- **Layout:** Same shell pattern as AdminShell (sidebar + topbar + content)

## Database Structure (13 MongoDB Models)

All models use Mongoose with `{ timestamps: true }`. The pattern `mongoose.models.X || mongoose.model("X", schema)` prevents model re-registration in hot-reload.

### Relationships
- **Course** → `categoryId` refs **Category** (populated on read)
- **Reservation** → `courseId` refs **Course** (populated on read)
- **Post.likes** → Array of ObjectId refs **AdminUser**
- All other models are independent collections

### Model-by-Model Summary

| Model | Key Fields | Purpose |
|---|---|---|
| AdminUser | email (unique), passwordHash, name, role | Single admin account (bootstrap from env vars) |
| Category | name, slug (unique), description, sortOrder | Course taxonomy |
| Course | title, slug (unique), categoryId, instructor, date, location, price, imageUrl, published, featured, showOnHomepage, maxSeats | Core product catalog |
| WorkshopImage | title, imageUrl, order, active | Photo gallery |
| FAQ | question, answer, category, published, sortOrder | FAQ accordion |
| Mentor | name, title, imageUrl, bio, specialty, active, showOnHomepage, order | Instructor profiles |
| Feedback | fullName, message, rating, approved, showOnHomepage | Testimonials (moderated) |
| Post | caption, content, imageUrl, slug, published, likes[] | Blog articles |
| ContactMessage | fullName, email, message, phone, status (new/read/archived) | Contact form inbox |
| NewsletterSubscriber | email (unique) | Email list |
| Reservation | courseId, fullName, email, phone, wilaya, profession, status (pending/confirmed/cancelled) | Course bookings |
| ClientSignup | fullName, email, phone, wilaya, profession, courseInterest, newsletterOptIn, status | General interest registrations |
| MarketerUser | email (unique), passwordHash, name, role | Marketer account (bootstrap from env vars) |
| Pixel | platform (meta\|tiktok, unique), pixelId, label, active, verifiedAt, notes | Meta/TikTok tracking pixels |

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│                   Browser                     │
├─────────────────────────────────────────────┤
│  Public Pages (SSR)  │  Admin SPA-like Forms  │
│  Server Components   │  Client Components     │
│  force-dynamic       │  react-hook-form       │
└──────────┬───────────┴──────────┬────────────┘
           │                      │
     RSC fetch             Client fetch()
     (queries.ts)          (POST /api/...)
           │                      │
           ▼                      ▼
┌─────────────────────────────────────────────┐
│              Next.js API Routes               │
│  parse → Zod validate → DB check → execute   │
├─────────────────────────────────────────────┤
│              Mongoose / MongoDB               │
│              (Atlas cluster)                  │
├─────────────────────────────────────────────┤
│         External Services (optional)          │
│  Cloudinary (image upload)                    │
│  SMTP/Nodemailer (contact notifications)     │
└─────────────────────────────────────────────┘
```

### Rendering Strategy
- **All pages use `force-dynamic`** — no static generation. Every page is SSR'd on each request.
- **Server Components** handle data fetching via `lib/data/queries.ts`
- **Client Components** handle interactivity: forms, animations, modals, filters
- **Images** use `next/image` with Cloudinary remote patterns

### Navigation & Loading UX
- **TopLoader** (`components/layout/TopLoader.tsx`) — thin gradient progress bar at the top of the viewport, shown automatically on client-side navigations via `usePathname` change detection. Wrapped in its own Suspense boundary.
- **Per-segment `loading.tsx`** — every route that does async data fetching has a `loading.tsx` file that shows an instant skeleton (table, form, or page-layout) while the RSC payload streams in. Next.js automatically swaps the skeleton for the real page when ready.
- **Skeleton components** — reusable loading placeholders:
  - `AdminPageSkeleton` / `AdminCRMSkeleton` (`components/ui/AdminPageSkeleton.tsx`) — for admin list/CRM pages
  - `AdminFormSkeleton` (`components/ui/AdminFormSkeleton.tsx`) — for admin edit pages
  - `PublicHomeSkeleton` / `PublicListSkeleton` / `PublicDetailSkeleton` / `PublicTextSkeleton` (`components/ui/PublicPageSkeleton.tsx`) — for public pages
- **Eager prefetch** — all navigation links (public navbar, admin sidebar, mobile drawer) use `prefetch={true}` so RSC payloads are fetched as soon as the link mounts, not just on hover/intent.
- **Client-side cache** — `experimental.staleTimes.dynamic = 10` in `next.config.ts` keeps recently-visited page payloads fresh for 10 s, so rapid back/forward navigation between admin pages shows instant cached content instead of re-fetching.
- **Admin "new" pages have no loading.tsx** — they are pure client components with no async data fetching, so they render instantly.

### Data Flow (Two Paths)

**Path 1 — Server Component (read):**
```
Page (async Server Component)
  → queries.ts function (e.g., getPublishedCourses)
    → tryConnectToDatabase() → Mongoose .find().lean()
  → serialize.ts (MongoDoc → typed object)
  → RSC renders to HTML
```

**Path 2 — Client Form (write):**
```
Form Component (useForm + zodResolver)
  → user submits
  → fetch("POST /api/...", { body: JSON.stringify(values) })
  → Route handler:
      1. Parse JSON body
      2. Zod safeParse validation
      3. Check hasDatabaseConfig()
      4. connectToDatabase()
      5. Mongoose .create() / .findByIdAndUpdate()
      6. revalidatePath() to purge RSC cache
      7. NextResponse.json()
  → Client handles response, shows toast
```

---

## Authentication & Authorization

### Flow
1. **Login:** `POST /api/admin/login` → Zod validates → `authenticateAdmin()` checks DB first, then falls back to env vars → JWT signed with `jose` (HS256, 7d) → set as `httpOnly`, `sameSite: lax`, `secure` (in production) cookie named `dentova_admin_session`
2. **Middleware:** `middleware.ts` runs on `/admin/:path*` and `/api/admin/:path*` (except `/admin/login` and `/api/admin/login`) → reads cookie → `verifySessionToken()` → redirects to `/admin/login?next=...` on failure
3. **Logout:** `POST /api/admin/logout` → clears cookie with `maxAge: 0` → redirects to `/`
4. **Admin-Like:** `POST /api/admin/posts/like` checks `getAdminSession()` internally (not via middleware pattern — direct cookie read)

### Admin User Bootstrap
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` in `.env.local`
- `npm run seed:admin` → `scripts/seed-admin.ts` → `upsertAdminFromEnv()` → upserts into MongoDB
- On login, `authenticateAdmin()` falls back to env vars if no DB user exists yet, then upserts

### Session Check in Pages
- `app/(site)/layout.tsx` calls `getAdminSession()` to pass `authenticated` prop to Navbar
- `app/admin/layout.tsx` calls `getAdminSession()` to determine if AdminShell renders
- Admin pages themselves are NOT individually protected (middleware handles that)

---

## Design System

### Color Tokens (Tailwind `dentova-*` namespace)
Full palette defined in [tailwind.config.ts](tailwind.config.ts):

| Token | Hex | Usage |
|---|---|---|
| `dentova-navy` (DEFAULT: `#14123a`) | Dark navy | Primary background, text on light |
| `dentova-violet` | `#321246` | Gradient midpoint |
| `dentova-purple` | `#3c348a` | Accent |
| `dentova-lavender` | `#8976c4` | Subtle UI elements |
| `dentova-magenta` (DEFAULT: `#9817a0`) | Magenta | CTA buttons (`primary` variant), hover states |
| `dentova-teal` | `#73cbd5` | Accent, links, icons, highlights |
| `dentova-cyan` | `#73cbd5` | Same as teal |
| `dentova-ice` | `#f4f3fa` | Light background |
| `dentova-ink` | `#14123a` | Same as navy |
| `dentova-canvas` | `#f4f3fa` | Page background |
| `dentova-surface` | `#ffffff` | Card/surface |
| `dentova-ash` | `#e8e6f4` | Subtle borders |
| `dentova-graphite` | `#14123a` | Same as navy |
| `dentova-muted` | `#574691` | Secondary text |
| `dentova-coral` | `#9817a0` | Same as magenta |
| `dentova-gold` | `#e99cef` | Highlight |
| `dentova-mint` | `#eefafb` | Light teal |

Each main color has a 50–950 scale (navy, teal, magenta).

### Typography
- **Body:** Inter (Google Fonts, `--font-inter`)
- **Headings:** Darker Grotesque (local font file, `--font-darker-grotesque`)
- Font classes: `font-sans` (Inter), `font-display` (Darker Grotesque)

### Shadows
- `shadow-soft`: Large soft shadow
- `shadow-card`: Medium card shadow
- `shadow-luxe`: Premium larger shadow
- `shadow-glow`: Magenta glow (for CTA buttons)

### Gradients
- `bg-dentova-gradient`: Navy → Violet → Teal (main brand gradient)
- `bg-dentova-aurora`: Subtle teal/navy/lavender
- `bg-dentova-cta`: Magenta → Pink → Lavender

### CSS Variables (in `:root`)
```
--background: #f4f3fa
--foreground: #14123a
--dentova-navy/violet/purple/lavender/magenta/cyan
```

### UI Patterns
- **Buttons:** Always have `dentova-focus` (focus-visible outline ring), rounded-full, font-bold. 5 variants: `primary` (magenta bg), `secondary` (violet bg), `outline`, `ghost`, `light` (glass)
- **Inputs:** Rounded-lg, border with subtle shadow, `dentova-focus` ring
- **Cards:** Rounded-xl or rounded-3xl, border, bg-white, shadow
- **Admin:** Consistent `adminLabelClassName` for form labels, `adminFormClassName` for form containers, `tableHeaderClassName`/`tableCellClassName` for tables
- **Public:** Heavy use of framer-motion scroll-reveal animations, gradient text, ParallaxBlob decorations

---

## API Route Pattern

Every API route follows this consistent pattern:

```typescript
export const runtime = "nodejs";

export async function POST(request: Request) {
  // 1. Parse
  const payload = await request.json().catch(() => null);
  // 2. Validate
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }
  // 3. Check DB config
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "..." }, { status: 503 });
  }
  // 4. Connect
  await connectToDatabase();
  // 5. Execute
  const result = await Model.create(parsed.data);
  // 6. Revalidate
  revalidatePath("/relevant-path");
  // 7. Respond
  return NextResponse.json({ result }, { status: 201 });
}
```

### Public vs Admin API Routes
- **Public routes** (`/api/courses`, `/api/contact`, etc.): No auth required, serve public-facing forms
- **Admin routes** (`/api/admin/*`): Protected by middleware (JWT cookie), serve admin CRUD operations

---

## Key Components & Their Responsibilities

### Layout Shells
| Component | File | Role |
|---|---|---|
| RootLayout | [app/layout.tsx](app/layout.tsx) | Fonts, metadata, Toaster |
| SiteLayout | [app/(site)/layout.tsx](app/(site)/layout.tsx) | Navbar + Footer, force-dynamic |
| AdminLayout | [app/admin/layout.tsx](app/admin/layout.tsx) | AdminShell with session |
| AdminShell | [components/admin/AdminShell.tsx](components/admin/AdminShell.tsx) | Sidebar + TopBar + MobileDrawer + content |

### Admin Components
| Component | File | Role |
|---|---|---|
| AdminSidebar | [components/admin/AdminSidebar.tsx](components/admin/AdminSidebar.tsx) | Desktop nav, logo, public site link |
| AdminTopBar | [components/admin/AdminTopBar.tsx](components/admin/AdminTopBar.tsx) | Mobile menu trigger, breadcrumb, logout |
| AdminMobileDrawer | [components/admin/AdminMobileDrawer.tsx](components/admin/AdminMobileDrawer.tsx) | Slide-out mobile nav |
| AdminNavLinks | [components/admin/AdminNavLinks.tsx](components/admin/AdminNavLinks.tsx) | Navigation groups (Principal, Contenu, Gestion, Modération) |
| AdminHeader | [components/admin/AdminHeader.tsx](components/admin/AdminHeader.tsx) | Page title, description, action button slot |
| AdminStatCard | [components/admin/AdminStatCard.tsx](components/admin/AdminStatCard.tsx) | Dashboard metric card |
| ReservationsCRM | [components/admin/ReservationsCRM.tsx](components/admin/ReservationsCRM.tsx) | Full CRM: search, filter, expand, inline edit, status change |
| FeedbackAdminPanel | [components/admin/FeedbackAdminPanel.tsx](components/admin/FeedbackAdminPanel.tsx) | Approve/reject/delete feedback |
| AdminDeleteButton | [components/admin/AdminDeleteButton.tsx](components/admin/AdminDeleteButton.tsx) | Delete with confirmation dialog |
| CoursesTableClient | [components/admin/CoursesTableClient.tsx](components/admin/CoursesTableClient.tsx) | Courses data table with publish toggle |
| ImageUploadField | [components/admin/ImageUploadField.tsx](components/admin/ImageUploadField.tsx) | File upload to Cloudinary |

### Public Components
| Component | File | Role |
|---|---|---|
| HeroSection | [components/public/HeroSection.tsx](components/public/HeroSection.tsx) | Landing hero with upcoming courses, stats |
| CoursesSection | [components/public/CoursesSection.tsx](components/public/CoursesSection.tsx) | Filterable course grid |
| CourseCard | [components/public/CourseCard.tsx](components/public/CourseCard.tsx) | Individual course card |
| BlogSection | [components/public/BlogSection.tsx](components/public/BlogSection.tsx) | Blog post teasers |
| TestimonialsSection | [components/public/TestimonialsSection.tsx](components/public/TestimonialsSection.tsx) | Testimonial display |
| FAQSection | [components/public/FAQSection.tsx](components/public/FAQSection.tsx) | Accordion FAQ |
| ImageGallery | [components/public/ImageGallery.tsx](components/public/ImageGallery.tsx) | Photo grid |
| MotionReveal | [components/public/MotionReveal.tsx](components/public/MotionReveal.tsx) | Scroll-triggered animation wrapper |
| ParallaxBlob | [components/public/ParallaxBlob.tsx](components/public/ParallaxBlob.tsx) | Decorative animated blob |
| SectionHeader | [components/public/SectionHeader.tsx](components/public/SectionHeader.tsx) | Reusable section heading |

### Form Components (Public)
| Component | File | Validation Schema | API Endpoint |
|---|---|---|---|
| ContactForm | [components/forms/ContactForm.tsx](components/forms/ContactForm.tsx) | `contactSchema` | `POST /api/contact` |
| FeedbackForm | [components/forms/FeedbackForm.tsx](components/forms/FeedbackForm.tsx) | `feedbackSchema` | `POST /api/feedback` |
| NewsletterForm | [components/forms/NewsletterForm.tsx](components/forms/NewsletterForm.tsx) | `newsletterSchema` | `POST /api/newsletter` |
| ReservationForm | [components/forms/ReservationForm.tsx](components/forms/ReservationForm.tsx) | `reservationSchema` | `POST /api/reservations` |
| SignupForm | [components/forms/SignupForm.tsx](components/forms/SignupForm.tsx) | `signupSchema` | `POST /api/signup` |

---

## Environment Variables

Defined in `.env.local` (contains production credentials — **never commit**):

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `ADMIN_JWT_SECRET` | Yes | HS256 signing key for JWT sessions |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL (metadataBase, used in Vercel) |
| `ADMIN_EMAIL` | Yes | Admin login email (bootstrap + fallback auth) |
| `ADMIN_PASSWORD` | Yes | Admin login password (bootstrap + fallback auth) |
| `ADMIN_NAME` | Optional | Display name for admin (default: "Admin1") |
| `MARKETER_EMAIL` | Optional* | Marketer login email (*required for marketer access) |
| `MARKETER_PASSWORD` | Optional* | Marketer login password |
| `MARKETER_NAME` | Optional | Display name for marketer (default: "Dentova Marketing") |
| `CLOUDINARY_CLOUD_NAME` | Optional* | Cloudinary cloud name (*required for image upload) |
| `CLOUDINARY_API_KEY` | Optional* | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Optional* | Cloudinary API secret |
| `SMTP_HOST` | Optional | SMTP server hostname |
| `SMTP_PORT` | Optional | SMTP port (default: 587) |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP password |
| `CONTACT_TO_EMAIL` | Optional | Destination email for contact notifications |

---

## Deployment

### Target: Vercel
- The app is designed for Vercel deployment (evidenced by `NEXT_PUBLIC_SITE_URL` pointing to a `.vercel.app` domain)
- `next.config.ts` is minimal: only Cloudinary image `remotePatterns` configured
- No `output: "standalone"` — uses default Vercel serverless
- Environment variables must be set in Vercel dashboard

### Scripts
```bash
npm run dev          # Start dev server (next dev)
npm run build        # Production build (next build)
npm run start        # Start production server (next start)
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm run seed:admin   # Seed admin user from env vars (uses tsx)
```

---

## Testing Setup

**No automated tests exist.** There are no test files, no Jest/Vitest config, no Playwright/Cypress config. Testing is manual via browser.

---

## Coding Conventions

### Naming
- **Files:** kebab-case (`admin-user.ts`, `contact-form.tsx`)
- **Components:** PascalCase (`AdminShell`, `CourseCard`)
- **Functions:** camelCase (`getPublishedCourses`, `serializeCourse`)
- **Constants:** UPPER_SNAKE for env-derived, camelCase for config objects (`siteConfig`, `navItems`)
- **Types/Interfaces:** PascalCase (`Course`, `BlogPost`)

### Code Organization
- **Zod schemas** live in `lib/validators/` and are shared between server (API routes) and client (react-hook-form resolvers)
- **Server-only data functions** are in `lib/data/queries.ts` (each returns `[]` or `null` if DB unavailable)
- **Serialization** happens in `lib/data/serialize.ts` — converts raw Mongoose `_id` to string `id`, formats dates
- **Reusable UI primitives** go in `components/ui/`
- **Business-logic components** go in `components/admin/`, `components/public/`, `components/forms/`, `components/layout/`
- **Type definitions** in `types/index.ts` — keep in sync with Mongoose models

### Import Pattern
- Use `@/` path alias (maps to project root)
- Example: `import { cn } from "@/lib/utils"`

### Error Handling
- **API routes:** Return structured error JSON with appropriate HTTP status codes (422 for validation, 503 for DB unavailable, 401 for auth, 404 for not found, 500 for server errors)
- **Server Components:** `queries.ts` functions return `[]` or `null` when DB is unavailable (graceful degradation) — pages check for empty data and render appropriate empty states
- **Client Forms:** Display toast notifications on error via `sonner`

### Force-Dynamic
Every page that fetches data uses `export const dynamic = "force-dynamic"` to disable static generation. This is necessary because the app has no static content — everything comes from MongoDB.

---

## Third-Party Integrations

### Cloudinary (Image Upload)
- Configured via `lib/cloudinary.ts`
- Upload endpoint: `POST /api/admin/upload` (multipart form data)
- Admin forms use `ImageUploadField` component which calls this endpoint
- Returns `{ imagePublicId, imageUrl }` — stored in entity documents
- **Currently not configured** (env vars are empty)

### Nodemailer (Contact Email)
- Configured via `lib/mail.ts`
- `sendContactNotification()` fires after `POST /api/contact`
- **Gracefully skips** if SMTP env vars are not set (returns `{ sent: false, reason: "mail_not_configured" }`)
- **Currently not configured** (env vars are empty)

---

## Known Issues & Observations

1. **No testing:** Zero automated tests — critical for a production app with 11 models and payment-adjacent reservations
2. **No rate limiting:** API routes have no rate limiting — forms could be spammed
3. **Single admin role:** The `AdminUser` schema has a `role` enum of `["admin"]` only — no role-based access control granularity
4. **Cloudinary not configured:** Image upload UI exists but won't work until Cloudinary env vars are set. Admin forms using `ImageUploadField` may fail silently or throw.
5. **SMTP not configured:** Contact form saves to DB but won't send email notifications to the team.
6. **Reservation system is CRM-only:** Reservations are captured but there's no capacity tracking against `maxSeats` — no automatic waitlisting or seat counting
7. **Post.likes use AdminUser ObjectIds:** Only admins can like posts — public users see the like button but it's disabled or redirects to login
8. **No pagination on list pages:** Admin tables load all records at once (`find({})` with no skip/limit) — could be slow with many records
9. **Blog post content is plain text:** Stored and rendered as `whitespace-pre-wrap` — no rich text/Markdown support
10. **Hardcoded locations in CoursesSection:** The location filter is hardcoded to "Alger", "Oran", "Constantine" — not dynamic from course data
11. **`to_get_inspired_from/` directory:** Contains an old Vite/React prototype — not part of the app but ships in the repo
12. **`design_assets/` gitignored:** The brand guidelines, source files, and fonts are excluded from git — only the processed/copied versions remain in `public/`
13. **No i18n framework:** French translation is hardcoded inline — no react-intl/next-intl
14. **Client-side navigation on logout:** `AdminLoginForm` uses `window.location.assign()` instead of Next.js router for redirect after login

---

## Development Workflows

### Adding a New Admin CRUD Entity
1. Create Mongoose model in `models/NewEntity.ts`
2. Add TypeScript type in `types/index.ts`
3. Create Zod validator in `lib/validators/new-entity.ts`
4. Add query functions in `lib/data/queries.ts`
5. Add serializer in `lib/data/serialize.ts`
6. Create API routes in `app/api/admin/new-entity/route.ts` (GET/POST) and `[id]/route.ts` (PATCH/DELETE)
7. Create form component in `components/admin/NewEntityForm.tsx`
8. Create pages in `app/admin/new-entity/page.tsx` (list), `new/page.tsx` (create), `[id]/edit/page.tsx` (edit)
9. Add navigation item in `lib/admin/navigation.ts`
10. Add stat card on dashboard in `app/admin/page.tsx` (optional)

### Adding a New Public Form
1. Create Zod validator in `lib/validators/new-form.ts`
2. Create form component in `components/forms/NewForm.tsx`
3. Create API route in `app/api/new-form/route.ts`
4. Add form to the appropriate page/section

### Running Locally
```bash
# First time setup
cp .env.local.example .env.local  # (doesn't exist yet — create manually)
npm install
npm run seed:admin

# Development
npm run dev
# → http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

---

## File-Specific Notes

### [lib/db/connect.ts](lib/db/connect.ts)
- Uses global caching pattern (`globalThis.mongooseCache`) to prevent multiple connections in dev hot-reload
- `connectToDatabase()` — throws on failure (use in API routes)
- `tryConnectToDatabase()` — returns boolean, logs error (use in Server Components for graceful degradation)
- `hasDatabaseConfig()` — checks if `MONGODB_URI` is set

### [lib/data/queries.ts](lib/data/queries.ts)
- All functions check DB availability first via `ensureDb()`
- `resolveCategory()` handles both populated and non-populated `categoryId` (defensive)
- `getAdminStats()` returns counts for 11 collections (dashboard)
- `getUpcomingCourses()` filters by `date >= today`

### [lib/auth/admin-user.ts](lib/auth/admin-user.ts)
- `authenticateAdmin()`: DB lookup → bcrypt compare → env var fallback → upsert
- The env var fallback allows first-time login when no admin exists in DB yet

### [middleware.ts](middleware.ts)
- Edge-compatible (uses `NextResponse`, no Node.js APIs)
- `publicAdminPaths`: `/admin/login`, `/api/admin/login` (unprotected)
- Redirect preserves intended destination via `?next=` query param

### [tailwind.config.ts](tailwind.config.ts)
- All colors under `dentova.*` namespace — never use raw hex in components
- Custom shadows, gradients, and font families defined here
- Content paths: `./app/**`, `./components/**`, `./lib/**`
