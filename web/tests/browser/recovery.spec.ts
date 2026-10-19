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

test("Favorites downloads and viewer navigation include only the filtered photos", async ({
  page,
}) => {
  const state = galleryState();
  state.shoots[0].photos[0].favorite = true;
  await seed(page, state, `/gallery/${state.shoots[0].id}`);
  await page.getByRole("button", { name: /^Favorites/ }).click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: /Download/ })
    .first()
    .click();
  expect((await download).suggestedFilename()).toBe("Paris-sample-s0.webp");
  await page
    .getByRole("button", { name: /^Open .*take 1/ })
    .first()
    .click();
  const current = await page
    .getByRole("dialog")
    .locator("img")
    .getAttribute("src");
  await page.getByRole("button", { name: "Next photo" }).click();
  expect(
    await page.getByRole("dialog").locator("img").getAttribute("src"),
  ).toBe(current);
  await page.getByRole("button", { name: "Toggle favorite photo" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Download/ }).first(),
  ).toBeDisabled();
});

test("a selected photo being reshot cannot accidentally download the rest of the shoot", async ({
  page,
  context,
}) => {
  const state = galleryState();
  const route = `/gallery/${state.shoots[0].id}`;
  await seed(page, state, route);
  await page.getByRole("checkbox", { name: "Select s0", exact: true }).check();
  const other = await context.newPage();
  await other.goto(`/#${route}`);
  await other.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Download selected" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Download selected" }),
  ).toBeEnabled({ timeout: 10000 });
});

test("leaving a gallery cancels its pending download", async ({ page }) => {
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
