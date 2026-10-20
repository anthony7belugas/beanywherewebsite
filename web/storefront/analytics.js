import { createEventOutbox } from "./event-outbox.js";
// Shared public-site / Studio measurement. No form values, raw URLs, email or photo data.
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";
import {
  captureAttribution,
  currentAttribution,
  directAttribution,
} from "./acquisition.js";
export const MEASUREMENT_ID = "G-2VT9EWH1B5";
export const ANALYTICS_VERSION = "web-20261020-1";
const KEY = "beanywhere-measurement-v1";
const CHOICE = "beanywhere-analytics-choice";
const TIMEOUT = 30 * 60000;
const YEAR = 365 * 86400000;
const EVENTS = new Set(
  "page_view view_item_list view_item select_item cta_clicked styling_selected style_direction_selected faq_opened scroll_depth engagement_tick web_vital web_error pack_opened screen_view upload_screen_viewed reference_selection_started reference_selection_completed reference_selection_failed upload_started upload_completed upload_failed consent_completed checkout_viewed begin_checkout purchase_initiated checkout_error payment_return purchase_status library_viewed library_failed gallery_opened gallery_lookup_started gallery_lookup_completed gallery_lookup_failed delivery_email_submitted delivery_email_changed results_revealed results_completed download_started photo_saved save_all download_failed save_all_partial reshoot_requested reshoot_accepted reshoot_failed slot_retry support_opened instagram_opened outbound_clicked privacy_opened".split(
    " ",
  ),
);
const TEXT = new Set(
  "pack_id style_id styling source medium campaign content code first_source first_medium first_campaign session_source session_medium session_campaign action surface outcome error_code metric gallery_access release experiment variant".split(
    " ",
  ),
);
const NUM = new Set(
  "count n duration_ms value percent position take image_version consent_version attempt_number".split(
    " ",
  ),
);
const aliases = {
  packId: "pack_id",
  styleId: "style_id",
  durationMs: "duration_ms",
  imageVersion: "image_version",
  consentVersion: "consent_version",
  reason: "error_code",
};
export function safeParams(input = {}) {
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    const name = aliases[key] || key;
    if (
      TEXT.has(name) &&
      typeof value === "string" &&
      /^[a-z0-9][a-z0-9_.:-]{0,99}$/i.test(value)
    )
      out[name] = value;
    else if (
      NUM.has(name) &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1e9
    )
      out[name] = value;
    else if (
      ["restored", "reused_refs", "is_test"].includes(name) &&
      typeof value === "boolean"
    )
      out[name] = value ? 1 : 0;
  }
  return out;
}
export function safePage(href) {
  const u = new URL(href, "https://beanywhere.app");
  if (u.pathname.startsWith("/studio")) {
    const part = u.hash.replace(/^#/, "").split(/[/?]/)[1];
    return (
      "/studio/" +
      ([
        "upload",
        "checkout",
        "library",
        "gallery",
        "payment",
        "shoot",
      ].includes(part)
        ? part
        : "home")
    );
  }
  if (
    /^\/shoots\/(santorini|paris|nightout|everyday|alpine|miami)\/$/.test(
      u.pathname,
    )
  )
    return u.pathname;
  // Never echo an arbitrary path: links can contain private information.
  return [
    "/",
    "/privacy",
    "/privacy.html",
    "/terms",
    "/terms.html",
    "/support",
    "/support.html",
  ].includes(u.pathname)
    ? u.pathname.replace(".html", "")
    : "/other";
}
function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
const volatileStorage = new Map(),
  failedWrites = new Set();
function read(key) {
  if (failedWrites.has(key)) return volatileStorage.get(key) ?? null;
  try {
    const store = storage();
    if (store) return JSON.parse(store.getItem(key) || "null");
  } catch {}
  return volatileStorage.get(key) ?? null;
}
function save(key, value) {
  volatileStorage.set(key, value);
  try {
    const store = storage();
    if (store) {
      store.setItem(key, JSON.stringify(value));
      failedWrites.delete(key);
    } else failedWrites.add(key);
  } catch {
    failedWrites.add(key);
  }
}
export function analyticsPreference() {
  if (
    typeof navigator !== "undefined" &&
    (navigator.globalPrivacyControl || navigator.doNotTrack === "1")
  )
    return false;
  const value = read(CHOICE);
  return typeof value === "boolean" ? value : null;
}
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const cleanAttribution = (value) =>
  Object.fromEntries(
    Object.entries(directAttribution()).map(([key, fallback]) => [
      key,
      typeof value?.[key] === "string" &&
      /^[a-z0-9][a-z0-9_.-]{0,63}$/i.test(value[key])
        ? value[key].toLowerCase()
        : fallback,
    ]),
  );
const earlyEvents = [];
const earlyStudioEvents = [];
let policy = { available: false, mode: "choice" };
let memory,
  initialized = false,
  loaded = false,
  configuredSession = "",
  lastPage = "",
  preferenceListener;
export function analyticsAllowed() {
  if (typeof window === "undefined" || typeof navigator === "undefined")
    return false;
  return (
    policy.available &&
    (analyticsPreference() === true ||
      (analyticsPreference() !== false && policy.mode === "automatic"))
  );
}
export function nextIdentity(previous, { now, uuid, attribution }) {
  const valid =
    previous &&
    /^\d{1,16}\.\d{10}$/.test(previous.clientId || "") &&
    previous.firstSeenAtMs > 0 &&
    previous.firstSeenAtMs <= now &&
    now - previous.firstSeenAtMs < YEAR;
  const state = valid
    ? { ...previous }
    : {
        clientId:
          parseInt(uuid().replaceAll("-", "").slice(-8), 16) +
          "." +
          Math.floor(now / 1000),
        firstSeenAtMs: now,
        firstAttribution: attribution,
        visitNumber: 0,
      };
  state.firstAttribution = cleanAttribution(state.firstAttribution);
  state.sessionAttribution = cleanAttribution(state.sessionAttribution);
  if (
    !valid ||
    !UUID.test(state.sessionId || "") ||
    !Number.isSafeInteger(state.gaSessionId) ||
    !Number.isFinite(state.lastActiveAtMs) ||
    now < state.lastActiveAtMs ||
    now - state.lastActiveAtMs >= TIMEOUT
  ) {
    state.sessionId = uuid();
    state.gaSessionId = Math.floor(now / 1000);
    state.sessionStartedAtMs = now;
    state.sessionAttribution = cleanAttribution(attribution);
    state.visitNumber = Math.max(0, Number(state.visitNumber) || 0) + 1;
  }
  state.lastActiveAtMs = now;
  return state;
}
function testTraffic() {
  if(window.location.hostname!=='beanywhere.app')return true;
  try {
    if(new URL(window.location.href).searchParams.get('ba_test')==='1')sessionStorage.setItem('beanywhere-analytics-test','1');
    return sessionStorage.getItem('beanywhere-analytics-test')==='1';
  }catch{return false;}
}
function identity() {
  const prior = read(KEY) || memory;
  // Session source is the current external visit, not the 30-day last-identifiable source.
  const url = new URL(window.location.href);
  const attribution = url.searchParams.has("ba_at")
    ? directAttribution()
    : captureAttribution({
        url: window.location.href,
        referrer: document.referrer,
        now: Date.now(),
      });
  memory = nextIdentity(prior, {
    now: Date.now(),
    uuid: () => crypto.randomUUID(),
    attribution,
  });
  save(KEY, memory);
  return memory;
}
export function analyticsContext() {
  if (!analyticsAllowed())
    return { enabled: false, version: ANALYTICS_VERSION };
  const state = identity();
  return {
    enabled: true,
    version: ANALYTICS_VERSION,
    clientId: state.clientId,
    sessionId: state.sessionId,
    gaSessionId: state.gaSessionId,
    firstSeenAtMs: state.firstSeenAtMs,
    firstAttribution: state.firstAttribution,
    sessionAttribution: state.sessionAttribution,
    attribution: currentAttribution(),
  };
}
function gtag(...args) {
  window.dataLayer ??= [];
  window.dataLayer.push(arguments);
}
function load() {
  if (loaded || !analyticsAllowed()) return;
  loaded = true;
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("js", new Date());
  const state = identity();
  configureSession(state);
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  script.onerror = () => {
    loaded = false;
  };
  document.head.append(script);
}
function configureSession(state) {
  const session = state.sessionAttribution || directAttribution();
  configuredSession = state.sessionId;
  gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
    client_id: state.clientId,
    session_id: state.gaSessionId,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 365 * 86400,
    page_location: "https://beanywhere.app" + safePage(window.location.href),
    page_title: "BeAnywhere " + safePage(window.location.href),
    page_referrer: safeReferrer(),
    ignore_referrer: /(^|\.)stripe\.com$/.test(referrerHost()),
    // These defaults also cover Google's automatic session/engagement events.
    is_test: testTraffic() ? 1 : 0,
    session_source: session.source,
    session_medium: session.medium,
    session_campaign: session.campaign,
    // Campaign settings belong to the stream configuration, leaving room for
    // action metadata within Google's per-event parameter limit.
    campaign_source: session.source === "direct" ? "(direct)" : session.source,
    campaign_medium: session.medium === "none" ? "(none)" : session.medium,
    campaign_name: session.campaign,
    campaign_content: session.content,
  });
}
function referrerHost() {
  try {
    return new URL(document.referrer).hostname;
  } catch {
    return "";
  }
}
function safeReferrer() {
  const host = referrerHost();
  return host && /^[a-z0-9.-]{1,253}$/i.test(host)
    ? "https://" + host + "/"
    : "";
}
export function trackWeb(name, params = {}, eventId = crypto.randomUUID()) {
  if (!EVENTS.has(name)) return;
  if (!initialized) {
    if (starting && analyticsPreference() !== false && earlyEvents.length < 100)
      earlyEvents.push({ name, params: safeParams(params), eventId });
    return;
  }
  if (!analyticsAllowed()) return;
  try {
    load();
    const state = identity(),
      last = currentAttribution(),
      session = state.sessionAttribution || directAttribution();
    if (configuredSession !== state.sessionId) configureSession(state);
    const values = {
      ...safeParams(params),
      event_id: eventId,
      session_id: state.gaSessionId,
      release: ANALYTICS_VERSION,
      page_location: "https://beanywhere.app" + safePage(window.location.href),
      page_title: "BeAnywhere " + safePage(window.location.href),
      page_referrer: safeReferrer(),
      source: last.source,
      medium: last.medium,
      campaign: last.campaign,
      content: last.content,
      code: last.code,
      first_source: state.firstAttribution.source,
      first_medium: state.firstAttribution.medium,
      first_campaign: state.firstAttribution.campaign,
      session_source: session.source,
      session_medium: session.medium,
      session_campaign: session.campaign,
      is_test: testTraffic() ? 1 : 0,
    };
    if (name === "engagement_tick")
      values.engagement_time_msec = Math.round(Number(params.durationMs) || 0);
    gtag("event", name, values);
  } catch {
    /* Measurement must never stop the product. */
  }
}
export function setAnalyticsAllowed(enabled) {
  save(CHOICE, !!enabled);
  window["ga-disable-" + MEASUREMENT_ID] = !analyticsAllowed();
  if (!enabled) {
    outbox.clear();
    earlyEvents.length = 0;
    earlyStudioEvents.length = 0;
    if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.trim().split("=")[0];
      if (/^_ga($|_)/.test(name))
        for (const domain of [
          "",
          "; domain=beanywhere.app",
          "; domain=.beanywhere.app",
        ])
          document.cookie = name + "=; Max-Age=0; path=/" + domain;
    }
  } else if (analyticsAllowed()) {
    if (loaded) gtag("consent", "update", { analytics_storage: "granted" });
    else load();
  }
  Promise.resolve(preferenceListener?.(analyticsAllowed())).catch(() => {});
  window.dispatchEvent(new Event("beanywhere-analytics-choice"));
}
export function onAnalyticsPreference(fn) {
  preferenceListener = fn;
}
// Backend queue supplements selected Studio events. Bounded, stable IDs, original time, retries.
const QUEUE = "beanywhere-web-event-outbox-v1";
const outbox = createEventOutbox({
  read: () => read(QUEUE),
  write: (rows) => save(QUEUE, rows),
  allowed: analyticsAllowed,
});
export function setEventTransport(fn) {
  outbox.setTransport(fn);
}
export function queueStudioEvent(name, params, eventId = crypto.randomUUID()) {
  if (!initialized) {
    if (
      starting &&
      analyticsPreference() !== false &&
      earlyStudioEvents.length < 100
    )
      earlyStudioEvents.push({ name, params, eventId });
    return;
  }
  if (!analyticsAllowed()) return;
  const context = analyticsContext();
  outbox.enqueue({
    id: eventId,
    name,
    params: { ...params, source: "web_studio", sessionId: context.sessionId },
    at: Date.now(),
  });
}
const flushEvents = () => outbox.flush();
let starting = false, policyCheckedAt=0;
async function refreshPolicy() {
  const before=analyticsAllowed();
  try {
    const response=await fetch('https://us-central1-bethere-3d7de.cloudfunctions.net/getWebAnalyticsPolicy', {credentials:'omit',signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw new Error('Unavailable');
    const value=await response.json();
    policy={available:value.available===true,mode:value.mode==='automatic'?'automatic':'choice'};
    policyCheckedAt=Date.now();
    if(!initialized)startAnalytics();
  }catch{
    policy={available:false,mode:'choice'};earlyEvents.length=0;earlyStudioEvents.length=0;
  }
  window['ga-disable-'+MEASUREMENT_ID]=!analyticsAllowed();
  if(before!==analyticsAllowed()) {
    if(loaded)gtag('consent','update',{analytics_storage:analyticsAllowed()?'granted':'denied'});
    if(analyticsAllowed()){load();void flushEvents();}
    else outbox.clear();
    window.dispatchEvent(new Event('beanywhere-analytics-choice'));
  }
}
export function initAnalytics({enabled=true}={}) {
  if(initialized||starting||!enabled||typeof window==='undefined')return;
  starting=true;void refreshPolicy();
  const refresh=()=>{if(document.visibilityState==='visible' && Date.now()-policyCheckedAt>=300000)void refreshPolicy();};
  setInterval(refresh,300000);document.addEventListener('visibilitychange',refresh);window.addEventListener('online',refresh);
}
function startAnalytics() {
  if (initialized) return;
  initialized = true;
  window["ga-disable-" + MEASUREMENT_ID] = !analyticsAllowed();
  let measuring = analyticsAllowed();
  let focusedAt =
    measuring && document.visibilityState === "visible" ? performance.now() : 0;
  const engagement = () => {
    const now = performance.now();
    if (focusedAt && document.visibilityState === "visible")
      trackWeb("engagement_tick", {
        durationMs: Math.min(30000, now - focusedAt),
      });
    focusedAt = analyticsAllowed() && document.visibilityState === "visible" ? now : 0;
  };
  const page = () => {
    if (!analyticsAllowed()) return;
    const next = safePage(window.location.href);
    if (next !== lastPage) {
      engagement();
      lastPage = next;
      trackWeb("page_view", {
        surface: next.startsWith("/studio") ? "studio" : "storefront",
      });
    }
  };
  window.addEventListener("beanywhere-analytics-choice", () => {
    const allowed = analyticsAllowed();
    if (allowed === measuring) return;
    measuring = allowed;
    // Start a measured visit when collection begins; never include the earlier
    // opted-out interval in engagement or silently skip this page's funnel entry.
    focusedAt = allowed && document.visibilityState === "visible" ? performance.now() : 0;
    lastPage = "";
    if (allowed) page();
  });
  page();
  for (const event of earlyEvents.splice(0))
    trackWeb(event.name, event.params, event.eventId);
  for (const event of earlyStudioEvents.splice(0))
    queueStudioEvent(event.name, event.params, event.eventId);
  window.dispatchEvent(new Event("beanywhere-analytics-choice"));
  window.addEventListener("hashchange", page);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (focusedAt)
        trackWeb("engagement_tick", {
          durationMs: Math.min(30000, performance.now() - focusedAt),
        });
      focusedAt = 0;
    } else {
      focusedAt = analyticsAllowed() ? performance.now() : 0;
      void flushEvents();
    }
  });
  window.addEventListener("pagehide", () => {
    if (focusedAt)
      trackWeb("engagement_tick", {
        durationMs: Math.min(30000, performance.now() - focusedAt),
      });
    focusedAt = 0;
  });
  window.addEventListener("online", () => void flushEvents());
  window.addEventListener("storage", (event) => {
    if (event.key === CHOICE) {
      window["ga-disable-" + MEASUREMENT_ID] = !analyticsAllowed();
      if (!analyticsAllowed()) {
        outbox.clear();
        if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
      } else {
        if (loaded) gtag("consent", "update", { analytics_storage: "granted" });
        load();
      }
      window.dispatchEvent(new Event("beanywhere-analytics-choice"));
    }
  });
  setInterval(engagement, 30000);
  const depths = new Set();
  window.addEventListener(
    "scroll",
    () => {
      const range = document.documentElement.scrollHeight - innerHeight;
      if (range <= 0) return;
      const p = (100 * scrollY) / range;
      for (const d of [25, 50, 75, 90])
        if (p >= d && !depths.has(lastPage + d)) {
          depths.add(lastPage + d);
          trackWeb("scroll_depth", { percent: d });
        }
    },
    { passive: true },
  );
  window.addEventListener("error", () =>
    trackWeb("web_error", { error_code: "runtime_error" }),
  );
  window.addEventListener("unhandledrejection", () =>
    trackWeb("web_error", { error_code: "unhandled_rejection" }),
  );
  const vital = (metric) =>
    trackWeb(
      "web_vital",
      { metric: metric.name.toLowerCase(), value: metric.value },
      metric.id,
    );
  for (const watch of [onCLS, onINP, onLCP, onFCP, onTTFB])
    try {
      watch(vital);
    } catch {}
}
