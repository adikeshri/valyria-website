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
| `app/globals.css` | Design tokens (from `valyria-app`) + all page styles. |
| `app/robots.ts`, `app/sitemap.ts` | Generated `/robots.txt` and `/sitemap.xml`. |
| `public/assets/` | Logo mark + favicons, the still `screenshot.png` fallback, and the hero screencast (`hero.webm` / `hero.mp4` / `hero-poster.jpg`). |

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
