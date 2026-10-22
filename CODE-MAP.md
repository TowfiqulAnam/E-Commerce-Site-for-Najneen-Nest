# Where to edit each section

| What you want to change | File or screen | Guidance |
|---|---|---|
| Real products, stock, prices, discounts | Admin → Products | No code edit required. Use Active to show/hide; never use sample prices for real sales. |
| Contact, delivery, payment, returns, privacy | Admin → Settings | Stored in D1. Save before opening checkout. |
| Header, hero text, category navigation | `app/page.tsx` | Search `announcement`, `header`, `hero` and `collections`. |
| Product cards and filters | `app/page.tsx` | Search `product-grid`, `shop-tools`, `filters`. |
| Compare, cart, request and policy dialogs | `app/page.tsx` | Search `panel==='compare'`, `panel==='cart'`, `panel==='request'`. |
| Colours, type, spacing, mobile layout | `app/globals.css` | Theme variables are at the top. Mobile rules are in the media queries at the end. |
| Name, browser title and description | `app/layout.tsx` | Replace metadata without changing application routes. |
| Logo/favicon and collection artwork | `public/favicon.svg`, `public/art/` | Editable SVG. `scripts/create-art.mjs` regenerates the supplied art and overwrites those assets. |
| Dashboard layout and forms | `app/admin/page.tsx` | Each tab has a conditional section; save actions call the API. |
| Product types, price math, categories | `lib/store.ts` | Monetary values use integer paisa. `quote()` is the shared server calculation. |
| Authorization, validation, order/stock saving | `app/api/store/route.ts` | Server-only. Preserve authorization on every admin operation and atomic version checks. |
| Database schema | `db/schema.ts`, `drizzle/` | Generate a new migration when changing schema; do not rewrite applied SQL. |
| Sites sign-in | `app/chatgpt-auth.ts` | Platform-owned routes. Do not trust these headers on an independent public origin. |
| Portable deployment config | `scripts/prepare-independent.mjs` | Takes your D1 UUID; generates token-auth configuration. |
| Database restore | `scripts/restore-backup.mjs` | Validates backup shape and generates SQL for a new database, with checkout closed. |
| Business logic tests | `tests/store.test.mjs` | Price calculation and invalid purchase checks. |
| End-to-end API tests | `tests/integration.mjs` | Local-only test database; authorization, concurrency, order and admin operations. |
| Hosting integration | `.openai/hosting.json`, `vite.config.ts`, `worker/index.ts` | Preserve Sites identity and build integration for Sites deployments. |

## Safe editing routine

Create a branch → change one feature → run type checks and tests → preview desktop and mobile → create a source/data backup → deploy → test a real product with a controlled order → record the version. Use your editor's formatting tools; the initial UI files favour compact JSX and can be reformatted without changing behaviour.

## Data flow

Browser → `/api/store` → validated server action → D1 versioned snapshot. Public GET returns only visible products and shop settings. Admin GET requires authorization before returning orders or customer details. Browser totals are a preview; checkout recomputes prices on the server and requires the reviewed total to match. A conditional database update commits stock changes and order creation together; conflicts retry against current stock.
