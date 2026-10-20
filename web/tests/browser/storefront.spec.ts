import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

async function publicPages(page: Page) {
  const files: Record<string, string> = {
    '/': 'index.html', '/shoots/paris/': 'shoots/paris/index.html',
    '/storefront.js': 'web/storefront/storefront.js', '/acquisition.js': 'web/storefront/acquisition.js',
    '/storefront.css': 'web/storefront/storefront.css',
  };
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
