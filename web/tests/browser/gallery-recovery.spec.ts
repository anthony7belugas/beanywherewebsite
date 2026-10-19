import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { Pack } from "../../src/lib/types";

const packs: Pack[] = JSON.parse(readFileSync(new URL("../../src/lib/catalog.json", import.meta.url), "utf8"));
const pack = packs.find(value => value.packId === "paris")!;

async function recoveredGallery(page: Page, emailState = "sent") {
  const uid = `w_${"a".repeat(40)}`, owner = `w_${"b".repeat(40)}`;
  const job = {
    id: "recovery-test", uid: owner, packId: "paris", styling: "m", styleId: "tailored",
    clientVisible: true, status: "done", generationState: "finished", reshootsLeft: 3,
    retryWindowEndsAtMs: Date.now() + 86400000, emailRequestState: emailState,
    slots: Array.from({ length: 12 }, (_, i) => ({
      slotId: `s${i}`, sceneId: pack.scenes[Math.floor(i / 2)].sceneId, take: i % 2 + 1,
      status: "done", path: `outputs/${owner}/recovery-test/p${i}.jpg`,
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
  await expect(notice).toContainText("We couldn’t confirm your email delivery.");
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
