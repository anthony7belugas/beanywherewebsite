import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const root = new URL("../../../", import.meta.url);
// Exercise saved-preference handling directly now that the customer UI is removed.
const analyticsModule = "/analytics.js?v=" + createHash("sha256")
  .update(readFileSync(new URL("analytics.js", root))).digest("hex").slice(0, 16);
async function setPreference(page: Page, allowed: boolean) {
  await page.evaluate(async ({ modulePath, allowed }) => {
    const analytics = await import(/* @vite-ignore */ modulePath);
    analytics.setAnalyticsAllowed(allowed);
  }, { modulePath: analyticsModule, allowed });
}
async function setup(
  page: Page,
  policyGate: Promise<void> = Promise.resolve(),
) {
  await page.route("https://us-central1-bethere-3d7de.cloudfunctions.net/collectWebJourney", route => route.fulfill({json:{disposition:"accepted"},headers:{"Access-Control-Allow-Origin":"*"}}));
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
              "/public-pages.js",
              "/styles.css",
            ].includes(pathname)
          ? pathname.slice(1)
          : pathname === "/shoots/paris/"
            ? "shoots/paris/index.html"
            : ["/support", "/privacy", "/terms"].includes(pathname)
              ? pathname.slice(1) + ".html" : null;
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
  await expect(page.getByRole("button", { name: "Usage settings" })).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
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
  await expect(page.getByRole("button", { name: "Usage settings" })).toHaveCount(0);
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
    await setPreference(page, false);
    const count = (await records(page)).filter(
      (row) => row[0] === "event",
    ).length;
    await page
      .getByRole("button", { name: "Men’s styling", exact: true })
      .click();
    expect(
      (await records(page)).filter((row) => row[0] === "event"),
    ).toHaveLength(count);
    expect(await page.evaluate(() => (window as unknown as Record<string, unknown>)["ga-disable-G-2VT9EWH1B5"])).toBe(true);
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
  expect(await page.evaluate(() => (window as unknown as Record<string, unknown>)["ga-disable-G-2VT9EWH1B5"])).toBe(true);
  expect(tags).toBe(0);
  expect(await records(page)).toHaveLength(0);
});

test("enabling measurement records the current page once without counting opted-out time", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => localStorage.setItem("beanywhere-analytics-choice", "false"));
  await setup(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Usage settings" })).toHaveCount(0);
  await page.clock.runFor(60000);
  expect((await records(page)).filter(row => row[0] === "event")).toHaveLength(0);
  await setPreference(page, true);
  await expect.poll(async () => (await records(page)).filter(row => row[0] === "event" && row[1] === "page_view").length).toBe(1);
  for (const row of (await records(page)).filter(row => row[0] === "event" && row[1] === "engagement_tick"))
    expect((row[2] as { duration_ms: number }).duration_ms).toBeLessThan(1000);
  await setPreference(page, true);
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
  await setPreference(page, false);
  await scroll();
  expect(await count()).toBe(4);
  await setPreference(page, true);
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
  await setPreference(other, false);
  await expect.poll(() => page.evaluate(() => (window as unknown as Record<string, unknown>)["ga-disable-G-2VT9EWH1B5"])).toBe(true);
  const count = (await records(page)).filter(row => row[0] === "event").length;
  await page.getByRole("button", { name: "Men’s styling", exact: true }).click();
  expect((await records(page)).filter(row => row[0] === "event")).toHaveLength(count);
});

const ticks = async (page: Page) => (await records(page))
  .filter(row => row[0] === "event" && row[1] === "engagement_tick")
  .map(row => row[2] as Record<string, string | number>);
