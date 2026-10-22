# Najneen Nest

**For You & Your Home.** A responsive online store and a protected store-management dashboard. You own the source and can run it without ChatGPT on Cloudflare Workers with D1.

## Start here

- Storefront: `/`
- Management dashboard: `/admin`
- Daily operating guide: [LAUNCH-AND-MANAGE.md](LAUNCH-AND-MANAGE.md)
- File-by-file editing guide: [CODE-MAP.md](CODE-MAP.md)
- Downloadable product import template: `public/product-import-example.json`

The store begins with **checkout closed and no real products**. Six clearly labelled illustrated sample products appear only while the visible catalogue is empty. Their names and prices are demonstrations. They cannot be ordered. The phone 01521572770 came from the owner's referenced planning chat. No payment provider, delivery promise, social URL, business email, or return policy has been invented.

## Features

Search, category filters, price/discount sorting, product details, compare up to three products, persistent device-local cart, server-priced checkout, promotion codes, order references, phone contact and product requests. Admin supports add/edit/hide products, JSON import/export, prices, discounts, stock, orders and payment verification, request tracking, promotion activation and sales attribution, expense records, date-filtered cash summaries, launch settings and full JSON backup.

Products, orders and business records live in **Cloudflare D1**, not browser storage. Cart contents alone use localStorage. Every business write uses an atomic compare-and-swap version check to keep orders and stock consistent. Orders keep a price/name snapshot. Cancellation restores stock once. Payment verification is a manual bookkeeping flag; it does not collect money or issue refunds.

## Local installation

