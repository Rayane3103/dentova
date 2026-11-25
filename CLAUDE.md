# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Dentova - CLAUDE.md

> **Last updated:** 2026-11-16
> **App version:** `package.json` reports `dentova-rebuild@0.1.0` (not bumped per release)

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
| Framework | Next.js (App Router) | 15.1 |
| Runtime | React + TypeScript | 19.0 / 5.7 |
| Styling | Tailwind CSS | 3.4 |
| Database | MongoDB (Atlas) + Mongoose | 8.9 |
| Auth | JWT via `jose` + `bcryptjs` | 5.9 / 2.4 |
| Forms | react-hook-form + zod | 7.54 / 3.24 |
| Animation | framer-motion | 11.15 |
| Icons | lucide-react | 0.468 |
| Toasts | sonner | 1.7 |
| Media | Cloudinary SDK | 2.5 |
| Email | Nodemailer | 8.0 |
| Spreadsheets | exceljs + google-auth-library | 4.4 / 10.9 |
| PDF | jspdf + jspdf-autotable | 4.2 / 5.0 |

**No state management library.** Reads go through React Server Components (`lib/data/queries.ts`); client state is local (`useState` / `useForm`).

**No `googleapis` SDK** - the Sheets integration calls the REST API directly with a service-account JWT, to keep the serverless bundle small.

## Project Structure

