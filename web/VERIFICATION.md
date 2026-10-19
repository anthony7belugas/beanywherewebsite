# Verification record

October 18, 2026. All verification was local; no production backend or billing provider was called.

| Check | Result |
| --- | --- |
| TypeScript compilation, including staged integration modules | Passed |
| Optimized application build | Passed |
| Local business logic, storage, media access, and staged payment tests | 81 passed |
| Chromium desktop/phone browser journeys | 16 passed |
| WebKit desktop/phone browser journeys | 16 passed |
| Online dependency audit | Zero known vulnerabilities in the locked tree at audit time |
| Existing backend source comparison | 9 callable names, 7 contract fields, 12-photo / 3-reshoot contract present |
| Public catalog assets | Six packs, twelve covers, 144 scene previews present |
| Responsive layout | No horizontal page overflow at 320, 390, 768, and 1440 pixels |
| Outside-service requests during the complete browser journey | None observed |
| Existing BeThere repository | Remained clean at `fd33146` |

The 32 browser checks passed against both the development app and the packaged `dist/` preview served by the included Python launcher.

The browser journeys cover valid and invalid photo selection, duplicate detection, draft recovery after refresh, consent gating, checkout email validation, $0 demo checkout, generation progress, favorite persistence, ZIP download, reshooting, the image viewer, shoot deletion, a full local-data wipe, collection filters, scene previews, and unavailable routes.

The third audit added atomic reviewed checkout, failed-setting rollback, optional cross-tab messaging with focus recovery, storage-denial handling, explicit favorite intent, refreshed-token admission checks, and payment transaction-binding validation. Fault injection and stale-tab tests passed in both browser engines.

The second audit added saved-data validation and confirmed recovery, filtered downloads and viewer navigation, reshoot selection handling, interrupted-download cancellation, response validation, and approved checkout-origin checks.

The audit added delayed-photo deletion and cross-tab regressions, prepared-image validation, Safari keyboard focus checks, and 31 Firebase SDK-mocked boundary tests. See `AUDIT.md` for findings and remaining launch work.

Domain tests cover concurrent checkout deduplication across service instances, stable reshoot operation IDs, maximum reshoot allowance, private-reference cleanup, output ownership, visibility/deletion/refund access fences, and staged payment source, amount, currency, product, replay, and refund checks.

Visual review covered the home, gallery, and phone checkout screens. The narrow header layout and the hidden keyboard skip link were corrected during review. Final visual previews are saved in `previews/`.

## Limits of this verification

- WebKit is an automated desktop browser-engine test with phone-sized viewports, not a physical iPhone test.
- The Firebase adapter is type-checked, exercised with SDK mocks, and its referenced interfaces were compared with local source. No live Firebase session, rules, App Check, Storage CORS, payment checkout, or webhook was exercised.
- Generation and checkout intentionally use local simulation and marketing sample images. AI likeness, real output quality, real payments, and real email delivery are not being claimed.
- The staged payment core requires authenticated provider events and an atomic server implementation of its storage interface. It is not a deployed webhook endpoint.
- The local source snapshot can differ from current cloud configuration. Connection and staging validation remain required before deployment.

See `integration/CONNECTION-PLAN.md` for the explicit connection work.
