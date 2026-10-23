import { test, expect, type Page } from '@playwright/test';

async function fixture(page: Page, loseApplyReply = false, scenario = 'normal') {
  // Real UI + real persistence/checkout service; only the Firebase boundary is replaced.
  await page.route('https://**', route => route.abort());
  await page.route('**/src/services/index.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
    import { LiveStudioService } from '/src/services/live.ts';
    import { LocalStudioService } from '/src/services/local.ts';
    export const liveMode = true;
    const namespace = 'checkout-code-browser-test';
    const uid = 'w_' + 'a'.repeat(40);
    const claim = () => JSON.parse(sessionStorage.getItem('qa-code-claim') || 'null');
    const job = { id:'promo-job', uid, orderId:'promo-order', packId:'paris', styling:'w', styleId:'chic',
      clientVisible:true, status:'developing', generationState:'queued', reshootsLeft:3,
      slots:[], readableOutputPaths:[], createdAt:{seconds:1792400000} };
    window.paidCalls = 0; window.startCalls = 0; window.uploadCalls = 0; window.cancelCalls = 0;
    const api = {
      session:{uid,webAppId:'qa',capabilityVersion:1},
      listJobs:async()=>claim()?.state==='fulfilled'?[job]:[], watchJobs:async()=>()=>{},
      listWebGalleries:async()=>({email:'',jobs:[],nextCursor:null}), recordEvent:async()=>{},
      getWebCheckoutCode:async()=>claim(),
      claimWebCheckoutCode:async(key,code)=>{
        if(code !== 'BA-2345-6789-ABCD') throw Error('This checkout code is unavailable.');
        const value = claim() || {state:'claimed',orderId:null,jobId:null};
        sessionStorage.setItem('qa-code-claim',JSON.stringify(value));
        if(${loseApplyReply} && !sessionStorage.getItem('qa-lost-reply')) {
          sessionStorage.setItem('qa-lost-reply','yes'); throw Error('Connection interrupted. Try again.');
        }
        return value;
      },
      checkPackReadiness:async()=>({ok:true,productId:'photo.pack.standard'}), recordConsent:async()=>{},
      uploadReferences:async()=>{window.uploadCalls++;return {sessionId:'promo-upload'};},
      createOrder:async()=>{
        const count=Number(sessionStorage.getItem('qa-orders')||0)+1;
        sessionStorage.setItem('qa-orders',String(count));
        return {orderId:count===1?'promo-order':'promo-order-'+count};
      },
      cancelWebCheckout:async(orderId)=>{
        window.cancelCalls++;
        sessionStorage.setItem('qa-cancelled-order',orderId);
        return {orderId,state:'expired',amountMinor:399,currency:'usd'};
      },
      startWebComplimentaryCheckout:async(key,orderId,email)=>{
        window.startCalls++;
        if(!claim())throw Error('Code required');
        if(sessionStorage.getItem('qa-paid-order')===orderId)throw Error('Stripe order cannot use a code');
        if('${scenario}'==='lost-free' && !sessionStorage.getItem('qa-free-failed')) {
          sessionStorage.setItem('qa-free-failed','yes'); throw Error('Connection interrupted before starting. Try again.');
        }
        window.deliveryEmail=email; window.freeOrderId=orderId;
        sessionStorage.setItem('qa-code-claim',JSON.stringify({state:'fulfilled',orderId:'promo-order',jobId:'promo-job'}));
        return {kind:'complimentary',orderId:'promo-order',jobId:'promo-job'};
      },
      beginWebCheckout:async(orderId)=>{window.paidCalls++;sessionStorage.setItem('qa-paid-order',orderId);throw Error('Paid checkout reached');},
    };
    const local = new LocalStudioService(namespace+'-drafts');
    const seed = (async()=>{
      if((await local.read()).draft)return;
      await local.startDraft('paris','w','chic');
      const image = new Image(); image.src='/assets/scenes/paris/w/chic/0.webp'; await image.decode();
      const canvas=document.createElement('canvas');canvas.width=200;canvas.height=300;
      canvas.getContext('2d').drawImage(image,0,0,200,300);
      await local.updateDraft((await local.read()).draft,{references:Array.from({length:4},(_,i)=>({
        id:'photo-'+i,name:'Selfie '+i,url:canvas.toDataURL('image/jpeg'),width:200,height:300,sample:false,
      })),email:'friend@example.com'});
      await local.updateDraft((await local.read()).draft,{consent:true});
    })();
    export const service = new LiveStudioService(async()=>api,namespace);
    const read=service.read.bind(service); service.read=async()=>{await seed;return read();};
  ` }));
  await page.goto('/#/checkout');
  await expect(page.getByRole('heading', { name:'Review your photoshoot', exact:true })).toBeVisible();
  await expect(page.getByRole('button', { name:'Continue to pay $3.99' })).toBeEnabled();
}

for (const width of [390, 1440]) test(`code checkout claims on Apply, survives refresh and opens the existing gallery (${width}px)`, async ({ page }) => {
  await page.setViewportSize({ width, height:900 });
  await fixture(page);
  await expect(page.getByLabel('Checkout code', { exact:true })).toHaveCount(0);
  await page.getByRole('button', { name:'Have a code?' }).click();
  await page.getByLabel('Checkout code', { exact:true }).fill('BA-2345-6789-ABCD');
  await page.getByRole('button', { name:'Apply', exact:true }).click();
  await expect(page.getByRole('button', { name:'Start free photoshoot' })).toBeEnabled();
  await expect(page.locator('.receipt-total')).toContainText('$0.00');
  expect(await page.evaluate(() => Reflect.get(window,'uploadCalls'))).toBe(0);
  expect(await page.evaluate(() => Reflect.get(window,'startCalls'))).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (process.env.CHECKOUT_CODE_SCREENSHOTS) await page.screenshot({path:`${process.env.CHECKOUT_CODE_SCREENSHOTS}/checkout-code-${width}.png`,fullPage:true});
  await page.reload();
  await expect(page.getByRole('button', { name:'Start free photoshoot' })).toBeEnabled();
  await page.getByRole('button', { name:'Start free photoshoot' }).click();
  await expect(page).toHaveURL(/#\/gallery\/promo-job$/);
  await expect(page.getByRole('heading', {name:'Paris, with you.'})).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window,'paidCalls'))).toBe(0);
  expect(await page.evaluate(() => Reflect.get(window,'uploadCalls'))).toBe(1);
});

test('an invalid code leaves the paid checkout available and does not grant a free shoot', async ({page}) => {
  await fixture(page);
  await page.getByRole('button', {name:'Have a code?'}).click();
  await page.getByLabel('Checkout code',{exact:true}).fill('wrong');
  await page.getByRole('button',{name:'Apply',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('code is unavailable');
  await expect(page.locator('.receipt-total')).toContainText('$3.99');
  await page.getByRole('button',{name:'Continue to pay $3.99'}).click();
  await expect(page.locator('.form-error')).toContainText(['code is unavailable','Paid checkout reached']);
  expect(await page.evaluate(() => Reflect.get(window,'paidCalls'))).toBe(1);
  expect(await page.evaluate(() => Reflect.get(window,'startCalls'))).toBe(0);
});

test('refresh recovers a code whose successful Apply reply was lost', async ({page}) => {
  await fixture(page,true);
  await page.getByRole('button',{name:'Have a code?'}).click();
  await page.getByLabel('Checkout code',{exact:true}).fill('BA-2345-6789-ABCD');
  await page.getByRole('button',{name:'Apply',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('Connection interrupted');
  await page.reload();
  await expect(page.getByRole('button',{name:'Start free photoshoot'})).toBeEnabled();
  expect(await page.evaluate(() => Reflect.get(window,'paidCalls'))).toBe(0);
});

test('a code entered after a lost paid reply closes that checkout and starts a fresh free order', async ({page}) => {
  await fixture(page, false, 'lost-paid');
  await page.getByRole('button',{name:'Continue to pay $3.99'}).click();
  await expect(page.getByRole('alert')).toContainText('Paid checkout reached');
  await page.getByRole('button',{name:'Have a code?'}).click();
  await page.getByLabel('Checkout code',{exact:true}).fill('BA-2345-6789-ABCD');
  await page.getByRole('button',{name:'Apply',exact:true}).click();
  await page.getByRole('button',{name:'Start free photoshoot'}).click();
  await expect(page).toHaveURL(/#\/gallery\/promo-job$/);
  expect(await page.evaluate(() => Reflect.get(window,'cancelCalls'))).toBe(1);
  expect(await page.evaluate(() => Reflect.get(window,'freeOrderId'))).toBe('promo-order-2');
  expect(await page.evaluate(() => Reflect.get(window,'paidCalls'))).toBe(1);
});

test('correcting the email after a failed free start uses the corrected delivery address', async ({page}) => {
  await fixture(page, false, 'lost-free');
  await page.getByRole('button',{name:'Have a code?'}).click();
  await page.getByLabel('Checkout code',{exact:true}).fill('BA-2345-6789-ABCD');
  await page.getByRole('button',{name:'Apply',exact:true}).click();
  await page.getByRole('button',{name:'Start free photoshoot'}).click();
  await expect(page.getByRole('alert')).toContainText('Connection interrupted before starting');
  await page.locator('input[type="email"]').fill('correct@example.com');
  await page.getByRole('button',{name:'Start free photoshoot'}).click();
  await expect(page).toHaveURL(/#\/gallery\/promo-job$/);
  expect(await page.evaluate(() => Reflect.get(window,'deliveryEmail'))).toBe('correct@example.com');
  expect(await page.evaluate(() => Reflect.get(window,'paidCalls'))).toBe(0);
});