```
app/
  layout.tsx                     -> Root layout: fonts, metadata, GTM, PixelScripts, TopLoader, Toaster
  globals.css                    -> CSS variables, scrollbar, marquee animation
  loading.tsx / not-found.tsx    -> Global spinner / 404
  login/page.tsx                 -> UNIFIED login (admin + marketer)
  (site)/                        -> PUBLIC PAGES - Navbar + Footer, force-dynamic
    page.tsx                     -> Homepage (Hero, About, Courses, Sponsors, Blog, Testimonials, FAQ, Contact, Gallery)
    about|privacy|terms|cookies  -> Static content pages
    inscription/page.tsx         -> Standalone signup page
    blog/page.tsx                -> Blog listing
    blog/[slug]/page.tsx         -> Single post with like button
    courses/page.tsx             -> Catalog with category + city filters
    courses/[slug]/page.tsx      -> Course detail, reservation form, Product JSON-LD
    courses/[slug]/thank-you/    -> Post-reservation page - fires the Purchase conversion
  admin/                         -> ADMIN CONSOLE (middleware-protected, role: admin)
    layout.tsx, loading.tsx, page.tsx   -> AdminShell, skeleton, dashboard
    login/page.tsx               -> Legacy login (superseded by /login)
    courses|categories|mentors|posts|sponsors|workshop-images|faqs/
                                 -> list + new/ + [id]/edit/ CRUD triads
    reservations/page.tsx        -> CRM: search, filter, paginate, inline edit, export, Sheets sync
    abandoned-carts/page.tsx     -> "Paniers oublies" - unconverted reservation drafts
    signups|messages|newsletter|feedback/  -> Client records, inbox, subscribers, moderation
  marketer/                      -> MARKETER CONSOLE (middleware-protected, role: marketer)
    layout.tsx, page.tsx         -> MarketerShell, marketing dashboard
    login/page.tsx               -> Legacy login (superseded by /login)
    pixels/page.tsx              -> Meta/TikTok pixel management
    reservations|subscribers|feedback|messages/  -> Stubs pointing at the admin console
  api/
    auth/login|logout            -> UNIFIED auth - tries marketer, then admin
    courses, courses/[slug]      -> Public course reads
    contact|feedback|newsletter|signup    -> Public form submissions
    reservations/route.ts        -> Create reservation (+ draft conversion, Sheets sync via after())
    reservations/draft/route.ts  -> Upsert abandoned-cart draft as the visitor types
    admin/
      login|logout|upload        -> Session + Cloudinary upload
      categories|courses|faqs|mentors|posts|sponsors|workshop-images/
                                 -> GET/POST + [id] PATCH/DELETE
      reservations/              -> GET/PATCH, [id] detail, sheet/ (manual Sheets sync)
      abandoned-carts/route.ts   -> GET/PATCH abandoned drafts
      signups|messages|newsletter|feedback/  -> Read + status updates
      posts/like/route.ts        -> Toggle like (reads session directly)
    marketer/
      login|logout|stats         -> Session + aggregated KPIs
      pixels/, pixels/[id]       -> Pixel CRUD

components/
  auth/UnifiedLoginForm.tsx      -> Role-detecting login form
  admin/                         -> AdminShell, Sidebar, TopBar, MobileDrawer, NavLinks, Header,
                                    StatCard, Table, DataTable, ConfirmDialog, DeleteButton,
                                    EmptyAdminState, StatusBadge, AdminScrollLock, admin-ui.ts
                                    ReservationsCRM, AbandonedCartsList, SignupsList,
                                    FeedbackAdminPanel, CoursesTableClient,
                                    ExportMenu, ReservationsSheetButton,
                                    CourseQuestionsBuilder, ImageUploadField,
                                    CourseForm, CategoryForm, MentorForm, PostForm,
                                    SponsorForm, FAQForm, WorkshopImageForm
  marketer/                      -> MarketerShell, Sidebar, TopBar, MobileDrawer, NavLinks,
                                    Header, StatCard, TrendIndicator, AnalyticsChart,
                                    PixelManager, MarketerLoginForm
  forms/                         -> ContactForm, FeedbackForm, NewsletterForm, ReservationForm,
                                    SignupForm, FormField, StarRating, use-reservation-draft.ts
  layout/                        -> Navbar, Footer, TopLoader, GoogleTagManager,
                                    PixelScripts, MetaPixelScript
  marketing/                     -> CourseViewContentTracker, ReservationConversionTracker
  public/                        -> HeroSection, AboutSection, CoursesSection, CourseCard,
                                    CoursePriceCard, SponsorsBar, BlogSection, FAQSection,
                                    TestimonialsSection, WhyParticipateSection, ContactSection,
                                    ImageGallery, LegalPage, SectionHeader, MotionReveal,
                                    MotionCounter, StaggerContainer, ParallaxBlob, PostLikeButton
                                    (HeroSection.previous.tsx is a superseded leftover)
  ui/                            -> Button, Input, Textarea, Select, Checkbox, Badge, Card,
                                    Container, FileUpload, ConfirmDialog, SuccessDialog,
                                    AdminPageSkeleton, AdminFormSkeleton, PublicPageSkeleton

lib/
  admin/navigation.ts            -> Admin sidebar groups + active-path logic
  marketer/navigation.ts         -> Marketer sidebar groups
  auth/                          -> admin-user, marketer-user, session (jose), cookies, password
  data/
    queries.ts                   -> All server-side reads (returns [] / null when DB is down)
    serialize.ts                 -> Mongoose doc -> typed object converters
    reservation-record.ts        -> Reservation filters, status counts, RESERVATIONS_PAGE_SIZE
    abandoned-cart.ts            -> Abandon threshold, filters, counts, completeness
    abandoned-cart-convert.ts    -> markDraftConverted()
  db/connect.ts                  -> Connection singleton: connectToDatabase / tryConnect / hasDatabaseConfig
  export/table-export.ts         -> CSV / Excel / PDF export for any admin table
  integrations/
    google-sheets.ts             -> Service-account REST client (Sheets + Drive)
    reservations-sheet.ts        -> Reservations -> spreadsheet mirror
  marketing/                     -> track-meta-event.ts, meta-course-tracking.ts
  validators/                    -> One Zod schema per entity, shared server + client
  cloudinary.ts, constants.ts, format.ts, mail.ts, slug.ts, utils.ts, youtube.ts

models/                          -> 17 Mongoose schemas (see Database Structure)
types/index.ts                   -> Shared TypeScript types - keep in sync with the models
middleware.ts                    -> Edge auth guard with role enforcement
scripts/seed-admin.ts            -> Seeds admin + marketer from env vars
public/                          -> brand/ (logos, patterns), fonts/, images/
to_get_inspired_from/            -> Old Vite prototype - NOT part of the app, fails lint
```

## Marketer View

A dedicated marketing dashboard with its own authentication, separate from the admin console.

### Authentication
- **Parallel to admin:** Uses same JWT secret (`ADMIN_JWT_SECRET`), different cookie (`dentova_marketer_session`)
- **Credential bootstrap:** `MARKETER_EMAIL`, `MARKETER_PASSWORD`, `MARKETER_NAME` in `.env.local`
- **Seed script:** `npm run seed:admin` now seeds both admin AND marketer accounts
- **Middleware:** Protects `/marketer/:path*` and `/api/marketer/:path*`, and rejects an admin token at those paths (role is checked, not just presence)
- **Login:** via the unified `/login` page - see Authentication & Authorization below
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

