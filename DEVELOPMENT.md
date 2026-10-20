# BeAnywhere website and Web Studio

This original checkout, `/Users/anthonyobese/beanywherewebsite`, is the canonical website working folder. Publish the `main` branch of `anthony7belugas/beanywherewebsite` to the existing Cloudflare Pages site. October 18 Codex worktrees are historical working copies.

The shared backend, delivery emails, payment handling, native app, and owner reports live in the original `/Users/anthonyobese/BeThere` repository on `main`. Keep website changes here so web releases remain independent of app-store releases. See `BeThere/docs/web-studio-development.md` for the complete source map and source-tracking behavior.

From `web/`, run `npm ci`, `npm run check`, `npm run build`, and `node scripts/sync-static.mjs`. Commit the source and compiled root/`studio/` files together. The existing ignored `.env.production.local` supplies production build configuration. Push `main` to publish through Cloudflare Pages.

Local preview without charges or image generation: `npm run dev -- --mode draft`.

Example tracked link:

`https://beanywhere.app/?utm_source=instagram&utm_medium=social&utm_campaign=launch&utm_content=reel_03&source_code=ig03`

Use a different `utm_content` or `source_code` for each placement. Confirmed sales appear in the owner dashboard under **Web sales by source**, separately from mobile sales. Untracked traffic remains direct; old purchases do not gain invented source labels.

Delivery emails link to `/studio/#/gallery/{jobId}`. The gallery route preserves that destination through photo-delivery-email recovery on another browser. Completed galleries keep photo selection and downloads prominent, explain the included reshoots, and show one next-shoot suggestion below the photos, preferring a setting absent from the loaded library. Incomplete galleries do not show the suggestion.


The October 19 finishing pass removes favorites controls, leads the shoot pages with six previews and “12 photos total · 2 per scene,” and clarifies the editable photo delivery email before payment. Missing photos offer a free manual retry after automatic work ends; retries preserve the three reshoots and update the website gallery without creating a follow-up email. Deploy the backend’s `retrySlot`, `recoverWebGalleries`, and `listWebGalleries` before this website revision. Existing email lookup and remembered-browser access remain in place.

Validation for this pass: 240 frontend tests, 58 Chromium/WebKit browser checks, all 255 backend release checks, and desktop/390px/320px visual review. Payment, generation, and delivery edge cases use isolated fixtures; this pass does not charge a real card or generate a customer shoot.

October 19 audit fixes: campaign styling is remembered and carried through public navigation, including when storage is unavailable. Failed shoots show the available count without promising email or advertising reshoots. Gallery delivery warnings also use verified provider feedback from the backend, scoped to the current delivery request. New web delivery emails use “photo delivery email.” Validation: 240 frontend tests, 68 Chromium/WebKit checks and 258 backend release checks. No customer payments, generation or email sends are used for release verification.

Failed web shoots now link directly to support from the failure message, including the shoot reference, and keep completed photos available to save. The shared backend closes future failed web shoots without creating replacement credits; existing credits and native compensation are preserved. Deploy `onJobCreatedGenerate`, `recoverStuckJobs`, and `closeExpiredDeliveryWindows` before publishing this update. The existing automatic retries, partial-delivery emails, and simultaneous photo loading remain in place.

Validation: all 259 backend release checks, 240 frontend tests, and 16 Chromium/WebKit gallery checks passed.

Failed web galleries now show their final failure and support message immediately, even if a worker exits before clearing its automatic-work claim. Active retries and reshoots retain their progress states. This is a website-only change.

Validation: 244 frontend tests and 72 Chromium/WebKit browser checks passed. A deeper audit also passed 16 focused backend suites covering payment races, gallery recovery, uploads, native isolation, failure handling, email delivery, generation budgets, reshoots, and refunds. Live Stripe event subscriptions, email-feedback configuration, generation settings, and relevant deployed functions were checked read-only. A real paid web purchase through generation, email receipt, and reshoot remains untested.

