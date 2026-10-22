import { createEventOutbox, createPersistentEventStore } from "./event-outbox.js";
// Shared public-site / Studio measurement. No form values, raw URLs, email or photo data.
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";
import {
  captureAttribution,
  currentAttribution,
  directAttribution,
} from "./acquisition.js";
export const MEASUREMENT_ID = "G-2VT9EWH1B5";
export const ANALYTICS_VERSION = "web-20261021-12";
const KEY = "beanywhere-measurement-v1";
const CHOICE = "beanywhere-analytics-choice";
const TIMEOUT = 30 * 60000;
const YEAR = 365 * 86400000;
const EVENTS = new Set(
  "page_view view_item_list view_item select_item cta_clicked styling_selected style_direction_selected faq_opened scroll_depth engagement_tick web_vital web_error pack_opened screen_view upload_screen_viewed reference_selection_started reference_selection_completed reference_selection_failed upload_started upload_completed upload_failed consent_completed checkout_viewed begin_checkout purchase_initiated purchase_failed checkout_error payment_return purchase_status library_viewed library_failed gallery_opened gallery_lookup_started gallery_lookup_completed gallery_lookup_failed delivery_email_submitted delivery_email_changed results_revealed results_completed download_started photo_saved save_all download_failed save_all_partial reshoot_requested reshoot_accepted reshoot_failed slot_retry support_opened instagram_opened outbound_clicked privacy_opened".split(
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
      out[name] = name === "duration_ms" ? Math.round(value) : value;
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
const EARLY = "beanywhere-analytics-pending-v1";
const EARLY_STUDIO = "beanywhere-studio-pending-v1";
function pendingRead(key = EARLY) {
  try { return JSON.parse(window.sessionStorage.getItem(key) || "[]"); } catch { return []; }
}
function pendingSave() {
  try { window.sessionStorage.setItem(EARLY, JSON.stringify(earlyEvents.slice(-100))); } catch {}
  try { window.sessionStorage.setItem(EARLY_STUDIO, JSON.stringify(earlyStudioEvents.slice(-100))); } catch {}
}
const earlyEvents = [];
const eventContexts = new Map();
function eventSnapshot(name) {
  return { at: Date.now(), pagePath: safePage(window.location.href), referrer: safeReferrer(),
    attribution: currentAttribution(), isTest: testTraffic(), activePage: document.visibilityState === "visible" && document.hasFocus(),
    arrival: new URL(window.location.href).searchParams.has("ba_at") ? directAttribution()
      : captureAttribution({ url: window.location.href, referrer: document.referrer }),
    // Capture an existing browser's context before another tab can advance it.
    // A temporary policy fetch failure pauses delivery, not the local visit
    // clock. New identities still wait for collection permission.
    ...(analyticsAllowed() ? { context: analyticsContext({ active: false }) } : (memory || ownerBrowserId()) ? {context:{...identity({
      active: !["web_vital", "web_error"].includes(name) && document.visibilityState === "visible",
    })}} : {}) };
}
function rememberEarly(name, params, eventId, navigationReferrer) {
  if (!starting || policyDenied || analyticsPreference() === false || earlyEvents.length >= 100) return;
  const snapshot = eventSnapshot(name);
  if (navigationReferrer !== undefined) snapshot.referrer = navigationReferrer;
  earlyEvents.push({ name, params: safeParams(params), eventId, snapshot });
  pendingSave();
}
const earlyStudioEvents = [];
let policy = { available: false, mode: "choice" };
let policyDenied = false;
let memory,
  initialized = false,
  loaded = false,
  configuredSession = "",
  configuredPage = "",
  configuredReferrer = "",
  pageReferrer = null,
  lastPage = "",
  lastPageSession = "",
  arrivalUsed = false,
  preferenceListener;
const depths = new Set();
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
// Used only by the explicit owner setup page. No Analytics requests or Studio
// sign-in are needed to identify this browser, and no IP/hardware ID is used.
export function ownerBrowserId() {
  const value = read(KEY);
  return value && /^\d{1,16}\.\d{10}$/.test(value.clientId || "") &&
    value.firstSeenAtMs > 0 && value.firstSeenAtMs <= Date.now() &&
    Date.now() - value.firstSeenAtMs < YEAR ? value.clientId : null;
}
export function prepareOwnerBrowser() {
  const state = nextIdentity(read(KEY), { now: Date.now(), uuid: () => crypto.randomUUID(), attribution: directAttribution() });
  // Refuse an ephemeral ID that would stop matching as soon as this page closes.
  window.localStorage.setItem(KEY, JSON.stringify(state));
  if (ownerBrowserId() !== state.clientId) throw new Error("Browser storage is unavailable. Use a regular browser with storage enabled.");
  return state.clientId;
}
let volatileTestTraffic = false;
function testTraffic() {
  if(window.location.hostname!=='beanywhere.app')return true;
  // An explicit test link remains a test even when browser storage throws.
  // Retain the marker in this document after client-side URL cleanup as well.
  volatileTestTraffic ||= new URL(window.location.href).searchParams.get('ba_test')==='1';
  try {
    if(volatileTestTraffic)sessionStorage.setItem('beanywhere-analytics-test','1');
    volatileTestTraffic ||= sessionStorage.getItem('beanywhere-analytics-test')==='1';
  }catch{}
  return volatileTestTraffic;
}
function identity({ active = true } = {}) {
  // Deferred performance/error callbacks describe the viewed page; they must
  // not keep a hidden tab's session alive or manufacture a returning visit.
  if (!active && memory) return memory;
  const prior = read(KEY) || memory;
  // Session source is the current external visit, not the 30-day last-identifiable source.
  const url = new URL(window.location.href);
  const attribution = arrivalUsed || url.searchParams.has("ba_at")
    ? directAttribution()
    : captureAttribution({
        url: window.location.href,
        referrer: document.referrer,
        now: Date.now(),
      });
  // A tab returning from inactivity is not another click on its original URL.
  // Only the first identity lookup in a newly loaded document consumes arrival data.
  arrivalUsed = true;
  memory = nextIdentity(prior, {
    now: Date.now(),
    uuid: () => crypto.randomUUID(),
    attribution,
  });
  save(KEY, memory);
  if (prior?.sessionId !== memory.sessionId)
    window.dispatchEvent(new Event("beanywhere-analytics-session"));
  return memory;
}
export function analyticsContext({ active = true } = {}) {
  if (!analyticsAllowed())
    return { enabled: false, version: ANALYTICS_VERSION };
  const state = identity({ active });
  return {
    enabled: true,
    isTest: testTraffic(),
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
function load(state) {
  if (loaded || !analyticsAllowed()) return;
  loaded = true;
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("js", new Date());
  configureSession(state || identity());
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  script.onerror = () => {
    loaded = false;
  };
  document.head.append(script);
}
function configureSession(state, pagePath = safePage(window.location.href), referrer = pageReferrer ?? safeReferrer()) {
  const session = state.sessionAttribution || directAttribution();
  configuredSession = state.sessionId;
  configuredPage = pagePath;
  configuredReferrer = referrer;
  gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
    client_id: state.clientId,
    session_id: state.gaSessionId,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 365 * 86400,
    page_location: "https://beanywhere.app" + pagePath,
    page_title: "BeAnywhere " + pagePath,
    page_referrer: referrer,
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
  emitWeb(name, params, eventId);
}
// Only the timer supplies a prior-page snapshot. Event callers cannot override
// safe URLs or attach arbitrary metadata to an event.
function emitWeb(name, params, eventId = crypto.randomUUID(), snapshot) {
  if (!EVENTS.has(name)) return;
  if (!initialized) {
    if (starting && analyticsPreference() !== false && earlyEvents.length < 100)
      rememberEarly(name, params, eventId);
    return;
  }
  if (!analyticsAllowed()) { if (!policy.available) rememberEarly(name,params,eventId); return; }
  try {
    const state = snapshot?.context || identity({ active: !["web_vital", "web_error"].includes(name) &&
      (document.visibilityState === "visible" || name === "engagement_tick") }),
      last = snapshot?.attribution || currentAttribution(),
      session = state.sessionAttribution || directAttribution();
    load(state);
    const pagePath = snapshot?.pagePath ?? safePage(window.location.href);
    // Pending page views have distinct IDs from real navigations, including
    // reloads of the same URL. Only suppress repeat callbacks for the live page.
    if (name === "page_view" && !snapshot && lastPage === pagePath && lastPageSession === state.sessionId)
      return;
    const startsPage = name === "page_view" || (!snapshot &&
      lastPageSession !== state.sessionId && document.visibilityState === "visible");
    let referrer = snapshot?.referrer ?? pageReferrer ?? safeReferrer();
    if (!snapshot && lastPage && lastPage !== pagePath) referrer = "https://beanywhere.app" + lastPage;
    else if (startsPage && lastPageSession && lastPageSession !== state.sessionId) referrer = "";
    if (startsPage) pageReferrer = referrer;
    if ((configuredSession !== state.sessionId || configuredPage !== pagePath || configuredReferrer !== referrer))
      configureSession(state, pagePath, referrer);
    const values = {
      event_id: eventId,
      session_id: state.gaSessionId,
      release: ANALYTICS_VERSION,
      page_location: "https://beanywhere.app" + pagePath,
      occurred_at_ms: snapshot?.at || Date.now(),
      event_origin: "browser",
      active_page: (snapshot?.activePage ?? (document.visibilityState === "visible" && document.hasFocus())) ? 1 : 0,
      page_referrer: referrer,
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
      is_test: (snapshot?.isTest ?? testTraffic()) ? 1 : 0,
    };
    if (startsPage) {
      lastPage = pagePath;
      lastPageSession = state.sessionId;
      depths.clear();
      // A resumed session must have a visible entry page before its actions.
      if (name !== "page_view") {
        const pageId = crypto.randomUUID();
        const pageParams = { surface: pagePath.startsWith("/studio") ? "studio" : "storefront" };
        gtag("event", "page_view", { ...values, event_id: pageId, ...pageParams });
        journalEvent("page_view", pageParams, pageId, state, last, pagePath, referrer, values.occurred_at_ms, values.is_test, values.active_page);
      }
    }
    // Google maintains engagement_time_msec itself. Our visible-page timer uses
    // duration_ms so it cannot add the same interval to Google's clock twice.
    gtag("event", name, { ...safeParams(params), ...values });
    journalEvent(name, safeParams(params), eventId, state, last, pagePath, referrer, values.occurred_at_ms, values.is_test, values.active_page);
  } catch {
    /* Measurement must never stop the product. */
  }
}
export function setAnalyticsAllowed(enabled) {
  save(CHOICE, !!enabled);
  if (enabled && analyticsAllowed()) policyDenied=false;
  if (enabled && !initialized && analyticsAllowed()) startAnalytics();
  window["ga-disable-" + MEASUREMENT_ID] = !analyticsAllowed();
  if (!enabled) {
    outbox.clear();
    journal.clear();
    earlyEvents.length = 0;
    earlyStudioEvents.length = 0;
    pendingSave();
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
function durableQueue(key) {
  const saved=createPersistentEventStore({prefix:key,storage,legacy:()=>read(key),clearLegacy:()=>save(key,[])});
  return createEventOutbox({read:saved.read,put:saved.put,remove:saved.remove,clearStorage:saved.clear,allowed:analyticsAllowed});
}
const outbox = durableQueue(QUEUE);
// Independent browser observations; never purchase authority. Keep original IDs/time
// across page navigation, temporary offline periods, and Google being blocked.
const JOURNAL = "beanywhere-journey-outbox-v1";
const journal = durableQueue(JOURNAL);
function journalEvent(name, params, id, state, attribution, pagePath, referrer, at, isTest, activePage) {
  if (!UUID.test(id) || name === "web_vital") return;
  const context = { enabled: true, isTest: !!isTest, version: ANALYTICS_VERSION, clientId: state.clientId,
      sessionId: state.sessionId, gaSessionId: state.gaSessionId, firstSeenAtMs: state.firstSeenAtMs,
      firstAttribution: state.firstAttribution, sessionAttribution: state.sessionAttribution, attribution };
  eventContexts.set(id, { context, at });
  if (eventContexts.size > 100) eventContexts.delete(eventContexts.keys().next().value);
  journal.enqueue({ id, name, params, at, pagePath, referrer, isTest: !!isTest, activePage: !!activePage, context, explicitConsent: analyticsPreference() === true });
}
function connectJournal() {
  journal.setTransport(async row => {
    const response = await fetch('https://us-central1-bethere-3d7de.cloudfunctions.net/collectWebJourney', {
      method: 'POST', credentials: 'omit', keepalive: true,
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(row), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Measurement deferred');
    return response.json();
  });
}
export function setEventTransport(fn) {
  outbox.setTransport(fn);
}
export function queueStudioEvent(name, params, eventId = crypto.randomUUID(), at = Date.now()) {
  if (!initialized || !policy.available) {
    if (
      starting && !policyDenied &&
      analyticsPreference() !== false &&
      earlyStudioEvents.length < 100
    )
      earlyStudioEvents.push({ name, params, eventId, at,
        context: memory ? { ...memory, enabled: true, version: ANALYTICS_VERSION,
          isTest: testTraffic(), attribution: currentAttribution() } : null });
    pendingSave();
    return;
  }
  emitStudioEvent(name, params, eventId, at);
}
function emitStudioEvent(name, params, eventId, at, deferredContext) {
  if (!analyticsAllowed()) return;
  const saved = eventContexts.get(eventId);
  const context = saved?.context || deferredContext || analyticsContext({ active: false });
  outbox.enqueue({
    id: eventId,
    name,
    params: { ...params, source: "web_studio", sessionId: context.sessionId, isTest: params.isTest === true || context.isTest === true || testTraffic() },
    at: saved?.at || at, context,
  });
}
const flushEvents = () => Promise.all([outbox.flush(), journal.flush()]);
let starting = false, policyCheckedAt=0, policyRefreshing=false;
async function refreshPolicy() {
  if (policyRefreshing) return;
  policyRefreshing=true;
  const before=analyticsAllowed();
  try {
    const response=await fetch('https://us-central1-bethere-3d7de.cloudfunctions.net/getWebAnalyticsPolicy', {credentials:'omit',signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw new Error('Unavailable');
    const value=await response.json();
    policy={available:value.available===true,mode:value.mode==='automatic'?'automatic':'choice'};
    policyCheckedAt=Date.now();
    policyDenied=!analyticsAllowed();
    if(analyticsAllowed()) { if(!initialized)startAnalytics(); else replayPending(); }
    if(!analyticsAllowed()) { earlyEvents.length=0; earlyStudioEvents.length=0; pendingSave(); outbox.clear(); journal.clear(); }
  }catch{
    // A temporary policy/network failure pauses sending. It is not withdrawal.
    policy={available:false,mode:'choice'};
    setTimeout(()=>void refreshPolicy(),30000);
  }
  policyRefreshing=false;
  window['ga-disable-'+MEASUREMENT_ID]=!analyticsAllowed();
  if(before!==analyticsAllowed()) {
    if(loaded)gtag('consent','update',{analytics_storage:analyticsAllowed()?'granted':'denied'});
    if(analyticsAllowed()){load(memory);void flushEvents();}
    // Queues survive a transient fetch failure; an explicit policy denial clears above.
    window.dispatchEvent(new Event('beanywhere-analytics-choice'));
  }
}
export function initAnalytics({enabled=true}={}) {
  if(initialized||starting||!enabled||typeof window==='undefined')return;
  starting=true;
  if (analyticsPreference() !== false) {
    const pending = pendingRead();
    for (const row of Array.isArray(pending) ? pending.slice(-100) : []) {
      if (EVENTS.has(row?.name) && UUID.test(row.eventId || '') && row.snapshot?.at > Date.now()-86400000 && row.snapshot.at <= Date.now())
        earlyEvents.push({ ...row, params: safeParams(row.params) });
    }
    const studio = pendingRead(EARLY_STUDIO);
    for (const row of Array.isArray(studio) ? studio.slice(-100) : []) {
      if (/^[a-z][a-z0-9_]{0,63}$/.test(row?.name || '') && UUID.test(row.eventId || '') &&
          Number.isSafeInteger(row.at) && row.at > Date.now()-86400000 && row.at <= Date.now()+300000 &&
          row.params && typeof row.params === 'object' && !Array.isArray(row.params))
        earlyStudioEvents.push(row);
    }
    rememberEarly('page_view', { surface: safePage(window.location.href).startsWith('/studio') ? 'studio' : 'storefront' }, crypto.randomUUID());
  } else { earlyEvents.length=0; earlyStudioEvents.length=0; pendingSave(); }
  window.addEventListener('hashchange',()=>{
    if (initialized && policy.available) return;
    const next = safePage(window.location.href);
    const previous = [...earlyEvents].reverse().find(event => event.name === 'page_view')?.snapshot.pagePath || lastPage;
    if (next === previous) return;
    rememberEarly('page_view', {surface:next.startsWith('/studio')?'studio':'storefront'},crypto.randomUUID(),
      previous ? 'https://beanywhere.app' + previous : undefined);
  });
  void refreshPolicy();
  const refresh=()=>{if(document.visibilityState==='visible' && Date.now()-policyCheckedAt>=300000)void refreshPolicy();};
  setInterval(refresh,300000);document.addEventListener('visibilitychange',refresh);window.addEventListener('online',refresh);
}
function replayPending() {
  const pending = earlyEvents.splice(0);
  pendingSave();
  // Resolve the timeline before emitting; loading Google must not move the
  // shared session's activity clock between two queued historical actions.
  let replayState = read(KEY) || memory;
  for (const event of pending) {
    const snapshot = event.snapshot;
    if (!snapshot.context) {
      replayState = nextIdentity(replayState, {
        now: Math.max(snapshot.at, replayState?.lastActiveAtMs || 0),
        uuid:()=>crypto.randomUUID(), attribution:snapshot.arrival,
      });
      snapshot.context = { ...replayState };
    }
  }
  if (pending.length && replayState) { memory=replayState; save(KEY,replayState); arrivalUsed=true; }
  for (const event of pending) emitWeb(event.name,event.params,event.eventId,event.snapshot);
  // The authenticated copy must resume after every successful policy retry,
  // including retries after startup. Reuse the journal's exact context/time.
  for (const event of earlyStudioEvents.splice(0))
    emitStudioEvent(event.name,event.params,event.eventId,event.at,event.context);
  pendingSave();
}
function startAnalytics() {
  if (initialized) return;
  initialized = true;
  window["ga-disable-" + MEASUREMENT_ID] = !analyticsAllowed();
  let measuring = analyticsAllowed();
  let cachedPage = false;
  const inFocus = () => document.visibilityState === "visible" && document.hasFocus();
  let focusedAt = measuring && inFocus() ? performance.now() : null;
  const engagement = (resume = true) => {
    const now = performance.now();
    if (focusedAt !== null && analyticsAllowed() && lastPage) {
      const durationMs = Math.min(30000, Math.max(0, now - focusedAt));
      if (durationMs > 0) emitWeb("engagement_tick", { durationMs }, undefined,
        { pagePath: lastPage, referrer: pageReferrer, activePage: true });
    }
    focusedAt = resume && analyticsAllowed() && inFocus() ? now : null;
  };
  const page = () => {
    if (!analyticsAllowed()) return;
    const next = safePage(window.location.href);
    if (next !== lastPage || identity().sessionId !== lastPageSession) {
      if (lastPage) engagement();
      trackWeb("page_view", {
        surface: next.startsWith("/studio") ? "studio" : "storefront",
      });
    }
  };
  window.addEventListener("beanywhere-analytics-choice", () => {
    const allowed = analyticsAllowed();
    // An explicit denial starts a new measured page when permission returns.
    // A failed refresh only pauses delivery: keep the last actual page so
    // recovery cannot invent a page view. Check withdrawal even while paused.
    if (!allowed && (policy.available || analyticsPreference() === false)) lastPage = "";
    if (allowed === measuring) return;
    measuring = allowed;
    // Start a measured visit when collection begins; never include the earlier
    // opted-out interval in engagement or silently skip this page's funnel entry.
    focusedAt = allowed && inFocus() ? performance.now() : null;
    if (allowed && inFocus()) page();
  });
  connectJournal();
  replayPending();
  page();
  window.dispatchEvent(new Event("beanywhere-analytics-choice"));
  window.addEventListener("hashchange", page);
  const resume = () => {
    if (focusedAt === null && analyticsAllowed() && inFocus()) focusedAt = performance.now();
    if (!cachedPage) page();
    void flushEvents();
  };
  window.addEventListener("blur", () => engagement(false));
  window.addEventListener("focus", resume);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") engagement(false);
    else resume();
  });
  window.addEventListener("pagehide", (event) => {
    cachedPage = event.persisted;
    engagement(false);
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    cachedPage = false;
    focusedAt = analyticsAllowed() && inFocus() ? performance.now() : null;
    lastPage = "";
    page();
    void flushEvents();
  });
  window.addEventListener("online", () => void flushEvents());
  window.addEventListener("storage", (event) => {
    if (event.key === CHOICE) {
      window["ga-disable-" + MEASUREMENT_ID] = !analyticsAllowed();
      if (!analyticsAllowed()) {
        outbox.clear(); journal.clear(); earlyEvents.length=0; earlyStudioEvents.length=0; pendingSave();
        if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
      } else {
        if (loaded) gtag("consent", "update", { analytics_storage: "granted" });
        load();
      }
      window.dispatchEvent(new Event("beanywhere-analytics-choice"));
    }
  });
  setInterval(engagement, 30000);
  window.addEventListener(
    "scroll",
    () => {
      if (!analyticsAllowed() || document.visibilityState !== "visible") return;
      page();
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
