import { openDB } from "idb";
import { LocalStudioService } from "./local";
import { packById } from "../lib/catalog";
import { validateDraft } from "../lib/domain";
import type { CheckoutReview, Draft, DraftGuard, DraftUpdate, Photo, Shoot, StudioService, Styling } from "../lib/types";
import type { createFirebaseAdapter, NativeJobProjection, ReshootOperation, WebCheckout } from "../../integration/firebase-adapter";

type API = ReturnType<typeof createFirebaseAdapter>;
type Attempt = {
  schemaVersion: 1; uid: string; key: string; review: CheckoutReview; email: string;
  draft: Draft; uploadAttempt: string; uploadSessionId?: string; orderId?: string;
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
    photos: (job.slots || []).map(slot => ({
      slotId: slot.slotId, sceneId: slot.sceneId, take: slot.take,
      label: pack?.scenes.find(scene => scene.sceneId === slot.sceneId)?.label || "Your photo",
      url: "", path: slot.path, status: slot.status,
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
  private db?: ReturnType<typeof openDB>;
  private listeners = new Set<() => void>();
  private jobs: (NativeJobProjection & { id: string })[] = [];
  private favorites: Record<string, boolean> = {};
  private watchError: Error | null = null;
  private watching?: Promise<void>;
  private checkoutInFlight?: Promise<ReturnType<typeof result>>;
  private checkoutAbort?: AbortController;
  private local: LocalStudioService;
  constructor(private connect: () => Promise<API>, private namespace = "beanywhere-web-live-v1") {
    this.local = new LocalStudioService(`${namespace}-drafts`);
    this.local.subscribe(() => this.changed());
  }
  private api() {
    return this.apiPromise ??= this.connect().catch(error => { this.apiPromise = undefined; throw error; });
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
      await api.watchJobs(jobs => { this.jobs = jobs; this.watchError = null; this.changed(); },
        error => { this.jobs = []; this.watchError = error; this.changed(); });
    })().catch(error => { this.watching = undefined; throw error; });
  }
  async read() {
    const state = await this.local.read();
    await this.startWatching();
    if (this.watchError) throw this.watchError;
    const api = await this.api();
    this.favorites = (await (await this.database()).get("favorites", api.session.uid)) || {};
    return { ...state, shoots: this.jobs.filter(job => !!packById(job.packId))
      .map(job => projectWebJob(job, this.favorites)) };
  }
  updateDraft(review: DraftGuard, patch: DraftUpdate) {
    if (patch.references || patch.wearsGlasses !== undefined || patch.consent === false) this.checkoutAbort?.abort();
    return this.local.updateDraft(review, patch);
  }
  startDraft(packId: string, styling: Styling, styleId: string) {
    this.checkoutAbort?.abort(); return this.local.startDraft(packId, styling, styleId);
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
    const next = { ...saved, ...patch };
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
  private async runCheckout(review: CheckoutReview, email: string, signal: AbortSignal) {
    const draft = { ...await this.current(review, signal), email };
    const invalid = validateDraft(draft);
    if (invalid) throw new Error(invalid);
    if (draft.references.some(photo => photo.sample || !/^data:image\/jpeg;base64,/.test(photo.url))) {
      throw new Error("Add your own 4–6 selfies before paying.");
    }
    const api = await this.api();
    const key = `${api.session.uid}/${reviewKey(review)}`;
    const db = await this.database();
    const tx = db.transaction("attempts", "readwrite");
    let attempt = await tx.store.get(key) as Attempt | undefined;
    if (!attempt) {
      attempt = { schemaVersion: 1, uid: api.session.uid, key, review, email,
        draft: structuredClone(draft), uploadAttempt: crypto.randomUUID() };
      await tx.store.add(attempt, key);
    }
    await tx.done;
    if (attempt.uid !== api.session.uid || attempt.email !== email || attempt.schemaVersion !== 1) {
      throw new Error("Resume this checkout using its original delivery email.");
    }
    await this.current(review, signal);
    if (!attempt.orderId) {
      const ready = await api.checkPackReadiness(attempt.draft.packId, attempt.draft.styling, attempt.draft.styleId);
      if (!ready.ok) throw new Error(ready.reason || "This shoot is temporarily unavailable.");
      await api.recordConsent(attempt.draft.styling, attempt.draft.wearsGlasses);
      await this.current(review, signal);
      if (!attempt.uploadSessionId) {
        const blobs = attempt.draft.references.map(photo => {
          const bytes = Uint8Array.from(atob(photo.url.split(",")[1]), char => char.charCodeAt(0));
          return new Blob([bytes], { type: "image/jpeg" });
        });
        const uploaded = await api.uploadReferences(blobs, attempt.uploadAttempt, attempt.draft.wearsGlasses,
          () => {}, signal);
        attempt = await this.checkpoint(attempt, { uploadSessionId: uploaded.sessionId });
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
    const checkout = await api.beginWebCheckout(attempt.orderId!, attempt.email);
    await this.current(review, signal);
    if (checkout.amountMinor !== 399 || checkout.currency !== "usd") {
      throw new Error("The price has changed. Contact support before continuing.");
    }
    if (checkout.state === "fulfilled") await this.finishDraft(attempt);
    return result(checkout);
  }
  private async finishDraft(attempt: Attempt) {
    await this.local.completeCheckout(attempt.review, attempt.email);
    const db = await this.database();
    const tx = db.transaction("attempts", "readwrite");
    const current = await tx.store.get(attempt.key) as Attempt | undefined;
    if (current?.uid === attempt.uid && current.orderId === attempt.orderId) {
      await tx.store.put({ ...current, draft: { ...current.draft, references: [] } }, attempt.key);
    }
    await tx.done;
  }
  async payment(orderId: string) {
    const api = await this.api();
    const checkout = await api.reconcileWebCheckout(orderId);
    if (checkout.state === "expired") {
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
      if (attempt?.uid === api.session.uid && attempt.orderId === orderId) await this.finishDraft(attempt);
    }
    return result(checkout);
  }
  async setFavorite(shootId: string, slotId: string, favorite: boolean) {
    const api = await this.api();
    if (!this.jobs.some(job => job.id === shootId && job.slots.some(slot => slot.slotId === slotId))) {
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
    const slot = this.jobs.find(job => job.id === shootId)?.slots.find(value => value.slotId === slotId);
    if (!slot?.path || slot.status !== "done") throw new Error("Wait for this photo to finish.");
    const db = await this.database();
    const key = `${api.session.uid}/${shootId}/${slotId}`;
    const tx = db.transaction("reshoots", "readwrite");
    let saved = await tx.store.get(key) as ReshootOperation | undefined;
    const replay = !!saved;
    if (!saved) {
      saved = { schemaVersion: 1, uid: api.session.uid, jobId: shootId, slotId,
        previousPath: slot.path, operationId };
      await tx.store.put(saved, key);
    }
    await tx.done;
    let outcome: { operationState?: string };
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
      throw new Error("That reshoot did not finish. Your photos are unchanged; try again or contact support.");
    }
  }
  async photoBlob(shootId: string, photo: Photo) {
    if (!photo.path) throw new Error("This photo is still being prepared.");
    return (await this.api()).download(shootId, photo.path);
  }
  async assertPhotos(shootId: string, photos: Photo[]) {
    return (await this.api()).assertPhotos(shootId, photos.map(photo => photo.path || ""));
  }
  async deleteShoot() { throw new Error("Use My studio to delete all your photos, or contact support about a single shoot."); }
  async deleteAllPhotos() {
    this.checkoutAbort?.abort();
    await (await this.api()).deleteAllPhotos();
    this.jobs = []; await this.local.clearReferences(); this.changed();
  }
  clearReferences() { this.checkoutAbort?.abort(); return this.local.clearReferences(); }
  reset() { this.checkoutAbort?.abort(); return this.local.reset(); }
}
