# Web studio rollout

Updated October 19, 2026. The backend is deployed to `bethere-3d7de` and the
compiled studio is published at `https://beanywhere.app/studio/` through the
existing Cloudflare Pages project. **Public sales are enabled.**

`config/web` uses the live one-time $3.99 price, with automatic delivery enabled.
The deployed end-to-end flow passed with the owner's reference photos and a
Stripe sandbox card before enabling public sales. No real card was charged.

## Connections

- Separate Firebase web app: `1:151223255006:web:7313193eb6302e7582674f`.
- reCAPTCHA Enterprise App Check is configured for beanywhere.app and www.
- Web identities use the separate `WEB_SESSION_PEPPER`, `w_` UIDs, web claims and
  named browser auth persistence. Native identities and purchasing stay separate.
- Stripe account: `acct_1US8Ls0oVroaUZP0`, charges and payouts enabled. Radar Lite;
  no Tax, Climate or Managed Payments upgrades.
- Live price: `price_1US9iC0oVroaUZP0VgwYznMp`, one-time $3.99 USD.
- Test price: `price_1US9zM0oVroaUZP0phpoHZVJ`.
- Restricted runtime keys and webhook signing secrets live only in Google Secret
  Manager. Live and sandbox credentials are separate.
- RevenueCat web config: `appb5f40f18d3`. The live product is imported. External
  receipts use the Stripe public key, including external sandbox receipts; the
  RevenueCat sandbox API key is specifically not for external receipt submission.
- Paid checkout creates one generation job and a durable automatic delivery
  intent. Existing generation and Resend workers provide bounded retries. Receipt
  reporting to RevenueCat cannot create another generation job.
- Server business and client funnel events identify platform `web`. Sandbox
  client behavior is excluded from production aggregate conversion totals.

## Build and release

1. Provide the public Firebase/App Check values in ignored `.env.production.local`.
2. From this directory, run `npm ci`, `npm run check`, then `npm run build`.
3. From the repository root, run `node web/scripts/sync-static.mjs`.
4. Review and commit `studio/` and the root `_headers` with source changes.
5. Push the reviewed website revision to `main`; Cloudflare Pages serves `/`.

The Firebase browser API key is intentionally public, restricted to Firebase
services, and cannot substitute for auth, Rules or App Check. GitHub secret alert
1 was verified against this public configuration and resolved as a false positive.
Never add Stripe secrets, webhook secrets or service-account private keys here.

## Verified so far

- 248 backend release checks, including both native production bundles.
- 139 frontend tests, TypeScript and live production build.
- 70 focused backend web tests after the latest audit: late checkout responses
  cannot overwrite a newer result; refund-first notifications preserve the
  reversed financial receipt without granting generation or queuing email.
- Reopening a completed checkout uses a stable conversion event ID. Removing
  reference photos also clears extra copies from local recovery checkpoints.
- Actual deployed App Check, browser custom sign-in and private gallery query.
- Website security headers and Firebase Storage CORS.
- Private credential pattern scan of all 399 tracked site files: zero matches.
- Actual sandbox Checkout payment, signed webhook, exactly one generation job,
  all 12 photos completed, RevenueCat receipt sync, and Gmail delivery with all
  12 photo attachments. The browser ZIP downloaded and passed archive integrity
  validation. An included reshoot completed and reduced the credit count by one.
- Actual sandbox refund was received through the signed webhook and immediately
  revoked the shoot's output access. Existing downloaded/email copies remain
  with the recipient. Refunds cannot grant more generation.
- Web upload sessions allow 90 minutes for checkout; native sessions retain their
  configured duration. Stripe SDK 23 uses `allowed_payment_method_types`.
- Mobile homepage layout checked at 375px; Android links remain available.

## Operational notes

The live Stripe account and price were checked as active with charges/payouts
enabled. A real-money purchase has not been performed. RevenueCat receives
external Stripe receipts for reporting; the backend Stripe ledger controls
generation. RevenueCat's later refund display follows its Stripe synchronization.
Never switch a public site into sandbox mode for general visitors: disable
checkout first, then restrict sandbox access to explicit test UIDs.

To pause sales without affecting native apps, set only
`config/web.checkoutEnabled` to false. Preserve existing paid orders and recovery
workers. Stripe secrets stay in Secret Manager; no credential belongs in this repo.


## Public storefront refresh — October 19, 2026

The homepage now presents the six shoots directly. Public detail pages at
`/shoots/<pack>/` are generated from the studio catalog, contain the offer and
previews as static HTML, and have canonical URLs plus a sitemap. They do not wait
for Firebase sign-in. `web/scripts/build-storefront.mjs` generates those pages and
copies the source CSS/JS from `web/storefront/`; the normal static sync runs it.

The public look picker hands only validated catalog choices to `/studio/` at the
selfie step. It cannot set prices, identities, payment state or jobs. Opening the
same selection retains the draft and checkout key; payment return parameters
cannot trigger a public entry. Upload, payment verification, reshoots, email and
native apps continue using the existing backend. Legacy studio home links return
to the public homepage; private galleries remain excluded from search indexing.

The plain Fraunces wordmark and real app favicon are shared across the flow.
Navigation is How it works / My photos; Photo settings is accessible from My
photos and the workflow footer. Mobile shoot pages keep the next action visible.
Verification: 142 frontend checks, production build, public asset/link checks, and
manual Chrome desktop/mobile review plus a disconnected upload/review journey.
No new paid generation or real card transaction was run for this UI refresh.
