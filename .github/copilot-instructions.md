## Quick orientation — what this repo is

- Next.js 14 (App Router) e‑commerce platform (frontend + API routes inside `app/`).
- TypeScript everywhere; shared helpers live in `lib/`, global providers in `context/`, UI in `components/` and static product data in `data/`.

## Big-picture architecture (what to read first)

- `app/layout.tsx` — root layout and the provider order (ThemeLoader, BusinessSettingsProvider, SiteSettingsProvider, PerformanceProvider, AuthProvider, CartProvider). Use this to understand global state & SSR/CSR boundaries.
- `app/api/**` — server endpoints (Next API routes). Prefer these for server-side work.
- `lib/database.ts` — single DB pool and helper methods (Database.query, getAllProducts, getBusinessSettings). It also falls back to static JSON if no DB.
- `data/product-loader.ts` and `data/products-*.json` — large static product catalog used when DB is absent; many APIs rely on this fallback.

## Key developer workflows / commands

- Development: `npm install` then `npm run dev` (starts Next dev server).
- Lint: `npm run lint` (uses Next ESLint config).
- DB helpers: `npm run db:init`, `npm run db:migrate`, `npm run db:test`, `npm run make:admin` (implemented as `tsx` scripts in `scripts/`).
- Production build (with obfuscation): `npm run build:obfuscated` — this runs `npm run build` then runs `build-obfuscated.js` which obfuscates client static JS in `.next/static` using `obfuscator.config.js`.
- Full deploy: `npm run deploy:prod` runs `clean`, `build:obfuscated`, then `npm start`.

Important note: `build-obfuscated.js` currently calls Windows `rmdir /s /q .next`; on Linux that will be a no-op or error depending on shell. When modifying build scripts, prefer portable commands (e.g. `rm -rf .next`) or use Node fs APIs.

## Conventions & patterns to follow

- Server-only logic: place in `app/api/*` or `lib/*` and avoid bundling into client bundles. The obfuscation script explicitly skips server chunks (server files are in `.next/server`).
- Database access: use the `Database` class in `lib/database.ts` to ensure table initialization and safe JSON parsing (`safeJsonParse` helper).
- Authentication: `lib/auth.ts` exposes `authenticateUser`, `requireAdmin`, and `handleAuthError`. JWT_SECRET must be provided via `.env.local` for full auth flow.
- Theme and settings: business/theme settings read from DB (or default). Check `BusinessSettingsProvider` + `ThemeLoader` when changing visual behavior.

## Integration points & external deps

- MySQL: `mysql2/promise` used in `lib/database.ts`. DB envs are loaded from `.env.local` (dotenv in that file).
- DO NOT USE: Obfuscation: `javascript-obfuscator` configured in `obfuscator.config.js`. Build script uses a tempered override (turns off some aggressive transforms for compatibility).
- Images: `next.config.js` contains `images.remotePatterns` — update that when adding remote image hosts.

## Practical guidance for making changes

- When adding server logic, put it under `app/api/*` and call `Database.query(...)` for consistency.
- When editing UI, follow existing component patterns in `components/` (e.g., `header.tsx`, `footer.tsx`, `product-card.tsx`) and reuse context providers (Cart/Auth/Performance).
- For product data changes, update `data/products-chunk-*.json` and `data/products-all.json` or the loader (`data/product-loader.ts`). Large imports use chunking — keep chunk sizes reasonable.

## Gotchas & quick checks

- The app works without a DB by design (static `data/` fallback). Use `app/api/products/route.ts` and `app/api/products/[id]/route.ts` as examples of fallback logic.
- Admin credentials: `lib/auth.ts` contains a server-only encoded admin email; do not expose it to client bundles.
- Removing console.logs: `next.config.js` can remove console in production. Build-obfuscation also rewrites static client JS—be careful when changing public assets.

## When in doubt

- Read `README.md` (root) and `docs/README.md` for high-level policies and deployment notes.
- Look at `scripts/` for migration & utility scripts (they show expectations for shape of product data and DB schema).

If any of these points are unclear or you want this file to include more code snippets or additional examples (testing, CI, or patch patterns), tell me which area to expand.
