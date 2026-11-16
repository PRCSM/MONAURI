# MONAURI — Fine Jewelry Storefront

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

## Deploy (Vercel)

```bash
npx vercel --prod
```

## Configuration (`.env.local`, see `.env.example`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_CURRENCY` | ISO currency (default `USD`) |
| `STRIPE_SECRET_KEY` | Enables real checkout via Stripe Checkout (hosted page). Unset = labelled demo mode, no payment taken |
| `CONTACT_WEBHOOK_URL` | Contact form forwards here (Slack/Zapier/CRM). Unset = form reports it isn't connected |

## Structure

- `src/data/catalog.ts` — demo products, categories, collections (single source of truth for prices)
- `src/lib/` — config, pricing (shared client/server), filters, persistent cart/wishlist store, checkout schema
- `src/components/home/` — reference sections (hero, bestsellers, five-tile category grid) + editorial sections
- `src/providers/` — Lenis/ScrollTrigger sync, overlay state (menu, search, bag)
- `src/components/scrolling/custom-scrollbar.tsx` — synced, draggable scrollbar (fine pointers only)
- `src/app/api/checkout` — server-side validation and re-pricing; Stripe or demo order

## Images

Photography is hotlinked from Unsplash / Pexels (`src/lib/images.ts`) and optimized by `next/image`.
The hero ring is an SVG overlay (`hero-ring.tsx`) positioned with `--ring-x / --ring-y / --ring-w` in `hero.tsx`.
Replace with commissioned photography (ideally a single composited calla-lily-and-ring shot) before launch.

## Not included / external

- Order persistence: demo orders live in the browser session only. Add a database (e.g. Prisma + Postgres) and a Stripe webhook for real orders.
- Emails, real policies, product specifications and certifications must be supplied by the business.
