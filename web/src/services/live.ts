import { analyticsErrorCode } from "../lib/analytics-error";
import { analyticsContext, analyticsAllowed, analyticsPreference, setAnalyticsAllowed, onAnalyticsPreference, trackWeb, queueStudioEvent, setEventTransport } from "../../storefront/analytics.js";
import { openDB } from "idb";
import { currentAttribution, type Acquisition } from "../../storefront/acquisition.js";
import { LocalStudioService } from "./local";
import { packById } from "../lib/catalog";
import { validateDraft } from "../lib/domain";
import { galleryRefreshMessage, photoRetryState } from "../lib/gallery-state";
import type { CheckoutReview, Draft, DraftGuard, DraftUpdate, Photo, Shoot, StudioService, Styling } from "../lib/types";
import type { createFirebaseAdapter, NativeJobProjection, ReshootOperation, WebCheckout, GalleryPage } from "../../integration/firebase-adapter";

type API = ReturnType<typeof createFirebaseAdapter>;
type Attempt = {
  schemaVersion: 1; uid: string; key: string; review: CheckoutReview; email: string;
  attribution?: Acquisition; draft: Draft; uploadAttempt: string; uploadSessionId?: string; orderId?: string;
  settled?: "fulfilled" | "refunded";
};
const reviewKey = (review: CheckoutReview) =>
  `${review.checkoutKey}:${review.referenceVersion}:${review.wearsGlasses ? 1 : 0}`;
const result = (checkout: WebCheckout) => ({ kind: "payment" as const, orderId: checkout.orderId,
  url: checkout.checkoutUrl, jobId: checkout.jobId, state: checkout.state });

export function projectWebJob(job: NativeJobProjection & { id: string }, favorites: Record<string, boolean>): Shoot {
  const pack = packById(job.packId);
  return {
    id: job.id, packId: job.packId, styling: job.styling, styleId: job.styleId,
    createdAt: (job.createdAt?.seconds || 0) * 1000, reshootsLeft: Math.max(0, job.reshootsLeft || 0),
    checkoutKey: job.orderId || job.id, operationIds: [], sample: false,
    status: job.status, generationState: job.generationState,
    retryWindowEndsAtMs: job.retryWindowEndsAtMs,
    deliveryClosed: job.deliveryClosed === true || !!job.deliveryClosedAt,
    reshootsClosedReason: job.reshootsClosedReason, emailRequestState: job.emailRequestState,
    emailDeliveryOutcomeUnknown: job.emailDeliveryOutcomeUnknown,
    emailDeliveryFeedback: !job.emailDeliveryFeedbackRequestId || job.emailDeliveryFeedbackRequestId === job.emailLatestRequestId
      ? job.emailDeliveryFeedback : undefined,
    deliveryEmail: job.deliveryEmail || job.emailRequestTo,
    manualRetriesPerSlot: job.manualRetriesPerSlot ?? 1,
    retriesClosedReason: job.retriesClosedReason, generationLimitReached: job.generationLimitReached,
    automaticWorkPending: job.automaticWorkPending || job.recovering || !!job.generationClaimId || !!job.recoveryClaimId,
    photos: (job.slots || []).map(slot => ({
      slotId: slot.slotId, sceneId: slot.sceneId, take: slot.take,
      label: pack?.scenes.find(scene => scene.sceneId === slot.sceneId)?.label || "Your photo",
      url: "", path: slot.path, status: slot.status,
      reshooting: slot.reshooting === true || (!!slot.claimId && typeof slot.prevPath === "string"),
      retrying: slot.retrying === true || (!!slot.claimId && typeof slot.prevPath !== "string"),
      hasActiveClaim: slot.hasActiveClaim || !!slot.claimId, manualAttempts: slot.manualAttempts || 0,
      favorite: favorites[`${job.id}/${slot.slotId}`] === true,
      revision: 0,
      // There is no simulated completion clock in a paid gallery.
      readyAt: slot.status === "done" && !!slot.path && job.readableOutputPaths?.includes(slot.path) ? 0 : Infinity,
    })),
  };
}

/** Drafts, identity, and payment checkpoints have separate stores. Resetting a draft never
 * discards a payment retry key or changes the identity that owns a paid gallery. */
