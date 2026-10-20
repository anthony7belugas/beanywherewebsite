import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { Pack } from "../../src/lib/types";

const packs: Pack[] = JSON.parse(readFileSync(new URL("../../src/lib/catalog.json", import.meta.url), "utf8"));
const pack = packs.find(value => value.packId === "paris")!;

async function recoveredGallery(page: Page, emailState = "sent", missing = false) {
  const uid = `w_${"a".repeat(40)}`, owner = `w_${"b".repeat(40)}`;
  const job = {
    id: "recovery-test", uid: owner, packId: "paris", styling: "m", styleId: "tailored",
    clientVisible: true, status: "done", generationState: "finished", reshootsLeft: 3,
    retryWindowEndsAtMs: Date.now() + 86400000, emailRequestState: emailState,
    deliveryEmail: "photos@example.com", manualRetriesPerSlot: 1,
    slots: Array.from({ length: 12 }, (_, i) => ({
      slotId: `s${i}`, sceneId: pack.scenes[Math.floor(i / 2)].sceneId, take: i % 2 + 1,
      status: missing && i === 11 ? "retryable" : "done", manualAttempts: 0,
      path: missing && i === 11 ? undefined : `outputs/${owner}/recovery-test/p${i}.jpg`,
    })),
    readableOutputPaths: Array.from({ length: 12 }, (_, i) => `outputs/${owner}/recovery-test/p${i}.jpg`),
  };
  // Exercise the real service and UI, replacing only Firebase's API boundary.
  await page.route("**/src/services/index.ts", route => route.fulfill({
    contentType: "application/javascript",
    body: `
      import { LiveStudioService } from '/src/services/live.ts';
      export const liveMode = true;
      const job = ${JSON.stringify(job)};
      let connection = 'ready';
      window.setGalleryConnection = value => { connection = value; };
      window.setDeliveryState = value => { job.emailRequestState = value; };
      window.setDeliveryFeedback = value => { job.emailDeliveryFeedback = value; };
      window.failShoot = count => {
        job.status = 'failed'; job.generationState = 'finished'; job.emailRequestState = '';
        job.slots.forEach((slot, i) => { if (i >= count) { slot.status = 'closed'; delete slot.path; } });
        job.readableOutputPaths = job.slots.filter(slot => slot.path).map(slot => slot.path);
      };
      window.setMissingState = (state, attempts = 0) => {
        job.generationState = state;
        job.slots[11].manualAttempts = attempts;
      };
      window.retryCalls = 0;
      window.finishPhotoRetry = () => {};

      const api = {
        session: { uid: ${JSON.stringify(uid)}, webAppId: 'isolated-qa', capabilityVersion: 1 },
        listJobs: async () => [], watchJobs: async () => () => {}, recordEvent: async () => {},
        listWebGalleries: async () => {
          if (connection === 'offline') throw Object.assign(Error('Connection lost'), { code: 'functions/unavailable' });
          if (connection === 'denied') throw Object.assign(Error('Access denied'), { code: 'functions/permission-denied' });
          return { email: 'qa@example.com', jobs: connection === 'removed' ? [] : [structuredClone(job)], nextCursor: null };
        },
        galleryPhoto: async (_, path) => {
          const i = Number(/p(\\d+)\\.jpg$/.exec(path)?.[1] || 0);
          return (await fetch('/assets/scenes/paris/m/tailored/' + Math.floor(i / 2) + '.webp')).blob();
        },
        assertGalleryPhotos: async () => {},
        retrySlot: async (jobId, slotId) => {
          window.retryCalls++;
          if (jobId !== job.id || slotId !== 's11') throw Error('Wrong photo');
          const slot = job.slots[11]; slot.status = 'developing'; slot.retrying = true; slot.hasActiveClaim = true;
          await new Promise(resolve => { window.finishPhotoRetry = resolve; });
          slot.status = 'done'; slot.retrying = false; slot.hasActiveClaim = false;
          slot.path = 'outputs/' + job.uid + '/' + job.id + '/p11.jpg';
          slot.manualAttempts = 1;
        },
      };
      export const service = new LiveStudioService(async () => api, 'gallery-recovery-' + crypto.randomUUID());
    `,
  }));
  await page.goto("/#/gallery/recovery-test");
  await expect(page.getByRole("heading", { name: "Paris, with you." })).toBeVisible();
}

test("a dropped connection keeps the recovered gallery and selection, and Retry reconnects in place", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await recoveredGallery(page);
  const selected = page.getByRole("checkbox", { name: "Select s0", exact: true });
  await selected.check();
  await page.evaluate(() => {
    Reflect.get(window, "setGalleryConnection")("offline");
    window.dispatchEvent(new Event("focus"));
  });
  const warning = page.getByRole("status").filter({ hasText: "Couldn’t refresh your photos" });
  await expect(warning).toBeVisible();
  await expect(selected).toBeChecked();
  await expect(page.locator(".section-heading button")).toHaveText(/selected/);
  await expect(page.getByRole("heading", { name: "Open this shoot" })).toHaveCount(0);
  await page.evaluate(() => Reflect.get(window, "setGalleryConnection")("ready"));
  await warning.getByRole("button", { name: "Retry connection", exact: true }).click();
  await expect(warning).toHaveCount(0);
  await expect(selected).toBeChecked();
  await expect(page.locator(".section-heading button")).toHaveText(/selected/);
});

