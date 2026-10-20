import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { Pack, Shoot, StudioState } from "../../src/lib/types";

const packs: Pack[] = JSON.parse(readFileSync(new URL("../../src/lib/catalog.json", import.meta.url), "utf8"));
const pack = packs.find(value => value.packId === "paris")!;

async function galleryFixture(page: Page, options: { deadline?: number; failPreview?: boolean; route?: string; missing?: boolean } = {}) {
  const shoot: Shoot = {
    id: "experience-test", packId: "paris", styling: "m", styleId: "tailored",
    createdAt: Date.now(), checkoutKey: "fixture", operationIds: [], sample: false,
    status: "done", generationState: "finished", reshootsLeft: 3,
    retryWindowEndsAtMs: options.deadline ?? Date.now() + 86400000,
    photos: Array.from({ length: 12 }, (_, i) => ({
      slotId: `s${i}`, sceneId: pack.scenes[Math.floor(i / 2)].sceneId,
      label: pack.scenes[Math.floor(i / 2)].label, take: i % 2 + 1,
      path: `photo-${i}`, url: "", status: "done", favorite: false, revision: 0, readyAt: 0,
    })),
  };
  const state: StudioState = { version: 1, draft: null, email: "qa@example.com", preferredStyling: "m", shoots: [shoot] };
  // Keep the real UI and replace only the service boundary. This never connects
  // to Firebase, takes payment, sends email, or generates customer photos.
  await page.route("**/src/services/index.ts", route => route.fulfill({
    contentType: "application/javascript",
    body: `
      export const liveMode = true;
      const state = ${JSON.stringify(state)};
      if (${!!options.missing}) {
        state.shoots[0].photos[11].status = 'pending';
        state.shoots[0].photos[11].readyAt = Infinity;
        delete state.shoots[0].photos[11].path;
        state.shoots[0].generationState = 'running';
      }
      const listeners = new Set();
      const attempts = new Map();
      window.photoRequests = [];
      window.replaceFixturePhoto = () => {
        state.shoots[0].photos[0].path = 'photo-0-replaced';
        for (const listener of listeners) listener();
      };
      window.finishFixturePhoto = () => {
        Object.assign(state.shoots[0].photos[11], { status: 'done', readyAt: 0, path: 'photo-11' });
        state.shoots[0].generationState = 'finished';
        for (const listener of listeners) listener();
      };
      window.removeFixturePhoto = () => {
        state.shoots[0].photos[0].readyAt = Infinity;
        delete state.shoots[0].photos[0].path;
        for (const listener of listeners) listener();
      };
      export const service = {
        mode: 'live', read: async () => structuredClone(state),
        subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
        track: () => {}, refreshGalleries: async () => {}, assertPhotos: async () => {},
        photoBlob: async (_, photo) => {
          window.photoRequests.push(photo.path);
          const count = (attempts.get(photo.path) || 0) + 1;
          attempts.set(photo.path, count);
          // React's development strict mode mounts the first image effect twice.
          if (${!!options.failPreview} && photo.path === 'photo-0' && count <= 2) throw Error('Temporary preview failure');
          const scene = photo.path.endsWith('-replaced') ? 1 : Math.floor(Number(photo.slotId.slice(1)) / 2);
          return (await fetch('/assets/scenes/paris/m/tailored/' + scene + '.webp')).blob();
        },
        reshoot: async () => { throw Error('Generation is disconnected in this fixture'); },
      };
    `,
  }));
  await page.goto(`/#${options.route || "/gallery/experience-test"}`);
}

test("save dialog keeps keyboard focus across gallery refreshes and respects an open share sheet", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => true });
    Object.defineProperty(navigator, "share", { value: () => new Promise<void>(resolve => {
      Reflect.set(window, "finishShare", resolve);
    }) });
  });
  await galleryFixture(page);
  await page.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await page.getByRole("button", { name: "Save current photo", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Save your photos" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close dialog", exact: true }).press("Tab");
  const save = dialog.getByRole("button", { name: "Save or share photos", exact: true });
  await expect(save).toBeFocused();
  await page.clock.fastForward(2000);
  await expect(save).toBeFocused();
  await save.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await page.evaluate(() => Reflect.get(window, "finishShare")());
  await expect(page.getByRole("dialog", { name: "Create a new take?" })).toBeVisible();
  await page.getByRole("button", { name: "Keep this photo", exact: true }).click();
  await expect(page.getByRole("button", { name: "Reshoot s0", exact: true })).toBeFocused();
});

