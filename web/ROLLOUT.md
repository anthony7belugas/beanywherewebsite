# Web studio rollout

Updated October 18, 2026. The backend is deployed to `bethere-3d7de` and the
compiled studio is published at `https://beanywhere.app/studio/` through the
existing Cloudflare Pages project. **Public sales are not yet enabled.**

`config/web` is temporarily in Stripe test mode and accepts checkout only for
the explicitly allowlisted test browser. The homepage launch links are prepared
locally but must not be published until the end-to-end test passes and the config
returns to live mode. The user requested this audit before the sandbox checkout.
No successful customer payment, photo generation or automatic email
has yet been verified end-to-end.

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
- 69 focused backend web tests after the latest audit: late checkout responses
  cannot overwrite a newer result; refund-first notifications preserve the
  reversed financial receipt without granting generation or queuing email.
- Reopening a completed checkout uses a stable conversion event ID. Removing
  reference photos also clears extra copies from local recovery checkpoints.
- Actual deployed App Check, browser custom sign-in and private gallery query.
- Website security headers and Firebase Storage CORS.
- Private credential pattern scan of all 399 tracked site files: zero matches.

Next: sandbox checkout → signed webhook → one real job → photo delivery →
RevenueCat receipt sync, retry/refund checks, live configuration, homepage links,
and a final production browser smoke test. Do not represent local tests as proof
that the entire deployed payment/delivery flow works.
