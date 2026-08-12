# Contributing

This started as a solo side project, so process is intentionally light.

## Setup

```
npm install
npm run dev
```

## Before committing

```
npx tsc -b
npm test
```

## Conventions

- One route per file under `src/pages`.
- Anything that decides a product's rating belongs in `src/lib`, stays a pure
  function, and gets a test in the same folder.
