# BeAnywhere web draft — audit and repairs

**Verdict: suitable for local review as a disconnected demo. Not ready for a live launch.**

Audited October 18, 2026. Reviewed the frontend, local persistence, photo preparation, staged Firebase adapter, staged payment logic, dependency tree, and packaged preview. Verified contracts against the existing native source without changing that repository. No Firebase, payment, or AI service was connected. Package registry and security-advisory lookups were used for dependency maintenance only.

## Third audit pass — transaction races, storage failures, and refreshed access

The next pass reproduced and repaired additional failures without connecting any service:

| Area | Finding | Repair and verification |
| --- | --- | --- |
| Checkout review and retries | Checkout checked only the draft identity, so it could consume references replaced and approved in another tab after review. The UI saved email separately, which bypassed checkout deduplication when two tabs submitted. | Check the reviewed reference revision and glasses setting inside the same transaction that validates permission, saves the email, and creates the shoot. Return an existing shoot before checking a retry's obsolete draft. Six checkout/reliability tests cover changed references, changed settings, permission revocation, atomic email/retries, invalid input preservation, committed notifications, and concurrent favorite intent. |
| Permission and glasses controls | A failed browser save left the checkbox visibly changed. Clicking Review from a stale tab could overwrite permission revoked elsewhere. | Roll back failed optimistic controls, disable Review while a setting is saving, and make Review compare freshly stored settings instead of rewriting permission. Browser fault injection verifies both failed settings, persistence after reload, and stale-tab revocation. |
| Storage startup and notifications | A blocked BroadcastChannel could crash startup. A notification exception after a successful database commit could report the save as failed and prevent navigation. A synchronous database-access exception also escaped before the storage guidance could render. | Make cross-tab messaging optional, isolate listener/message failures from committed writes, refresh on focus/visibility, and open storage on demand inside the handled read path. Chromium and WebKit tests simulate denied channels, broken notifications, denied storage access, and focus recovery. |
| Favorites across tabs | Two tabs choosing the same favorite toggled it twice and undid both users' visible intent. | Persist the chosen boolean value. A concurrent service test confirms that two requests to favorite the same photo keep it favorited. |
| Future session access | The staged adapter observed sign-in changes but did not recheck admission when a new token restricted the same signed-in user. Watched data and active uploads could remain active. | Observe token changes and recheck admission. Restricted or unverifiable refreshed claims clear subscriptions and cancel uploads. Three SDK-mocked tests cover revocation, token-check failure, a valid refresh, and observer disposal. Detection happens when the client receives refreshed claims; server-side revocation enforcement is still essential. |
| Future payment records | Non-string/path-containing payment IDs were accepted and coerced into transaction keys. A paid/refunded order without its stored transaction binding could acknowledge an unrelated event. | Require bounded, path-safe string identifiers, declared environments, three-letter uppercase currencies, and a matching transaction binding for completed orders. Six new tests reject malformed transaction IDs and missing terminal bindings. The provider normalizer and atomic server store still need implementation. |

This pass added **15 logic/integration tests and ten browser checks**. All previously passing checks remain passing. No dependency versions changed during this pass.

## Second audit pass — recovery, downloads, and checkout returns

The follow-up audit found and repaired these additional issues, while keeping the entire application disconnected:

| Area | Finding | Repair and verification |
| --- | --- | --- |
| Saved-data recovery | Incomplete or incompatible saved records could reach the renderer, crash a screen, and remain broken after reload. The normal reset path depended on reading the same malformed record. | Validate saved data before rendering or editing. Keep the original record unchanged on failure, display an actionable recovery screen, and support an explicit confirmed reset that does not need to decode the broken data. Preserve older valid drafts by adding their missing revision. Seven storage tests and a phone-sized browser recovery journey verify preservation, cancellation, reset, and migration. |
| Favorites and selection | Downloading from Favorites exported the entire shoot; the viewer could browse outside the filter. A selected photo entering a reshoot left the download action enabled with no finished selection. | Downloads and viewer navigation now use the active filter. An empty Favorites list disables downloading. Selected photos remain selected through a reshoot, with downloading disabled until they finish. The viewer closes when its photo leaves the visible set. Selection decorations no longer intercept the checkbox's pointer target. Browser tests cover these behaviors and reshoots initiated from a second tab. |
| Download failure handling | Pending downloads could outlive the gallery. A stalled request had no timeout. Successful HTML fallback responses or invalid WebP headers were treated as photo files. | Abort requests when leaving or removing the gallery, add a 30-second network deadline, check response type and WebP headers, and re-read the shoot before saving to reject deleted or changed photos. This is basic response validation, not a full image-decoder security check. Six media tests cover failure, timeout, cancellation, final access refusal, and a valid download; browsers verify navigation cancellation. |
| Future checkout handoff | The staged adapter accepted arbitrary checkout URLs, responses bound to another order, missing/non-string checkout identifiers, and unknown recovery statuses. | Require explicitly configured HTTPS checkout origins, reject embedded credentials and unapproved destinations, verify the returned order and checkout ID, and accept only declared recovery statuses. Eleven additional SDK-mocked tests cover these boundaries. No provider was selected or connected; backend checkout/webhook authentication remains mandatory. |

The second pass added **24 logic/integration tests and eight browser checks**. Current totals are below. The new recovery screen was visually reviewed at phone width.