## Marketing & Conversion Tracking

The marketer console (above) manages *which* pixels fire; this layer is *how* events reach them on the public site. It is a two-part system — pixel bootstrap in the root layout, and per-page event trackers — and it degrades gracefully when no pixel is configured.

### Pixel Bootstrap (root layout)
- **`components/layout/PixelScripts.tsx`** (server component, injected in `app/layout.tsx`) fetches `Pixel.find({ active: true })` from MongoDB and injects the tracking library `<script>` tags. Meta falls back to `NEXT_PUBLIC_META_PIXEL_ID` when no active Meta pixel exists in the DB; TikTok has no env fallback. Returns `null` (injects nothing) if the DB is down or no pixels are active — never breaks the page.
- **`components/layout/MetaPixelScript.tsx`** — `MetaFbeventsLoader` loads `fbevents.js` and the `fbq` stub **once**; `MetaPixelInit` runs `fbq('init', id)` + `fbq('track', 'PageView')` per pixel ID (plus a `<noscript>` fallback pixel). Split so init still runs even if GTM already created the `fbq` stub. TikTok uses its own inline loader in `PixelScripts.tsx`.

### Event Trackers (client components)
Rendered inside specific public pages; each returns `null` and only fires side effects in a `useEffect`:
- **`components/marketing/CourseViewContentTracker.tsx`** — fires `ViewContent` on course detail and thank-you pages.
- **`components/marketing/ReservationConversionTracker.tsx`** — fires `Purchase` (with DZD `value`) on the reservation thank-you page. **Deduplicated** via `sessionStorage` keyed on `reservation-<reservationId>`, and passes a stable `eventID` so browser-pixel + server-side (CAPI/GTM) events can be deduplicated downstream. Skips when `reservationId` is missing or `value <= 0`.

### Event Dispatch Helpers (`lib/marketing/`)
- **`track-meta-event.ts`** — `trackViewContent()` / `trackPurchase()`. Each pushes a **neutral `dataLayer` event** (`dentova_view_content` / `dentova_purchase`, plus an optional named event) for GTM consumers, then calls `fbq('track', ...)` directly. If `fbq` isn't ready yet it **polls** (100 ms × 50 attempts) rather than dropping the event. Meta event names are not hardcoded at call sites — they route through these helpers.
- **`meta-course-tracking.ts`** — `getCourseTrackingPayload()` builds the shared `content_ids` / `content_name` / `value` / `currency` (DZD) payload from a course.

### Reservation → Thank-You Flow
`ReservationForm` submits to `POST /api/reservations`, then does a **full-page redirect** to `/courses/[slug]/thank-you?reservation=<id>` (`app/(site)/courses/[slug]/thank-you/page.tsx`). That page is `robots: { index: false }` and hosts both trackers — this is where the `Purchase` conversion fires. When editing the reservation flow, preserve the `?reservation=` id in the redirect or conversion tracking silently stops.

### Relevant env var
| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Fallback Meta pixel ID when no active DB pixel exists |

## Reservation Funnel

The highest-value path in the app. Four pieces, in order:

### 1. Per-course questionnaires
`Course.questions[]` holds an optional list of `{ id, label, type: "text" | "select", required, options[], allowMultiple }`. Built in the admin via [components/admin/CourseQuestionsBuilder.tsx](components/admin/CourseQuestionsBuilder.tsx), rendered by `ReservationForm`, and stored back on the reservation as `answers[]` with the label **denormalised** — so renaming a question later does not rewrite historical answers.

### 2. Abandoned-cart capture ("Paniers oubliés")
- `POST /api/reservations/draft` upserts an `AbandonedCart` row **as the visitor types**, keyed `{ courseId, sessionKey }` (unique index). Client hook: [components/forms/use-reservation-draft.ts](components/forms/use-reservation-draft.ts)
- "Abandoned" is **derived at query time**, never stored: `converted: false` plus `lastActivityAt` older than `ABANDON_THRESHOLD_MINUTES` (currently **5 minutes**, [lib/data/abandoned-cart.ts](lib/data/abandoned-cart.ts)). No cron job exists or is needed
- On successful reservation, `markDraftConverted()` ([lib/data/abandoned-cart-convert.ts](lib/data/abandoned-cart-convert.ts)) flips `converted` and links `reservationId`
- Admin UI at `/admin/abandoned-carts`; rows carry a `new | contacted | lost` status and an "x/5 champs" completeness column

