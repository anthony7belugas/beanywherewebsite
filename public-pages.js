import { initAnalytics, trackWeb } from './analytics.js?v=590f078b49ed9f53';
import { currentAttribution, attributedLink } from './acquisition.js?v=75c8d0f7a609bd01';

// Informational pages share browsing preferences and identity, without Studio sign-in.
currentAttribution();
initAnalytics();
function refreshLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin || !/^\/(?:$|studio(?:\/|$)|shoots\/|(?:support|privacy|terms)(?:\.html)?\/?$)/.test(url.pathname)) return;
    link.href = attributedLink(url.pathname + url.search + url.hash);
  });
}
// Keep the original capture time through support/legal detours, even when
// browser storage is unavailable. No browser identity is placed in a URL.
refreshLinks();
window.addEventListener('pageshow', refreshLinks);
window.addEventListener('storage', event => { if (event.key === 'beanywhere-acquisition-v1') refreshLinks(); });
document.addEventListener('click', event => {
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!link) return;
  const url = new URL(link.href, location.href);
  const action = url.protocol === 'mailto:' ? 'support'
    : url.origin === location.origin ? url.pathname.startsWith('/studio') ? 'my_photos'
    : ({ '/': 'home', '/support': 'support', '/privacy': 'privacy', '/terms': 'terms' })[url.pathname] : null;
  if (action) trackWeb('cta_clicked', { action, surface: 'information' });
});
