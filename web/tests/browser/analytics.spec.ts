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
    "/?utm_source=google&utm_medium=organic&utm_campaign=autumn&utm_content=hero&source_code=friend&email=private@example.com",
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
  expect(config).toMatchObject({ campaign_source: "google", campaign_name: "autumn", session_source: "google", is_test: 1 });
  for (const row of first.filter(row => row[0] === "event"))
    expect(Object.keys(row[2] as Record<string, unknown>).length).toBeLessThanOrEqual(25);
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

test("enabling measurement records the current page once without counting opted-out time", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => localStorage.setItem("beanywhere-analytics-choice", "false"));
  await setup(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Usage settings" }).click();
  await expect(page.getByRole("checkbox", { name: "Share website usage data" })).not.toBeChecked();
  await page.clock.runFor(60000);
  expect((await records(page)).filter(row => row[0] === "event")).toHaveLength(0);
  await page.getByRole("checkbox", { name: "Share website usage data" }).check();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect.poll(async () => (await records(page)).filter(row => row[0] === "event" && row[1] === "page_view").length).toBe(1);
  for (const row of (await records(page)).filter(row => row[0] === "event" && row[1] === "engagement_tick"))
    expect((row[2] as { duration_ms: number }).duration_ms).toBeLessThan(1000);
  await page.getByRole("button", { name: "Usage settings" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect((await records(page)).filter(row => row[0] === "event" && row[1] === "page_view")).toHaveLength(1);
});

test("visible-page timing stays separate from Google's automatic engagement clock", async ({ page }) => {
  await page.clock.install();
  await setup(page);
  await page.goto("/");
  await expect.poll(async () => JSON.stringify(await records(page))).toContain("page_view");
  await page.clock.runFor(30000);
  const ticks = (await records(page)).filter(row => row[0] === "event" && row[1] === "engagement_tick");
  expect(ticks.some(row => (row[2] as { duration_ms: number }).duration_ms >= 29000)).toBe(true);
  for (const row of ticks) expect(row[2]).not.toHaveProperty("engagement_time_msec");
});

async function visibility(page: Page, value: "visible" | "hidden") {
  await page.evaluate(value => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value });
    document.dispatchEvent(new Event("visibilitychange"));
  }, value);
}
const pageViews = async (page: Page) => (await records(page))
  .filter(row => row[0] === "event" && row[1] === "page_view")
  .map(row => row[2] as Record<string, string | number>);

test("returning to an inactive tab records a new session with the same browser and no new campaign click", async ({ page }) => {
  await page.clock.install();
  await setup(page);
  await page.goto("/?utm_source=google&utm_medium=cpc&utm_campaign=return_test");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  const first = await page.evaluate(() => JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!));
  await visibility(page, "hidden");
  await page.clock.runFor(31 * 60000);
  await visibility(page, "visible");
  await expect.poll(async () => (await pageViews(page)).length, {
    message: JSON.stringify(await page.evaluate(() => ({
      now: Date.now(), state: JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!),
      events: ((window as unknown as { dataLayer: IArguments[] }).dataLayer || []).filter(row => row[0] === "event").map(row => [row[1], row[2]]),
    }))),
  }).toBe(2);
  const second = await page.evaluate(() => JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!));
  expect(second.clientId).toBe(first.clientId);
  expect(second.sessionId).not.toBe(first.sessionId);
  expect(second.visitNumber).toBe(2);
  expect((await pageViews(page))[1]).toMatchObject({
    session_source: "direct", first_source: "google", source: "google",
  });
  await visibility(page, "hidden");
  await page.clock.runFor(60000);
  await visibility(page, "visible");
  expect(await pageViews(page)).toHaveLength(2);
});

test("a browser cache restore records a page view and restarts the visible timer without counting time away", async ({ page }) => {
  await page.clock.install();
  await setup(page);
  await page.goto("/");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  const first = (await pageViews(page))[0];
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
  await visibility(page, "hidden");
  await page.clock.runFor(120000);
  await visibility(page, "visible");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  expect(await pageViews(page)).toHaveLength(2);
  expect((await pageViews(page))[1].session_id).toBe(first.session_id);
  await page.clock.runFor(30000);
  const ticks = (await records(page)).filter(row => row[0] === "event" && row[1] === "engagement_tick");
  expect(ticks.some(row => (row[2] as { duration_ms: number }).duration_ms >= 29000)).toBe(true);
  expect(ticks.every(row => (row[2] as { duration_ms: number }).duration_ms <= 30000)).toBe(true);
});

test("scroll depth can be measured again on a newly measured page after opting back in", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  const scroll = () => page.evaluate(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true, value: document.documentElement.scrollHeight - innerHeight,
    });
    window.dispatchEvent(new Event("scroll"));
  });
  await scroll();
  const count = async () => (await records(page)).filter(row => row[0] === "event" && row[1] === "scroll_depth").length;
  expect(await count()).toBe(4);
  await page.getByRole("button", { name: "Usage settings" }).click();
  await page.getByRole("checkbox", { name: "Share website usage data" }).uncheck();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await scroll();
  expect(await count()).toBe(4);
  await page.getByRole("button", { name: "Usage settings" }).click();
  await page.getByRole("checkbox", { name: "Share website usage data" }).check();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await scroll();
  expect(await count()).toBe(8);
});

test("a fresh external return keeps the browser but records the new session's source", async ({ page }) => {
  await page.clock.install();
  await setup(page);
  await page.goto("/?utm_source=google&utm_medium=cpc");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  const first = await page.evaluate(() => JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!));
  await visibility(page, "hidden");
  await page.clock.runFor(31 * 60000);
  await page.goto("/?utm_source=instagram&utm_medium=social");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  const returned = await page.evaluate(() => JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!));
  expect(returned.clientId).toBe(first.clientId);
  expect(returned.sessionId).not.toBe(first.sessionId);
  expect((await pageViews(page))[0]).toMatchObject({ session_source: "instagram", first_source: "google", source: "instagram" });
});

test("two tabs share a browser and session and apply withdrawal across both tabs", async ({ page, context }) => {
  await setup(page);
  await page.goto("/");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  const other = await context.newPage();
  await setup(other);
  await other.goto("/shoots/paris/");
  await expect.poll(async () => (await pageViews(other)).length).toBe(1);
  const config = async (p: Page) => (await records(p)).find(row => row[0] === "config")?.[2] as Record<string, unknown>;
  expect((await config(other)).client_id).toBe((await config(page)).client_id);
  expect((await pageViews(other))[0].session_id).toBe((await pageViews(page))[0].session_id);
  await other.getByRole("button", { name: "Usage settings" }).click();
  await other.getByRole("checkbox", { name: "Share website usage data" }).uncheck();
  await other.getByRole("button", { name: "Save", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as Record<string, unknown>)["ga-disable-G-2VT9EWH1B5"])).toBe(true);
  const count = (await records(page)).filter(row => row[0] === "event").length;
  await page.getByRole("button", { name: "Men’s styling", exact: true }).click();
  expect((await records(page)).filter(row => row[0] === "event")).toHaveLength(count);
});