test("an unrelated arriving photo keeps the prepared selection and save dialog open", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => true });
    Object.defineProperty(navigator, "share", { value: async (data: ShareData) => {
      Reflect.set(window, "sharedFiles", data.files?.map(file => file.name));
    } });
  });
  await galleryFixture(page, { missing: true });
  await page.getByRole("checkbox", { name: "Select s0", exact: true }).check();
  await page.getByRole("button", { name: "Save selected", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Save your photos" });
  await expect(dialog).toBeVisible();
  await page.evaluate(() => Reflect.get(window, "finishFixturePhoto")());
  await expect(page.locator(".gallery-toolbar")).toContainText("12 of 12");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Your photo is ready.");
  await dialog.getByRole("button", { name: "Save or share photos", exact: true }).click();
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "sharedFiles"))).toEqual(["Paris-s0.webp"]);
});

for (const change of ["replaceFixturePhoto", "removeFixturePhoto"]) test(`a selected photo change still discards stale prepared files (${change})`, async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => true });
    Object.defineProperty(navigator, "share", { value: async () => {} });
  });
  await galleryFixture(page);
  await page.getByRole("checkbox", { name: "Select s0", exact: true }).check();
  await page.getByRole("button", { name: "Save selected", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Save your photos" })).toBeVisible();
  await page.evaluate(change => Reflect.get(window, change)(), change);
  await expect(page.getByRole("dialog", { name: "Save your photos" })).toHaveCount(0);
});

test("recovering a preview in the viewer repairs its thumbnail without reusing it for a replacement", async ({ page }) => {
  await galleryFixture(page, { failPreview: true });
  const tile = page.locator(".photo-tile").first();
  await expect(tile).toContainText("Preview unavailable.");
  await page.getByRole("button", { name: "Open Haussmann balcony, take 1", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".lightbox img")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(tile.locator(".photo-open img")).toBeVisible();
  await expect(tile).not.toContainText("Preview unavailable.");
  const recovered = await tile.locator("img").getAttribute("src");
  await page.evaluate(() => Reflect.get(window, "replaceFixturePhoto")());
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "photoRequests").includes("photo-0-replaced"))).toBe(true);
  await expect(tile.locator(".photo-open img")).toBeVisible();
  await expect(tile.locator("img")).not.toHaveAttribute("src", recovered!);
});

test("expired reshoots have the same clear status in My photos and the gallery", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await galleryFixture(page, { deadline: Date.now() - 1000, route: "/library" });
  const card = page.locator(".library-card");
  await expect(card).toContainText("Reshoot window ended");
  await expect(card).not.toContainText("3 reshoots left");
  await card.click();
  await expect(page.getByText(/The reshoot window has ended/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Reshoot s0", exact: true })).toBeDisabled();
  await expect(page.locator(".section-heading button")).toBeEnabled();
});

test("the server deadline appears consistently and turns into an expired status without reloading", async ({ page }) => {
  await page.clock.install();
  await galleryFixture(page, { deadline: Date.now() + 60000, route: "/library" });
  const deadline = await page.locator(".reshoot-deadline").innerText();
  await expect(page.locator(".library-card")).toContainText("3 reshoots left");
  await page.locator(".library-card").click();
  await expect(page.locator(".reshoot-deadline")).toHaveText(deadline);
  await page.clock.fastForward(61000);
  await expect(page.getByRole("button", { name: "Reshoot s0", exact: true })).toBeDisabled();
  await expect(page.locator(".reshoot-deadline")).toHaveCount(0);
  await page.getByRole("link", { name: "My photos", exact: true }).first().click();
  await expect(page.locator(".library-card")).toContainText("Reshoot window ended");
});