async function virtualPage(page: Page, hash: string) {
  await page.evaluate(hash => {
    history.replaceState(null, "", "/studio/" + hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, hash);
}
async function focusState(page: Page, focused: boolean) {
  await page.evaluate(focused => {
    Object.defineProperty(document, "hasFocus", { configurable: true, value: () => focused });
    window.dispatchEvent(new Event(focused ? "focus" : "blur"));
  }, focused);
}

test("screen changes keep elapsed time on the screen just left and update safe navigation metadata", async ({ page }) => {
  await page.clock.install();
  await setup(page);
  await page.goto("/");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  await virtualPage(page, "#/upload");
  await page.clock.runFor(5000);
  await virtualPage(page, "#/checkout/private-order?email=private@example.com");
  const elapsed = (await ticks(page)).filter(row => Number(row.duration_ms) >= 4900);
  expect(elapsed).toHaveLength(1);
  expect(elapsed[0].page_location).toBe("https://beanywhere.app/studio/upload");
  expect((await pageViews(page)).at(-1)).toMatchObject({
    page_location: "https://beanywhere.app/studio/checkout",
    page_referrer: "https://beanywhere.app/studio/upload",
  });
  const config = (await records(page)).filter(row => row[0] === "config").at(-1)?.[2];
  expect(config).toMatchObject({
    page_location: "https://beanywhere.app/studio/checkout",
    page_referrer: "https://beanywhere.app/studio/upload", send_page_view: false,
  });
  expect(JSON.stringify(await records(page))).not.toContain("private-order");
  expect(JSON.stringify(await records(page))).not.toContain("private@example.com");
});

test("a visible but unfocused window pauses engagement and can start a returning session", async ({ page }) => {
  await page.clock.install();
  await setup(page);
  await page.goto("/?utm_source=google&utm_medium=cpc", { referer: "https://www.google.com/search?private=query" });
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  expect((await pageViews(page))[0].page_referrer).toBe("https://www.google.com/");
  await focusState(page, true);
  await page.clock.runFor(5000);
  await focusState(page, false);
  const before = await ticks(page);
  expect(before.some(row => Number(row.duration_ms) >= 4900)).toBe(true);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!));
  await page.clock.runFor(31 * 60000);
  expect(await ticks(page)).toEqual(before);
  const inactive = await page.evaluate(() => JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!));
  expect(inactive.lastActiveAtMs).toBe(state.lastActiveAtMs);
  await focusState(page, true);
  await expect.poll(async () => (await pageViews(page)).length).toBe(2);
  const returned = await page.evaluate(() => JSON.parse(localStorage.getItem("beanywhere-measurement-v1")!));
  expect(returned.clientId).toBe(state.clientId);
  expect(returned.sessionId).not.toBe(state.sessionId);
  expect((await pageViews(page)).at(-1)).toMatchObject({ session_source: "direct", page_referrer: "" });
  await page.clock.runFor(30000);
  await focusState(page, false);
  const elapsed = (await ticks(page)).slice(before.length).reduce((sum, row) => sum + Number(row.duration_ms), 0);
  expect(elapsed).toBeGreaterThanOrEqual(29900);
  expect(elapsed).toBeLessThan(30500);
});

test("a checkout failure reaches web analytics without becoming a purchase", async ({ page }) => {
  await setup(page);
  await page.goto("/");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  await page.evaluate(async () => {
    const link = performance.getEntriesByType("resource").find(entry => new URL(entry.name).pathname === "/analytics.js")!.name;
    const analytics = await import(/* @vite-ignore */ link);
    analytics.trackWeb("purchase_failed", { packId: "paris", reason: "unknown", email: "private@example.com" });
    analytics.trackWeb("purchase_completed", { value: 3.99 });
  });
  const events = (await records(page)).filter(row => row[0] === "event");
  expect(events.filter(row => row[1] === "purchase_failed")).toHaveLength(1);
  expect(events.find(row => row[1] === "purchase_failed")?.[2]).toMatchObject({ pack_id: "paris", error_code: "unknown" });
  expect(events.filter(row => row[1] === "purchase" || row[1] === "purchase_completed")).toHaveLength(0);
  expect(JSON.stringify(events)).not.toContain("private@example.com");
});


test("blur, hide and pagehide do not count the same interval twice", async ({ page }) => {
  await page.clock.install();
  await setup(page);
  await page.goto("/");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  await focusState(page, true);
  await page.clock.runFor(5000);
  await focusState(page, false);
  await visibility(page, "hidden");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
  const first = await ticks(page);
  await page.clock.runFor(120000);
  expect(await ticks(page)).toEqual(first);
  await visibility(page, "visible");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await focusState(page, true);
  await page.clock.runFor(2000);
  await visibility(page, "hidden");
  await focusState(page, false);
  const elapsed = (await ticks(page)).reduce((sum, row) => sum + Number(row.duration_ms), 0);
  expect(elapsed).toBeGreaterThanOrEqual(6900);
  expect(elapsed).toBeLessThan(7500);
  expect(await pageViews(page)).toHaveLength(2);
});


for (const path of ["/support", "/privacy", "/terms"]) test(`informational page ${path} records safe browsing without showing usage settings`, async ({ page }) => {
  await setup(page);
  const backend: string[] = [];
  page.on("request", request => {
    if (/cloudfunctions\.net|firestore\.googleapis|identitytoolkit\.googleapis/.test(request.url()) && !request.url().includes("getWebAnalyticsPolicy") && !request.url().includes("collectWebJourney")) backend.push(request.url());
  });
  await page.goto(path + "?email=private@example.com&order=secret");
  await expect.poll(async () => (await pageViews(page)).length).toBe(1);
  expect((await pageViews(page))[0].page_location).toBe("https://beanywhere.app" + path);
  expect((await records(page)).filter(row => row[1] === "view_item_list" || row[1] === "view_item")).toHaveLength(0);
  expect(JSON.stringify(await records(page))).not.toContain("private@example.com");
  await setPreference(page, false);
  await expect(page.getByRole("button", { name: "Usage settings" })).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: "BeAnywhere", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Usage settings" })).toHaveCount(0);
  expect(await pageViews(page)).toHaveLength(0);
  expect(backend).toEqual([]);
});


