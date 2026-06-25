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

## Deploy (GitHub → Cloudflare Pages)

1. **Push this folder to a new GitHub repo** (e.g. `beanywhere-site`).
2. **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
3. **Build settings — this is the one place to get right for a no-build static site:**
   - Framework preset: **None**
   - Build command: **(leave blank)**
   - Build output directory: **`/`**
4. Deploy. You'll get a `*.pages.dev` URL to check.
5. **Custom domain → add `beanywhere.app`** (and `www.beanywhere.app` if you want). Because the
   domain already lives in your Cloudflare account, it wires the DNS record and provisions SSL
   automatically. (`.app` is forced-HTTPS — Cloudflare handles the cert.)

Every later `git push` to the repo auto-deploys.

## After it's live — wire the app + App Store

- In the app, set `src/lib/theme.ts`:
  - `tosUrl: 'https://beanywhere.app/terms'`
  - `privacyUrl: 'https://beanywhere.app/privacy'`
- In **App Store Connect**, set the **Privacy Policy URL** to `https://beanywhere.app/privacy`.
  (A dead URL here is an automatic rejection — this is the item that unblocks submission.)

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
