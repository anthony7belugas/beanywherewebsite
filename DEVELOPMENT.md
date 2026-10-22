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

October 20 usage-controls removal: the public footer button and website usage dialog are removed from the homepage, all shoot pages, and informational pages. Studio Photo settings no longer contains the usage checkbox. Analytics remains enabled by default; existing saved preferences and browser privacy signals retain their behavior. The policy text now describes the current behavior without pointing to removed controls. The obsolete settings scripts and styles are deleted from both source and generated output. Validation: TypeScript, 264 frontend tests, 128 Chromium/WebKit browser checks, and the production build passed.

October 21 owner browser setup adds `/owner-browser/`, a private-link registration page reached from the owner dashboard. It displays the same random browser ID used by public-site Analytics, preserving an existing ID across VPN/Wi-Fi changes. It sends no Analytics events or Studio sign-in requests, keeps its one-use token out of query strings/referrers, and requires working persistent storage before registration. The owner dashboard filters registered IDs from historical and future website usage reports; original GA data and confirmed financial records remain intact. Deploy `ownerWebAnalytics` and `claimOwnerBrowser` plus Firebase Hosting before publishing this website revision. Each browser/profile/in-app browser needs its own registration; storage clearing or private browsing may change the ID.

October 21 raw measurement reliability, release `web-20261021-6`: original action timestamps, safe pages and source snapshots survive delayed policy loading, navigation and retries. Important browser events also go to the restricted first-party collector; Google and first-party copies share IDs and must be deduplicated. Browser queues use individual event keys, retain at most 100 pending events for 24 hours, respect saved preferences/GPC/DNT, and fall back to memory when storage is blocked. Background failures are recorded with fixed categories; failed/duplicate-only selfie selection no longer emits completion. Campaign spaces normalize to underscores. Email-only recovery remains intentional and unchanged. The privacy copy describes the additional restricted browser history. Deploy the backend set documented in `BeThere/docs/web-studio-development.md` before publishing these generated assets.

Validation: 266 unit tests, all 140 Chromium/WebKit browser tests, TypeScript and production build passed. Backend validation: 269 release checks and real BigQuery fixture execution, including five independent report comparisons. Test browser traffic uses `ba_test=1` and is retained as test data for verification.
Final verification includes 142 browser checks. Marked browser test visits now retain `isTest` in authenticated business events as well as the Google/first-party copies; original shared IDs, timestamps and context are asserted together.

### Final analytics exclusion audit (October 21, web-20261021-7)

The test marker is now part of the shared analytics context so Studio observations and later server sale/outcome events keep their test provenance. Delayed initialization treats carried `ba_at` links as internal/direct session arrivals while preserving their prior campaign for sales attribution. The backend checks the registered owner-browser IDs before adding Studio behavior counters; it keeps the raw records. The known Codex browser is now registered alongside the three owner browsers, protecting reports even if a later test link omits `ba_test=1`.

Checks: 266 frontend tests and 144 Chromium/WebKit browser checks passed. The added regression checks cover context test propagation and carried source labels. Google exports can still be delayed, storage clearing creates a new browser identity, and separate app browsers need their own registration. No fingerprint or shared-IP exclusion is used.

### Focus classification correction (October 21, web-20261021-8)

Completed engagement intervals now retain `activePage: true` when emitted on blur, hide or pagehide: their duration was measured while focused. Otherwise short focused visits could be omitted from return reporting even though the duration survived in raw records. The existing blur/hide browser regression now checks classification as well as avoiding duplicated time. The companion owner-report update separates server-only follow-ups from visits and bases retention eligibility on export coverage rather than the latest customer action.

### Temporary measurement outage correction (October 21, web-20261021-9)

A temporary policy-fetch failure now preserves the visit clock for actual browser actions. Returning after inactivity retains a new session, the original action time, direct return attribution and the earlier campaign's sales credit. Deferred error/performance callbacks still do not advance activity. Studio business copies now queue during a temporary policy outage and resume with the browser journal's matching event ID, time, context and test marker. Explicit withdrawal clears both pending copies, including withdrawal from another tab.

Validation: 266 frontend unit tests, the production build and all 148 browser checks passed. Six focused Chromium/WebKit checks additionally cover the reproduced failures and withdrawal during the outage. The unchanged backend passed all 271 release checks. A fresh read-only combined export retrieved all nine included sources, excluded the four known owner/test browsers, and retained the same four observed customer browser sessions and zero paid customer purchases. Tests use local mocked endpoints; no customer purchases, photos or delivery emails are created. Email-only gallery recovery remains unchanged.

### Delayed navigation and multiple tabs (October 21, web-20261021-10)

Pending pages now capture an existing browser's session at observation time, including before policy initialization, so another tab cannot move their old actions into its newer session. New identities still wait for collection permission. The authenticated Studio queue waiting for policy approval is now also retained across document navigation in bounded session storage (up to 100 events, no older than 24 hours). Its original ID, time, session and test marker survive recovery. Withdrawal clears both in-memory and stored copies; successfully replayed entries are cleared. Existing durable delivery queues retain their retry and deduplication behavior.

Validation: 266 unit tests, TypeScript, production build and all 156 Chromium/WebKit checks passed. Regressions reproduce both failures and check that a newer tab's saved session is preserved, old event/session times remain compatible with the collector, pending Studio copies match browser records after navigation, and withdrawal prevents later replay. Tests use local mocked endpoints and never create customer traffic or purchases. The companion owner-export fix honors explicit inclusion without changing the four existing exclusions. Email-only gallery recovery and shared-Wi-Fi admission remain unchanged.

### Reloads, source classification and blocked-storage test markers (October 21, web-20261021-11)

Queued page views now retain each distinct real navigation, including a reload of the same URL during a policy outage. Duplicate live-page callbacks remain suppressed, and stable event IDs continue to deduplicate delivery. The regression preserves the original timestamps, one shared session, two distinct page events and test provenance.

Referrer classification distinguishes mail.google.com as gmail/email. Docs, Drive and other non-search Google subdomains remain host-labelled referrals; the known Google and Bing search hosts remain organic. Explicit campaign tags still take precedence. This applies only when a referrer is actually provided and does not identify a Gmail account or recover stripped referrers.

An explicit production ba_test=1 marker now survives a sessionStorage exception in memory, including subsequent URL cleanup in the same document. Normal production visitors remain unmarked. The production-host branch is tested with every request intercepted; Google, first-party and Studio copies retain the same classification. With all relevant storage unavailable, an untagged new document cannot inherit an in-memory marker; continue using the test link or a registered owner browser for live checks.

Validation: TypeScript, 267 unit tests, production build and all 162 Chromium/WebKit checks passed. The unchanged backend's 49 analytics, journey, exclusion and combined-export regression tests passed. A read-only export again retrieved all nine sources and retained the same 4 observed browsers, 4 visits, 5 page views, 73 events and 0 paid customer purchases. All four registered owner/test browsers remain excluded. No live customer event, payment, generation or email was created. Email recovery and shared-Wi-Fi admission are unchanged.