export class LiveStudioService implements StudioService {
  readonly mode = "live" as const;
  private apiPromise?: Promise<API>;
  private observedOrders = new Set<string>();
  track(name: string, params: Record<string, string | number | boolean>, stableEventId?: string) {
    const eventId=stableEventId || crypto.randomUUID();
    trackWeb(name,params,eventId);
    // Business events also keep authenticated ownership; public journey records use browser IDs.
    const backendNames=new Set(["pack_opened","checkout_viewed","upload_screen_viewed","reference_selection_started","reference_selection_completed","upload_started","upload_completed","upload_failed","consent_completed","purchase_initiated","purchase_completed","purchase_failed","photo_saved","save_all","download_failed","save_all_partial","library_viewed","library_failed","results_revealed","results_completed","slot_retry","support_opened"]);
    if(!backendNames.has(name))return;
    const clean={...params};
    // Email-recovered galleries never acquire the original account's identity.
    if(clean.jobId && !this.jobs.some(job=>job.id===clean.jobId)) { delete clean.jobId; delete clean.slotId; delete clean.sceneId; clean.restored=true; }
    queueStudioEvent(name,clean,eventId);
    void this.api().catch(()=>{});
  }
  private db?: ReturnType<typeof openDB>;
  private listeners = new Set<() => void>();
  private jobs: (NativeJobProjection & { id: string })[] = [];
  private recoveredJobs: (NativeJobProjection & { id: string })[] = [];
  private recoveryEmail = "";
  private recoveryEpoch = 0;
  private galleryRefresh?: Promise<boolean>;
  private galleryRefreshError = "";
  private galleryKnown = false;
  private nextGalleryRefreshAt = 0;
  private gallerySnapshot = "";
  private galleryChangedAt = 0;
  private settlingGalleries?: Promise<void>;
  private allJobs() {
    return [...new Map([...this.recoveredJobs, ...this.jobs].map(job => [job.id, job])).values()]
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }
  private favorites: Record<string, boolean> = {};
  private watchError: Error | null = null;
  private watching?: Promise<void>;
  private checkoutInFlight?: Promise<ReturnType<typeof result>>;
  private checkoutAbort?: AbortController;
  private retries = new Map<string, Promise<void>>();
  private local: LocalStudioService;
  constructor(private connect: () => Promise<API>, private namespace = "beanywhere-web-live-v1") {
    this.local = new LocalStudioService(`${namespace}-drafts`);
    this.local.subscribe(() => this.changed());
  }
  private api() {
    return this.apiPromise ??= this.connect().then(api=>{
      setEventTransport(row=>api.recordEvent(row.name,row.params,row.id,row.at,row.context));
      if(api.getAnalyticsProfile) {
        let syncing=false,again=false,retry:ReturnType<typeof setTimeout>|undefined,failures=0,observedSession='';
        const sync=async()=>{
          if(syncing){again=true;return;}
          syncing=true;clearTimeout(retry);
          try {
            const profile=await api.getAnalyticsProfile();
            const desired=analyticsPreference();
            if(desired===null && profile.analyticsAvailable && !profile.analytics)setAnalyticsAllowed(false);
            else if(desired!==null && (desired===false || profile.analyticsAvailable) && profile.analytics!==desired) {
              const result=await api.setAnalyticsPreference(desired,profile.preferenceRevisions.analytics);
              if(!result.applied && result.analytics!==desired)throw new Error('Preference changed; retry.');
            }
            const context=analyticsContext({active:false});
            if(context.enabled && context.sessionId!==observedSession){
              const observed=await api.recordWebObservation({kind:"session",eventId:crypto.randomUUID(),context});
              if(observed.disposition==='accepted'||observed.disposition==='duplicate')observedSession=context.sessionId || '';
            }
            failures=0;
          }catch{
            failures++;retry=setTimeout(()=>void sync(),Math.min(300000,30000*failures));
          }finally{syncing=false;if(again){again=false;void sync();}}
        };
        onAnalyticsPreference(()=>void sync());
        window.addEventListener('online',()=>void sync());
        window.addEventListener('beanywhere-analytics-choice',()=>void sync());
        window.addEventListener('beanywhere-analytics-session',()=>void sync());
        void sync();
      }
      return api;
    }).catch(error => { this.apiPromise = undefined; throw error; });
  }
  private database() {
    return this.db ??= openDB(`${this.namespace}-operations`, 1, {
      upgrade(db) { db.createObjectStore("attempts"); db.createObjectStore("orders");
        db.createObjectStore("favorites"); db.createObjectStore("reshoots"); },
    });
  }
  private changed() { for (const fn of this.listeners) { try { fn(); } catch {} } }
  subscribe(fn: () => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  private async startWatching() {
    return this.watching ??= (async () => {
      const api = await this.api();
      this.favorites = (await (await this.database()).get("favorites", api.session.uid)) || {};
      // Initial server read lets permission/index failures reach the UI rather than an empty gallery.
      this.jobs = await api.listJobs();
      // Email recovery is independent of this browser's owned galleries and checkout.
      // Keep its failure visible without blocking the owner listener or the whole studio.
      await this.refreshGalleries().catch(() => {});
      await api.watchJobs(jobs => { this.jobs = jobs; this.watchError = null; this.changed(); },
        error => { this.jobs = []; this.watchError = error; this.changed(); });
    })().catch(error => { this.watching = undefined; throw error; });
  }
  async read() {
    await this.local.read();
    await this.startWatching();
    if (this.watchError) throw this.watchError;
    await this.settleGalleryPurchases();
    const state = await this.local.read();
    const api = await this.api();
    this.favorites = (await (await this.database()).get("favorites", api.session.uid)) || {};
    const attempts = await (await this.database()).getAll("attempts") as Attempt[];
    return { ...state, recoveryEmail: this.recoveryEmail, galleryRefreshError: this.galleryRefreshError,
      shoots: this.allJobs().filter(job => !!packById(job.packId))
      .map(job => {
        const shoot = projectWebJob(job, this.favorites);
        shoot.deliveryEmail ||= attempts.find(attempt => attempt.uid === api.session.uid && attempt.orderId === job.orderId)?.email;
        return shoot;
      }) };
  }
  private settleGalleryPurchases() {
    return this.settlingGalleries ??= (async () => {
      const draft = (await this.local.read()).draft;
      if (!draft) return;
      const api = await this.api();
      const orders = new Set(this.jobs.filter(job => job.uid === api.session.uid).map(job => job.orderId));
      const attempts = await (await this.database()).getAll("attempts") as Attempt[];
      for (const attempt of attempts) {
        if (attempt.uid === api.session.uid && !attempt.settled && attempt.orderId
            && reviewKey(attempt.review) === reviewKey(draft) && orders.has(attempt.orderId)) {
          // A gallery is a reason to check the receipt, never payment authority itself.
          // An unavailable receipt must not prevent an already-readable gallery opening.
          await this.payment(attempt.orderId).catch(() => {});
        }
      }
    })().finally(() => { this.settlingGalleries = undefined; });
  }
  private async galleryPages(first: GalleryPage) {
    const api = await this.api();
    const jobs = [...first.jobs];
    let cursor = first.nextCursor;
    const seen = new Set<string>();
    while (cursor) {
      if (seen.has(cursor) || seen.size >= 100) throw new Error("Please contact support to load the rest of your galleries.");
      seen.add(cursor);
      const page = await api.listWebGalleries(cursor);
      if (page.email !== first.email) throw new Error("Your gallery email changed. Try finding your photos again.");
      jobs.push(...page.jobs); cursor = page.nextCursor;
    }
    return { email: first.email, jobs };
  }
  async recoverGalleries(email: string) {
    this.track("gallery_lookup_started",{});
    const epoch = ++this.recoveryEpoch;
    this.galleryKnown = false; this.nextGalleryRefreshAt = 0;
    this.recoveredJobs = []; this.recoveryEmail = ""; this.changed();
    const result = await this.galleryPages(await (await this.api()).recoverGalleries(email.trim())).catch(error=>{this.track("gallery_lookup_failed",{reason:"unknown"});throw error;});
    if (epoch !== this.recoveryEpoch) throw new Error("Your gallery search changed. Try again.");
    this.rememberGalleries(result); this.changed();
    this.track("library_viewed", { count: result.jobs.length, restored: true });
    this.track("gallery_lookup_completed",{count:result.jobs.length});
    return result.jobs.length;
  }
  private rememberGalleries(result: { email: string; jobs: (NativeJobProjection & { id: string })[] }) {
    const now = Date.now();
    const snapshot = JSON.stringify(result);
    if (snapshot !== this.gallerySnapshot) this.galleryChangedAt = now;
    this.gallerySnapshot = snapshot;
    this.recoveredJobs = result.jobs; this.recoveryEmail = result.email;
    this.galleryKnown = true; this.galleryRefreshError = "";
    // Owned shoots already have a realtime listener. Poll recovered shoots quickly only
    // while work is progressing; an unchanged/stalled job must not poll all day.
    const owned = new Set(this.jobs.map(job => job.id));
    const active = result.jobs.some(job => !owned.has(job.id)
      && !["failed", "refunded"].includes(job.status)
      && (job.status === "developing" || job.automaticWorkPending || job.recovering
        || job.generationClaimId || job.recoveryClaimId
        || ["queued", "running", "retry-waiting", "recovery-owned", "stalled"].includes(job.generationState || "")
        || job.slots.some(slot => slot.hasActiveClaim || slot.claimId || slot.reshooting || slot.retrying)
        || ["waiting", "queued", "sending", "pending"].includes(job.emailRequestState || "")));
    this.nextGalleryRefreshAt = now + (active && now - this.galleryChangedAt < 300000 ? 15000 : 300000);
  }
  refreshGalleries(options: { background?: boolean } = {}) {
    if (this.galleryRefresh) return this.galleryRefresh;
    if (options.background && (Date.now() < this.nextGalleryRefreshAt
        || (this.galleryKnown && !this.recoveryEmail && !this.galleryRefreshError))) return Promise.resolve(false);
    const epoch = this.recoveryEpoch;
    return this.galleryRefresh = (async () => {
      const api = await this.api();
      // Optional for legacy adapters; the deployed web adapter always provides this.
      if (!api.listWebGalleries) return false;
      const result = await this.galleryPages(await api.listWebGalleries());
      if (epoch !== this.recoveryEpoch) return false;
      this.rememberGalleries(result);
      return true;
    })().catch(error => {
      // A failed connection is not a revoked gallery. Keep the last successful
      // result in place; downloads and reshoots still verify current access.
      const accessDenied = /^(?:functions\/)?(?:permission-denied|unauthenticated)$/.test(error?.code || "");
      if (accessDenied && epoch === this.recoveryEpoch && this.recoveredJobs.length) {
        this.recoveredJobs = []; this.changed();
      }
      if (epoch === this.recoveryEpoch) {
        this.galleryRefreshError = galleryRefreshMessage(error);
        const now = Date.now();
        // This quota resets at UTC midnight. An automatic loop cannot fix it.
        this.nextGalleryRefreshAt = /^(?:functions\/)?resource-exhausted$/.test(error?.code || "")
          ? (Math.floor(now / 86400000) + 1) * 86400000 + 1000 : now + 60000;
      }
      throw error;
    }).finally(() => { this.galleryRefresh = undefined; });
  }
  updateDraft(review: DraftGuard, patch: DraftUpdate) {
    if (patch.references || patch.wearsGlasses !== undefined || patch.consent === false) this.checkoutAbort?.abort();
    return this.local.updateDraft(review, patch);
  }
  async startDraft(packId: string, styling: Styling, styleId: string) {
    this.checkoutAbort?.abort();
    await this.startWatching();
    await this.settleGalleryPurchases();
    return this.local.startDraft(packId, styling, styleId);
  }
  setStyling(styling: Styling) { return this.local.setStyling(styling); }
  private async current(review: CheckoutReview, signal: AbortSignal) {
    if (signal.aborted) throw new Error("Checkout was cancelled. Review your selfies before continuing.");
    const draft = (await this.local.read()).draft;
    if (!draft || reviewKey(draft) !== reviewKey(review) || !draft.consent) {
      throw new Error("Your photos or permission changed. Review this shoot again.");
    }
    return draft;
  }
  private async checkpoint(attempt: Attempt, patch: Partial<Pick<Attempt, "uploadSessionId" | "orderId">>) {
    const db = await this.database();
    const tx = db.transaction(["attempts", "orders"], "readwrite");
    const saved = await tx.objectStore("attempts").get(attempt.key) as Attempt | undefined;
    if (!saved || saved.uid !== attempt.uid || saved.uploadAttempt !== attempt.uploadAttempt ||
        (saved.orderId && patch.orderId && saved.orderId !== patch.orderId) ||
        (saved.uploadSessionId && patch.uploadSessionId && saved.uploadSessionId !== patch.uploadSessionId)) {
      await tx.done; throw new Error("Checkout recovery could not be verified. Contact support before paying again.");
    }
    const next = { ...saved, ...patch,
      // After the server acknowledges an upload, recovery needs its ID, not another local copy.
      ...(patch.uploadSessionId ? { draft: { ...saved.draft, references: [] } } : {}),
    };
    await tx.objectStore("attempts").put(next, attempt.key);
    if (next.orderId) await tx.objectStore("orders").put(attempt.key, `${attempt.uid}/${next.orderId}`);
    await tx.done;
    return next;
  }
  checkout(review: CheckoutReview, email: string) {
    if (this.checkoutInFlight) return this.checkoutInFlight;
    const controller = new AbortController(); this.checkoutAbort = controller;
    return this.checkoutInFlight = this.runCheckout(review, email.trim(), controller.signal)
      .finally(() => { this.checkoutInFlight = undefined; this.checkoutAbort = undefined; });
  }
  private async runCheckout(review: CheckoutReview, email: string, signal: AbortSignal, recoveredRefund = false): Promise<ReturnType<typeof result>> {
    const draft = { ...await this.current(review, signal), email };
    const invalid = validateDraft(draft);
    if (invalid) throw new Error(invalid);
    if (draft.references.some(photo => photo.sample || !/^data:image\/jpeg;base64,/.test(photo.url))) {
      throw new Error("Add your own 4–6 selfies before paying.");
    }
    const api = await this.api();
    void api.recordWebObservation?.({kind:"checkout_email",eventId:crypto.randomUUID(),context:analyticsContext(),email}).catch(()=>{});
    const key = `${api.session.uid}/${reviewKey(review)}`;
    const db = await this.database();
    let attempt: Attempt | undefined;
    for (let tries = 0; tries < 25; tries++) {
      await this.current(review, signal);
      // Claim and scan in one transaction: another tab cannot insert a different
      // checkout between checking for an earlier payment and saving this attempt.
      const tx = db.transaction("attempts", "readwrite");
      const attempts = await tx.store.getAll() as Attempt[];
      const earlier = attempts.find(value => value.uid === api.session.uid && !value.settled &&
        (value.key !== key || value.email !== email));
      if (!earlier) {
        attempt = attempts.find(value => value.key === key);
        if (!attempt) {
          attempt = { schemaVersion: 1, uid: api.session.uid, key, review, email,
            attribution: currentAttribution(), draft: structuredClone(draft), uploadAttempt: crypto.randomUUID() };
          await tx.store.add(attempt, key);
        }
      }
      await tx.done;
      if (!earlier) break;
      if (earlier.orderId) {
        const closed = await api.cancelWebCheckout(earlier.orderId);
        if (["creating", "open"].includes(closed.state)) {
          throw new Error("We could not close your earlier checkout. Check its payment status before trying again.");
        }
        if (closed.state === "fulfilled") await this.finishDraft(earlier);
        if (closed.state === "refunded") await this.markSettled(earlier, "refunded");
        else if (closed.state !== "expired") {
          // Payment can win the race. Open its status/gallery instead of charging
          // again for an edit; leave the customer's newer draft intact.
          return result(closed);
        }
      }
      await this.releaseAttempt(earlier);
    }
    if (!attempt) throw new Error("Your checkout changed in another tab. Review it and try again.");
    if (attempt.uid !== api.session.uid || attempt.email !== email || attempt.schemaVersion !== 1) {
      throw new Error("Resume this checkout using its original delivery email.");
    }
    await this.current(review, signal);
    if (!attempt.orderId) {
      const ready = await api.checkPackReadiness(attempt.draft.packId, attempt.draft.styling, attempt.draft.styleId);
      if (!ready.ok) throw new Error(ready.reason || "This shoot is temporarily unavailable.");
      await api.recordConsent(attempt.draft.styling, attempt.draft.wearsGlasses);
      this.track("consent_completed", { packId: draft.packId, styling: draft.styling });
      await this.current(review, signal);
      if (!attempt.uploadSessionId) {
        const blobs = attempt.draft.references.map(photo => {
          const bytes = Uint8Array.from(atob(photo.url.split(",")[1]), char => char.charCodeAt(0));
          return new Blob([bytes], { type: "image/jpeg" });
        });
        this.track("upload_started", { packId: draft.packId, styling: draft.styling });
        const uploadStarted=performance.now();
        const uploaded = await api.uploadReferences(blobs, attempt.uploadAttempt, attempt.draft.wearsGlasses,
          () => {}, signal).catch(error=>{this.track("upload_failed",{packId:draft.packId,styling:draft.styling,reason:signal?.aborted?"cancelled":analyticsErrorCode(error)});throw error;});
        attempt = await this.checkpoint(attempt, { uploadSessionId: uploaded.sessionId });
        this.track("upload_completed", { packId: draft.packId, styling: draft.styling, count:blobs.length,durationMs:Math.round(performance.now()-uploadStarted) });
      }
      await this.current(review, signal);
      const order = await api.createOrder({ packId: attempt.draft.packId,
        productId: ready.productId || packById(attempt.draft.packId)!.productId,
        styling: attempt.draft.styling, styleId: attempt.draft.styleId,
        wearsGlasses: attempt.draft.wearsGlasses, uploadSessionId: attempt.uploadSessionId! });
      // Save before creating a payment session or opening Stripe. A lost reply reuses this order.
      attempt = await this.checkpoint(attempt, { orderId: order.orderId });
    }
    await this.current(review, signal);
    const checkout = await api.beginWebCheckout(attempt.orderId!, attempt.email, attempt.attribution);
    await this.current(review, signal);
    if (checkout.amountMinor !== 399 || checkout.currency !== "usd") {
      throw new Error("The price has changed. Contact support before continuing.");
    }
    if (checkout.state === "refunded") {
      // A verified refund closes only this order. Keep the reviewed selfies, but
      // use a fresh upload/order identity for an intentional new purchase.
      await this.releaseAttempt(attempt);
      if (!recoveredRefund) return this.runCheckout(review, email, signal, true);
      throw new Error("This purchase is closed. Review your shoot before trying again.");
    }
    if (checkout.state === "fulfilled") await this.finishDraft(attempt);
    if (checkout.state === "open") this.track("purchase_initiated", { packId: draft.packId, styling: draft.styling });
    return result(checkout);
  }
  private async finishDraft(attempt: Attempt) {
    await this.local.completeCheckout(attempt.review, attempt.email);
    await this.markSettled(attempt, "fulfilled");
  }
  private async markSettled(attempt: Attempt, settled: "fulfilled" | "refunded") {
    const db = await this.database();
    const tx = db.transaction("attempts", "readwrite");
    const current = await tx.store.get(attempt.key) as Attempt | undefined;
    if (current?.uid === attempt.uid && current.uploadAttempt === attempt.uploadAttempt && current.orderId === attempt.orderId) {
      await tx.store.put({ ...current, settled, draft: { ...current.draft, references: [] } }, attempt.key);
    }
    await tx.done;
  }
  private async releaseAttempt(attempt: Attempt) {
    const db = await this.database();
    const tx = db.transaction(["attempts", "orders"], "readwrite");
    const current: Attempt | undefined = await tx.objectStore("attempts").get(attempt.key);
    // If an in-flight request just saved an order ID, the caller must reread and
    // close that server order before its checkpoint can be discarded.
    if (current?.uid === attempt.uid && current.uploadAttempt === attempt.uploadAttempt && current.orderId === attempt.orderId) {
      await tx.objectStore("attempts").delete(attempt.key);
      if (attempt.orderId) await tx.objectStore("orders").delete(`${attempt.uid}/${attempt.orderId}`);
    }
    await tx.done;
  }
  async payment(orderId: string) {
    const api = await this.api();
    const checkout = await api.reconcileWebCheckout(orderId);
    if (["expired", "refunded"].includes(checkout.state)) {
      // Only a server-confirmed terminal checkout can release its immutable attempt.
      // A late response for an older order must never erase a newer checkout.
      const db = await this.database();
      const tx = db.transaction(["attempts", "orders"], "readwrite");
      const orderKey = `${api.session.uid}/${orderId}`;
      const key = await tx.objectStore("orders").get(orderKey);
      const attempt = key ? await tx.objectStore("attempts").get(key) as Attempt | undefined : undefined;
      if (attempt?.uid === api.session.uid && attempt.orderId === orderId) {
        await tx.objectStore("attempts").delete(key);
        await tx.objectStore("orders").delete(orderKey);
      }
      await tx.done;
    }
    if (checkout.state === "fulfilled") {
      const db = await this.database();
      const key = await db.get("orders", `${api.session.uid}/${orderId}`);
      const attempt = key ? await db.get("attempts", key) as Attempt | undefined : undefined;
      if (attempt?.uid === api.session.uid && attempt.orderId === orderId) {
        await this.finishDraft(attempt);
        if (!this.observedOrders.has(orderId)) {
          this.observedOrders.add(orderId);
          const digest = new Uint8Array(await crypto.subtle.digest("SHA-256",
            new TextEncoder().encode(`web-purchase-completed-v1:${api.session.uid}:${orderId}`)));
          const hex = Array.from(digest.slice(0, 16), b => b.toString(16).padStart(2, "0")).join("");
          const eventId = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
          this.track("purchase_completed", { packId: attempt.draft.packId, styling: attempt.draft.styling,
            ...(checkout.jobId ? { jobId: checkout.jobId } : {}) }, eventId);
        }
      }
    }
    return result(checkout);
  }
  async editCheckout(input: { orderId?: string; review?: CheckoutReview }) {
    this.checkoutAbort?.abort();
    await this.checkoutInFlight?.catch(() => {});
    const api = await this.api();
    const db = await this.database();
    const key = input.orderId ? await db.get("orders", `${api.session.uid}/${input.orderId}`)
      : input.review ? `${api.session.uid}/${reviewKey(input.review)}` : null;
    const attempt: Attempt | undefined = key ? await db.get("attempts", key) : undefined;
    if (input.orderId && (!attempt || attempt.orderId !== input.orderId)) {
      throw new Error("Open the original checkout in this browser to edit it.");
    }
    if (attempt) {
      if (attempt.uid !== api.session.uid) throw new Error("This checkout is unavailable.");
      if (attempt.orderId) {
        const closed = await api.cancelWebCheckout(attempt.orderId);
        if (closed.state !== "expired") {
          throw new Error("This checkout could not be reopened. Check your payment status before paying again.");
        }
      }
    }
    const review = attempt?.review || input.review;
    if (!review) throw new Error("Review your selfies before continuing.");
    // Reopen first so a failed local write leaves the recovery record available.
    // A newer draft in another tab is already editable and must be preserved.
    await this.local.reopenCheckout(review, attempt?.email, true);
    if (attempt) await this.releaseAttempt(attempt);
  }
  retryPhoto(shootId: string, slotId: string): Promise<void> {
    const key = `${shootId}/${slotId}`;
    const pending = this.retries.get(key);
    if (pending) return pending;
    const retry = (async () => {
      const api = await this.api();
      const job = this.allJobs().find(value => value.id === shootId);
      if (!job) throw new Error("This shoot is unavailable.");
      const shoot = projectWebJob(job, this.favorites);
      const photo = shoot.photos.find(value => value.slotId === slotId);
      if (!photo || !photoRetryState(shoot, photo, Date.now()).available) {
        throw new Error("This photo can’t be retried right now. Refresh your gallery.");
      }
      try { await api.retrySlot(shootId, slotId); }
      finally {
        // A lost response can still mean the server finished. Refresh both owned
        // and email-recovered shoots before allowing another deliberate tap.
        await Promise.allSettled([
          api.listJobs().then(jobs => { this.jobs = jobs; }), this.refreshGalleries(),
        ]);
        this.changed();
      }
    })().finally(() => { this.retries.delete(key); });
    this.retries.set(key, retry);
    return retry;
  }
  async setFavorite(shootId: string, slotId: string, favorite: boolean) {
    const api = await this.api();
    if (!this.allJobs().some(job => job.id === shootId && job.slots.some(slot => slot.slotId === slotId))) {
      throw new Error("This photo is unavailable.");
    }
    const tx = (await this.database()).transaction("favorites", "readwrite");
    const saved = (await tx.store.get(api.session.uid)) || {};
    saved[`${shootId}/${slotId}`] = favorite;
    await tx.store.put(saved, api.session.uid); await tx.done;
    this.favorites = saved; this.changed();
  }
  async reshoot(shootId: string, slotId: string, operationId: string) {
    const api = await this.api();
    const slot = this.allJobs().find(job => job.id === shootId)?.slots.find(value => value.slotId === slotId);
    if (!slot?.path || slot.status !== "done") throw new Error("Wait for this photo to finish.");
    const db = await this.database();
    const key = `${api.session.uid}/${shootId}/${slotId}`;
    const previous = await db.get("reshoots", key) as ReshootOperation | undefined;
    // A new visible photo is not proof that the old request settled. Verify its
    // receipt before atomically replacing that checkpoint with this new tap.
    const previousFinished = previous && previous.previousPath !== slot.path &&
      (await api.reshootStatus(previous) as { operationState?: string }).operationState === "finished";
    const latestSlot = this.allJobs().find(job => job.id === shootId)?.slots.find(value => value.slotId === slotId);
    if (latestSlot?.status !== "done" || latestSlot.path !== slot.path)
      throw new Error("This photo changed. Review it before reshooting.");
    const tx = db.transaction("reshoots", "readwrite");
    let saved = await tx.store.get(key) as ReshootOperation | undefined;
    if (previousFinished && saved?.operationId === previous?.operationId) saved = undefined;
    const replay = !!saved;
    if (!saved) {
      saved = { schemaVersion: 1, uid: api.session.uid, jobId: shootId, slotId,
        previousPath: slot.path, operationId };
      await tx.store.put(saved, key);
    }
    await tx.done;
    let outcome: { operationState?: string; message?: string };
    try {
      outcome = await (replay ? api.reshootStatus(saved) : api.reshoot(saved)) as typeof outcome;
    } catch {
      // This status operation fences an unreceived request before another allowance can be used.
      outcome = await api.reshootStatus(saved) as typeof outcome;
    }
    if (["finished", "rolled-back", "not-started", "closed"].includes(outcome.operationState || "")) {
      const cleanup = db.transaction("reshoots", "readwrite");
      const current = await cleanup.store.get(key) as ReshootOperation | undefined;
      if (current?.operationId === saved.operationId) await cleanup.store.delete(key);
      await cleanup.done;
    }
    if (["rolled-back", "not-started", "closed"].includes(outcome.operationState || "")) {
      const message = outcome.message === "This pack is closed. Use its replacement or contact support."
        ? "Reshoots are unavailable for this shoot. You can save your available photos or contact support."
        : outcome.message;
      throw new Error(message || "That reshoot did not finish. Your photos are unchanged; try again or contact support.");
    }
    // The server has accepted or finished this reshoot. Email-recovered library
    // lookup is optional here; its failure must not turn a completed action into
    // a retryable-looking error. refreshGalleries records the separate warning.
    await this.refreshGalleries().catch(() => {});
    this.changed();
  }
  async photoBlob(shootId: string, photo: Photo) {
    if (!photo.path) throw new Error("This photo is still being prepared.");
    await this.startWatching();
    const api = await this.api();
    const job = this.allJobs().find(job => job.id === shootId);
    if (!job) throw new Error("This gallery is unavailable.");
    return job.uid === api.session.uid ? api.download(shootId, photo.path) : api.galleryPhoto(shootId, photo.path);
  }
  async assertPhotos(shootId: string, photos: Photo[]) {
    await this.startWatching();
    const api = await this.api();
    const job = this.allJobs().find(job => job.id === shootId);
    if (!job) throw new Error("This gallery is unavailable.");
    const paths = photos.map(photo => photo.path || "");
    return job.uid === api.session.uid ? api.assertPhotos(shootId, paths) : api.assertGalleryPhotos(shootId, paths);
  }
  async deleteShoot() { throw new Error("Use My photos → Photo settings to delete all your photos created in this browser, or contact support about a recovered shoot."); }
  async deleteAllPhotos() {
    this.checkoutAbort?.abort();
    await (await this.api()).deleteAllPhotos();
    this.jobs = []; await this.clearReferences(); this.changed();
  }
  private async clearRecoveryImages() {
    const tx = (await this.database()).transaction("attempts", "readwrite");
    for (const saved of await tx.store.getAll() as Attempt[]) {
      if (saved.draft?.references?.length) {
        await tx.store.put({ ...saved, draft: { ...saved.draft, references: [] } }, saved.key);
      }
    }
    await tx.done;
  }
  async clearReferences() {
    this.checkoutAbort?.abort();
    await this.local.clearReferences(); await this.clearRecoveryImages();
  }
  async reset() {
    this.checkoutAbort?.abort();
    await this.local.reset(); await this.clearRecoveryImages();
  }
}
