import { test, expect, type Page } from '@playwright/test';

async function fixture(page: Page, checkout = false) {
  await page.route('**/src/services/index.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
    import { LiveStudioService } from '/src/services/live.ts';
    import { LocalStudioService } from '/src/services/local.ts';
    export const liveMode = true;
    const namespace = 'speed-' + crypto.randomUUID();
    const uid = 'w_' + 'a'.repeat(40);
    const job = { id: 'owned', uid, packId: 'paris', styling: 'w', styleId: 'chic',
      clientVisible: true, status: 'done', generationState: 'finished', reshootsLeft: 3,
      slots: [], readableOutputPaths: [], createdAt: {seconds: 1792400000} };
    const connection = new Promise(resolve => { window.connectStudio = resolve; });
    const recovery = new Promise(resolve => { window.recoverStudio = () => resolve({email:'',jobs:[],nextCursor:null}); });
    const api = {
      session: {uid,webAppId:'qa',capabilityVersion:1},
      listJobs: async () => ${checkout ? '[]' : '[job]'},
      listWebGalleries: () => recovery,
      watchJobs: async () => () => {}, recordEvent: async () => {},
      checkPackReadiness: async () => ({ok:true,productId:'pack.paris'}), recordConsent: async () => {},
      uploadReferences: async (_files,_id,_glasses,progress) => {
        window.uploads = (window.uploads || 0) + 1;
        progress(.5);
        await new Promise(resolve => { window.finishUpload = () => { progress(1); resolve(); }; });
        return {sessionId:'upload_1',uploadStatus:'completed'};
      },
      createOrder: async () => {
        await new Promise(resolve => { window.finishChecking = resolve; });
        return {orderId:'order_1'};
      },
      beginWebCheckout: async () => {
        await new Promise(resolve => { window.finishCheckout = resolve; });
        throw new Error('Connection interrupted. Try again.');
      },
    };
    const local = new LocalStudioService(namespace + '-drafts');
    const seed = (async () => {
      if (!${checkout}) return;
      await local.startDraft('paris','w','chic');
      await local.updateDraft((await local.read()).draft, { references: Array.from({length:4},(_,i)=>({
        id:'photo-'+i,name:'Selfie '+i,url:'data:image/jpeg;base64,'+btoa('x'.repeat(2048)),
        width:800,height:1200,sample:false
      })),email:'buyer@example.com'});
      await local.updateDraft((await local.read()).draft,{consent:true});
    })();
    export const service = new LiveStudioService(async () => { await connection; return api; },namespace);
    const read = service.read.bind(service);
    service.read = async () => { await seed; return read(); };
  ` }));
}

for (const width of [390, 1440]) {
  test(`navigation appears before connection; owned galleries do not wait for recovery (${width}px)`, async ({ page }, testInfo) => {
    await page.setViewportSize({width,height:900});
    await fixture(page);
    await page.goto('/#/library');
    await expect(page.getByRole('navigation', {name:'Main navigation'})).toBeVisible();
    await expect(page.getByRole('heading', {name:'My photos'})).toBeVisible();
    await expect(page.locator('.gallery-placeholder')).toBeVisible();
    if (process.env.STUDIO_SPEED_SCREENSHOTS) await page.screenshot({path: `${process.env.STUDIO_SPEED_SCREENSHOTS}/loading-${testInfo.project.name}-${width}.png`});
    await page.evaluate(() => Reflect.get(window,'connectStudio')());
    await expect(page.locator('.library-card')).toHaveCount(1);
    await expect(page.getByRole('heading', {name:'Paris',exact:true})).toBeVisible();
    // Recovery is intentionally unresolved; an owned gallery is already usable.
    await expect(page.locator('.gallery-placeholder')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => Reflect.get(window,'recoverStudio')());
    await expect(page.locator('.library-card')).toHaveCount(1);
  });
}

test('mobile checkout shows upload percentage, validation and redirect stages, then safely retries', async ({page}, testInfo) => {
  await page.clock.install();
  await page.setViewportSize({width:390,height:844});
  await fixture(page,true);
  await page.goto('/#/checkout');
  await page.evaluate(() => Reflect.get(window,'connectStudio')());
  await expect(page.getByRole('button',{name:'Continue to pay $3.99'})).toBeVisible();
  await page.getByRole('button',{name:'Continue to pay $3.99'}).click();
  await expect(page.getByRole('button',{name:'Uploading your selfies…'})).toBeDisabled();
  await expect(page.getByRole('progressbar',{name:'Selfie upload'})).toHaveAttribute('value','0.5');
  await expect(page.getByText('50%',{exact:true})).toBeVisible();
  await page.clock.fastForward(15001);
  await expect(page.getByText('This is taking a little longer.',{exact:false})).toBeVisible();
  if (process.env.STUDIO_SPEED_SCREENSHOTS) await page.screenshot({path: `${process.env.STUDIO_SPEED_SCREENSHOTS}/checkout-${testInfo.project.name}.png`});
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => Reflect.get(window,'finishUpload')());
  await expect(page.getByRole('button',{name:'Checking your photoshoot…'})).toBeDisabled();
  await expect.poll(() => page.evaluate(() => typeof Reflect.get(window,'finishChecking'))).toBe('function');
  await page.evaluate(() => Reflect.get(window,'finishChecking')());
  await expect(page.getByRole('button',{name:'Opening secure checkout…'})).toBeDisabled();
  await expect.poll(() => page.evaluate(() => typeof Reflect.get(window,'finishCheckout'))).toBe('function');
  await page.evaluate(() => Reflect.get(window,'finishCheckout')());
  await expect(page.getByRole('alert')).toContainText('Connection interrupted');
  await page.getByRole('button',{name:'Continue to pay $3.99'}).click();
  await expect(page.getByRole('button',{name:'Opening secure checkout…'})).toBeDisabled();
  expect(await page.evaluate(() => Reflect.get(window,'uploads'))).toBe(1);
});
