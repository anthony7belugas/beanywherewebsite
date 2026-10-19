import { test, expect } from "@playwright/test";

async function selected(page: import("@playwright/test").Page) {
  await page.goto("/#/shoot/paris");
  await page.getByRole("button", { name: "Create my Paris shoot" }).click();
  await page.getByRole("button", { name: /Use demo photos/ }).click();
  await expect(page.getByText("4 / 6 photos selected")).toBeVisible();
}

test("failed permission and glasses saves roll back their visible state", async ({
  page,
}) => {
  await selected(page);
  await page.evaluate(() => {
    IDBObjectStore.prototype.put = () => {
      throw new DOMException("Storage full", "QuotaExceededError");
    };
  });
  const glasses = page.getByRole("checkbox", { name: /I wear glasses/ });
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
