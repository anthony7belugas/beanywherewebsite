import { expect, it, vi } from 'vitest';
import { captureAttribution, attributedLink, directAttribution } from '../storefront/acquisition.js';
const now = 1792400000000;
function memory() { const data = new Map<string, string>(); return { getItem: (k: string) => data.get(k) || null, setItem: (k: string, v: string) => { data.set(k, v); } }; }
it('keeps tagged source and post labels through storefront navigation and a direct return', () => {
  const storage = memory();
  const first = captureAttribution({ url: 'https://beanywhere.app/?utm_source=Instagram&utm_medium=social&utm_campaign=launch&utm_content=reel_03&source_code=ig03', storage, now });
  expect(first).toMatchObject({ source: 'instagram', content: 'reel_03', code: 'ig03' });
  const link = attributedLink('/studio/?start=paris&styling=w&look=chic#/upload', first);
  const next = captureAttribution({ url: `https://beanywhere.app${link}`, now: now + 1000 });
  expect(next).toEqual(first);
  expect(link).toContain('start=paris'); expect(link).toContain('#/upload');
  expect(captureAttribution({ url: 'https://beanywhere.app/', storage, now: now + 86400000 })).toEqual(first);
  expect(captureAttribution({ url: 'https://beanywhere.app/', storage, now: now + 31 * 86400000 })).toEqual(directAttribution());
});
it('uses the newest identifiable visit and ignores internal referrers', () => {
  const storage = memory();
  captureAttribution({ url: 'https://beanywhere.app/?utm_source=instagram', storage, now });
  const second = captureAttribution({ url: 'https://beanywhere.app/', referrer: 'https://www.tiktok.com/@example', storage, now: now + 1000 });
  expect(second.source).toBe('tiktok');
  expect(captureAttribution({ url: 'https://beanywhere.app/studio/', referrer: 'https://beanywhere.app/shoots/paris/', storage, now: now + 2000 })).toEqual(second);
});
it('does not store raw URLs or personal fields and tolerates denied storage', () => {
  const storage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const first = captureAttribution({ url: 'https://beanywhere.app/?ref=ig03&utm_campaign=person%40example.com&email=private%40example.com', storage, now });
  expect(first).toMatchObject({ source: 'referral', code: 'ig03', campaign: '' });
  expect(attributedLink('https://outside.example/', first)).toBe('https://outside.example/');
  expect(captureAttribution({ url: 'https://beanywhere.app/', referrer: 'https://evilinstagram.com/?secret=yes', storage, now })).toMatchObject({source:'evilinstagram.com',medium:'referral'});
});
it('never renews an expired or malformed internal attribution timestamp', () => {
  const first = captureAttribution({ url: 'https://beanywhere.app/?utm_source=google&utm_medium=cpc', now });
  const link = attributedLink('/studio/', first);
  expect(captureAttribution({ url: `https://beanywhere.app${link}`, now: now + 31 * 86400000 })).toEqual(directAttribution());
  for (const timestamp of ['invalid', '0', String(now + 1000)]) {
    expect(captureAttribution({ url: `https://beanywhere.app/?utm_source=google&ba_at=${timestamp}`, now })).toEqual(directAttribution());
  }
  const storage = memory();
  const recent = captureAttribution({ url: 'https://beanywhere.app/?utm_source=instagram', storage, now: now + 30 * 86400000 });
  expect(captureAttribution({ url: `https://beanywhere.app${link}`, storage, now: now + 31 * 86400000 })).toEqual(recent);
});
it('does not let an older internal link overwrite a newer identifiable visit', () => {
  const storage = memory();
  const first = captureAttribution({ url: 'https://beanywhere.app/?utm_source=google', storage, now });
  const link = attributedLink('/studio/', first);
  const recent = captureAttribution({ url: 'https://beanywhere.app/?utm_source=instagram', storage, now: now + 10000 });
  expect(captureAttribution({ url: `https://beanywhere.app${link}`, storage, now: now + 20000 })).toEqual(recent);
  expect(captureAttribution({ url: 'https://beanywhere.app/', storage, now: now + 30000 })).toEqual(recent);
});
it('an open tab picks up newer campaign credit and expires credit without renewing its original URL', async () => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(now);
  const storage = memory();
  vi.stubGlobal('window', { location: new URL('https://beanywhere.app/?utm_source=google'), localStorage: storage });
  vi.stubGlobal('document', { referrer: '' });
  try {
    const module = await import('../storefront/acquisition.js');
    expect(module.currentAttribution().source).toBe('google');
    vi.setSystemTime(now + 10000);
    module.captureAttribution({ url: 'https://beanywhere.app/?utm_source=instagram', storage });
    expect(module.currentAttribution().source).toBe('instagram');
    vi.setSystemTime(now + 31 * 86400000);
    expect(module.currentAttribution()).toEqual(directAttribution());
  } finally { vi.unstubAllGlobals(); vi.useRealTimers(); }
});
