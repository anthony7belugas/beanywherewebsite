// Generates privacy.html + terms.html from the SAME data the app renders (legal-data.mjs,
// derived from src/lib/legal.ts). Run: node generate.mjs
// This is the sync mechanism: regenerate whenever legal.ts changes so the site never drifts.
import { writeFileSync } from 'node:fs';
import { LEGAL_INFO, PRIVACY, TERMS } from './legal-data.mjs';

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Make the support email clickable wherever it appears in the body text.
const EMAIL = LEGAL_INFO.supportEmail;
const linkifyEmail = (html) =>
  html.split(EMAIL).join(`<a href="mailto:${EMAIL}">${EMAIL}</a>`);

// Render one section's body array: group consecutive "•" lines into a <ul>, the rest <p>.
function renderBody(body) {
  const out = [];
  let list = [];
  const flush = () => {
    if (list.length) { out.push(`<ul>${list.join('')}</ul>`); list = []; }
  };
  for (const raw of body) {
    const line = linkifyEmail(esc(raw));
    if (raw.trimStart().startsWith('•')) {
      list.push(`<li>${line.replace(/^\s*•\s*/, '')}</li>`);
    } else {
      flush();
      out.push(`<p>${line}</p>`);
    }
  }
  flush();
  return out.join('\n        ');
}

function renderSections(sections) {
  return sections
    .map((s) => {
      const h = s.title ? `<h2>${esc(s.title)}</h2>\n        ` : '';
      return `      <section>\n        ${h}${renderBody(s.body)}\n      </section>`;
    })
    .join('\n');
}

function page({ title, slug, otherSlug, otherLabel, sections }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow">
  <title>${title} · BeAnywhere</title>
  <meta name="description" content="${title} for BeAnywhere — the app that turns your selfies into AI travel photos.">
  <link rel="icon" type="image/png" href="icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="topbar">
    <div class="wrap">
      <a class="wordmark" href="./">BeAnywhere</a>
      <nav>
        <a href="privacy.html"${slug === 'privacy' ? ' aria-current="page"' : ''}>Privacy</a>
        <a href="terms.html"${slug === 'terms' ? ' aria-current="page"' : ''}>Terms</a>
      </nav>
    </div>
  </header>

  <main class="wrap doc">
    <p class="eyebrow">BeAnywhere</p>
    <h1>${title}</h1>
    <p class="meta">Effective ${esc(LEGAL_INFO.effectiveDate)} · Questions? <a href="mailto:${EMAIL}">${EMAIL}</a></p>

${renderSections(sections)}
  </main>

  <footer class="site-footer">
    <div class="wrap">
      © ${new Date().getFullYear()} ${esc(LEGAL_INFO.name)} · <a href="${otherSlug}.html">${otherLabel}</a> · <a href="mailto:${EMAIL}">Contact</a>
    </div>
  </footer>
</body>
</html>
`;
}

writeFileSync(
  'privacy.html',
  page({ title: 'Privacy Policy', slug: 'privacy', otherSlug: 'terms', otherLabel: 'Terms of Service', sections: PRIVACY })
);
writeFileSync(
  'terms.html',
  page({ title: 'Terms of Service', slug: 'terms', otherSlug: 'privacy', otherLabel: 'Privacy Policy', sections: TERMS })
);

console.log('Wrote privacy.html + terms.html from legal-data.mjs');
console.log(`  entity: ${LEGAL_INFO.name} · email: ${EMAIL} · effective: ${LEGAL_INFO.effectiveDate}`);
