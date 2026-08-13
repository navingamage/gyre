# Contributing

This started as a solo side project, so process is intentionally light.

## Setup

```
npm install
npm run dev          # frontend only — the catalog needs the API, see below
```

`npm run dev` serves the frontend alone, so anything that fetches `/api/*`
will fail. For the full stack against a local D1 database:

```
npm run db:migrate:local
npm run build
npx wrangler pages dev dist --local --port 8788
```

See [DEPLOY.md](DEPLOY.md) for the longer version.

## Before committing

```
npm test
npm run build        # typechecks src/ and functions/, then builds
```

## Conventions

- One route per file under `src/pages`, lazily loaded in `App.tsx`.
- One endpoint per file under `functions/api`, mirroring the URL path.
- Anything that decides a product's rating belongs in `src/lib`, stays a pure
  function, and gets a test in the same folder.
- Shared backend logic goes in `functions/lib`, with its test beside it.
  Anything touching passwords, sessions, or signatures gets tested for the
  failure case, not just the happy path.
- Money is never taken from the client. Prices come from the database, always.
- Schema changes are new numbered files in `migrations/` — never edits to
  files already applied, since CI has run them against production.
