# Web studio rollout status

This directory is saved source on `codex/web-studio`. It is not published by the
existing website. `src/App.tsx` selects the live service only with explicit live
configuration. Production builds fail without the dedicated Firebase and App
Check settings. Use `npm run build:draft` for a disconnected preview.

The Firebase integration now uses the dedicated BeAnywhere Web Studio app and a
separate named Firebase auth store. It requires verified web claims and App Check,
persists one browser identity across tabs, and calls the server's checkout API
with the frozen order ID and delivery email. All payment results are read from
the server. The UI must not infer success from a Stripe return URL.

Upload recovery recognizes completed and finalizing server sessions. It does not
overwrite a completed upload after an acknowledgement is lost.

The live service now uploads reviewed selfies, freezes and persists the order,
opens the server-created Stripe checkout, and shows actual server photo progress.
Duplicate taps and ambiguous responses reuse the saved attempt. Downloads use
authorized storage reads and recheck access before saving. Paid gallery access
and payment retry keys survive clearing local draft data.

The official RevenueCat Stripe app is connected to the separate BeAnywhere Web
configuration. The restricted live Stripe key is stored in Google Cloud Secret
Manager as `STRIPE_SECRET_KEY` (version 1), and a read-only account request verified
the correct account with payments and payouts enabled. This is not a completed
checkout or a live release. No secret value belongs in browser configuration.

Remaining release work includes automatic email delivery and gallery recovery,
Firebase/App Check configuration, Stripe/RevenueCat products and webhooks,
sandbox end-to-end checks, and a separate Cloudflare Pages build
step to publish the finished studio under `/studio/` while preserving the site.
Copy the generated `_headers` into the deployment root and merge existing rules;
Cloudflare will not apply a `_headers` file left inside `/studio/`.

Verified locally: TypeScript, 132 frontend tests, and the explicit draft build.
These checks do not establish that live payments, email, or generation work.
