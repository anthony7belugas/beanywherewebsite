# BeAnywhere — site

Static marketing + legal site for **BeAnywhere**, served at **https://beanywhere.app**.
Three pages, no build step, no framework: `index.html`, `privacy.html`, `terms.html`.

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page (brand hero + links). |
| `privacy.html` | Privacy Policy — **generated**, do not hand-edit. |
| `terms.html` | Terms of Service — **generated**, do not hand-edit. |
| `styles.css` | Shared styles, mirrors the app's "golden-hour" theme. |
| `icon.png` | The app icon (favicon + hero mark). |
| `legal-data.mjs` | The legal text data, derived from the app's `src/lib/legal.ts`. |
| `generate.mjs` | Builds `privacy.html` + `terms.html` from `legal-data.mjs`. |

## Update the existing site (GitHub → Cloudflare Pages)

This is a static site with no build step. Keep the existing GitHub repository and Cloudflare Pages
project. Put the changed files on a new branch in that repository, review its Pages preview, then
merge into the production branch. Pushing directly to the production branch may immediately update
the live site.
In Cloudflare Pages, use framework preset **None**, a blank build command, and output directory
`/` if these settings need to be restored. Confirm `beanywhere.app` still points to this Pages
project before relying on the public links.

Check the published `https://beanywhere.app/privacy` and `https://beanywhere.app/terms` in a
private browser window. Both should open without signing in, display the same text as the app,
and link to each other and the support email.

## After it's live — wire the app + App Store

- The app's `src/lib/theme.ts` already uses `https://beanywhere.app/terms` and
  `https://beanywhere.app/privacy`. Verify both after deployment.
- In **App Store Connect**, use `https://beanywhere.app/privacy` for Privacy Policy URL and
  `https://beanywhere.app/` for Support URL (the homepage displays the support email).
- Keep “Coming soon to the App Store” on the homepage until the listing is live; then replace it
  with a link to the actual App Store listing.

## Keeping the legal text in sync with the app (important)

The canonical legal wording lives in the app at `src/lib/legal.ts`. The two pages here are a
**generated mirror** of it — same words, so the app and the website never disagree.

When you change `legal.ts` (new clause, effective date, etc.):

1. Copy the app's `src/lib/legal.ts` over `legal-data.mjs`, then strip the 3 TypeScript-only bits:
   ```bash
   cp ../BeThere/src/lib/legal.ts legal-data.mjs
   sed -i '' '/^export type LegalSection/d' legal-data.mjs
   sed -i '' 's/export const PRIVACY: LegalSection\[\] = \[/export const PRIVACY = [/' legal-data.mjs
   sed -i '' 's/export const TERMS: LegalSection\[\] = \[/export const TERMS = [/' legal-data.mjs
   ```
   *(On Linux, drop the `''` after `-i`.)*
2. Regenerate and push:
   ```bash
   node generate.mjs
   git commit -am "sync legal text" && git push
   ```

That's the whole loop: edit `legal.ts` in the app → mirror it here → regenerate → push.
