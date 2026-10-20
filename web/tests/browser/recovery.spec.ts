import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { Pack, StudioState } from "../../src/lib/types";
const packs: Pack[] = JSON.parse(
  readFileSync(new URL("../../src/lib/catalog.json", import.meta.url), "utf8"),
);
const pack = packs.find((p) => p.packId === "paris")!;
const emptyState = (): StudioState => ({
  version: 1,
  draft: null,
  shoots: [],
  preferredStyling: "w",
  email: "",
});
function galleryState(): StudioState {
  const styleId = pack.styleDirections.w[0].id;
  return {
    ...emptyState(),
    shoots: [
      {
        id: crypto.randomUUID(),
        packId: pack.packId,
        styling: "w",
        styleId,
        createdAt: Date.now() - 20000,
        reshootsLeft: 3,
        checkoutKey: crypto.randomUUID(),
        operationIds: [],
        sample: true,
        photos: Array.from({ length: 12 }, (_, i) => ({
          slotId: `s${i}`,
          sceneId: pack.scenes[Math.floor(i / 2)].sceneId,
          label: pack.scenes[Math.floor(i / 2)].label,
          take: (i % 2) + 1,
          url: `./assets/scenes/paris/w/${styleId}/${Math.floor(i / 2)}.webp`,
          favorite: false,
          revision: 0,
          readyAt: Date.now() - 10000,
        })),
      },
    ],
  };
}
async function seed(page: Page, state: unknown, route = "/") {
  await page.goto("/");
  await expect(page.locator(".pack-card")).toHaveCount(6);
  await page.evaluate(
    (data) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("beanywhere-private-studio-v1", 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("studio", "readwrite");
          tx.objectStore("studio").put(data, "state");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
      }),
    state,
  );
  await page.goto(`/#${route}`);
  await page.reload();
}

async function useDownloads(page: Page) {
  // Exercise the download fallback independently of the host's native share sheet.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => false });
  });
}

test("damaged saved data has a non-destructive recovery screen and a confirmed reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const broken = { ...emptyState(), draft: { packId: "removed-pack" } };
  await seed(page, broken, "/upload");
  await expect(
    page.getByRole("heading", { name: "Your saved photos need attention." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset local studio" }).click();
  await page.screenshot({
    path: "../../work/web-draft-qa/mobile-recovery.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Keep saved data" }).click();
  const stored = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const r = indexedDB.open("beanywhere-private-studio-v1");
        r.onsuccess = () => {
          const db = r.result;
          const get = db
            .transaction("studio")
            .objectStore("studio")
            .get("state");
          get.onsuccess = () => {
            resolve(get.result);
            db.close();
          };
        };
      }),
  );
  expect(stored).toEqual(broken);
  await page.getByRole("button", { name: "Reset local studio" }).click();
  await page.getByRole("button", { name: "Clear saved studio" }).click();
  await expect(page.locator(".pack-card")).toHaveCount(6);
});

test("legacy favorites do not hide photos, and selecting one saves only that photo", async ({ page }) => {
  await useDownloads(page);
  const state = galleryState();
  state.shoots[0].photos[0].favorite = true;
  await seed(page, state, `/gallery/${state.shoots[0].id}`);
  await expect(page.locator(".photo-tile")).toHaveCount(12);
  await expect(page.getByRole("button", { name: /favorite/i })).toHaveCount(0);
  await page.getByRole("checkbox", { name: "Select s0", exact: true }).check();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download selected", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("Paris-sample-s0.webp");
  await page.getByRole("button", { name: /^Open .*take 1/ }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next photo" })).toBeEnabled();
  await expect(page.getByRole("button", { name: /favorite/i })).toHaveCount(0);
});

test("a selected photo being reshot cannot accidentally download the rest of the shoot", async ({
  page,
  context,
}) => {
  await useDownloads(page);
  const state = galleryState();
  const route = `/gallery/${state.shoots[0].id}`;
  await seed(page, state, route);
  await page.getByRole("checkbox", { name: "Select s0", exact: true }).check();
  const other = await context.newPage();
  await other.goto(`/#${route}`);
  await other.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await other.getByRole("button", { name: "Use 1 reshoot", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Download selected" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Download selected" }),
  ).toBeEnabled({ timeout: 10000 });
});

