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

React + TypeScript + Vite + Tailwind CSS, tested with Vitest. Currently a
frontend prototype backed by static seed data — no real backend/payments yet.

## Architecture

- `src/lib/rating.ts` — the microplastic scoring engine. Pure function, no
  hidden state: takes a product's materials/synthetics/packaging and returns
  an auditable 0-100 score and letter grade.
- `src/lib/alternatives.ts` — given a product, finds same-category products
  with a strictly better score.
- `src/context/CartContext.tsx` — cart state, persisted to `localStorage`.
- `src/data/products.json`, `src/data/articles.ts` — seed content. In a real
  version these would be a database and a CMS respectively.
- `src/pages/*` — one route per page, routed with `react-router-dom`.

## Roadmap

- [ ] Real backend + persistent orders (currently client-only)
- [ ] Brand partner intake flow
- [ ] Expand the rating engine beyond keyword matching (e.g. ingredient DB)
- [ ] Payments

## Status

Early and actively evolving as a side project. See commit history for the
build-out.

## License

MIT
