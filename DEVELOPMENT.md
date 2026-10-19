# BeAnywhere website and Web Studio

This original checkout, `/Users/anthonyobese/beanywherewebsite`, is the canonical website working folder. Publish the `main` branch of `anthony7belugas/beanywherewebsite` to the existing Cloudflare Pages site. October 18 Codex worktrees are historical working copies.

The shared backend, delivery emails, payment handling, native app, and owner reports live in the original `/Users/anthonyobese/BeThere` repository on `main`. Keep website changes here so web releases remain independent of app-store releases. See `BeThere/docs/web-studio-development.md` for the complete source map and source-tracking behavior.

From `web/`, run `npm ci`, `npm run check`, `npm run build`, and `node scripts/sync-static.mjs`. Commit the source and compiled root/`studio/` files together. The existing ignored `.env.production.local` supplies production build configuration. Push `main` to publish through Cloudflare Pages.

Local preview without charges or image generation: `npm run dev -- --mode draft`.

Example tracked link:

`https://beanywhere.app/?utm_source=instagram&utm_medium=social&utm_campaign=launch&utm_content=reel_03&source_code=ig03`

Use a different `utm_content` or `source_code` for each placement. Confirmed sales appear in the owner dashboard under **Web sales by source**, separately from mobile sales. Untracked traffic remains direct; old purchases do not gain invented source labels.

Delivery emails link to `/studio/#/gallery/{jobId}`. The gallery route preserves that destination through checkout-email recovery on another browser. Completed galleries keep downloads and favorites prominent, explain the included reshoots, and show one next-shoot suggestion below the photos, preferring a setting absent from the loaded library. Incomplete galleries do not show the suggestion.
