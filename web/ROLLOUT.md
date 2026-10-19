# Web studio rollout status

This directory is saved source on `codex/web-studio`. It is not published by the
existing website. `src/App.tsx` still uses the local demo service. Do not expose
the demo checkout as a real payment flow.

The Firebase integration now uses the dedicated BeAnywhere Web Studio app and a
separate named Firebase auth store. It requires verified web claims and App Check,
persists one browser identity across tabs, and calls the server's checkout API
with the frozen order ID and delivery email. All payment results are read from
the server. The UI must not infer success from a Stripe return URL.

Upload recovery recognizes completed and finalizing server sessions. It does not
overwrite a completed upload after an acknowledgement is lost.

Remaining release work includes the live StudioService and gallery UI, automatic
email delivery and recovery, Firebase/App Check configuration, Stripe/RevenueCat
configuration, sandbox end-to-end checks, and a separate Cloudflare Pages build
step to publish the finished studio under `/studio/` while preserving the site.

Verified locally: TypeScript, 112 frontend tests, and the Vite production build.
These checks do not establish that live payments, email, or generation work.
