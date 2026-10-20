import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
const root = new URL("../../../", import.meta.url);
async function setup(
  page: Page,
  policyGate: Promise<void> = Promise.resolve(),
) {
  await page.route(
    "https://us-central1-bethere-3d7de.cloudfunctions.net/getWebAnalyticsPolicy",
    async (route) => {
      await policyGate;
      await route.fulfill({
        json: { available: true, mode: "automatic" },
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    },
  );
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ body: "", contentType: "application/javascript" }),
  );
  await page.route("https://**.google-analytics.com/**", (route) =>
    route.abort(),
  );
  await page.route("http://127.0.0.1:4178/**", (route) => {
    const pathname = new URL(route.request().url()).pathname;
    const file =
      pathname === "/"
        ? "index.html"
        : [
              "/storefront.js",
              "/storefront.css",
              "/acquisition.js",
              "/analytics.js",
            ].includes(pathname)
          ? pathname.slice(1)
          : pathname === "/shoots/paris/"
            ? "shoots/paris/index.html"
            : null;
    return file
      ? route.fulfill({
          body: readFileSync(new URL(file, root)),
          contentType: pathname.endsWith(".js")
            ? "application/javascript"
            : pathname.endsWith(".css")
              ? "text/css"
              : "text/html",
        })
      : route.continue();
  });
}
const records = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { dataLayer?: IArguments[] }).dataLayer || []).map(
      (entry) => Array.from(entry),
    ),
  );

test("first page and early clicks survive policy loading; safe metadata follows the same browser", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await setup(page, gate);
  await page.goto(
    "/?utm_source=google&utm_medium=organic&email=private@example.com",
  );
  await page
    .getByRole("button", { name: "Men’s styling", exact: true })
    .click();
  expect(await records(page)).toHaveLength(0);
  release();
  await expect
    .poll(async () => JSON.stringify(await records(page)))
    .toContain("styling_selected");
  const first = await records(page);
  expect(JSON.stringify(first)).not.toContain("private@example.com");
  expect(
    first.filter((row) => row[0] === "event" && row[1] === "page_view"),
  ).toHaveLength(1);
  const config = first.find((row) => row[0] === "config")?.[2] as {
    client_id: string;
    session_id: number;
  };
  expect(config.client_id).toMatch(/^\d+\.\d{10}$/);
  await page.locator('[data-shoot-link="paris"]').click();
  await expect
    .poll(async () => JSON.stringify(await records(page)))
    .toContain("view_item");
  const next = (await records(page)).find(
    (row) => row[0] === "config",
  )?.[2] as typeof config;
  expect(next.client_id).toBe(config.client_id);
  expect(next.session_id).toBe(config.session_id);
});

for (const blocked of [false, true])
  test(`withdrawal stops events even when browser storage is blocked: ${blocked}`, async ({
    page,
  }) => {
    if (blocked)
      await page.addInitScript(() =>
        Object.defineProperty(window, "localStorage", {
          get() {
            throw Error("blocked");
          },
        }),
      );
    await setup(page);
    await page.goto("/");
    await expect
      .poll(async () => JSON.stringify(await records(page)))
      .toContain("page_view");
    await page.getByRole("button", { name: "Usage settings" }).click();
    await page
      .getByRole("checkbox", { name: "Share website usage data" })
      .uncheck();
    await page.getByRole("button", { name: "Save", exact: true }).click();
    const count = (await records(page)).filter(
      (row) => row[0] === "event",
    ).length;
    await page
      .getByRole("button", { name: "Men’s styling", exact: true })
      .click();
    expect(
      (await records(page)).filter((row) => row[0] === "event"),
    ).toHaveLength(count);
    await page.getByRole("button", { name: "Usage settings" }).click();
    await expect(
      page.getByRole("checkbox", { name: "Share website usage data" }),
    ).not.toBeChecked();
  });

test("a browser privacy signal prevents loading Analytics", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true }),
  );
  let tags = 0;
  page.on("request", (request) => {
    if (request.url().includes("googletagmanager.com")) tags++;
  });
  await setup(page);
  await page.goto("/");
  await page
    .getByRole("button", { name: "Men’s styling", exact: true })
    .click();
  await page.getByRole("button", { name: "Usage settings" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Share website usage data" }),
  ).not.toBeChecked();
  expect(tags).toBe(0);
  expect(await records(page)).toHaveLength(0);
});
