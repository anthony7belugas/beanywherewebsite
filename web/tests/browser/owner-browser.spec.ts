import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
const root = new URL('../../../', import.meta.url);
const token = 'a'.repeat(64);
async function setup(page: Page) {
  const claims: Record<string, unknown>[] = [];
  const external: string[] = [];
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'us-central1-bethere-3d7de.cloudfunctions.net' && url.pathname === '/claimOwnerBrowser') {
      const body = route.request().postDataJSON(); claims.push(body.data);
      await route.fulfill({ json: { result: { registered: true, label: 'My phone', clientId: body.data.clientId } }, headers: { 'Access-Control-Allow-Origin': '*' } });
      return;
    }
    if (url.origin !== 'http://127.0.0.1:4178') { external.push(url.href); await route.abort(); return; }
    const file = url.pathname === '/owner-browser/' ? 'owner-browser/index.html' : url.pathname.slice(1);
    if (['owner-browser/index.html', 'owner-browser.js', 'analytics.js', 'acquisition.js', 'storefront.css'].includes(file)) {
      await route.fulfill({ body: readFileSync(new URL(file, root)), contentType: file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    } else await route.continue();
  });
  return { claims, external };
}
test('registration preserves an existing ID, strips the private link, and sends nothing until selected', async ({ page }) => {
  const { claims, external } = await setup(page);
  await page.addInitScript(() => localStorage.setItem('beanywhere-measurement-v1', JSON.stringify({clientId:'123.1792480000',firstSeenAtMs:Date.now()-1000})));
  await page.goto('/owner-browser/#' + token);
  await expect(page.locator('#browser-id')).toHaveText('123.1792480000');
  await expect(page).toHaveURL(/\/owner-browser\/$/);
  expect(claims).toEqual([]);
  await page.getByRole('button', { name: 'Exclude this browser', exact: true }).click();
  await expect(page.locator('#pair-status')).toContainText('My phone is registered');
  expect(claims).toEqual([{token,clientId:'123.1792480000'}]);
  expect(external.filter(url => /google-analytics|googletagmanager|authWithWebSession/.test(url))).toEqual([]);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('beanywhere-measurement-v1')!).clientId)).toBe('123.1792480000');
});
test('a new owner browser gets a durable ID only after explicit registration', async ({ page }) => {
  const { claims } = await setup(page);
  await page.goto('/owner-browser/#' + token);
  await expect(page.locator('#browser-id')).toContainText('An ID will be saved');
  expect(await page.evaluate(() => localStorage.getItem('beanywhere-measurement-v1'))).toBeNull();
  await page.getByRole('button', { name: 'Exclude this browser', exact: true }).click();
  await expect(page.locator('#pair-status')).toContainText('is registered');
  expect(claims[0].clientId).toMatch(/^\d{1,16}\.\d{10}$/);
  await page.reload();
  await expect(page.locator('#browser-id')).toHaveText(String(claims[0].clientId));
  await expect(page.getByRole('button', { name: 'Exclude this browser', exact: true })).toBeDisabled();
});
test('blocked storage cannot register an ephemeral owner browser', async ({ page }) => {
  const { claims } = await setup(page);
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked','SecurityError'); }; });
  await page.goto('/owner-browser/#' + token);
  await page.getByRole('button', { name: 'Exclude this browser', exact: true }).click();
  await expect(page.locator('#pair-status')).toContainText('Browser storage is unavailable');
  expect(claims).toEqual([]);
});
