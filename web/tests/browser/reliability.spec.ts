import { test, expect } from "@playwright/test";

async function selected(page: import("@playwright/test").Page) {
  await page.goto("/#/shoot/paris");
  await page.getByRole("button", { name: "Add your selfies" }).click();
  await page.getByRole("button", { name: /Use demo photos/ }).click();
  await expect(page.getByText("4 / 6 photos selected")).toBeVisible();
}

for (const source of ['notification', 'gallery refresh']) for (const outcome of ['stale success', 'stale failure']) test(`an older screen refresh cannot replace a newer result: ${source}, ${outcome}`, async ({ page }) => {
  await page.route('**/src/services/index.ts', route => route.fulfill({ contentType: 'application/javascript', body: `
    export const liveMode = true;
    const state = {version:1,draft:null,email:'',preferredStyling:'w',shoots:[]};
    const listeners = new Set();
    let delayed = false;
    window.pendingScreenReads = [];
    window.delayScreenReads = () => { delayed = true; };
    window.refreshScreen = () => { for (const listener of listeners) listener(); };
    window.refreshGallery = () => window.dispatchEvent(new Event('focus'));
    export const service = {
      mode:'live', track:()=>{},
      read: () => delayed ? new Promise((resolve,reject) => window.pendingScreenReads.push({resolve,reject})) : Promise.resolve(state),
      subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
      refreshGalleries: async () => true,
    };
    window.finishScreenRead = (index, result) => {
      const pending = window.pendingScreenReads[index];
      if (result === 'error') pending.reject(new Error('Old connection failure'));
      else pending.resolve({...state,recoveryEmail:result});
    };
  ` }));
  await page.goto('/#/library');
  await expect(page.getByRole('button',{name:'Find my photos',exact:true})).toBeVisible();
  await page.evaluate(source => {
    Reflect.get(window,'delayScreenReads')();
    Reflect.get(window,'refreshScreen')();
    Reflect.get(window,source === 'notification' ? 'refreshScreen' : 'refreshGallery')();
  },source);
  await expect.poll(() => page.evaluate(() => Reflect.get(window,'pendingScreenReads').length)).toBe(2);
  await page.evaluate(() => Reflect.get(window,'finishScreenRead')(1,'current@example.com'));
  // The settings dialog reads the latest state rather than preserving form edits.
  await page.getByRole('button',{name:'Photo settings',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('current@example.com');
  await page.evaluate(result => Reflect.get(window,'finishScreenRead')(0,result), outcome === 'stale failure' ? 'error' : 'old@example.com');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.getByRole('dialog')).toContainText('current@example.com');
  await expect(page.getByRole('heading',{name:'Your photos need to reconnect.'})).toHaveCount(0);
  // A genuinely newer error still appears, and a later successful read recovers.
  await page.evaluate(() => Reflect.get(window,'refreshScreen')());
  await expect.poll(() => page.evaluate(() => Reflect.get(window,'pendingScreenReads').length)).toBe(3);
  await page.evaluate(() => Reflect.get(window,'finishScreenRead')(2,'error'));
  await expect(page.getByRole('heading',{name:'Your photos need to reconnect.'})).toBeVisible();
  await page.evaluate(() => Reflect.get(window,'refreshScreen')());
  await expect.poll(() => page.evaluate(() => Reflect.get(window,'pendingScreenReads').length)).toBe(4);
  await page.evaluate(() => Reflect.get(window,'finishScreenRead')(3,'reconnected@example.com'));
  await expect(page.getByRole('dialog')).toContainText('reconnected@example.com');
});

test("failed permission and glasses saves roll back their visible state", async ({
  page,
}) => {
  await selected(page);
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = () => {
      throw new DOMException("Storage full", "QuotaExceededError");
    };
  });
  const glasses = page.getByRole("checkbox", { name: /I’m wearing prescription glasses/ });
  const consent = page.getByRole("checkbox", { name: /18 or older/ });
  await glasses.click();
  await expect(page.getByRole("status")).toContainText("Storage full");
  await expect(glasses).not.toBeChecked();
  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(
    page.getByRole("button", { name: "Review my shoot" }),
  ).toBeDisabled();
  await page.reload();
  await expect(consent).not.toBeChecked();
  await expect(glasses).not.toBeChecked();
});

test("a blocked cross-tab channel does not prevent startup or focus recovery", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, "BroadcastChannel", {
      value: class {
        constructor() {
          throw new DOMException("Channel unavailable", "SecurityError");
        }
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await selected(page);
  const other = await context.newPage();
  await other.goto("/#/upload");
  await other
    .getByRole("button", { name: "Remove reference 1", exact: true })
    .click();
  await expect(other.getByText("3 / 6 photos selected")).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByText("3 / 6 photos selected")).toBeVisible();
  expect(errors).toEqual([]);
});

test("a cross-tab notification failure does not turn a saved change into an error", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    BroadcastChannel.prototype.postMessage = () => {
      throw new DOMException("Channel closed", "InvalidStateError");
    };
  });
  await selected(page);
  await expect(page.getByRole("status")).not.toContainText("Channel closed");
  await page.reload();
  await expect(page.getByText("4 / 6 photos selected")).toBeVisible();
});

test("blocked database access shows storage guidance instead of a blank screen", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new DOMException("Storage denied", "SecurityError");
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your studio needs browser storage." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("reviewing from a stale tab does not restore revoked permission", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, "BroadcastChannel", { value: undefined });
  });
  await selected(page);
  await page.getByRole("checkbox", { name: /18 or older/ }).check();
  await expect(
    page.getByRole("button", { name: "Review my shoot" }),
  ).toBeEnabled();
  // Reproduce a click before cross-tab focus/visibility notifications arrive.
  await page.evaluate(() => {
    window.addEventListener("focus", (e) => e.stopImmediatePropagation(), true);
    document.addEventListener(
      "visibilitychange",
      (e) => e.stopImmediatePropagation(),
      true,
    );
  });
  const other = await context.newPage();
  await other.goto("/#/upload");
  await other.getByRole("checkbox", { name: /18 or older/ }).uncheck();
  await expect(
    other.getByRole("checkbox", { name: /18 or older/ }),
  ).toBeEnabled();
  await page.evaluate(() =>
    (
      document.querySelector(".flow-actions button") as HTMLButtonElement
    ).click(),
  );
  await expect(page.getByRole("status")).toContainText("Your draft changed");
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: /18 or older/ }),
  ).not.toBeChecked();
  await expect(page).toHaveURL(/#\/upload$/);
});
