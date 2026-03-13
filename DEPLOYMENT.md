# Chick N' Dip – Deployment Guide (GitHub → Vercel)

## Pre-deployment checklist ✓

| Item | Status |
|------|--------|
| Build passes | ✓ `npm run build` succeeds |
| Supabase configured | ✓ URL, anon key, service role key |
| Resend API key | ✓ For inquiry reply emails |
| `.env.local` in `.gitignore` | ✓ Secrets not committed |

---

## Deploy via GitHub

### 1. Push your code to GitHub

If you haven't already, create a repo and push:

```bash
cd Chick-N-Dip-Brand-Website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Deploy on Vercel (recommended for Next.js)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. **Root Directory**: Leave as `.` (or set to `Chick-N-Dip-Brand-Website` if the repo root is the parent folder).
5. **Framework Preset**: Next.js (auto-detected).
6. **Build Command**: `npm run build` (default).
7. **Output Directory**: `.next` (default).

### 3. Add environment variables in Vercel

In your project → **Settings** → **Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Same place |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Same place (keep secret) |
| `RESEND_API_KEY` | Your Resend API key | From [resend.com/api-keys](https://resend.com/api-keys) |

Optional:

| Variable | Value |
|----------|-------|
| `RESEND_FROM_EMAIL` | `Chick N' Dip <noreply@yourdomain.com>` (after verifying domain in Resend) |

### 4. Configure Supabase for production

In **Supabase Dashboard** → **Authentication** → **URL Configuration**:

- **Site URL**: `https://your-app.vercel.app` (your Vercel URL)
- **Redirect URLs**: Add `https://your-app.vercel.app/auth/callback`

### 5. Deploy

Click **Deploy**. Vercel will build and deploy. Each push to `main` will trigger a new deployment.

---

## Alternative: Deploy to other platforms

- **Netlify**: Import from GitHub, set build command `npm run build`, publish directory `.next` (or use Next.js runtime).
- **Railway / Render / Fly.io**: Connect GitHub, set env vars, run `npm run build` then `npm run start`.

---

## Post-deployment

1. Visit your live URL and test: sign up, login, contact form, admin dashboard.
2. Ensure at least one user has `Role = 'admin'` in Supabase `profiles` table for admin access.
3. For custom email domain: verify your domain in Resend and set `RESEND_FROM_EMAIL`.