## Findings fixed

| Priority | Finding and practical impact | Repair and evidence |
| --- | --- | --- |
| High, local privacy | Photo preparation could finish after reference removal and restore the removed photos. An old operation could also write private photos or an email into a replacement draft. | Every draft edit now checks the draft identity and reference revision inside its storage transaction. Clearing photos invalidates pending edits; resetting creates a fresh identity; leaving the upload screen cancels its pending save. Reproduced with failing regression tests, then verified with storage tests and delayed-image preparation in Chromium and WebKit. |
| Medium, local correctness | Two tabs could overwrite newer photo changes. Consent stayed checked after the photos changed. | Stale photo edits are rejected with a review message. Changing or removing references resets consent in storage and across tabs. Existing local drafts migrate without discarding their content. |
| High, future integration | The unconnected Firebase adapter could start work after an account change, return an old account's job list or download, and leave a gallery visible until another database update arrived. | Bound each adapter to one admitted session, rechecked identity at async boundaries, cleared gallery subscriptions on sign-out, cancelled active uploads, and added explicit disposal. Download checks now query the server before and after transfer and require the exact user/job/output path. SDK-mocked regression tests cover these boundaries; live Firebase rules remain untested. |
| Medium, future integration | Cancellation could happen during authentication or at the last upload and still allow the upload/finalization to continue. Returned upload paths were checked too loosely. | Cancellation is checked before session creation, after authentication, between uploads, and before finalization/metadata commit. Session paths must match each expected index; expired sessions and inconsistent finalized paths fail closed. In-flight server operations already dispatched cannot be recalled; server privacy controls remain necessary. |
| Medium, future integration | Limiting the gallery query before sorting could omit the user's newest shoots. Malformed stored payment order identity/status could be acknowledged as applied. | Sort the server query by creation time before its 100-job limit. Payment processing rejects inconsistent stored identifiers, unknown statuses, and missing privacy flags. Actual payment verification and atomic persistence are still separate implementation work. |
| Medium, upload compatibility | A wide image could meet the initial size requirement but shrink below the backend's minimum edge size during preparation. | Validate prepared dimensions and JPEG byte size against the existing backend limits. Added a browser regression using a 4000 × 256 image. Unreadable files get an actionable message; transparent images are composited on white. |
| Medium, accessibility | Safari/WebKit keyboard navigation could leave a modal and enter background controls. | Dialogs render outside an inert page background; forward and reverse Tab stay inside, and keyboard focus returns to the opener. Chromium and WebKit tests pass. |
| Dependency maintenance | The online package audit reported seven affected package entries, including inherited test-tool and Firebase Node dependencies. This does not establish that the local browser draft was exploitable. | Updated Vitest to 4.1.12 and pinned the transitive gRPC package to patched 1.13.6. The final online npm audit reports zero known vulnerabilities. The gRPC override exceeds Firebase's old Node-only dependency pin; revisit it when upstream updates. Firebase is absent from the shipped frontend bundle. |

## Verification

- 81 automated logic and integration-boundary tests passed, including 31 tests using mocked Firebase SDK calls.
- 32 browser tests passed: sixteen journeys/checks in Chromium and sixteen in WebKit, including phone-sized layouts, delayed photo preparation, multiple tabs, keyboard navigation, downloads, deletion, and reload recovery.
- TypeScript checks and the optimized build passed. All 32 browser checks also passed against the actual packaged build served by its included launcher.
- Static native-source compatibility check passed: nine callable names, seven contract fields, and the 12-photo / 3-reshoot model. This is not semantic or live integration certification.
- Online npm audit: zero known vulnerabilities in the installed locked tree at the audit time.
- No outside-service requests or uncaught page errors observed in the full gallery journey. The compiled browser bundle contains no Firebase bootstrap, callable adapter, or staged payment processor.
- The original BeThere repository remained clean. Work was confined to this draft and its saved archive.

Maintainer advisory references for the dependency repairs: [gRPC certificate validation](https://github.com/grpc/grpc-node/security/advisories/GHSA-m9gg-hp2v-232j), [Vitest mock redirect traversal](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9), and [Tinypool worker options](https://github.com/tinylibs/tinypool/security/advisories/GHSA-85c8-ppgw-ccpr).

## Still required before launch

1. Implement and test the canonical web identity flow, web App Check, rules, authorized domains, and Storage CORS in staging. The native authentication bootstrap currently rejects web.
2. Implement explicit web payment routing, authenticated provider webhooks, atomic fulfillment/refunds, and persistent checkout recovery. The current mobile store fallback must not receive web purchases.
3. Connect real job states, authoritative pricing, scoped deletion/account deletion, and upload/checkout/reshoot recovery. Call the adapter's `dispose()` on session teardown. Validate the gallery query's compound index and add pagination.
4. Test real Firebase and payment sandboxes, physical iPhones and Android devices, interrupted transfers, partial delivery, refunds, and privacy revocation. SDK mocks and desktop WebKit cannot establish those results.
5. Add public indexable landing pages for search traffic, final production disclosures, and the hosting configuration. The draft's hash routes and `noindex` are intentional for local review; deploying this unchanged would not complete that SEO work.

No remaining connection step has been silently enabled. The displayed images are supplied marketing samples; generation and checkout remain simulated. See `integration/CONNECTION-PLAN.md` for the exact connection work.
