# Dentova — CLAUDE.md

## Tech Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5.7
- **Styling:** Tailwind CSS 3.4 (custom `dentova-*` tokens)
- **Database:** MongoDB + Mongoose 8 (Atlas cluster)
- **Auth:** JWT (jose) + bcryptjs, httpOnly cookies
- **Forms:** react-hook-form + zod (@hookform/resolvers)
- **UI:** framer-motion, lucide-react, sonner (toasts)
- **Media:** Cloudinary SDK
- **Email:** Nodemailer (optional SMTP)

## Project Structure
```
app/(site)/    → Public pages (home, courses, inscription, legal)
app/admin/     → Admin pages (dashboard, CRUD for all entities)
app/api/       → Route handlers (public + admin)
components/    → admin/ forms/ layout/ public/ ui/
lib/           → auth/ data/ db/ validators/ + utils, mail, cloudinary
models/        → Mongoose schemas (11 models)
types/         → Shared TypeScript interfaces
middleware.ts  → JWT cookie check for /admin/* routes
```

## Key Architecture Rules
1. **Server Components** for data fetching → use `queries.ts` + `serialize.ts`
2. **Client Components** only for interactivity (forms, animations, state)
3. **All API routes** follow: parse → Zod validate → check DB config → connect → execute → respond
4. **Admin pages** wrapped in `AdminShell` (sidebar + mobile drawer)
5. **Graceful degradation** when MongoDB is unavailable (return empty arrays)
6. **`force-dynamic`** on all Server Component pages

## Conventions
- `cn()` from `lib/utils.ts` for conditional class merging
- Use `dentova-*` Tailwind tokens only (no raw hex colors)
- Zod schemas in `lib/validators/` → shared between API and forms
- Admin forms use classes from `components/admin/admin-ui.ts`
- Type updates go in `types/index.ts`

## Data Flow
```
Server Component → queries.ts → Mongoose → serialize.ts → RSC render
Client Form → fetch(POST /api/...) → route handler → Zod → Mongoose create
```

## Auth Flow
```
Login POST → authenticateAdmin() (DB check, then env fallback)
→ JWT cookie (HS256, 7d, httpOnly)
Middleware → verify JWT on /admin/*, /api/admin/*
Logout POST → clear cookie
```

## Important Notes
- `.env.local` contains **real credentials** (MongoDB URI, admin password, JWT secret) — treat as sensitive
- Cloudinary env vars are empty (not configured)
- SMTP env vars are empty (email notifications silently skip if unset)
- The `to_get_inspired_from/` dir is an old Vite/React prototype — not part of the app
- For deep-dive: see memory file `full-technical-report.md` in the project's memory directory