### 3. Reservation submit
`POST /api/reservations` validates, creates the `Reservation`, then runs follow-up work inside Next's `after()` so the response is not blocked: marking the draft converted and syncing the Sheet.

### 4. Thank-you page and conversion tracking
Full-page redirect to `/courses/[slug]/thank-you?reservation=<id>` — `robots: { index: false }` — which hosts both trackers. **Preserve the `?reservation=` id in any change to this flow, or the Purchase conversion silently stops firing.**

---

## Admin Tooling

### Exports
[lib/export/table-export.ts](lib/export/table-export.ts) — `exportTable()` renders any column set to **CSV, Excel (exceljs) or PDF (jspdf + jspdf-autotable)**, entirely client-side. Surfaced through [components/admin/ExportMenu.tsx](components/admin/ExportMenu.tsx) on the reservations, signups and abandoned-carts tables.

### Google Sheets sync (reservations)
- [lib/integrations/google-sheets.ts](lib/integrations/google-sheets.ts) — a thin REST client over the Sheets and Drive APIs using a service-account JWT (`google-auth-library`). No `googleapis` SDK
- [lib/integrations/reservations-sheet.ts](lib/integrations/reservations-sheet.ts) — builds the French header matrix and rewrites the tab. Creates the spreadsheet on first use (or adopts `GOOGLE_SHEETS_RESERVATIONS_ID`), shares it with `GOOGLE_SHEETS_SHARE_EMAIL`, and records it in the `SheetLink` collection
- Triggered automatically after each reservation, and manually via `POST /api/admin/reservations/sheet` ([components/admin/ReservationsSheetButton.tsx](components/admin/ReservationsSheetButton.tsx))
- Note the deliberate `import "@/models/Course"` side-effect import — without it the `populate("courseId")` fails in a cold serverless context

### Pagination and filtering
[lib/data/reservation-record.ts](lib/data/reservation-record.ts) and [lib/data/abandoned-cart.ts](lib/data/abandoned-cart.ts) each export a `build*Filter()` plus status-count aggregation helpers, paging at 25 rows. Other admin lists are still unpaginated.

---

## Database Structure (17 MongoDB Models)

All models use Mongoose with `{ timestamps: true }`. The pattern `mongoose.models.X || mongoose.model("X", schema)` prevents re-registration during hot reload.

### Relationships
- **Course** → `categoryId` refs **Category** (populated on read)
- **Reservation** → `courseId` refs **Course** (populated on read)
- **AbandonedCart** → `courseId` refs **Course**, `reservationId` refs **Reservation** once converted
- **Post.likes** → array of ObjectIds refs **AdminUser**
- All other collections are independent

### Model-by-Model Summary

| Model | Key Fields | Purpose |
|---|---|---|
| AdminUser | email (unique), passwordHash, name, role | Admin account (bootstrap from env) |
| MarketerUser | email (unique), passwordHash, name, role | Marketer account (bootstrap from env) |
| Category | name, slug (unique), description, sortOrder | Course taxonomy |
| Course | title, slug (unique), categoryId, **courseType** (`formation`\|`cycle`), **cycleDates[]**, instructor, date, time, location, price, imageUrl, **youtubeUrl**, **questions[]**, published, featured, showOnHomepage, maxSeats | Core catalog |
| Reservation | courseId, fullName, email, phone, wilaya, profession, **answers[]**, status (`pending`\|`confirmed`\|**`paid`**\|`cancelled`) | Course bookings |
| AbandonedCart | courseId, sessionKey, partial contact fields, answers[], attempts, status (`new`\|`contacted`\|`lost`), converted, convertedAt, reservationId, lastActivityAt | Partially filled reservation forms |
| ClientSignup | fullName, email, phone, wilaya, profession, courseInterest, newsletterOptIn, status | General interest registrations |
| ContactMessage | fullName, email, phone, message, status (`new`\|`read`\|`archived`) | Contact form inbox |
| NewsletterSubscriber | email (unique) | Email list |
| Feedback | fullName, message, rating, approved, showOnHomepage | Moderated testimonials |
| Post | caption, content, imageUrl, slug, published, likes[] | Blog articles |
| FAQ | question, answer, category, published, sortOrder | FAQ accordion |
| Mentor | name, title, imageUrl, bio, specialty, active, showOnHomepage, order | Instructor profiles |
| Sponsor | name, imageUrl, websiteUrl, order, active | Partner logos (`SponsorsBar`) |
| WorkshopImage | title, imageUrl, order, active | Photo gallery |
| Pixel | platform (`meta`\|`tiktok`, unique), pixelId, label, active, verifiedAt, notes | Tracking pixels |
| SheetLink | resource (unique), spreadsheetId, spreadsheetUrl, sheetId, lastSyncedAt | Google Sheets mirror bookkeeping |

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