test("delayed policy and Google blocking preserve original page, time and source in durable raw events", async({page})=>{
  let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});
  await setup(page,gate);
  const raw:any[]=[];
  await page.route("**/collectWebJourney",async route=>{raw.push(route.request().postDataJSON());await route.fulfill({json:{disposition:"accepted"},headers:{"Access-Control-Allow-Origin":"*"}});});
  await page.goto("/?utm_source=instagram&utm_medium=social&utm_campaign=Fall%20Launch&utm_content=Reel%201");
  await page.getByRole("button",{name:"Men’s styling",exact:true}).click();
  const beforeRelease=Date.now();
  await page.evaluate(()=>{window.history.replaceState(null,'','/support');});
  release();
  await expect.poll(()=>raw.some(row=>row.name==='styling_selected')).toBe(true);
  const action=raw.find(row=>row.name==='styling_selected');
  expect(action.at).toBeLessThanOrEqual(beforeRelease);expect(action.pagePath).toBe('/');
  expect(action.context.attribution).toMatchObject({source:'instagram',campaign:'fall_launch',content:'reel_1'});
  expect(new Set(raw.map(row=>row.context.clientId)).size).toBe(1);
  expect(new Set(raw.map(row=>row.context.sessionId)).size).toBe(1);
  const ga=(await records(page)).find(row=>row[1]==='styling_selected')![2] as any;
  expect(ga.event_id).toBe(action.id);expect(ga.occurred_at_ms).toBe(action.at);expect(ga.page_location).toBe('https://beanywhere.app/');
});

test("a failed policy request and document navigation preserve pending early actions without sending before approval",async({page})=>{
  await setup(page);
  let fail=true; const raw:any[]=[];
  await page.route("**/getWebAnalyticsPolicy",route=>fail?route.abort():route.fulfill({json:{available:true,mode:'automatic'},headers:{'Access-Control-Allow-Origin':'*'}}));
  await page.route("**/collectWebJourney",async route=>{raw.push(route.request().postDataJSON());await route.fulfill({json:{disposition:'accepted'},headers:{'Access-Control-Allow-Origin':'*'}});});
  await page.goto('/?utm_source=reddit&utm_medium=social');
  await page.getByRole('button',{name:'Men’s styling',exact:true}).click();
  expect(raw).toHaveLength(0);
  fail=false;await page.goto('/support');
  await expect.poll(()=>raw.some(row=>row.name==='styling_selected')).toBe(true);
  expect(raw.find(row=>row.name==='styling_selected').pagePath).toBe('/');
  expect(raw.find(row=>row.name==='styling_selected').context.sessionAttribution.source).toBe('reddit');
});

test("first-party delivery retries the same raw event after a navigation",async({page})=>{
  await setup(page);const raw:any[]=[];let accept=false;
  await page.route('**/collectWebJourney',async route=>{raw.push(route.request().postDataJSON()); if(!accept)await route.abort();else await route.fulfill({json:{disposition:'accepted'},headers:{'Access-Control-Allow-Origin':'*'}});});
  await page.goto('/');
  await expect.poll(()=>raw.length).toBeGreaterThan(0);
  const first=raw[0];accept=true;await page.goto('/support');
  await expect.poll(()=>raw.filter(row=>row.id===first.id).length).toBeGreaterThan(1);
  const replay=[...raw].reverse().find(row=>row.id===first.id);expect(replay).toEqual(first);
});


test("marked test traffic keeps the same ID and original context in authenticated business records",async({page})=>{
  await setup(page);await page.goto('/?ba_test=1');
  await expect.poll(async()=> (await pageViews(page)).length).toBe(1);
  const row=await page.evaluate(async modulePath=>{
    const a=await import(/* @vite-ignore */ modulePath);
    const eventId=crypto.randomUUID();
    const sent=new Promise<any>(resolve=>a.setEventTransport(async (event:any)=>{resolve(event);return {disposition:'accepted'};}));
    a.trackWeb('pack_opened',{packId:'paris'},eventId);
    a.queueStudioEvent('pack_opened',{packId:'paris'},eventId);
    return {row:await sent,eventId};
  },analyticsModule);
  expect(row.row.id).toBe(row.eventId);expect(row.row.params.isTest).toBe(true);
  expect(row.row.params.sessionId).toBe(row.row.context.sessionId);
  const ga=(await records(page)).find(entry=>entry[1]==='pack_opened')![2] as any;
  expect(row.row.at).toBe(ga.occurred_at_ms);expect(row.row.context.gaSessionId).toBe(ga.session_id);
});
