import { test, expect } from "@playwright/test";
import path from "node:path";

async function uploadPage(page: import("@playwright/test").Page) {
  await page.goto("/#/shoot/paris");
  await page.getByRole("button", { name: "Add your selfies" }).click();
}

test("removing references wins against a photo still being prepared, including after reload", async ({
  page,
}) => {
  await uploadPage(page);
  await page.getByRole("button", { name: /Use demo photos/ }).click();
  await expect(page.getByText("4 / 6 photos selected")).toBeVisible();
  await page.evaluate(() => {
    const original = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function () {
      await original.call(this);
      if (this.src.startsWith("blob:"))
        await new Promise<void>((resolve) =>
          Reflect.set(window, "releasePreparation", resolve),
        );
    };
  });
  await page
    .getByLabel("Choose reference photos")
    .setInputFiles(path.resolve("public/assets/covers/paris-w.webp"));
  await expect
    .poll(() =>
      page.evaluate(() => typeof Reflect.get(window, "releasePreparation")),
    )
    .toBe("function");
  await page.getByRole("button", { name: "Photo settings", exact: true }).click();
  await page
    .getByRole("button", { name: "Remove draft reference photos" })
    .click();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.getByText("0 / 6 photos selected")).toBeVisible();
  await page.evaluate(() => Reflect.get(window, "releasePreparation")());
  await expect(page.getByRole("status")).toContainText(
    "selected photos changed",
  );
  await page.reload();
  await expect(page.getByText("0 / 6 photos selected")).toBeVisible();
});

test("changing photos resets permission, including across tabs", async ({
  page,
  context,
}) => {
  await uploadPage(page);
  await page.getByRole("button", { name: /Use demo photos/ }).click();
  await page.getByRole("checkbox", { name: /18 or older/ }).check();
  await expect(
    page.getByRole("button", { name: "Review my shoot" }),
  ).toBeEnabled();
  const other = await context.newPage();
  await other.goto("/#/upload");
  await expect(other.getByText("4 / 6 photos selected")).toBeVisible();
  await other
    .getByRole("button", { name: "Remove reference 1", exact: true })
    .click();
  await expect(page.getByText("3 / 6 photos selected")).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: /18 or older/ }),
  ).not.toBeChecked();
  await expect(
    other.getByRole("checkbox", { name: /18 or older/ }),
  ).not.toBeChecked();
});

test("rejects images that would become too narrow for the existing generation backend", async ({
  page,
}) => {
  await uploadPage(page);
  const png = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 4000;
    canvas.height = 256;
    canvas.getContext("2d")!.fillRect(0, 0, 4000, 256);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  await page.getByLabel("Choose reference photos").setInputFiles({
    name: "panorama.png",
    mimeType: "image/png",
    buffer: Buffer.from(png, "base64"),
  });
  await expect(page.getByRole("status")).toContainText("less extreme shape");
  await expect(page.getByText("0 / 6 photos selected")).toBeVisible();
});

test("keyboard focus stays in a dialog and returns to its opener", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Photo settings", exact: true });
  await opener.focus();
  await page.keyboard.press("Enter");
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
    expect(
      await modal.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(modal).toHaveCount(0);
  await expect(opener).toBeFocused();
});