Two parallel roles — **admin** and **marketer** — sharing one JWT secret, one login page, and one middleware, but separate cookies and separate areas of the app.

### Unified Login
- **One page for both roles:** `/login` ([app/login/page.tsx](app/login/page.tsx)) rendering [components/auth/UnifiedLoginForm.tsx](components/auth/UnifiedLoginForm.tsx)
- `POST /api/auth/login` tries `authenticateMarketer()` **first**, then `authenticateAdmin()`, and returns `{ ok, role, redirectTo }` so the client knows where to go (`/marketer` or `/admin`)
- The legacy `/admin/login` and `/marketer/login` pages still exist; `/login` is the current entry point

### Sessions
- JWT signed with `jose`, HS256, 7-day expiry, secret `ADMIN_JWT_SECRET`
- Cookies are `httpOnly`, `sameSite: lax`, `secure` in production:
  - `dentova_admin_session` → payload `{ adminId, email, role: "admin" }`
  - `dentova_marketer_session` → payload `{ marketerId, email, role: "marketer" }`
- Helpers live in [lib/auth/cookies.ts](lib/auth/cookies.ts) and [lib/auth/session.ts](lib/auth/session.ts)

### Authorization
[middleware.ts](middleware.ts) guards `/admin/*`, `/api/admin/*`, `/marketer/*`, `/api/marketer/*`. It checks the **role claim**, not merely the presence of a token — an admin cookie is rejected at `/marketer` and vice versa. Failures redirect to `/login?next=<path>`.

`POST /api/admin/posts/like` is the exception: it reads the session directly via `getAdminSession()` rather than relying on the matcher.

### Bootstrap
- `npm run seed:admin` → [scripts/seed-admin.ts](scripts/seed-admin.ts) upserts **both** accounts from env vars
- `authenticateAdmin()` / `authenticateMarketer()` check the DB first, then fall back to env vars and upsert — so first-time login works before seeding

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
| SiteLayout | [app/(site)/layout.tsx](<app/(site)/layout.tsx>) | Navbar + Footer, force-dynamic |
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

Defined in `.env.local` (contains production credentials — **never commit**; `.gitignore` covers `.env*.local`):

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `ADMIN_JWT_SECRET` | Yes | HS256 signing key — shared by admin and marketer sessions |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin. Feeds `metadataBase`, `siteConfig.url` and course structured data. **Set this in Vercel**, not just locally |
| `ADMIN_EMAIL` | Yes | Admin login email (bootstrap + fallback auth) |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `ADMIN_NAME` | Optional | Admin display name (default: "Admin1") |
| `MARKETER_EMAIL` | Optional* | Marketer login email (*required for marketer access) |
| `MARKETER_PASSWORD` | Optional* | Marketer login password |
| `MARKETER_NAME` | Optional | Marketer display name (default: "Dentova Marketing") |
| `CLOUDINARY_CLOUD_NAME` | Optional* | *Required for image upload |
| `CLOUDINARY_API_KEY` | Optional* | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Optional* | Cloudinary API secret |
| `SMTP_HOST` | Optional* | *All four SMTP vars plus `CONTACT_TO_EMAIL` are required together |
| `SMTP_PORT` | Optional | SMTP port (default 587; 465 switches to implicit TLS) |
| `SMTP_USER` | Optional* | SMTP username — also used as the `From` address |
| `SMTP_PASS` | Optional* | SMTP password (for Gmail: a 16-character App Password) |
| `CONTACT_TO_EMAIL` | Optional* | Destination inbox for contact notifications |
| `NEXT_PUBLIC_GTM_ID` | Optional | Google Tag Manager container ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Fallback Meta pixel ID when no active DB pixel exists |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Optional* | *Required for the reservations → Google Sheets sync |
| `GOOGLE_PRIVATE_KEY` | Optional* | Service-account private key (newlines escaped as `
`) |
| `GOOGLE_SHEETS_SHARE_EMAIL` | Optional | Google account granted editor access to auto-created sheets |
| `GOOGLE_SHEETS_RESERVATIONS_ID` | Optional | Existing spreadsheet ID to sync into instead of creating one |

