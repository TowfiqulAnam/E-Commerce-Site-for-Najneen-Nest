# Najneen Nest: launch and daily management

## Fill these in before opening checkout

- [ ] Original logo and approved product photographs (the supplied logo treatment and artwork are editable placeholders).
- [ ] Real product names, specifications, prices, stock and any discounts.
- [ ] Confirm the supplied phone number: 01521572770.
- [ ] Business email and official Facebook/social URL, if used.
- [ ] Delivery areas, expected time, courier arrangements and the flat delivery charge.
- [ ] Payment arrangement and instructions. The site does not process payments.
- [ ] Returns, cancellations and refunds policy.
- [ ] Privacy policy appropriate to your business and customer-data handling.
- [ ] Admin access, backup location and responsibility for checking orders.
- [ ] Site audience/domain and hosting account.

Use Admin → Settings. Opening checkout is blocked until real visible products and the required policies exist. The initial preview is private; public customer access is a separate hosting setting.

## First launch in order

1. Open `/admin` and sign in with the authorized account (Sites) or server token (independent hosting).
2. Add one real product. Enter BDT prices normally; the form converts them to paisa internally. Use a reliable HTTPS photo URL or place a licensed photo under `public/art/` and use that path. Fill dimensions, materials, variants and safety details in the description.
3. Add the remaining products. For bulk import, download the template and edit the JSON array. Keep unique stable IDs. Prices in JSON are paisa. Import updates matching IDs; it does not delete other products. Hidden products preserve order history.
4. Complete the business fields. Explicitly choose the delivery fee, including zero only if you intend free delivery. Do not add payment credentials.
5. Test search, filters, details, comparison, cart and request form on a phone. Test an unavailable item and a promotion code too.
6. Back up data, open checkout in Settings, place a controlled order, verify its total, stock reduction and dashboard record. Cancel it if appropriate and verify stock returns. This is not an online payment.
7. When ready, make the site public in your host settings and share the domain. Test without your admin login. The storefront should work; `/api/store?admin=1` must not expose customer data.

## Every day (10–15 minutes)

1. Review New orders and Requests. Contact the customer using the details they provided. There are no automatic notifications.
2. Verify availability/payment using your chosen process. Mark payment received only after checking it.
3. Move orders through Confirmed → Packed → Shipped → Delivered. Cancel only when the order should not be fulfilled; cancellation restores stock once and cannot be reopened.
4. Update stock, hide unavailable products as needed, and record courier, advertising, packaging and other expenses.
5. Download a backup after meaningful activity. Keep customer information private.

## Each week

Review date-filtered collected sales and expenses. This is a cash summary, not profit accounting. Compare promotion usage and collected sales; stop ineffective offers. Review low stock and product requests to choose the next products. Export a full backup, check one restored copy periodically, and update the source ZIP/Git history after code changes.

## Promotions

Create a unique code, percentage and end date in Promotions. Discounts apply after product markdowns and before delivery. Dates use UTC and expire after the displayed end date; Bangladesh is UTC+6. Pause a code anytime. Do not promise a discount publicly until you have tested it in checkout. Track usage and collected sales in the same tab.

## Moving to another developer or platform

Give them the repository/ZIP, README, CODE-MAP and a private encrypted database backup separately. Transfer hosting access through the provider's normal access controls. Never place admin tokens or customer exports inside the source archive. A developer can keep the existing Cloudflare runtime or port the server API/database adapter elsewhere; uploading the frontend alone to a static host will not preserve ordering.

## Common problems

- **Admin denied:** check the Sites allowlist or independent token and AUTH_MODE. Being signed in is not the same as being authorized.
- **Checkout closed:** complete Settings and add at least one real active product, then save the Open checkout switch.
- **Out of stock at checkout:** another order may have used the remaining stock. Refresh the cart; the server is authoritative.
- **Dashboard changed:** refresh before saving. This prevents stale product edits from overwriting newer stock.
- **No order alert:** notifications are not connected. Review Orders regularly; an email/SMS service is an optional future integration.
- **Missing photos:** verify the HTTPS URL or local asset path and usage rights. Back up the original image files separately.
- **Growing data or slow operations:** ask a developer to migrate the versioned snapshot to paginated normalized tables before approaching 1 MB of snapshot data.
