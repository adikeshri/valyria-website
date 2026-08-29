# valyria-website

The marketing / "coming soon" site for [Valyria](https://github.com/adikeshri/valyria),
served at **valyria.dev**.

A single-page **Next.js (App Router) + TypeScript** app, fully static — it
prerenders to HTML with no server runtime. Style, theme and iconography are
ported from [`valyria-app`](https://github.com/adikeshri/valyria-app)
(`apps/desktop/src/styles/tokens.css`): the rust / dragon-fire orange accent,
light-first colour system with dark + explicit `data-theme` overrides, the
system UI / `SF Mono` type stack, and [`lucide-react`](https://lucide.dev) icons.

## Stack

- **Next.js 16** App Router, React 19, TypeScript
- Plain CSS (`app/globals.css`) — no CSS framework
- Static export at build time; deploys to Vercel with zero config

## Structure

| Path | Purpose |
|---|---|
| `app/layout.tsx` | `<html>` shell, metadata / OpenGraph, favicons, and the no-flash theme-init script. |
| `app/page.tsx` | The page itself (server component). |
| `app/components/ThemeToggle.tsx` | Client component — light / dark / system, persisted to `localStorage`. |
| `app/components/BetaAccessForm.tsx` | Client component — the "request early access" form: required email / name / company / designation, honeypot + time-trap, inserts straight into Supabase. |
| `app/globals.css` | Design tokens (from `valyria-app`) + all page styles. |
| `app/robots.ts`, `app/sitemap.ts` | Generated `/robots.txt` and `/sitemap.xml`. |
| `public/assets/` | Logo mark + favicons, the still `screenshot.png` fallback, and the hero screencast (`hero.webm` / `hero.mp4` / `hero-poster.jpg`). |

## Early-access form

`app/components/BetaAccessForm.tsx` collects beta-tester sign-ups. It stays
static — the browser inserts a row directly into **Supabase** (Postgres) using
the project's public `anon` key. No server, no third-party form service, always
free on Supabase's free tier.

**Required fields:** `email`, `name`, `company`, `designation`. OS and use case
are optional. A device that has already signed up sees the confirmation instead
of the form (`valyria-beta-signed-up` in `localStorage`).

### One-time setup

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. **SQL Editor → paste [`supabase/schema.sql`](supabase/schema.sql) → Run.**
   That creates the `beta_signups` table and — crucially — a Row-Level-Security
   policy that lets the `anon` role **INSERT only** (no read/update/delete). It
   also adds `unique (email)` and length/format `CHECK`s so junk can't bloat the
   table.
3. **Project Settings → API** — copy the **Project URL** and the **anon public**
   key into `.env.local` (see [`.env.local.example`](.env.local.example)) and
   into the Vercel project's Environment Variables:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

Read submissions in the Supabase **Table Editor**, or export from there. With
the vars unset (e.g. a fork), the form falls back to opening the visitor's mail
client addressed to `BETA_EMAIL` (`beta@valyria.dev`).

### How the request works

```
POST {SUPABASE_URL}/rest/v1/beta_signups
apikey: {anon key}
Authorization: Bearer {anon key}
Prefer: return=minimal
{ email, name, company, designation, os, use_case, source }
```

`201` → added. `409` → email already present (unique constraint) — the form
treats that as "you're on the list" too. Anything else surfaces an inline error.

### Spam protection

1. **Honeypot** — a hidden `_gotcha` field; a submission with it filled is
   dropped silently.
2. **Time-trap** — submissions that arrive < `MIN_FILL_MS` (3s) after the form
   mounts get a soft "double-check your details" message (an instant retry
   passes). Stops bots that POST on page load.
3. **Postgres constraints** — `unique (email)` + email-shape and length `CHECK`s
   reject malformed / oversized rows at the database.

Because the endpoint just appends a row to *your* free database, abuse has no
cost or quota to hit — unwanted rows are deleted in the Table Editor. If bot
volume ever becomes a real nuisance, the upgrade path is a **Supabase Edge
Function** (free tier, 500k invocations/mo) that verifies a CAPTCHA token and
rate-limits by IP before inserting with the `service_role` key; the form would
then POST to the function instead of `rest/v1`.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production build + serve
```

## Deploy (Vercel)

Import the repo in Vercel — the framework preset **Next.js** is detected
automatically, no build settings to change.

- **Build command:** `next build` (default)
- **Output:** handled by the Vercel Next.js adapter (default)
- **Custom domain:** add `valyria.dev` under the project's *Domains* tab and
  point the DNS record at Vercel. (There is no `CNAME` file — Vercel manages the
  domain, not the repo.)

## The hero screencast

`public/assets/hero.{webm,mp4}` is a scripted screen recording of the
`valyria-app` desktop renderer. Regenerate it from a **fresh checkout** of
`valyria-app` (never the working copy) so nothing there is touched:

```bash
git clone <valyria-app> /tmp/va-rec && cd /tmp/va-rec/apps/desktop
npm install && npm run dev            # Vite dev server on :5183

# a Playwright script drives the app (dark theme, glided cursor) through
# Agent → Task → Diff → Tests → Terminal → Activity → Agent, then:
#   ffmpeg -i raw.webm -vf "setpts=0.82*PTS,scale=1440:900:flags=lanczos" -an \
#     -c:v libx264 -pix_fmt yuv420p -crf 25 -movflags +faststart hero.mp4
#   ffmpeg -i raw.webm -vf "setpts=0.82*PTS,scale=1440:900:flags=lanczos" -an \
#     -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 hero.webm
#   ffmpeg -ss 0.3 -i raw.webm -frames:v 1 hero-poster.jpg
```

The `<video>` is `autoplay muted loop playsinline`; it starts and ends on the
same view so the loop is seamless, and `screenshot.png` is the in-`<video>`
fallback.

## Refreshing the static images

```bash
cp ../valyria-app/apps/desktop/src/assets/logo-mark.png public/assets/
cp ../valyria-app/docs/assets/screenshot.png public/assets/
```

## License

Apache-2.0. See [LICENSE](LICENSE).