Every optional integration degrades silently rather than throwing — check the env var before concluding a feature is broken.

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
npm run lint         # eslint . --max-warnings=0 (CI-strict: any warning fails)
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

1. **No testing:** Zero automated tests — no Jest/Vitest/Playwright config and no test files, despite 17 models and a reservation funnel
2. **No rate limiting:** Public API routes (contact, feedback, newsletter, reservations, signup, reservation drafts) have no throttling. `POST /api/reservations/draft` fires repeatedly as a visitor types, so it is the most exposed
3. **Single admin role:** `AdminUser.role` is an enum of `["admin"]` only — no granularity below the admin/marketer split
4. **Cloudinary optional:** Image upload UI exists but requires `CLOUDINARY_*` env vars; without them `lib/cloudinary.ts` throws
5. **SMTP optional:** `sendContactNotification()` silently returns `{ sent: false, reason: "mail_not_configured" }` when SMTP vars are unset. Contact messages still save to MongoDB — nobody is notified. Verify env vars before assuming mail is broken
6. **No capacity enforcement:** `Course.maxSeats` is stored and displayed but never checked against reservation count — no waitlist, no sold-out state
7. **Post.likes reference AdminUser:** only authenticated admins can like a blog post
8. **Pagination is partial:** reservations and abandoned carts page at 25 rows (`RESERVATIONS_PAGE_SIZE`, `ABANDONED_CARTS_PAGE_SIZE`). Every other admin list still does `find({})` with no limit
9. **Blog content is plain text:** rendered with `whitespace-pre-wrap` — no Markdown or rich text
10. **Hardcoded locations:** the city filter in `CoursesSection` is fixed to Alger / Oran / Constantine rather than derived from course data
11. **`to_get_inspired_from/`:** an old Vite/React prototype that still ships in the repo and fails `npm run lint` — lint errors from that directory are pre-existing, not yours
12. **`HeroSection.previous.tsx`:** a superseded copy of the hero left in `components/public/`
13. **`tsconfig.tsbuildinfo` is tracked:** a build artifact in git, so it shows as modified after every build
14. **No i18n framework:** French copy is hardcoded inline
15. **`NEXT_PUBLIC_SITE_URL` matters more than it looks:** it feeds `metadataBase`, `siteConfig.url`, the course Product markup and the Sheets links. If unset it falls back to `http://localhost:3000`

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
# Login: http://localhost:3000/login  (admin and marketer share this page)
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
- `getAdminStats()` returns 12 dashboard counts; several models are imported dynamically inside the `Promise.all` to keep the Edge/serverless bundle lean
- `getUpcomingCourses()` filters by `date >= today`

### [lib/auth/admin-user.ts](lib/auth/admin-user.ts)
- `authenticateAdmin()`: DB lookup → bcrypt compare → env var fallback → upsert
- The env var fallback allows first-time login when no admin exists in DB yet

### [middleware.ts](middleware.ts)
- Edge-compatible (uses `NextResponse`, no Node.js APIs)
- Matches `/admin/:path*`, `/api/admin/:path*`, `/marketer/:path*`, `/api/marketer/:path*`
- `publicPaths`: `/login`, `/api/auth/login` — allowed through before any matcher logic
- **Enforces role, not just presence of a token**: an admin cookie cannot reach `/marketer`, and vice versa. A token whose `role` claim does not match the area is rejected like a missing one.
- All failures redirect to `/login?next=<original path>`

### [tailwind.config.ts](tailwind.config.ts)
- All colors under `dentova.*` namespace — never use raw hex in components
- Custom shadows, gradients, and font families defined here
- Content paths: `./app/**`, `./components/**`, `./lib/**`
