# Prem Biradar — MERN Portfolio

A full-stack personal portfolio with a secure Admin Panel. Everything shown on the public site
(profile, photo, skills, experience, education, certifications, projects, YouTube videos, resume)
is stored in MongoDB and edited from `/admin` — no code changes needed to update content.

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT in an http-only cookie, bcrypt, single admin account (no public registration)
- **Storage:** Cloudinary (photos, thumbnails, resume PDF)
- **Email:** Nodemailer (SMTP) or Resend
- **Security:** Helmet, CORS, rate limiting, express-validator, mongo-sanitize, honeypot spam field

```
prem-portfolio/
├── server/   config/ controllers/ middleware/ models/ routes/ services/ utils/ seed/ app.js server.js
└── client/   src/{components,sections,pages,layouts,context,hooks,services,assets}
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- A [Cloudinary](https://cloudinary.com) account (free tier is enough) — needed for uploads
- Email: a Gmail **app password** (or any SMTP), or a [Resend](https://resend.com) API key

## 2. Local setup

```bash
# Backend
cd server
cp .env.example .env        # then fill in the values (see below)
npm install
npm run seed                # creates the admin user + loads your resume data
npm run dev                 # API on http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev                 # site on http://localhost:5173
```

Vite proxies `/api` to `localhost:5000`, so cookies work locally with no extra config.

### Environment variables (`server/.env`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string (e.g. `openssl rand -hex 48`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Used **once** by `npm run seed` to create the admin |
| `CLOUDINARY_*` | Cloud name / API key / API secret |
| `EMAIL_HOST/PORT/USER/PASSWORD` | SMTP (Gmail: `smtp.gmail.com`, `587`, app password) |
| `RESEND_API_KEY` | Optional; if set, Resend is used instead of SMTP |
| `CONTACT_EMAIL` | Where contact-form notifications go (`premrb2001@gmail.com`) |
| `CLIENT_URL` | Frontend origin, for CORS (e.g. `https://yourdomain.com`) |

Secrets live only in the server `.env`; nothing secret is ever sent to React.

## 3. First-run checklist

1. Open `http://localhost:5173/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
2. **Profile → Upload** your photo (until you do, the site uses the bundled portrait in `client/src/assets`).
3. **Profile →** add your GitHub URL.
4. **Resume → Upload** your PDF and mark it active.
5. **Projects →** add project images and any GitHub / live-demo links.
6. **YouTube →** add videos (title, URL, category); mark one as *Featured*. Thumbnails default to
   YouTube's own thumbnail if you don't upload one. No YouTube scraping or API is used.
7. Send a test message from the contact form and check Admin → Messages and your inbox.

## 4. What the seed loads

Only content from your resume: 2 roles (SoftGrid, The Skybrisk), MCA + BCA, both certifications,
both projects, and all skill groups. Skill percentages are **not** shown unless you set one in the admin.
Re-running `npm run seed` never overwrites collections that already have data.

## 5. Deployment

**Recommended layout:** frontend and API on subdomains of the same domain
(e.g. `yourdomain.com` and `api.yourdomain.com`). Admin login uses an http-only cookie, and
browsers increasingly block cookies between unrelated domains (e.g. `*.vercel.app` → `*.onrender.com`),
which can break admin login even though the public site works.

**API (Render / Railway / Fly / VPS)**
- Root directory `server`, build `npm install`, start `npm start`
- Set all env vars from above with `NODE_ENV=production` and `CLIENT_URL` = your frontend URL
- Run `npm run seed` once (shell/one-off job)

**Frontend (Vercel / Netlify / Cloudflare Pages)**
- Root directory `client`, build `npm run build`, output `dist`
- Set `VITE_API_URL=https://api.yourdomain.com/api`
- Add an SPA rewrite so `/admin/*` serves `index.html` (Netlify: `/* /index.html 200`; Vercel: rewrite `/(.*)` → `/`)

**Before going live**
- Replace `your-domain.com` in `client/index.html` (canonical, og:url), `public/robots.txt` and `public/sitemap.xml`
- Add a 1200×630 `og-image.png` to `client/public` and an `og:image` meta tag if you want link previews
- Use a strong admin password and rotate it if it was ever shared

## 6. API overview

Public `GET`: `/api/profile`, `/skills`, `/projects`, `/experience`, `/education`, `/certifications`, `/youtube`, `/resume`.
Public `POST`: `/api/messages` (rate-limited, validated, honeypot).
Everything else requires the admin cookie: all create/update/delete routes, uploads, `/api/messages` (list/read/delete), `/api/resume/all`.

## 7. Notes

- `multer-storage-cloudinary` requires Multer 1.x, which npm flags as deprecated. Uploads are admin-only,
  size-limited and type-filtered, but revisit if you swap the storage adapter.
- Contact messages are always saved to MongoDB first; if email delivery fails, the admin list shows an "Email not sent" badge.
- The admin panel is always dark; the public site follows the light/dark toggle and stores the choice.