test("a successful refresh removes revoked galleries instead of retaining the last result", async ({ page }) => {
  await recoveredGallery(page);
  await page.evaluate(() => {
    Reflect.get(window, "setGalleryConnection")("removed");
    window.dispatchEvent(new Event("focus"));
  });
  await expect(page.locator(".gallery")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Your photos, right here." })).toBeVisible();
});

test("unconfirmed delivery offers all available photos and support, then clears after delivery succeeds", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => true });
    Object.defineProperty(navigator, "share", { value: async (data: ShareData) => {
      Reflect.set(window, "sharedPhotoCount", data.files?.length);
    } });
  });
  await recoveredGallery(page, "failed");
  const notice = page.getByRole("status", { name: "Email delivery update" });
  await expect(notice).toContainText("We couldn’t deliver your email.");
  await expect(notice.getByRole("link", { name: "Get help" })).toHaveAttribute("href", /subject=Web%20shoot%20recovery-test/);
  await page.getByRole("checkbox", { name: "Select s0", exact: true }).check();
  await notice.getByRole("button", { name: "Save photos", exact: true }).click();
  await page.getByRole("dialog", { name: "Save your photos" }).getByRole("button", { name: "Save or share photos", exact: true }).click();
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "sharedPhotoCount"))).toBe(12);
  await page.evaluate(() => {
    Reflect.get(window, "setDeliveryState")("sent");
    window.dispatchEvent(new Event("focus"));
  });
  await expect(notice).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Paris, with you." })).toBeVisible();
});

test("an email-recovered missing photo retries for free, then joins the gallery", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await recoveredGallery(page, "sent", true);
  await expect(page.locator(".delivery-destination")).toContainText("photos@example.com");
  const tile = page.locator(".photo-tile").last();
  await expect(page.locator(".gallery-toolbar")).toContainText("11 of 12");
  await expect(tile.getByRole("button", { name: /Reshoot/ })).toHaveCount(0);
  await tile.getByRole("button", { name: /Retry .*for free/ }).click();
  await expect(page.getByRole("status").filter({ hasText: "Retrying your missing photo" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "retryCalls"))).toBe(1);
  await page.evaluate(() => Reflect.get(window, "finishPhotoRetry")());
  await expect(page.locator(".gallery-toolbar")).toContainText("12 of 12");
  await expect(tile.getByRole("button", { name: "Reshoot s11", exact: true })).toBeEnabled();
  await expect(page.locator(".lead")).toContainText("3 reshoots left");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("automatic attempts finish before manual retry is offered, and spent retries stop spinning", async ({ page }) => {
  await recoveredGallery(page, "sent", true);
  await page.evaluate(() => {
    Reflect.get(window, "setMissingState")("retry-waiting");
    window.dispatchEvent(new Event("focus"));
  });
  const tile = page.locator(".photo-tile").last();
  await expect(tile).toContainText("Trying again…");
  await expect(tile.getByRole("button", { name: /Retry .*for free/ })).toHaveCount(0);
  await page.evaluate(() => {
    Reflect.get(window, "setMissingState")("finished", 1);
    window.dispatchEvent(new Event("focus"));
  });
  await expect(tile).toContainText("Couldn’t finish this photo");
  await expect(tile.locator(".spin")).toHaveCount(0);
  await expect(tile.getByRole("button", { name: /Retry .*for free/ })).toHaveCount(0);
});

test("a later email bounce shows the delivery warning without removing photos or reshoots", async ({ page }) => {
  await recoveredGallery(page);
  await page.evaluate(() => {
    Reflect.get(window, "setDeliveryFeedback")("bounced");
    window.dispatchEvent(new Event("focus"));
  });
  await expect(page.getByRole("status", { name: "Email delivery update" })).toContainText("We couldn’t deliver your email.");
  await expect(page.locator(".gallery-toolbar")).toContainText("12 of 12");
  await expect(page.getByRole("button", { name: "Reshoot s0", exact: true })).toBeEnabled();
});

for (const count of [0, 5]) test(`a failed ${count}-photo shoot never promises a delivery email`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await recoveredGallery(page);
  await page.evaluate(count => {
    Reflect.get(window, "failShoot")(count);
    window.dispatchEvent(new Event("focus"));
  }, count);
  await expect(page.locator(".lead")).toContainText(`This shoot needs attention · ${count} of 12 ready`);
  await expect(page.locator(".gallery")).toContainText("Your shoot couldn’t be completed.");
  await expect(page.locator(".gallery")).toContainText(count ? "This shoot won’t be emailed." : "no delivery email to wait for");
  await expect(page.locator(".gallery")).not.toContainText("Your photos will be sent");
  await expect(page.locator(".progress-panel")).toHaveCount(0);
  await expect(page.locator(".reshoot-guide")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Retry .*for free/ })).toHaveCount(0);
  if (!count) await expect(page.locator(".section-heading button")).toBeDisabled();
});