Install Node.js 22.13+ (24 recommended), npm and Git. In this folder:

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_sloppy_khan.sql
```

Apply the migration once per new local database. Later migrations must be applied in order without replaying old ones. Copy `.env.example` to `.dev.vars` (ignored by Git), set `AUTH_MODE=token` and a locally generated random `ADMIN_TOKEN` of at least 32 characters. Never use your production credential for tests.

```sh
npm run dev
```

Open the printed localhost URL. In `/admin`, expand **Independent hosting sign-in** and enter the local token. The token is only kept in page memory. Do not expose the development server on a public address.

## Tests

```sh
npx tsc --noEmit
node --test tests/store.test.mjs
```

For integration tests, start the local preview, set `TEST_ADMIN_TOKEN` in your shell to your local token, then run `node tests/integration.mjs`. This creates **test records in the local database** and closes local checkout afterward. It refuses non-local hosts. Never run it against production.

## Hosting option A: Sites

The `.openai/hosting.json` retains this Site's identity and declares `DB`. Sites provisions D1 and applies generated migrations. Configure runtime `AUTH_MODE=sites` and `ADMIN_EMAILS` as a comma-separated administrator allowlist. Sites supplies trusted identity headers; the API checks the allowlist on every admin read/write. Only use this auth mode behind Sites' trusted gateway. Admin identity details and secrets do not belong in the repository.

The initial Sites publication is private to its owner. Finish business details and testing before deliberately changing access to public in Sites. Changing audience does not change the application-level admin allowlist. Publishing or updating code does not seed sample orders or overwrite stored data.

## Hosting option B: independent Cloudflare account

This is the portable deployment route outside ChatGPT. A static host such as GitHub Pages is insufficient because orders require a server and database.

1. Create a Cloudflare account. Install dependencies and run `npx wrangler login`.
2. Create D1: `npx wrangler d1 create najneen-nest`. Save the returned database UUID.
3. Run `npm run build`, then `node scripts/prepare-independent.mjs YOUR-DATABASE-UUID`.
4. Initialize the new remote database:

```sh
npx wrangler d1 execute DB --remote --config dist/server/wrangler.independent.json --file drizzle/0000_sloppy_khan.sql
```

5. Generate a random 32+ character admin token with a password manager. Store it securely. Configure it interactively (never in source or a shell argument):

```sh
npx wrangler secret put ADMIN_TOKEN --config dist/server/wrangler.independent.json
npx wrangler deploy --config dist/server/wrangler.independent.json
```

6. In `/admin` use **Independent hosting sign-in**. This deployment sets `AUTH_MODE=token`, so forged Sites headers cannot authorize users. Use HTTPS. Rotate the token with the same `secret put` command if exposed. Anyone with this token is an administrator; do not share it with customers. For multiple staff, replace this adapter with a verified identity provider and role checks.
7. Add your domain in Cloudflare if desired. Repeat build, prepare-independent and deploy after source edits. Keep the same D1 UUID to preserve data. Do not use the placeholder database UUID from the generated default config for production.

Cloudflare's free tier may suit a small launch, subject to usage and CPU limits; this is not a guarantee of free hosting. Official pages checked 22 October 2026: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/). The published free allowances include 100,000 Worker requests/day and 5 million D1 rows read/day. Check current pricing and usage before enabling paid services. Domain registration, payment providers, email/SMS, shipping and image hosting are separate costs. Sites billing is separate from your own Cloudflare account.

## Back up and restore

**Source backup:** keep Git history and a source ZIP. These do not contain database records or secrets.

**Data backup:** use Admin → Backups daily and before major changes. Encrypt the downloaded JSON and keep it outside GitHub. It contains customer contact information. Keep a separate copy of original product photos: the backup stores image URLs, not their remote files. On an independently owned Cloudflare account also export D1:

```sh
npx wrangler d1 export DB --remote --config dist/server/wrangler.independent.json --output backups/database.sql
```

Create `backups/` first. It is ignored by Git. Sites-managed storage can be migrated using the admin JSON export without access to Cloudflare credentials.

**Restore JSON to a fresh database:**

1. Keep the current database untouched. Create a new D1 database and point a newly generated independent config to its UUID.
2. Apply the schema migration to that new database as above.
3. Generate restore SQL from a private JSON backup:

```sh
node scripts/restore-backup.mjs backups/najneen-backup.json backups/restore.sql
npx wrangler d1 execute DB --remote --config dist/server/wrangler.independent.json --file backups/restore.sql
```

4. The restore closes checkout intentionally. Verify product counts, orders, stock, expenses and settings in a private deployment. Check image URLs. Configure the admin secret separately.
5. Deploy with the restored database only after verification, then reopen checkout. Keep the old database until you have verified the replacement. Delete local unencrypted customer-data exports securely when no longer needed.

For a full SQL export, import the export into a **new empty database** instead of applying the schema separately. Never import SQL into the live database as an experiment. For code rollback, check out the previous Git commit and redeploy using the same database; do not roll back applied schema migrations blindly.

## Scope and limits

- Currency is BDT; money is stored as integer paisa. Delivery is one configurable flat charge. Complex zones, variants and multiple warehouses need further development.
- The small-store database uses one versioned JSON document in D1 to make multi-item checkout atomic and portable. It is intended for a small catalogue and modest order history, not high-volume commerce. Archive old records and migrate to normalized tables well before the D1 per-value limit (2 MB); target a snapshot below 1 MB. A developer should add paginated normalized records as volume grows.
- Public product requests have basic duplicate throttling, not a full anti-bot system. Add Cloudflare WAF/rate limits or Turnstile before paid advertising or if spam appears. No CAPTCHA service is configured.
- No automated email/SMS, payment gateway, courier API, tax calculation, refund execution, customer login or photo upload service is configured. Orders and requests are visible in the dashboard; check it regularly. Images are HTTPS URLs or versioned local assets.
- React, Vinext, Cloudflare and dependencies must be kept up to date. The current Vinext dependency is a beta; test upgrades and restore procedures before production use.
- Illustrations were authored for this project and are editable SVG. They are not photos of real inventory. Typography loads from Google Fonts with system fallbacks.

## Secrets and ownership

No real credentials are included. `.dev.vars`, `.env` files, generated local runtime state, customer backups and dependencies are excluded. Retain the vendored library licenses. Custom store code and illustrations were created for Najneen Nest; third-party packages keep their own licenses.