test("leaving a gallery cancels its pending download", async ({ page }) => {
  await useDownloads(page);
  const state = galleryState();
  await seed(page, state, `/gallery/${state.shoots[0].id}`);
  await page.evaluate(() => {
    const original = window.fetch;
    Reflect.set(window, "downloadAborted", false);
    window.fetch = async (input, init) => {
      if (String(input).includes("/assets/scenes/")) {
        Reflect.set(window, "downloadStarted", true);
        await new Promise<void>((resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => {
              Reflect.set(window, "downloadAborted", true);
              reject(new DOMException("cancelled", "AbortError"));
            },
            { once: true },
          );
          Reflect.set(window, "releaseDownload", resolve);
        });
      }
      return original(input, init);
    };
  });
  await page.getByRole("button", { name: "Download all", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "downloadStarted")))
    .toBe(true);
  await page.getByRole("link", { name: "BeAnywhere home", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "downloadAborted")))
    .toBe(true);
});

test("reshoot review can be cancelled or saved, and only confirmation spends one reshoot", async ({ page }) => {
  await useDownloads(page);
  const state = galleryState();
  await seed(page, state, `/gallery/${state.shoots[0].id}`);
  await page.setViewportSize({ width: 320, height: 740 });
  const opener = page.getByRole("button", { name: "Reshoot s0", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Create a new take?" });
  await expect(dialog).toContainText("This uses 1 of your 3 remaining reshoots.");
  await expect(dialog).toContainText("When the new version is ready, it replaces this photo in your gallery.");
  await expect(dialog.locator("img")).toHaveAttribute("alt", /current photo/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await dialog.getByRole("button", { name: "Keep this photo" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(page.getByText(/12 sample photo slots · 3 reshoots left/)).toBeVisible();

  await opener.click();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await opener.click();
  const download = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Save current photo" }).click();
  expect((await download).suggestedFilename()).toBe("Paris-sample-s0.webp");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("3 remaining reshoots");
  const confirm = dialog.getByRole("button", { name: "Use 1 reshoot", exact: true });
  await expect(confirm).toBeEnabled();
  // A fast repeat tap must not spend a second allowance.
  await confirm.evaluate(button => { (button as HTMLButtonElement).click(); (button as HTMLButtonElement).click(); });
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText(/12 sample photo slots · 2 reshoots left/)).toBeVisible();
  await expect(page.locator(".photo-tile").first()).toContainText("Reshoot 1");
  await page.reload();
  await expect(page.getByText(/12 sample photo slots · 2 reshoots left/)).toBeVisible();
});

test("saving through the native share flow returns to the reshoot review without spending it", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => true });
    Object.defineProperty(navigator, "share", { value: async ({ files }: { files: File[] }) => {
      Reflect.set(window, "savedPhotoNames", files.map(file => file.name));
    } });
  });
  const state = galleryState();
  state.shoots[0].reshootsLeft = 1;
  await seed(page, state, `/gallery/${state.shoots[0].id}`);
  await page.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("This uses your last remaining reshoot.");
  await page.getByRole("button", { name: "Save current photo" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(page.getByRole("dialog", { name: "Save your photos" })).toBeVisible();
  await page.getByRole("button", { name: "Save or share photos" }).click();
  await expect(page.getByRole("dialog", { name: "Create a new take?" })).toBeVisible();
  expect(await page.evaluate(() => Reflect.get(window, "savedPhotoNames"))).toEqual(["Paris-sample-s0.webp"]);
  await page.getByRole("button", { name: "Keep this photo" }).click();
  await expect(page.getByRole("button", { name: "Reshoot s0", exact: true })).toBeFocused();
  expect(await page.locator("#root").evaluate(root => (root as HTMLElement).inert)).toBe(false);
  await page.reload();
  await page.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("This uses your last remaining reshoot.");
  await page.getByRole("button", { name: "Use 1 reshoot", exact: true }).click();
  await expect(page.getByText("You’ve used your included reshoots.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reshoot s0", exact: true })).toBeDisabled();
});

test("a stale confirmation cannot reshoot a newer photo from another tab", async ({ page, context }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, "BroadcastChannel", { value: undefined });
  });
  const state = galleryState();
  const route = `/gallery/${state.shoots[0].id}`;
  await seed(page, state, route);
  await page.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await page.evaluate(() => {
    window.addEventListener("focus", event => event.stopImmediatePropagation(), true);
    document.addEventListener("visibilitychange", event => event.stopImmediatePropagation(), true);
  });
  const other = await context.newPage();
  await other.goto(`/#${route}`);
  await other.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await other.getByRole("button", { name: "Use 1 reshoot", exact: true }).click();
  await expect(other.getByText(/12 sample photo slots · 2 reshoots left/)).toBeVisible();
  await page.getByRole("button", { name: "Use 1 reshoot", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("This photo changed.");
  await page.reload();
  await expect(page.getByText(/12 sample photo slots · 2 reshoots left/)).toBeVisible();
  await expect(page.locator(".photo-tile").first()).toContainText("Reshoot 1");
});
