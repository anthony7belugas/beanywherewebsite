import { initAnalytics, trackWeb } from './analytics.js';
import { currentAttribution } from './acquisition.js';
import { bindUsageSettings } from './usage-settings.js';

// Informational pages share browsing preferences and identity, without Studio sign-in.
currentAttribution();
initAnalytics();
bindUsageSettings();
document.addEventListener('click', event => {
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!link) return;
  const url = new URL(link.href, location.href);
  const action = url.protocol === 'mailto:' ? 'support'
    : url.origin === location.origin ? url.pathname.startsWith('/studio') ? 'my_photos'
    : ({ '/': 'home', '/support': 'support', '/privacy': 'privacy', '/terms': 'terms' })[url.pathname] : null;
  if (action) trackWeb('cta_clicked', { action, surface: 'information' });
});
