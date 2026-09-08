# FAYMS website

A full website + admin dashboard for FAYMS, a digital solutions company.
Built with Next.js (App Router, TypeScript), Tailwind CSS, and SQLite.

- **Public site**: Home / About / Services / Our Work / Why FAYMS / Process / Contact
- **Admin dashboard**: secure login, add/edit/delete projects, publish/unpublish,
  image upload, and a contact-message inbox
- **Auth**: bcrypt-hashed passwords, signed JWT session cookies (httpOnly), no
  credentials hardcoded anywhere in the code
- **Database**: SQLite file at `data/fayms.db`, created automatically on first run

---

## 1. How to run the website

```bash
npm install
cp .env.example .env.local   # then edit .env.local, see below
npm run create-admin         # creates your admin account, see section 2
npm run dev                  # starts the dev server at http://localhost:3000
```

For a production run locally:

```bash
npm run build
npm run start
```

### Environment variables (`.env.local`)

| Variable | Required | Purpose |
|---|---|---|
| `SESSION_SECRET` | Yes | Long random string used to sign admin session tokens. A ready-made one has already been placed in `.env.local` for you — generate a new one for real deployments with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | No | Your live domain, used for SEO/Open Graph tags, e.g. `https://fayms.sa` |

Never commit `.env.local` — it's already in `.gitignore`.

---

## 2. How to create the admin account

Admin credentials are never hardcoded. Create the account from the command line,
which hashes the password with bcrypt before storing it:

```bash
npm run create-admin -- --username admin --password "a-strong-password-here"
```

Or run it with no flags and it will prompt you interactively:

```bash
npm run create-admin
```

Running the command again with the same username resets that admin's password —
useful if you forget it. Use a password with at least 10 characters.

---

## 3. How to log in to the dashboard

1. Go to `/admin/login` (e.g. `http://localhost:3000/admin/login`)
2. Enter the username/password you created in step 2
3. You'll land on `/admin/dashboard`

All `/admin/*` pages and `/api/admin/*` routes are protected by middleware —
visiting them while logged out redirects you straight to the login page.
Sessions last 7 days; use **Log out** in the dashboard header to end one early.

---

## 4. How to add a new project

1. In the dashboard, click **Add project**
2. Fill in the name, category, description, and optional project URL
3. Upload an image (JPG/PNG/WEBP/GIF, 5MB max) — it's stored in `public/uploads`
4. Click **Add project**

New projects are published by default and appear immediately in the **Our Work**
section of the public site — no redeploy needed, since it reads live from the
database.

## 5. How to edit / delete / publish projects

From the dashboard project list:
- **Edit** — opens the same form pre-filled; save to update
- **Publish / Unpublish** — toggles visibility on the public site without
  deleting the project
- **Delete** — permanently removes the project (and its uploaded image, if any)
  after a confirmation prompt

---

## 6. How to deploy the website online

This project needs a Node.js server (it's not a static export), because of the
SQLite database and image uploads. Two straightforward options:

### Option A — a VPS / any Node host (Hetzner, DigitalOcean, etc.)
```bash
git clone <your-repo>
cd fayms
npm install
npm run build
npm run create-admin -- --username admin --password "..."
npm run start   # or run it behind pm2 / systemd, proxied by nginx on port 443
```
Make sure `data/` and `public/uploads/` are on **persistent** disk (not wiped on
redeploy), and that `.env.local` (with a real `SESSION_SECRET`) is present on
the server.

### Option B — Vercel (or similar serverless platform)
Vercel's filesystem is **read-only and ephemeral** at runtime, so SQLite and
local image uploads won't persist there as-is. If you deploy to Vercel:
- Swap SQLite for a hosted database (e.g. Turso/libSQL, Postgres via Neon or
  Supabase) — the query code in `lib/db.ts` is isolated, so this is a contained
  change
- Swap local image storage for a hosted bucket (e.g. Vercel Blob, S3,
  Cloudinary) — the upload logic is isolated in
  `app/api/admin/upload/route.ts`
- Set `SESSION_SECRET` (and any new DB/storage credentials) as environment
  variables in the Vercel project settings

A plain VPS (Option A) requires no code changes and is the fastest path to a
first launch.

---

## 7. Where to add your domain, WhatsApp, email and Instagram

These are currently placeholders — search and replace them:

| What | Where |
|---|---|
| Email | `hello@fayms.sa` — appears in `components/Footer.tsx` and `components/ContactSection.tsx` |
| WhatsApp | `https://wa.me/966500000000` — same two files |
| Instagram | `https://instagram.com/fayms` — same two files |
| Domain (for SEO/OG tags) | Set `NEXT_PUBLIC_SITE_URL` in `.env.local` |
| Logo | `components/Logo.tsx` renders a recreated vector mark — see note below |

### About the logo
Your uploaded logo file couldn't be read by the build tools in this session, so
the mark currently on the site is a close hand-built recreation of it (same
angular "F/A" shape), not your original file. Drop your real logo file into
`public/` (e.g. `public/logo.png`) and swap the `<LogoMark />` usage in
`components/Logo.tsx` for an `<img src="/logo.png" />` (or `next/image`) to use
the authentic asset — and regenerate `public/favicon.svg` from it too.

---

## Project structure

```
app/
  page.tsx                 Public homepage (assembles all sections)
  admin/                    Admin pages (login, dashboard, project add/edit)
  api/
    projects/               Public GET — published projects only
    contact/                 Public POST — contact form submissions
    auth/login, auth/logout  Session login/logout
    admin/projects/          Protected CRUD for projects
    admin/upload/            Protected image upload
    admin/messages/          Protected contact-message inbox
components/                 UI building blocks for the public site + admin
lib/db.ts                   SQLite schema + connection
lib/auth.ts                 Password hashing + session helpers
middleware.ts                Route protection for /admin and /api/admin
scripts/create-admin.mjs    CLI to create/reset the admin account
data/fayms.db                SQLite database (created on first run, gitignored)
public/uploads/               Uploaded project images (gitignored)
```

## Notes for whoever maintains this next

- All admin routes are protected centrally in `middleware.ts` — new
  `/admin/*` or `/api/admin/*` routes are protected automatically.
- Zod validates every API input; extend the schemas in each route file when
  adding fields.
- The contact form currently only stores submissions in the `messages` table,
  viewable in the dashboard's **Messages** tab. Wire up email notifications
  (e.g. via Resend or SMTP) in `app/api/contact/route.ts` if you want alerts.
