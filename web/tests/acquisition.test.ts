import { expect, it, vi } from 'vitest';
import { captureAttribution, attributedLink, directAttribution } from '../storefront/acquisition.js';

it('distinguishes webmail and non-search Google referrals from actual search', () => {
  const from = (referrer: string) => captureAttribution({url:'https://beanywhere.app/',referrer});
  expect(from('https://mail.google.com/mail/u/0/#inbox')).toMatchObject({source:'gmail',medium:'email'});
  expect(from('https://docs.google.com/document/d/example')).toMatchObject({source:'docs.google.com',medium:'referral'});
  expect(from('https://drive.google.com/file/d/example')).toMatchObject({source:'drive.google.com',medium:'referral'});
  expect(from('https://accounts.google.com/')).toMatchObject({source:'accounts.google.com',medium:'referral'});
  expect(from('https://www.google.com/search?q=photos')).toMatchObject({source:'google',medium:'organic'});
  expect(from('https://images.google.com/')).toMatchObject({source:'google',medium:'organic'});
  expect(from('https://google.com.evil.example/')).toMatchObject({source:'google.com.evil.example',medium:'referral'});
  expect(captureAttribution({url:'https://beanywhere.app/?utm_source=newsletter&utm_medium=email',referrer:'https://www.google.com/'})).toMatchObject({source:'newsletter',medium:'email'});
});
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
it('replaces the complete campaign tuple when refreshing an already tagged internal link', () => {
  const old = captureAttribution({ url: 'https://beanywhere.app/?utm_source=google&utm_medium=cpc&utm_campaign=old_campaign&utm_content=old_post&ref=old_code', now });
  const href = attributedLink('/studio/?start=paris&ref=old_code#/upload', old);
  const recent = captureAttribution({ url: 'https://beanywhere.app/?utm_source=instagram&utm_medium=social', now: now + 1000 });
  const refreshed = attributedLink(href, recent);
  expect(captureAttribution({ url: `https://beanywhere.app${refreshed}`, now: now + 2000 })).toEqual(recent);
  expect(refreshed).toContain('start=paris');
  expect(refreshed).toContain('#/upload');
  for (const field of ['utm_campaign', 'utm_content', 'source_code', 'ref'])
    expect(new URL(refreshed, 'https://beanywhere.app').searchParams.has(field)).toBe(false);
});
it('removes old transfer labels when campaign credit expires without changing external links', () => {
  const href = '/studio/?styling=m&utm_source=google&utm_campaign=old&ref=old_code&ba_at=123#/library';
  expect(attributedLink(href, directAttribution())).toBe('/studio/?styling=m#/library');
  const external = 'https://outside.example/?utm_source=partner&ref=invitation';
  expect(attributedLink(external, directAttribution())).toBe(external);
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
