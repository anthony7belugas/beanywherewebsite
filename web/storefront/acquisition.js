// Last identifiable visit, shared by the public storefront and Studio. Never payment authority.
const KEY = 'beanywhere-acquisition-v1';
const WINDOW = 30 * 86400000;
const fields = { source: 'utm_source', medium: 'utm_medium', campaign: 'utm_campaign', content: 'utm_content', code: 'source_code' };
const label = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_.-]{0,63}$/i.test(value.trim()) ? value.trim().toLowerCase() : '';
export const directAttribution = () => ({ source: 'direct', medium: 'none', campaign: '', content: '', code: '' });
export function captureAttribution({ url, referrer = '', storage, now = Date.now() }) {
  const current = new URL(url);
  const params = current.searchParams;
  let next = Object.fromEntries(Object.entries(fields).map(([key, param]) => [key, label(params.get(param))]));
  next.code ||= label(params.get('ref'));
  let explicit = !!(next.source || next.code);
  if (explicit) {
    next.source ||= 'referral'; next.medium ||= 'unspecified';
  } else {
    try {
      const host = new URL(referrer).hostname.toLowerCase();
      if (host !== current.hostname && !host.endsWith('.' + current.hostname)) {
        const known = [['instagram.com', 'instagram'], ['tiktok.com', 'tiktok'], ['facebook.com', 'facebook'],
          ['reddit.com', 'reddit'], ['linkedin.com', 'linkedin'], ['youtube.com', 'youtube'],
          ['t.co', 'x'], ['twitter.com', 'x'], ['google.com', 'google'], ['bing.com', 'bing']];
        const match = known.find(([domain]) => host === domain || host.endsWith('.' + domain));
        if (!['checkout.stripe.com','billing.stripe.com','beanywhere.app','www.beanywhere.app'].includes(host)) {
          const source=match ? match[1] : label(host.replace(/^www\./,''));
          if(source) { next = { ...directAttribution(), source, medium:match ? (['google', 'bing'].includes(source) ? 'organic' : 'social') : 'referral' }; explicit = true; }
        }
      }
    } catch { /* A missing referrer is normal. */ }
  }
  if (explicit) {
    const transferredAt = Number(params.get('ba_at'));
    const capturedAt = transferredAt > 0 && transferredAt <= now && now - transferredAt < WINDOW ? transferredAt : now;
    const saved = { ...next, capturedAt };
    try { storage?.setItem(KEY, JSON.stringify(saved)); } catch { /* Tagged navigation also works without storage. */ }
    return saved;
  }
  try {
    const saved = JSON.parse(storage?.getItem(KEY) || 'null');
    if (saved && saved.capturedAt > 0 && saved.capturedAt <= now && now - saved.capturedAt < WINDOW && label(saved.source)) {
      return { ...Object.fromEntries(Object.keys(fields).map(key => [key, label(saved[key])])), capturedAt: saved.capturedAt };
    }
  } catch { /* Tracking must never stop a shoot. */ }
  return directAttribution();
}
let visit;
export function currentAttribution() {
  if (visit) return visit;
  if (typeof window === 'undefined') return directAttribution();
  let storage; try { storage = window.localStorage; } catch { /* Optional storage. */ }
  visit = captureAttribution({ url: window.location.href, referrer: document.referrer, storage });
  return visit;
}
export function attributedLink(href, attribution = currentAttribution()) {
  if (attribution.source === 'direct') return href;
  const url = new URL(href, 'https://beanywhere.app');
  if (url.origin !== 'https://beanywhere.app') return href;
  for (const [key, param] of Object.entries(fields)) if (label(attribution[key])) url.searchParams.set(param, label(attribution[key]));
  if (attribution.capturedAt) url.searchParams.set('ba_at', String(attribution.capturedAt));
  return url.pathname + url.search + url.hash;
}
