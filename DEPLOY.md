# Deploying Gyre

Target: **https://gyre.antipodetech.com**, served from its own Cloudflare
Pages project, with the API running as Pages Functions and D1 as the database.

Everything in this document is manual, one-time setup that needs your
Cloudflare and Stripe accounts. Once it's done, pushing to `main` deploys.

---

## What's already in the repo

| Piece | Where |
|---|---|
| Frontend (React/Vite) | `src/`, builds to `dist/` |
| API | `functions/api/**` — auto-discovered by Wrangler at the project root |
| Database schema + seed | `migrations/*.sql` |
| SPA fallback + security headers | `public/_redirects`, `public/_headers` |
| CI (test → build → migrate → deploy) | `.github/workflows/ci.yml` |
| Bindings | `wrangler.toml` |

---

## 1. Create the D1 database

```sh
npx wrangler d1 create gyre-db
```

This prints a `database_id`. **Paste it into `wrangler.toml`**, replacing the
placeholder:

```toml
[[d1_databases]]
binding = "DB"
database_name = "gyre-db"
database_id = "<the id it printed>"
```

Commit that change — CI reads it to know which database to migrate.

Then create the tables and seed the catalog:

```sh
npm run db:migrate:remote
```

## 2. Create the Pages project

The deploy step pushes to an existing project, so create it first:

```sh
npx wrangler pages project create gyre --production-branch main
```

## 3. Set up Stripe

1. Create a Stripe account and **stay in test mode** until you've seen a
   payment work end to end.
2. Copy the test secret key (`sk_test_…`) from the Stripe dashboard.
3. Add a webhook endpoint pointing at
   `https://gyre.antipodetech.com/api/webhooks/stripe`, subscribed to the
   **`checkout.session.completed`** event. Stripe will show a signing secret
   (`whsec_…`).

Store both as Pages runtime secrets (these are *not* the same as the GitHub
secrets in step 4 — these are what the deployed Functions read at runtime):

```sh
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name gyre
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name gyre
```

Until `STRIPE_SECRET_KEY` is set, `/api/checkout` returns a clear 500
("Checkout isn't configured yet") rather than failing obscurely — the rest of
the site works fine without it.

## 4. Let CI deploy

Create a Cloudflare API token with these permissions:

- **Account → Cloudflare Pages → Edit**
- **Account → D1 → Edit**

Then add two repository secrets in GitHub
(*Settings → Secrets and variables → Actions*):

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | the token above |
| `CLOUDFLARE_ACCOUNT_ID` | from the Cloudflare dashboard sidebar |

Pushing to `main` now runs tests, builds, applies any new migrations, and
deploys.

## 5. Attach the custom domain

In the Cloudflare dashboard, attach `gyre.antipodetech.com` as a custom domain
on the `gyre` Pages project. This is the same per-product-subdomain pattern as
the other products on `antipodetech.com`, and the DNS side stays yours to wire
up.

---

## Local development

Two options. The plain Vite server is faster but has **no API** — the catalog
won't load, because it's fetched from `/api/products`:

```sh
npm run dev          # frontend only, port 5173
```

For the full stack (API + local D1), build first, then serve through Wrangler:

```sh
npm run db:migrate:local   # once, creates .wrangler/state with tables + seed
npm run build
npx wrangler pages dev dist --local --port 8788
```

Local D1 lives in `.wrangler/state` (gitignored). Deleting that directory
resets the database — rerun `npm run db:migrate:local` afterwards.

For local secrets, create a `.dev.vars` file (also gitignored):

```
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Stripe can't reach `localhost`, so to exercise webhooks locally use the Stripe
CLI:

```sh
stripe listen --forward-to http://localhost:8788/api/webhooks/stripe
```

---

## What has and hasn't been verified

Being explicit, because some of this can only be proven after deploying.

**Verified locally**, against real local D1 via `wrangler pages dev`:

- Catalog API (list, single, 404 for unknown slug)
- Register / login / logout / session persistence / expiry
- Wrong-password and duplicate-email rejection
- Checkout rejecting unauthenticated callers, unknown products, and bad
  quantities
- Webhook accepting a correctly signed payload and flipping the order to
  `paid`; rejecting tampered signatures, missing headers, and stale timestamps
- SPA fallback routing and the security headers in `_headers`
- 57 unit tests over hashing, session tokens, cookies, and signature checks

**Not yet verified** — needs real credentials or a real deployment:

- An actual redirect into Stripe Checkout and a real card payment. The
  integration is written against Stripe's documented REST API, but it has
  never called Stripe.
- A genuine Stripe webhook delivery. The signature scheme is verified against
  payloads signed independently with Node's HMAC, but not against Stripe's own
  traffic.
- The CI deploy job. It has never run — the test/build half runs on every push,
  but the deploy half has never had credentials.

---

## Known gaps

Worth knowing before this handles anyone's money.

- **Orders can stick in `pending`.** If a webhook is never delivered, nothing
  reconciles it. A scheduled job that polls Stripe for unresolved sessions
  would close this.
- **No rate limiting** on login or registration. Cloudflare's WAF or Turnstile
  would be the natural place to add it.
- **No email.** No order confirmations, no password reset. A password lost
  today is unrecoverable.
- **Prices are USD-only** and shipping is collected but never costed.
- **No admin surface.** Adding a product means writing a migration and
  deploying.
- **`react-router-dom` has an open advisory** (`npm audit`) that only clears
  with the v7 major. Worth deciding whether to upgrade or consciously accept.
