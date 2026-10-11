# BeAnywhere — site

Static marketing, support and legal site for **BeAnywhere**, served at **https://beanywhere.app**.
Four pages, no framework or deployment build step: `index.html`, `support.html`, `privacy.html`, `terms.html`.

## Files

| File | What it is |
|---|---|
| `index.html` | Photoshoot-first landing page with accurate launch availability. |
| `support.html` | iPhone/Android help and account deletion by app or email, served at `/support`. |
| `privacy.html` | Privacy Policy — generated; edit `legal-data.mjs` instead. |
| `terms.html` | Terms of Service — generated; edit `legal-data.mjs` instead. |
| `styles.css` | Shared styles matching the app's golden-hour theme. |
| `icon.png` | The app icon, used for the favicon and hero. |
| `legal-data.mjs` | Shared website policy text with explicit Apple and Android sections. |
| `generate.mjs` | Generates `privacy.html` and `terms.html` from `legal-data.mjs`. |

## Update the site

Use the existing GitHub repository and Cloudflare Pages project. Make changes on a branch,
review the Pages preview, then merge into the production branch when publishing is intended.
Pushing to the production branch may immediately update the live site.

For policy changes, edit `legal-data.mjs`, set the effective date appropriately, then run:

```sh
node generate.mjs
git diff --check
```

Commit both the source and generated HTML. Compare the wording with the app's
`src/lib/legal.ts` (Apple) and `src/lib/platformLegal.ts` (Android), including actual account,
payment and data-handling behavior. Keep shared disclosures consistent while clearly scoping
platform-specific instructions. Do not copy the Apple-only source over `legal-data.mjs`:
that would erase Android disclosures and the external account-deletion information.
Website changes do not update the legal text bundled inside an already submitted app.

Cloudflare Pages uses framework preset **None**, a blank build command and output directory `/`.
It serves the `.html` files at their existing extensionless URLs. Retain the custom domain
`beanywhere.app` and existing page addresses.

## Review before publishing

- Open all four pages on desktop and a narrow mobile viewport; check links, spacing and readability.
- Check `/support#delete-account` lands on the deletion instructions below the sticky header.
- Confirm Apple-specific additional terms and retention disclosures remain intact.
- Confirm email links open `support@beanywhere.app`; monitor and fulfill support/deletion requests.
- Preserve the photoshoot-first homepage and accurate availability. Add each store's download
  link only when that public listing is available.
- After publication, check the HTTPS pages without signing in, including the deletion anchor.

## Store and sign-in links

- App Store Connect: Privacy Policy `https://beanywhere.app/privacy`; Support `https://beanywhere.app/support`.
- Google Play: Privacy Policy `https://beanywhere.app/privacy`; account deletion `https://beanywhere.app/support#delete-account`.
- Google sign-in branding: homepage `https://beanywhere.app/`, Privacy `https://beanywhere.app/privacy`, Terms `https://beanywhere.app/terms`.

Configure these service fields separately after the relevant pages are published. This repository
does not change store listings, sign-in configuration or the app's deletion implementation.
