import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { Pack } from "../../src/lib/types";

const packs: Pack[] = JSON.parse(readFileSync(new URL("../../src/lib/catalog.json", import.meta.url), "utf8"));
const pack = packs.find(value => value.packId === "paris")!;

async function recoveredGallery(page: Page, emailState = "sent", missing = false,
  options: { owner?: boolean; limited?: boolean; reshootLookupFailure?: boolean } = {}) {
  const uid = `w_${"a".repeat(40)}`, owner = options.owner ? uid : `w_${"b".repeat(40)}`;
  const job = {
    id: "recovery-test", uid: options.owner ? uid : owner, packId: "paris", styling: "m", styleId: "tailored",
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
      let connection = ${JSON.stringify(options.limited ? "limited" : "ready")};
      let notifyOwned = () => {};
      window.galleryReads = 0;
      window.setGalleryConnection = value => { connection = value; };
      window.setDeliveryState = value => { job.emailRequestState = value; };
      window.setDeliveryFeedback = value => { job.emailDeliveryFeedback = value; };
      window.failShoot = (count, automaticWorkPending = false) => {
        job.status = 'failed'; job.generationState = 'finished'; job.emailRequestState = '';
        job.automaticWorkPending = automaticWorkPending;
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
        listJobs: async () => ${!!options.owner} ? [structuredClone(job)] : [],
        watchJobs: async callback => { notifyOwned = () => callback([structuredClone(job)]); return () => {}; },
        recordEvent: async () => {},
        listWebGalleries: async () => {
          window.galleryReads++;
          if (connection === 'offline') throw Object.assign(Error('Connection lost'), { code: 'functions/unavailable' });
          if (connection === 'denied') throw Object.assign(Error('Access denied'), { code: 'functions/permission-denied' });
          if (connection === 'limited') throw Object.assign(Error('Too many attempts'), { code: 'functions/resource-exhausted' });
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
        reshoot: async operation => {
          if (!${!!options.reshootLookupFailure} || operation.jobId !== job.id || operation.slotId !== 's0') {
            throw Error('Unexpected reshoot in this fixture');
          }
          job.slots[0].path = 'outputs/' + job.uid + '/' + job.id + '/replacement.jpg';
          job.readableOutputPaths = job.slots.map(slot => slot.path).filter(Boolean);
          job.reshootsLeft = 2;
          connection = 'limited';
          notifyOwned();
          return { operationState: 'finished' };
        },
      };
      api.download = api.galleryPhoto;
      api.assertPhotos = api.assertGalleryPhotos;
      export const service = new LiveStudioService(async () => api, 'gallery-recovery-' + crypto.randomUUID());
    `,
  }));
  await page.goto("/#/gallery/recovery-test");
  await expect(page.getByRole("heading", { name: "Paris, with you." })).toBeVisible();
}

test("a rate-limited recovery lookup leaves owned photos open and can be retried without reloading", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-20T10:00:00Z") });
  await recoveredGallery(page, "sent", false, { owner: true, limited: true });
  const warning = page.getByRole("status").filter({ hasText: "Photo lookup is temporarily limited" });
  await expect(warning).toBeVisible();
  await expect(page.locator(".section-heading button")).toBeEnabled();
  await expect(page.getByRole("heading", { name: "Your photos need to reconnect." })).toHaveCount(0);
  await page.clock.runFor(31000);
  expect(await page.evaluate(() => Reflect.get(window, "galleryReads"))).toBe(1);
  await page.evaluate(() => Reflect.get(window, "setGalleryConnection")("ready"));
  await warning.getByRole("button", { name: "Retry connection", exact: true }).click();
  await expect(warning).toHaveCount(0);
  await expect(page.locator(".gallery-toolbar")).toContainText("12 of 12");
});

test("a successful connection retry is not repeated on every gallery navigation", async ({ page }) => {
  await page.clock.install();
  await recoveredGallery(page, "sent", false, { owner: true, limited: true });
  const warning = page.getByRole("status").filter({ hasText: "Photo lookup is temporarily limited" });
  await page.evaluate(() => Reflect.get(window, "setGalleryConnection")("ready"));
  await warning.getByRole("button", { name: "Retry connection", exact: true }).click();
  await expect(warning).toHaveCount(0);
  expect(await page.evaluate(() => Reflect.get(window, "galleryReads"))).toBe(2);
  await page.getByRole("link", { name: "My photos", exact: true }).first().click();
  await expect(page.locator(".library-card")).toHaveCount(1);
  await page.locator(".library-card").click();
  await expect(page.getByRole("heading", { name: "Paris, with you." })).toBeVisible();
  await page.clock.runFor(1000);
  expect(await page.evaluate(() => Reflect.get(window, "galleryReads"))).toBe(2);
  // A later explicit retry still works; only the already-handled action is skipped.
  await page.evaluate(() => {
    Reflect.get(window, "setGalleryConnection")("offline");
    window.dispatchEvent(new Event("focus"));
  });
  const disconnected = page.getByRole("status").filter({ hasText: "Couldn’t refresh your photos" });
  await expect(disconnected).toBeVisible();
  await page.evaluate(() => Reflect.get(window, "setGalleryConnection")("ready"));
  await disconnected.getByRole("button", { name: "Retry connection", exact: true }).click();
  await expect(disconnected).toHaveCount(0);
  expect(await page.evaluate(() => Reflect.get(window, "galleryReads"))).toBe(4);
});

test("a finished reshoot shows success even if the follow-up photo lookup is limited", async ({ page }) => {
  await recoveredGallery(page, "sent", false, { owner: true, reshootLookupFailure: true });
  await page.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await page.getByRole("dialog", { name: "Create a new take?" })
    .getByRole("button", { name: "Use 1 reshoot", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("Your reshoot request has been checked");
  await expect(page.locator(".lead")).toContainText("2 reshoots left");
  await expect(page.getByRole("status").filter({ hasText: "Photo lookup is temporarily limited" })).toBeVisible();
  await expect(page.locator(".toast")).not.toContainText("Too many attempts");
});

test("settled galleries skip rapid polls but still refresh email feedback periodically", async ({ page }) => {
  await page.clock.install();
  await recoveredGallery(page);
  await page.clock.runFor(31000);
  expect(await page.evaluate(() => Reflect.get(window, "galleryReads"))).toBe(1);
  await page.evaluate(() => Reflect.get(window, "setDeliveryFeedback")("bounced"));
  await page.clock.fastForward(300000);
  await expect(page.getByRole("status", { name: "Email delivery update" })).toContainText("We couldn’t deliver your email.");
  expect(await page.evaluate(() => Reflect.get(window, "galleryReads"))).toBe(2);
});

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

for (const count of [0, 5]) for (const pending of [false, true]) test(`a failed ${count}-photo shoot never promises a delivery email (worker pending: ${pending})`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await recoveredGallery(page);
  await page.evaluate(({ count, pending }) => {
    Reflect.get(window, "failShoot")(count, pending);
    window.dispatchEvent(new Event("focus"));
  }, { count, pending });
  await expect(page.locator(".lead")).toContainText(`This shoot needs attention · ${count} of 12 ready`);
  await expect(page.locator(".gallery")).toContainText("We couldn’t complete your shoot.");
  await expect(page.getByRole("link", { name: "Contact support for help", exact: true }))
    .toHaveAttribute("href", "mailto:support@beanywhere.app?subject=Web%20shoot%20recovery-test");
  await expect(page.locator(".gallery")).toContainText(count ? "This shoot won’t be emailed." : "no delivery email to wait for");
  await expect(page.locator(".gallery")).not.toContainText("Your photos will be sent");
  await expect(page.locator(".progress-panel")).toHaveCount(0);
  await expect(page.locator(".reshoot-guide")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Retry .*for free/ })).toHaveCount(0);
  if (!count) await expect(page.locator(".section-heading button")).toBeDisabled();
  else {
    await expect(page.locator(".section-heading button")).toBeEnabled();
    await expect(page.getByRole("button", { name: /^Open .*take/ })).toHaveCount(count);
  }
});
