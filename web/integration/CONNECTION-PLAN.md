# Prepared integration — not connected

Baseline reviewed: local `/Users/anthonyobese/BeThere` at commit `fd33146`, October 18, 2026. The source tree remained clean. Public catalog and asset versions match the local seed data, not a new read of the production database.

The draft frontend has a functional local implementation. `firebase-adapter.ts` is a separate, type-checked integration layer; it is not a drop-in live replacement for `LocalStudioService`. Production identity, payment handlers, job-to-view-model mapping, and privacy operations must be connected deliberately. There are no credentials, production initialization calls, migrations, deploy commands, or automatic live-mode switches in this package.

## Existing interfaces prepared for reuse

| Operation         | Existing interface                                  | Draft preparation                                               |
| ----------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| Catalog           | Firestore `packs`                                   | Public metadata projection; private prompts excluded            |
| Readiness         | `checkPackReadiness`                                | Pack, styling, and style ID                                     |
| Consent           | `users/{uid}`                                       | Server timestamp, consentVersion 1, styling, glasses            |
| Upload session    | `createReferenceUploadSession`                      | 4–6 JPEGs, persistent clientAttemptId, glasses                  |
| Upload            | Firebase Storage `refs/{uid}/{session}/{index}.jpg` | Resumable, bounded uploads; progress and cancellation           |
| Finalize          | `finalizeReferenceUploadSession`                    | Server image validation and thumbnail generation                |
| Reference reuse   | `commitReferenceMetadata`                           | Exact completed session                                         |
| Order             | `createOrder`                                       | Frozen pack, styling, product, and upload session               |
| Gallery           | Firestore `jobs`                                    | UID, visibility, deletion, and refund filtering                 |
| Download          | Authenticated Storage blob                          | Checks authoritative output allowlist before and after download |
| Reshoot           | `reshootSlot`, `getReshootOperationStatus`          | Stable operation ID and previous-path contract                  |
| Retry             | `retrySlot`                                         | Existing job and slot IDs                                       |
| Delete all photos | `deleteMyPhotos`                                    | Kept explicitly distinct from local single-shoot deletion       |

Actual native model distinctions are retained: slots can be developing, done, retryable, blocked, closed, or failed; jobs may be partially delivered, refunded, deleted, or waiting for recovery. Production UI mapping must show those states instead of substituting the demo’s time-based progress. The backend remains the authority for prices, access, entitlements, reshoot counts, output paths, and job creation.

## Connection work to perform later

1. **Create a staging environment and register a web client.** Configure a web App Check provider, authorized domains, storage CORS, and the precise CSP endpoints needed by the selected providers. Keep production enforcement intact. The current native `ensureAppCheckReady` rejects web; this draft does not relax it.
2. **Add browser identity to the existing canonical-account system.** The existing identity uses device-bound secrets and server-minted custom claims. Google sign-in currently admits only the Android Firebase app ID. A web Google/email flow must prove ownership and map to the existing canonical UID, including privacy tombstones and account migration rules. Do not automatically merge by email or store the native device credential in browser localStorage. The adapter expects a verified session minted by that future server integration.
3. **Add explicit WEB payment routing.** `functions/lib/purchase-stores.js` currently defaults non-Android calls to APP_STORE and recognizes only native RevenueCat app IDs. Add an explicit, trusted web app/store mapping and separate web transaction keys. Never send web receipts through that default Apple path.
4. **Implement the `WebPayments` interface.** Prefer the existing RevenueCat ecosystem if its one-time product integration meets the frozen-order requirements. A server endpoint must bind the canonical UID and exact order before creating checkout, choose price/product on the server, and return an allowlisted checkout URL. Supply `checkoutOrigins` as explicit HTTPS origins without wildcards or paths. The adapter rejects unapproved destinations, embedded credentials, mismatched order IDs, invalid checkout IDs, and unknown reconciliation statuses; these client checks complement server authentication. Persist checkout ID before navigation and reconcile server payment status after return or reload. A successful redirect alone must never create a generation job.
5. **Connect verified webhooks to existing fulfillment.** Authenticate the raw provider request before constructing `TrustedPaymentEvent`; the boolean field in the staging type is not authentication. Implement `PaymentStore` using one Firestore transaction and the existing order specification, payment authorization, refund, deletion, generation-budget, and job lifecycle helpers. The supplied core covers duplicate events, transaction ownership, product/amount/currency checks, delayed payment, refunds before payment, and privacy holds. Normalize provider identifiers to nonempty, path-safe strings of up to 256 ASCII letters, digits, underscores, hyphens, periods, or colons, and currency to three uppercase letters. Completed orders must retain the matching namespaced transaction key; missing or inconsistent bindings require recovery instead of acknowledgement. The core does not itself verify provider signatures or access Firestore. Mismatches and privacy holds need a persisted review/refund queue rather than infinite webhook retries.
6. **Connect screens to the adapter.** Map live Firestore jobs to the view model, persist upload/checkout/reshoot operation IDs through refresh, map partial/blocked/refunded states, attach current catalog pricing, and reconcile any ambiguous reshoot result with the same operation ID. The job query orders by `createdAt` descending before its 100-record limit; verify/create the required `uid + clientVisible + createdAt` compound index in staging and add paging. Bind each adapter to one admitted auth session and call `dispose()` on sign-out or teardown before constructing another. The adapter also checks admission on token refresh and invalidates the session on restricted or unverifiable claims. This detects updated claims once received; server rules and revocation checks must still enforce access independently. Downloads use fresh server reads around transfer and require an exact job path. Local favorites can remain device-specific initially, or use a separate user-owned preference record with deliberate rules.
7. **Complete account and photo deletion.** The local per-shoot button is not connected to `deleteMyPhotos`, which deletes all photos. Add a scoped backend operation or present the existing all-photo action accurately. Account deletion must use the existing tombstone/revocation protocol and a browser session teardown. Do not call native account deletion with invented device-secret fields.
8. **Validate before launch.** Test real Safari/iPhone and Android Chrome uploads, HEIC conversion support if promised, large photos, cancellation, duplicate tabs, auth redirects, checkout return, delayed and duplicate webhooks, refunds, deletion races, storage denial, partial generations, reshoots, downloads, and recovery after the browser closes. Verify that old native clients remain compatible.

## Hosting later

Keep the existing marketing site intact. A separate studio subdomain can serve this app, while public indexable landing pages remain on the main site. Use a dedicated Hosting site/target if using Firebase Hosting, so the native app’s public image hosting and owner tools are not overwritten.

Remove the draft branding, sample backend, and `noindex` only after live behavior and disclosures are validated. The current local privacy and terms dialogs explicitly describe the disconnected draft and are not production legal documents.

No deployment is performed or automated by this document or package.

## Audit follow-up

Local privacy races, cancellation, session invalidation, output-path checks, image preparation, payment record validation, and Safari keyboard focus were repaired during the local audit. See `../AUDIT.md` for reproducible findings. The 31 SDK-mocked adapter checks do not replace live staging validation. An abort prevents subsequent client steps; an already-dispatched server operation still needs the backend’s existing privacy/revocation controls.
