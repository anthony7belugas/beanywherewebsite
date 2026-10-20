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
