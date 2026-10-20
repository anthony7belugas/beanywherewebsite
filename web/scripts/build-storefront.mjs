import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
const root = new URL('../../', import.meta.url);
// Version every script dependency by its contents. A new release must not mix
// new HTML with an older cached measurement or attribution module.
const revision = bytes => createHash('sha256').update(bytes).digest('hex').slice(0,16);
await copyFile(new URL('../storefront/acquisition.js',import.meta.url),new URL('acquisition.js',root));
// Navigation and measurement must use one acquisition module per page. Bundling
// a second copy would recapture the same arrival after the policy fetch finishes.
await build({entryPoints:[new URL('../storefront/analytics.js',import.meta.url).pathname],bundle:true,format:'esm',minify:true,external:['./acquisition.js'],outfile:new URL('analytics.js',root).pathname});
const acquisitionVersion = revision(await readFile(new URL('acquisition.js',root)));
const analytics = await readFile(new URL('analytics.js',root),'utf8');
await writeFile(new URL('analytics.js',root),analytics.replaceAll('"./acquisition.js"',`"./acquisition.js?v=${acquisitionVersion}"`));
async function versionedScript(name, dependencies) {
  let source = await readFile(new URL(`../storefront/${name}.js`,import.meta.url),'utf8');
  for (const dependency of dependencies) {
    const version = revision(await readFile(new URL(`${dependency}.js`,root)));
    source = source.replace(`'./${dependency}.js'`,`'./${dependency}.js?v=${version}'`);
  }
  await writeFile(new URL(`${name}.js`,root),source);
  return source;
}
const storefront = await versionedScript('storefront',['analytics','acquisition']);
const publicPages = await versionedScript('public-pages',['analytics','acquisition']);
const publicVersion = revision(publicPages);
for (const name of ['support','privacy','terms']) {
  const path = new URL(`${name}.html`,root);
  const html = (await readFile(path,'utf8'))
    .replace(/src="\/public-pages\.js(?:\?v=[a-f0-9]+)?"/,`src="/public-pages.js?v=${publicVersion}"`);
  await writeFile(path,html);
}
const storefrontVersion = revision(storefront);

