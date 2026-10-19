import { test, expect } from "@playwright/test";
import path from "node:path";

async function start(page: import("@playwright/test").Page) {
  await page.goto("/#/shoot/paris");
  await page.getByRole("button", { name: "Create my Paris shoot" }).click();
  await page.getByRole("button", { name: /Use demo photos/ }).click();
  await page.getByRole("checkbox", { name: /18 or older/ }).check();
  await page.getByRole("button", { name: "Review my shoot" }).click();
  await page.getByLabel("Your email").fill("preview@example.com");
  await page.getByRole("button", { name: "Create my demo shoot" }).click();
  await expect(page).toHaveURL(/gallery/);
  await expect(
    page.getByRole("button", { name: "Reshoot s11", exact: true }),
  ).toBeEnabled({ timeout: 15000 });
}
test("complete desktop journey, persistence, favorites, ZIP, reshoot and deletion", async ({
  page,
}) => {
  const errors: string[] = [];
  const remote: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:4178") &&
      !r.url().startsWith("data:") &&
      !r.url().startsWith("blob:")
    )
      remote.push(r.url());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await start(page);
  await page.getByRole("button", { name: "Favorite s0", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Unfavorite s0", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Unfavorite s0", exact: true }),
  ).toBeVisible();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download all", exact: true }).click();
  expect((await dl).suggestedFilename()).toMatch(/\.zip$/);
  await page.getByRole("button", { name: "Reshoot s0", exact: true }).click();
  await expect(
    page.getByText(/12 sample photo slots · 2 reshoots left/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reshoot s0", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: /Open .*take 1/ })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.screenshot({
    path: "../../work/web-draft-qa/desktop-gallery.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Delete this shoot" }).click();
  await page.getByRole("button", { name: "Delete shoot", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your story starts here." }),
  ).toBeVisible();
  expect(remote).toEqual([]);
  expect(errors).toEqual([]);
});
test("phone upload validation, draft recovery and complete privacy wipe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Men’s styling", exact: true })
    .click();
  await page.locator('a.pack-card[href="#/shoot/miami"]').click();
  await page.getByRole("button", { name: "Create my Miami shoot" }).click();
  await expect(
    page.getByRole("button", { name: "Review my shoot" }),
  ).toBeDisabled();
  await page.getByLabel("Choose reference photos").setInputFiles({
    name: "not-an-image.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("test"),
  });
  await expect(page.getByRole("status")).toContainText("choose a JPG");
  const p = path.resolve("public/assets/covers/paris-w.webp");
  await page.getByLabel("Choose reference photos").setInputFiles(p);
  await expect(page.getByText("1 / 6 photos selected")).toBeVisible();
  await page.getByLabel("Choose reference photos").setInputFiles(p);
  await expect(page.getByRole("status")).toContainText("already selected");
  await page.reload();
  await expect(page.getByText("1 / 6 photos selected")).toBeVisible();
  await page.getByRole("button", { name: /Use demo photos/ }).click();
  await page.getByRole("checkbox", { name: /18 or older/ }).check();
  await expect(
    page.getByRole("button", { name: "Review my shoot" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Dismiss message" }).click();
  await page.screenshot({
    path: "../../work/web-draft-qa/mobile-upload.png",
    fullPage: true,
    animations: "disabled",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Review my shoot" }).click();
  await page.getByRole("button", { name: "Create my demo shoot" }).click();
  await expect(page.getByRole("alert")).toContainText("valid email");
  await page.getByLabel("Your email").fill("phone@example.com");
  await page.screenshot({
    path: "../../work/web-draft-qa/mobile-checkout.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Create my demo shoot" }).click();
  await expect(page).toHaveURL(/gallery/);
  await page.getByRole("button", { name: "Open account and privacy" }).click();
  await page.getByRole("button", { name: "Clear all local data" }).click();
  await page.getByRole("button", { name: "Clear everything" }).click();
  await expect(page).toHaveURL(/#\/$/);
  await page.getByRole("link", { name: "My photos", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your story starts here." }),
  ).toBeVisible();
});
test("catalog filters, all looks, narrow layouts, and unknown routes", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".pack-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Escapes", exact: true }).click();
  await expect(page.locator(".pack-card")).toHaveCount(4);
  await page.getByRole("textbox", { name: "Search shoots" }).fill("nowhere");
  await expect(page.getByText("No settings found.")).toBeVisible();
  await page.getByRole("button", { name: "Show all shoots" }).click();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/#/shoot/santorini");
  await page
    .getByRole("button", { name: "Men’s styling", exact: true })
    .click();
  await expect(page.locator(".scene-card img")).toHaveCount(6);
  await page.locator(".scene-card").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/#/missing");
  await expect(
    page.getByRole("heading", { name: "This page has moved on." }),
  ).toBeVisible();
});