The final gallery pass stops unnecessary background email lookups for browser-owned shoots, refreshes settled recovered galleries every five minutes, and backs off stalled work and lookup errors. Owned galleries retain their realtime listener and remain usable when email lookup fails; focus and explicit Retry still refresh immediately. Prepared photo saves stay open when an unrelated photo arrives, while replacing or removing a selected photo still invalidates the prepared files.

Validation: 252 frontend tests, all 82 Chromium/WebKit browser checks, and the production build passed. This release changes only the website; the backend and Android app are unchanged. A real paid purchase through generation, email receipt, and reshoot remains untested.

A confirmed reshoot now remains successful if the separate recovered-gallery lookup fails afterward. The gallery keeps its lookup warning and Retry control without showing the reshoot itself as failed. Validation: 253 frontend tests and 26 Chromium/WebKit recovered-gallery checks passed. The sequential Save all behavior is unchanged.

October 20 website analytics adds shared browser/session measurement across the public site and Studio, acquisition sources, ordered funnel steps, engagement, returns, errors, performance, and optional usage settings. Raw emails and photos never enter Google Analytics; private keyed email associations remain separate and do not merge browser identities or authorize gallery access. Confirmed payment and fulfillment events come from the backend.

The web stream uses daily BigQuery export to `bethere-3d7de.analytics_541514840`, without table or partition expiration. Web database events and private associations also have no scheduled expiration. Mobile retention remains unchanged. Owner website reports use a one-hour cache and a 256 MiB query billing cap; new daily exports may take 24–72 hours to appear. Production audit visits use `?ba_test=1`, which excludes that tab's browser events from the custom website reports.

Validation before publishing: 257 website tests, 92 Chromium/WebKit browser checks, 262 backend release checks including both native bundles, strict Google Measurement Protocol validation, and a query-fixture check against the BigQuery engine. Backend deployment completed before this website release. A real paid purchase, final photo generation, and delivery still require the final live test.

October 20 tracking audit, release `web-20261020-4`: focused-time measurement pauses when a visible window loses focus, flushes its last interval once, and resumes without including time away. A return after 30 minutes starts a new session for the existing browser. Screen transitions assign the preceding elapsed interval to the screen just left; page views and automatic-event defaults carry the current safe page and previous safe virtual page, with private query strings and identifiers removed. Resuming an old document does not repeat its original external referrer. Checkout failures now reach the web event stream, while browser-side purchase completion remains excluded from revenue events.

Validation: 261 frontend tests, 114 Chromium/WebKit browser checks, TypeScript and the production build passed. Fault cases reproduce the original page-time attribution, unfocused-window and missing checkout-failure issues. This release changes only website tracking and its compiled assets; no backend, native source, mobile settings, payments or generation changes.

The same audit connected Support, Privacy and Terms to shared page/session analytics and Usage settings. These pages issue no Firebase sign-in, database or Studio calls; they record no catalog impressions. Generated scripts and stylesheet dependencies are content-versioned. The shared Usage settings dialog removes itself on close, including Escape. Policy source now preserves the already-published web measurement disclosures and separate mobile retention wording; generated policy body content is unchanged. Final validation: 262 frontend tests and 120 Chromium/WebKit browser checks passed, including policy regeneration in an isolated temporary folder.

October 20 referral audit, release `web-20261020-5`: refreshing a previously tagged internal link now replaces all campaign labels and clears the legacy `ref` alias, preventing a newer source from inheriting an older campaign, post or referral code. Expired credit clears old transfer labels. Support, Privacy and Terms carry validated campaign labels and the original capture time through navigation even without browser storage. Public links refresh when another tab captures a newer visit or a page is restored. External and fragment-only links retain their normal destinations.

The generated public analytics bundle now imports the same content-versioned acquisition module as navigation, avoiding a second capture of the same arrival when measurement finishes loading. Browser tests use the actual generated public files and mock policy/Google endpoints; the delayed-policy case verifies that the original capture time remains unchanged. Validation: 264 frontend tests, 128 Chromium/WebKit browser checks, TypeScript and the production build passed. Backend/native source and deployments, live payments and photo generation remain untouched. Actual export/report reconciliation still requires Google's first daily table.
