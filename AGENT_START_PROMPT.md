# Agent Start Prompt

Copy and paste this prompt when you want Codex or another agent to start or continue the Dentova rebuild.

---

You are working in `C:\Users\rayan\Desktop\detnova`.

Build a Vercel-ready full-stack Next.js rebuild of the Dentova events/course website. Do not treat this as a static landing page. It must include a protected admin dashboard where the admin manages dynamic courses, categories, workshop/gallery images, and later reservations/messages/feedback.

Before coding, read:

- `DENTOVA_BUILD_PLAN.md`
- Especially `DENTOVA_BUILD_PLAN.md` section 3, "Project File Structure"
- All screenshots in `project-materials/screenshots/`
- Brand assets in `design_assets/`

The screenshots are the visual and functional baseline. Recreate the same product and make it better where sensible: cleaner responsive behavior, nicer admin UX, better validation, faster image loading, polished loading/empty/error states, and production-ready structure.

Important project constraints:

- Hosting target: Vercel
- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: lucide-react
- Database: MongoDB Atlas
- Image storage/CDN: Cloudinary
- Image rendering: Next/Image
- Auth: protected admin login with secure httpOnly cookie/JWT or Auth.js credentials
- Do not use static export
- Do not hardcode secrets
- Do not delete or overwrite `project-materials/` or `design_assets/`
- Preserve user-provided assets and screenshots

Expected public website:

- Home page with Dentova navbar, hero, about section, courses section, testimonials, FAQ, partners, feedback, contact, footer
- Dynamic course list with category filters
- Dynamic course detail page with image, course details, description, reservation form, included-benefits card, and workshop gallery
- Legal pages: privacy, terms, cookies
- Good mobile layouts
- Fast image loading, accurate `sizes`, lazy loading below fold, priority hero media

Expected admin dashboard:

- Admin login/logout
- Dashboard/course management table
- Add/edit/delete course
- Add/edit/delete category
- Add/edit/delete workshop/gallery image
- Toggle featured course
- Toggle show on homepage
- Toggle published/hidden
- Later or if time permits: reservations, contact messages, feedback approval, newsletter subscribers

Use these initial data models:

- `AdminUser`
- `Category`
- `Course`
- `WorkshopImage`
- `Reservation`
- `Feedback`
- `ContactMessage`
- `NewsletterSubscriber`

The course form must support the fields visible in `project-materials/screenshots/new_course.png`:

- title
- description
- image upload or image URL
- category
- instructor
- date
- time
- location
- price in DA
- contact phone
- contact email
- featured course
- show on homepage
- published status

Implementation approach:

1. If no Next.js app exists yet, scaffold the project in the current folder while preserving the material folders.
2. Add `.env.local.example`.
3. Configure Tailwind with Dentova colors and local Darker Grotesque font.
4. Build shared layout, navbar, footer, and design primitives.
5. Build public pages first with temporary static placeholders only where database wiring is not ready.
6. Add MongoDB models and connection helper.
7. Add admin auth and protected admin layout.
8. Add category CRUD.
9. Add course CRUD with Cloudinary upload.
10. Replace public course placeholders with real database-backed data.
11. Add course detail and reservation flow.
12. Add gallery CRUD and public gallery.
13. Add contact, feedback, and newsletter forms.
14. Add admin views for submissions if time permits.
15. Run `npm run lint` and `npm run build`.

Verification requirements:

- Do not finish with only code edits. Run lint/build if dependencies are installed.
- If dependency install or network access is blocked, explain exactly what could not be verified.
- Use browser/screenshot verification for the public homepage, course page, and admin dashboard when possible.
- Report changed files and any remaining setup needed for Vercel, MongoDB Atlas, and Cloudinary.

When starting, first inspect the current filesystem state. If work already exists, continue from it without overwriting unrelated user changes. If the user only asks for planning, do not code.

---
