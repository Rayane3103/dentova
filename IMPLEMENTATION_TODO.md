# Dentova Implementation Todo

This checklist tracks progress against `DENTOVA_BUILD_PLAN.md`.

## Phase 0: Project Setup

- [x] Read `DENTOVA_BUILD_PLAN.md` and `AGENT_START_PROMPT.md`.
- [x] Inspect key screenshots and brand assets.
- [x] Create baseline app directory structure while preserving `project-materials/` and `design_assets/`.
- [x] Copy selected logo, logomark, pattern, font, and screenshot-derived placeholder images into `public/`.
- [x] Add package/config files for Next.js, TypeScript, Tailwind, ESLint, and Vercel image settings.
- [x] Add `.env.local.example` with MongoDB, Cloudinary, JWT, and site URL variables.
- [x] Install dependencies.
- [x] Run initial lint/build verification.
- [x] Run runtime HTTP smoke checks for homepage, course detail, admin login, and admin route protection.

## Phase 1: Brand and Layout

- [x] Load Darker Grotesque globally.
- [x] Define Dentova Tailwind theme tokens.
- [x] Build shared navbar/footer.
- [x] Build reusable UI primitives.
- [x] Implement public static sections from screenshots.

## Phase 2: Database and Auth

- [x] Add MongoDB connection helper.
- [x] Add data models.
- [x] Add validation schemas.
- [x] Add admin authentication.
- [x] Protect admin routes with middleware.
- [x] Add seed admin script.

## Later Phases

- [ ] Courses/categories CRUD.
- [ ] Cloudinary upload integration.
- [ ] Public dynamic course list and details.
- [ ] Gallery CRUD and public gallery.
- [ ] Reservation/contact/feedback/newsletter persistence.
- [ ] Admin submission lists and moderation.
- [ ] Full responsive, SEO, accessibility, lint, and build QA.
