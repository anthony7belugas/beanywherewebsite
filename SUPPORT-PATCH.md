# BeAnywhere support page patch

## Apply

1. Unzip this patch and copy its website files into the root of your existing BeAnywhere website repository, replacing files with the same names.
2. Keep your existing `icon.png` and `legal-data.mjs`. They are unchanged and are not included in this patch.
3. Commit and deploy through your existing GitHub → Cloudflare Pages setup. No build command or new dependency is needed; generated legal pages are included.
4. Before App Store submission, open `https://beanywhere.app/support` in a private browser window. Check that the page loads, the email link opens `support@beanywhere.app`, and your support mailbox can receive messages.
5. Keep App Store Connect's Support URL set to `https://beanywhere.app/support`.

## Included

- `support.html`: minimal contact page plus help with packs, recovery, refunds and deletion.
- `index.html`: adds a Support link.
- `styles.css`: support page spacing and a wrapping header for narrow screens.
- `generate.mjs`, `privacy.html`, `terms.html`: add Support navigation so it also survives legal-page regeneration.
- `README.md`: updates deployment and App Store URL instructions.

The privacy and terms main content is byte-for-byte unchanged. The app icon and legal source data are also unchanged. Internal page and asset references, heading counts, IDs and section labels were checked. A browser visual preview could not be run because the available browser blocks local file URLs. The patch has not been deployed and nothing has been submitted to App Review.