const packs = JSON.parse(await readFile(new URL('../src/lib/catalog.json', import.meta.url), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cover = (pack, styling = 'w') => `/studio/assets/covers/${pack.packId}-${styling}.webp`;
const header = `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="site-width header-inner"><a class="wordmark" href="/" aria-label="BeAnywhere home">BeAnywhere</a><nav aria-label="Main"><a class="android-link" href="https://play.google.com/store/apps/details?id=com.besties.photo">Google Play ↗</a><a href="/studio/#/library">My photos</a></nav></div></header>`;
const footer = `<footer class="site-footer site-width"><div><a class="wordmark" href="/">BeAnywhere</a><p>© 2026 Besties, Inc. · Ages 18+</p></div><nav aria-label="Support and apps"><a href="https://play.google.com/store/apps/details?id=com.besties.photo">Get the Android app ↗</a><a href="/support">Support</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="https://www.instagram.com/beanywhere.app/">Instagram</a></nav></footer>`;
const toggle = `<div class="styling-toggle" role="group" aria-label="Wardrobe styling"><button type="button" data-styling="w" aria-pressed="true">Women’s styling</button><button type="button" data-styling="m" aria-pressed="false">Men’s styling</button></div>`;
function page({ title, description, path, image, body, packId = '' }) {
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index,follow"><meta name="theme-color" content="#15110e"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="https://beanywhere.app${path}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="https://beanywhere.app${path}"><meta property="og:image" content="https://beanywhere.app${image}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/icon.png" type="image/png"><link rel="apple-touch-icon" href="/icon.png"><link rel="preload" href="/assets/fonts/fraunces-semibold.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/storefront.css?v=6"></head><body ${packId ? `data-shoot="${packId}"` : ''}>${header}<main id="main" class="site-width">${body}</main>${footer}<script type="module" src="/storefront.js?v=${storefrontVersion}"></script></body></html>\n`;
}
const cards = packs.map((p,i) => `<a class="shoot-card" data-shoot-link="${p.packId}" href="/shoots/${p.packId}/"><div class="card-heading"><h3>${esc(p.title)}</h3><span>$3.99</span></div><img data-cover="${p.packId}" src="${cover(p)}" alt="${esc(p.title)} — women’s styling preview" width="720" height="960" loading="${i < 3 ? 'eager' : 'lazy'}"><p>${esc(p.tagline)}</p></a>`).join('\n');
await writeFile(new URL('index.html', root), page({title:'BeAnywhere — Your next photoshoot.',description:'You, somewhere extraordinary. Choose your setting and add your selfies. Create 12 photos online for $3.99, or get BeAnywhere on Google Play.',path:'/',image:'/assets/play-feature.jpg',body:`
<section class="intro"><h1>You, somewhere extraordinary.</h1><p>Choose your setting. Add your selfies. Get 12 photos worth keeping.</p><div class="offer"><strong>$3.99 per web shoot</strong><span>12 photos</span><span>3 reshoots</span><span>No subscription</span></div><div class="intro-actions"><a class="primary-button" href="#shoots">Create photos online <span aria-hidden="true">→</span></a><a class="app-button" href="https://play.google.com/store/apps/details?id=com.besties.photo"><span>Also available on</span><strong>Google Play ↗</strong></a></div><ol class="quick-steps" id="how-it-works" aria-label="How it works"><li>Choose</li><li>Upload selfies</li><li>Pay once</li><li>Get photos</li></ol></section>
<section id="shoots" class="catalog" aria-labelledby="shoots-title"><div class="catalog-heading"><h2 id="shoots-title">Choose your photoshoot</h2>${toggle}</div><div class="shoot-grid">${cards}</div><p class="caption">AI-generated previews show the setting and styling. Your results will vary.</p></section>

<section class="faq-section" aria-labelledby="faq-title"><h2 id="faq-title">A few things to know.</h2><div class="questions">
<details><summary>What photos should I upload?</summary><p>Use 4–6 clear photos of yourself, with different angles and good lighting. Use the same person in every photo, with no other people in the frame. BeAnywhere is for adults 18 and older.</p></details>
<details><summary>Do I need an account or an app?</summary><p>You can create photos right here on your phone or computer, with no password or app download. Prefer the Android app? Get BeAnywhere on Google Play and purchase there. Web galleries and app purchases are separate.</p></details>
<details><summary>How do I get back to my photos?</summary><p>Open My photos. Your browser remembers your galleries; on another device or after clearing browser data, enter your photo delivery email to find them. Your finished photos are also emailed as attachments.</p></details>
<details><summary>What does $3.99 include?</summary><p>One AI photoshoot: 12 photos total, with two photos in each of six scenes, plus three reshoots. It’s a one-time payment in USD, with no subscription. AI results can vary.</p></details>
<details><summary>Can I delete my photos?</summary><p>Open My photos → Photo settings to remove draft selfies or delete photos created in this browser. Contact support to delete galleries recovered from another browser. Copies you downloaded or received by email remain with you. See our <a href="/privacy">privacy policy</a> for details.</p></details></div></section>`}));
for (const p of packs) {
 const looks = ['w','m'].flatMap(s => p.styleDirections[s].map((look,i) => `<button type="button" class="look-option" data-look="${look.id}" data-for-styling="${s}" aria-pressed="${s==='w' && i===0}" ${s==='m'?'hidden':''}><strong>${esc(look.label)}</strong><span>${esc(look.blurb)}</span></button>`)).join('');
 const first = p.styleDirections.w[0].id;
 const scenes = p.scenes.map((scene,i) => `<figure><img data-scene="${i}" src="/studio/assets/scenes/${p.packId}/w/${first}/${i}.webp" alt="${esc(scene.label)} — illustrative preview" width="720" height="1080" loading="${i < 3 ? 'eager' : 'lazy'}"><figcaption>${esc(scene.label)}<span>2 photos</span></figcaption></figure>`).join('');
 const href = `/studio/?start=${p.packId}&amp;styling=w&amp;look=${first}#/upload`;
 const body = `<a class="back-link" href="/#shoots">← All photoshoots</a><section class="shoot-detail">
<div class="shoot-copy"><h1>${esc(p.title)}</h1><p class="description">${esc(p.tagline)}</p><p class="detail-price"><strong>$3.99 USD</strong> <span>One-time payment</span></p><p class="detail-includes"><strong>12 photos total</strong> · 2 per scene · 3 reshoots</p><div class="look-picker"><h2>Choose your look</h2>${toggle}<div class="look-options" role="group" aria-label="Choose a look">${looks}</div></div></div>
<section class="scene-section detail-scenes" aria-labelledby="scene-title"><div class="catalog-heading"><h2 id="scene-title">12 photos total.</h2><p>2 photos per scene · All 6 scenes included</p></div><div class="scene-grid">${scenes}</div><p class="caption">AI-generated style previews. Your photos will feature you; results will vary.</p></section>
<div class="shoot-checkout"><div class="shoot-action"><span><strong>$3.99</strong><small>USD · one time</small></span><a class="primary-button" data-start href="${href}">Add your selfies <span aria-hidden="true">→</span></a></div><p class="next-note">Next: add 4–6 selfies. You’ll review your shoot and delivery email before paying.</p></div>
</section>`;
 await mkdir(new URL(`shoots/${p.packId}/`,root),{recursive:true});
 await writeFile(new URL(`shoots/${p.packId}/index.html`,root),page({title:`${p.title} Photoshoot — BeAnywhere`,description:`${p.tagline} Create your ${p.title} photoshoot from 4–6 selfies. $3.99 USD for 12 photos and 3 reshoots.`,path:`/shoots/${p.packId}/`,image:cover(p),body,packId:p.packId}));
}
await copyFile(new URL('../storefront/storefront.css',import.meta.url),new URL('storefront.css',root));

await writeFile(new URL('sitemap.xml',root),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...packs.map(p=>`/shoots/${p.packId}/`),'/support','/privacy','/terms'].map(path=>`<url><loc>https://beanywhere.app${path}</loc></url>`).join('')}</urlset>\n`);
console.log('Built public homepage and six searchable shoot pages from the shared catalog.');
