# Gyre

**Amazon for microplastic-free products.**

Ocean gyres are where the world's plastic waste ends up — vast rotating
currents that concentrate garbage patches in the middle of the sea. Gyre is
the opposite: a marketplace that pulls microplastic-free products *out* of
obscurity and puts them in front of the people looking for them.

## Why

Public awareness of microplastics — in water, food, clothing, cosmetics — is
rising fast, but there's no dedicated place to shop for or even research
alternatives. The sustainable goods market was valued at $294B in 2023; this
carves out a specific, underserved slice of it.

## What it does

- **Browse & buy** — a curated catalog of products vetted to be free of
  microplastics (or as close to it as currently possible).
- **Microplastic ratings** — every product gets a transparency score based on
  materials, packaging, and manufacturing process, plus a content hub rating
  popular mainstream products and suggesting cleaner alternatives.
- **Certifications** — a certification mark brands can earn (and display) once
  their product line passes the rating bar.
- **Partners** — brands can apply to list, either fulfilling their own orders
  or having Gyre fulfill for them (dropship model to start).

## Stack

Runs entirely on Cloudflare's edge — no origin server, no AWS.

- **Frontend** — React + TypeScript + Vite + Tailwind CSS
- **API** — Cloudflare Pages Functions (Workers runtime)
- **Database** — Cloudflare D1 (SQLite at the edge), plain parameterised SQL
- **Payments** — Stripe Checkout, called over `fetch` with no SDK dependency
- **Tests** — Vitest (57 tests)

Runtime dependencies are React, the router, and two font packages. Auth,
password hashing, session handling and Stripe signature verification are all
written against WebCrypto rather than pulled in as libraries — the point of
this repo is to show the mechanism, not to hide it behind a package.

## Architecture

**Frontend**

- `src/lib/rating.ts` — the microplastic scoring engine. Pure function, no
  hidden state: takes a product's materials/synthetics/packaging and returns
  an auditable 0-100 score and letter grade.
- `src/lib/alternatives.ts` — given a product and a catalog, finds
  same-category products with a strictly better score.
- `src/context/AuthContext.tsx` — session state, hydrated from `/api/auth/me`.
- `src/context/CartContext.tsx` — cart state, persisted to `localStorage`.
- `src/pages/*` — one route per page, lazily loaded so each is its own chunk.

**Backend** (`functions/`)

- `lib/hash.ts` — PBKDF2-HMAC-SHA256 password hashing (210k rounds, per-user
  salt, cost recorded alongside the digest so it can be raised later).
- `lib/session.ts` — opaque random session tokens. Only the SHA-256 *hash* of
  a token is stored, so a database read can't be replayed as a login. Cookies
  are `HttpOnly`, `SameSite=Lax`, and `Secure` whenever the request is HTTPS.
- `lib/stripe.ts` — Checkout Session creation and webhook signature
  verification (HMAC over `timestamp.body`, constant-time compared, with a
  freshness window to block replays).
- `api/checkout.ts` — **prices are always recomputed from D1.** The client's
  cart decides *what* to buy, never what it costs.
- `api/webhooks/stripe.ts` — marks orders paid, idempotently, since Stripe
  retries.

**Data**

- `migrations/*.sql` — schema and seed catalog, applied by CI on deploy.
- `src/data/articles.ts` — editorial content; a CMS in a real version.

## Deploying

See [DEPLOY.md](DEPLOY.md) — it covers the Cloudflare and Stripe setup, the
local development flow, and an explicit list of what has and hasn't been
verified.

## Roadmap

- [x] Real backend + persistent orders
- [x] Brand partner intake flow
- [x] Accounts and sessions
- [x] Payments (Stripe Checkout)
- [ ] Reconcile orders whose webhook never arrived
- [ ] Rate limiting on auth endpoints
- [ ] Transactional email (confirmations, password reset)
- [ ] Expand the rating engine beyond keyword matching (e.g. ingredient DB)

## Status

A side project, built in the open. The payment path is implemented but has
only been exercised against locally signed payloads, not live Stripe traffic —
see the verification notes in [DEPLOY.md](DEPLOY.md) before trusting it with
real money.

## License

MIT
