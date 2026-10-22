// Last identifiable visit, shared by the public storefront and Studio. Never payment authority.
const KEY = 'beanywhere-acquisition-v1';
const WINDOW = 30 * 86400000;
const fields = { source: 'utm_source', medium: 'utm_medium', campaign: 'utm_campaign', content: 'utm_content', code: 'source_code' };
const label = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_. -]{0,63}$/i.test(value.trim()) ? value.trim().toLowerCase().replace(/ +/g, '_') : '';
export const directAttribution = () => ({ source: 'direct', medium: 'none', campaign: '', content: '', code: '' });
function storedAttribution(storage, now) {
  try {
    const saved = JSON.parse(storage?.getItem(KEY) || 'null');
    if (saved && saved.capturedAt > 0 && saved.capturedAt <= now && now - saved.capturedAt < WINDOW && label(saved.source)) {
      return { ...Object.fromEntries(Object.keys(fields).map(key => [key, label(saved[key])])), capturedAt: saved.capturedAt };
    }
  } catch { /* Tracking must never stop a shoot. */ }
  return null;
}
export function captureAttribution({ url, referrer = '', storage, now = Date.now() }) {
  const current = new URL(url);
  const params = current.searchParams;
  let next = Object.fromEntries(Object.entries(fields).map(([key, param]) => [key, label(params.get(param))]));
  next.code ||= label(params.get('ref'));
  const transferredAt = Number(params.get('ba_at'));
  const transferred = params.has('ba_at');
  const validTransfer = transferredAt > 0 && transferredAt <= now && now - transferredAt < WINDOW;
  let explicit = !!(next.source || next.code) && (!transferred || validTransfer);
  if (explicit) {
    next.source ||= 'referral'; next.medium ||= 'unspecified';
  } else if (!transferred) {
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
    const capturedAt = transferred ? transferredAt : now;
    const existing = transferred && storedAttribution(storage, now);
    if (existing && existing.capturedAt > capturedAt) return existing;
    const saved = { ...next, capturedAt };
    try { storage?.setItem(KEY, JSON.stringify(saved)); } catch { /* Tagged navigation also works without storage. */ }
    return saved;
  }
  return storedAttribution(storage, now) || directAttribution();
}
let visit;
export function currentAttribution() {
  if (typeof window === 'undefined') return directAttribution();
  let storage; try { storage = window.localStorage; } catch { /* Optional storage. */ }
  if (!visit) {
    visit = captureAttribution({ url: window.location.href, referrer: document.referrer, storage });
  } else {
    // Re-read a newer visit from another tab, and expire old credit without
    // treating the open document's original campaign URL as a fresh arrival.
    const saved = captureAttribution({ url: window.location.origin, storage });
    if (saved.source !== 'direct' && (!visit.capturedAt || saved.capturedAt >= visit.capturedAt)) visit = saved;
    else if (!visit.capturedAt || visit.capturedAt > Date.now() || Date.now() - visit.capturedAt >= WINDOW)
      visit = directAttribution();
  }
  return visit;
}
export function attributedLink(href, attribution = currentAttribution()) {
  const url = new URL(href, 'https://beanywhere.app');
  if (url.origin !== 'https://beanywhere.app') return href;
  // Links may already carry an older visit. Replace the whole tuple, including
  // empty labels and the legacy referral alias, so two campaigns cannot mix.
  for (const param of [...Object.values(fields), 'ref', 'ba_at']) url.searchParams.delete(param);
  if (attribution.source !== 'direct') {
    for (const [key, param] of Object.entries(fields)) if (label(attribution[key])) url.searchParams.set(param, label(attribution[key]));
    if (attribution.capturedAt) url.searchParams.set('ba_at', String(attribution.capturedAt));
  }
  return url.pathname + url.search + url.hash;
}
