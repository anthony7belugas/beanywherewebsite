import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

async function publicPages(page: Page, policyGate: Promise<void> = Promise.resolve()) {
  const files: Record<string, string> = {
    '/': 'index.html', '/shoots/paris/': 'shoots/paris/index.html',
    '/storefront.js': 'storefront.js', '/acquisition.js': 'acquisition.js',
    '/storefront.css': 'storefront.css', '/analytics.js':'analytics.js', '/usage-settings.js':'usage-settings.js',
    '/public-pages.js': 'public-pages.js', '/usage-settings.css': 'usage-settings.css', '/styles.css': 'styles.css',
    '/support': 'support.html', '/privacy': 'privacy.html', '/terms': 'terms.html',
  };
  await page.route('https://us-central1-bethere-3d7de.cloudfunctions.net/getWebAnalyticsPolicy', async route => {
    await policyGate;
    return route.fulfill({ json: { available: true, mode: 'automatic' }, headers: { 'Access-Control-Allow-Origin': '*' } });
  });
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.route('https://**.google-analytics.com/**', route => route.abort());
  await page.route('http://127.0.0.1:4178/**', route => {
    const pathname = new URL(route.request().url()).pathname;
    const file = files[pathname];
    if (!file) return route.continue();
    return route.fulfill({ body: readFileSync(new URL(file, new URL('../../../', import.meta.url))),
      contentType: pathname.endsWith('.js') ? 'application/javascript' : pathname.endsWith('.css') ? 'text/css' : 'text/html' });
  });
}

for (const blocked of [false, true]) test(`campaign styling survives back navigation and switching (storage blocked: ${blocked})`, async ({ page }) => {
  if (blocked) await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } }));
  await publicPages(page);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Women’s styling', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/?styling=m&utm_source=instagram&utm_campaign=men');
  await page.locator('[data-shoot-link="paris"]').click();
  await expect(page.getByRole('button', { name: 'Men’s styling', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: '← All photoshoots', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Men’s styling', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(new URL(page.url()).searchParams.get('utm_campaign')).toBe('men');
  await page.locator('[data-shoot-link="paris"]').click();
  await page.getByRole('button', { name: 'Women’s styling', exact: true }).click();
  await page.getByRole('link', { name: '← All photoshoots', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Women’s styling', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

for (const blocked of [false, true]) test(`campaign survives informational-page detours without renewing its timestamp (storage blocked: ${blocked})`, async ({ page }) => {
  if (blocked) await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } }));
  await publicPages(page);
  await page.goto('/?utm_source=instagram&utm_medium=social&utm_campaign=autumn&utm_content=post_3&source_code=ig03');
  await expect(page.getByRole('link', { name: 'My photos', exact: true })).toHaveAttribute('href', /utm_source=instagram/);
  const timestamp = new URL(await page.getByRole('link', { name: 'My photos', exact: true }).getAttribute('href') as string, 'https://beanywhere.app').searchParams.get('ba_at');
  expect(timestamp).toBeTruthy();
  for (const name of ['Support', 'Privacy', 'Terms']) {
    await page.getByRole('link', { name, exact: true }).first().click();
    const url = new URL(page.url());
    expect(url.searchParams.get('utm_campaign')).toBe('autumn');
    expect(url.searchParams.get('source_code')).toBe('ig03');
    expect(url.searchParams.get('ba_at')).toBe(timestamp);
    await page.locator('a.wordmark').first().click();
    await expect(page.getByRole('link', { name: 'My photos', exact: true })).toHaveAttribute('href', /utm_source=instagram/);
    expect(new URL(page.url()).searchParams.get('ba_at')).toBe(timestamp);
    const studio = new URL(await page.getByRole('link', { name: 'My photos', exact: true }).getAttribute('href') as string, 'https://beanywhere.app');
    expect(studio.searchParams.get('utm_source')).toBe('instagram');
    expect(studio.searchParams.get('utm_campaign')).toBe('autumn');
    expect(studio.searchParams.get('source_code')).toBe('ig03');
  }
});

test('an older tab refreshes navigation without mixing two campaigns', async ({ page, context }) => {
  await publicPages(page);
  await page.goto('/?utm_source=google&utm_medium=cpc&utm_campaign=old_campaign&utm_content=old_post&source_code=old_code');
  const newer = await context.newPage();
  await publicPages(newer);
  await newer.goto('/?utm_source=instagram&utm_medium=social');
  await expect(newer.getByRole('link', { name: 'My photos', exact: true })).toHaveAttribute('href', /utm_source=instagram/);
  await page.bringToFront();
  await expect(page.getByRole('link', { name: 'My photos', exact: true })).toHaveAttribute('href', /utm_source=instagram/);
  await page.getByRole('button', { name: 'Men’s styling', exact: true }).click();
  const url = new URL(await page.getByRole('link', { name: 'My photos', exact: true }).getAttribute('href') as string, 'https://beanywhere.app');
  expect(url.searchParams.get('utm_source')).toBe('instagram');
  for (const field of ['utm_campaign', 'utm_content', 'source_code']) expect(url.searchParams.has(field)).toBe(false);
  await newer.close();
});

test('loading measurement later does not recapture the same campaign arrival', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.clock.install({ time: new Date('2026-10-20T20:00:00Z') });
  await publicPages(page, gate);
  await page.goto('/?utm_source=instagram&utm_campaign=first_visit');
  const library = page.getByRole('link', { name: 'My photos', exact: true });
  await expect(library).toHaveAttribute('href', /utm_source=instagram/);
  const timestamp = new URL(await library.getAttribute('href') as string, 'https://beanywhere.app').searchParams.get('ba_at');
  await page.clock.runFor(1000);
  release();
  await expect.poll(() => page.evaluate(() => JSON.stringify((window as unknown as { dataLayer?: unknown[] }).dataLayer || []))).toContain('page_view');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('beanywhere-acquisition-v1') || '{}').capturedAt)).toBe(Number(timestamp));
  await page.getByRole('link', { name: 'Support', exact: true }).click();
  await expect(page.locator('a.wordmark').first()).toHaveAttribute('href', new RegExp(`ba_at=${timestamp}`));
});
