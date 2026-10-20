import { beforeEach, expect, it, vi } from "vitest";
import { openDB } from "idb";
import { directAttribution } from "../storefront/acquisition.js";
import { LiveStudioService, projectWebJob } from "../src/services/live";
import { LocalStudioService } from "../src/services/local";
import type { Draft } from "../src/lib/types";
import type { createFirebaseAdapter, NativeJobProjection } from "../integration/firebase-adapter";

type API = ReturnType<typeof createFirebaseAdapter>;
const uid = `w_${"a".repeat(40)}`;
const photoPath = `outputs/${uid}/job_1/photo.jpg`;
const job = (): NativeJobProjection & { id: string } => ({
  id: "job_1", uid, packId: "paris", styling: "w", styleId: "casual", clientVisible: true,
  status: "done", generationState: "retry-waiting", reshootsLeft: 3, readableOutputPaths: [photoPath],
  slots: [{ slotId: "s0", sceneId: "eiffel", take: 1, status: "done", path: photoPath },
    { slotId: "s1", sceneId: "eiffel", take: 2, status: "pending" }],
});
const checkout = (state = "open") => ({ orderId: "order_1", checkoutId: "cs_test_123", state,
  jobId: state === "fulfilled" ? "job_1" : null, amountMinor: 399, currency: "usd",
  checkoutUrl: state === "open" ? "https://checkout.stripe.com/c/pay/cs_test_123" : null });
let api: Record<string, any>;
let service: LiveStudioService;
let local: LocalStudioService;
let draft: Draft;
let namespace: string;
beforeEach(async () => {
  api = {
    session: { uid, webAppId: "1:151223255006:web:7313193eb6302e7582674f", capabilityVersion: 1 },
    listJobs: vi.fn().mockResolvedValue([job()]), watchJobs: vi.fn().mockResolvedValue(() => {}),
    checkPackReadiness: vi.fn().mockResolvedValue({ ok: true, productId: "pack.paris" }),
    recordConsent: vi.fn().mockResolvedValue(undefined), recordEvent: vi.fn().mockResolvedValue({ accepted: true }),
    uploadReferences: vi.fn().mockResolvedValue({ sessionId: "upload_1", uploadStatus: "completed" }),
    createOrder: vi.fn().mockResolvedValue({ orderId: "order_1" }),
    beginWebCheckout: vi.fn().mockResolvedValue(checkout()),
    reconcileWebCheckout: vi.fn().mockResolvedValue(checkout("paid")),
    cancelWebCheckout: vi.fn().mockResolvedValue(checkout("expired")),
    reshoot: vi.fn().mockResolvedValue({ operationState: "finished" }),
    reshootStatus: vi.fn().mockResolvedValue({ operationState: "finishing" }),
    download: vi.fn().mockResolvedValue(new Blob(["photo"])), assertPhotos: vi.fn().mockResolvedValue(undefined),
    deleteAllPhotos: vi.fn().mockResolvedValue(undefined),
  };
  namespace = `live-test-${crypto.randomUUID()}`;
  local = new LocalStudioService(`${namespace}-drafts`);
  service = new LiveStudioService(async () => api as API, namespace);
  await local.startDraft("paris", "w", "casual");
  let value = (await local.read()).draft!;
  await local.updateDraft(value, { references: Array.from({ length: 4 }, (_, i) => ({
    id: `photo-${i}`, name: `photo-${i}.jpg`, url: `data:image/jpeg;base64,${btoa("x".repeat(2048))}`,
    width: 800, height: 1200, sample: false,
  })) });
  value = (await local.read()).draft!;
  await local.updateDraft(value, { consent: true });
  draft = (await local.read()).draft!;
});

it("uploads the reviewed selfies, freezes an order, and returns only the server checkout", async () => {
  const result = await service.checkout(draft, "buyer@example.com");
  expect(result).toMatchObject({ kind: "payment", orderId: "order_1", state: "open" });
  expect(api.recordConsent).toHaveBeenCalledWith("w", false);
  expect(api.uploadReferences.mock.calls[0][0]).toHaveLength(4);
  expect(api.uploadReferences.mock.calls[0][0][0].type).toBe("image/jpeg");
  expect(api.createOrder).toHaveBeenCalledWith({ packId: "paris", productId: "pack.paris", styleId: "casual",
    styling: "w", wearsGlasses: false, uploadSessionId: "upload_1" });
  expect(api.beginWebCheckout).toHaveBeenCalledExactlyOnceWith("order_1", "buyer@example.com", directAttribution());
  expect((await local.read()).draft).not.toBeNull();
});

it("a lost checkout response retries the same saved order without uploading or creating another", async () => {
  api.beginWebCheckout.mockRejectedValueOnce(new Error("lost response"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow("lost response");
  await service.checkout(draft, "buyer@example.com");
  expect(api.uploadReferences).toHaveBeenCalledTimes(1);
  expect(api.createOrder).toHaveBeenCalledTimes(1);
  expect(api.beginWebCheckout.mock.calls).toEqual([["order_1", "buyer@example.com", directAttribution()], ["order_1", "buyer@example.com", directAttribution()]]);
});

it("a lost upload response keeps the same persisted upload attempt", async () => {
  api.uploadReferences.mockRejectedValueOnce(new Error("lost upload"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow("lost upload");
  await service.checkout(draft, "buyer@example.com");
  expect(api.uploadReferences.mock.calls[0][1]).toBe(api.uploadReferences.mock.calls[1][1]);
  expect(api.createOrder).toHaveBeenCalledTimes(1);
});

it("does not charge a changed draft after an in-flight upload finishes", async () => {
  api.uploadReferences.mockImplementation(async () => {
    await service.clearReferences();
    return { sessionId: "upload_1", uploadStatus: "completed" };
  });
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow("cancelled");
  expect(api.createOrder).not.toHaveBeenCalled(); expect(api.beginWebCheckout).not.toHaveBeenCalled();
});

it("coalesces duplicate checkout taps", async () => {
  const a = service.checkout(draft, "buyer@example.com");
  const b = service.checkout(draft, "buyer@example.com");
  expect(a).toBe(b); await a;
  expect(api.beginWebCheckout).toHaveBeenCalledTimes(1);
});

it("does not replace the email until an unresolved payment is confirmed expired", async () => {
  api.beginWebCheckout.mockRejectedValueOnce(new Error("unknown"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow();
  api.cancelWebCheckout.mockRejectedValueOnce(new Error("Could not verify unpaid checkout"));
  await expect(service.checkout(draft, "different@example.com")).rejects.toThrow("Could not verify");
  expect(api.beginWebCheckout).toHaveBeenCalledTimes(1);
});

it("never accepts sample images for a paid generation", async () => {
  await local.updateDraft(draft, { references: draft.references.map(photo => ({ ...photo, sample: true })) });
  const current = (await local.read()).draft!;
  await local.updateDraft(current, { consent: true });
  await expect(service.checkout(current, "buyer@example.com")).rejects.toThrow("own 4–6 selfies");
  expect(api.uploadReferences).not.toHaveBeenCalled(); expect(api.beginWebCheckout).not.toHaveBeenCalled();
});

it("never redirects a customer to a price different from the reviewed price", async () => {
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), amountMinor: 999 });
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow("price has changed");
});

it("only server-confirmed fulfillment clears the matching checkout draft", async () => {
  await service.checkout(draft, "buyer@example.com");
  await service.payment("order_1");
  expect((await local.read()).draft).not.toBeNull();
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  await service.payment("order_1");
  expect((await local.read()).draft).toBeNull();
  expect((await local.read()).email).toBe("buyer@example.com");
});

it("a late fulfilled payment cannot erase a newer draft", async () => {
  await service.checkout(draft, "buyer@example.com");
  await local.startDraft("paris", "w", "chic");
  const newer = (await local.read()).draft;
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  await service.payment("order_1");
  expect((await local.read()).draft).toEqual(newer);
});

it("only verified expiration releases an old checkout and a delayed response preserves its replacement", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.reconcileWebCheckout.mockResolvedValue(checkout("expired"));
  await service.payment("order_1");
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  await service.checkout(draft, "buyer@example.com");
  expect(api.uploadReferences).toHaveBeenCalledTimes(2);
  expect(api.uploadReferences.mock.calls[0][1]).not.toBe(api.uploadReferences.mock.calls[1][1]);
  await service.payment("order_1");
  await service.checkout(draft, "buyer@example.com");
  expect(api.uploadReferences).toHaveBeenCalledTimes(2);
  expect(api.beginWebCheckout.mock.calls.at(-1)).toEqual(["order_2", "buyer@example.com", directAttribution()]);
});

it("resetting draft storage does not discard the payment recovery record", async () => {
  await service.checkout(draft, "buyer@example.com");
  await service.reset();
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  expect(await service.payment("order_1")).toMatchObject({ state: "fulfilled", jobId: "job_1" });
  expect((await local.read()).email).toBe("buyer@example.com");
});

it("shows actual slot readiness without simulating the remaining photos", () => {
  const projected = projectWebJob(job(), { "job_1/s0": true });
  expect(projected.sample).toBe(false); expect(projected.generationState).toBe("retry-waiting");
  expect(projected.photos[0]).toMatchObject({ favorite: true, readyAt: 0, path: photoPath });
  expect(projected.photos[1].readyAt).toBe(Infinity);
  expect(projected.photos.filter(photo => photo.readyAt < Date.now() + 864000000)).toHaveLength(1);
});

it("a pending reshoot is reconciled instead of consuming another reshoot", async () => {
  await service.read();
  api.reshoot.mockRejectedValueOnce(new Error("lost response"));
  const operationId = crypto.randomUUID();
  await service.reshoot("job_1", "s0", operationId);
  await service.reshoot("job_1", "s0", crypto.randomUUID());
  expect(api.reshoot).toHaveBeenCalledTimes(1);
  expect(api.reshootStatus).toHaveBeenCalledTimes(2);
  expect(api.reshootStatus.mock.calls.every((call: [{ operationId: string }]) => call[0].operationId === operationId)).toBe(true);
  api.reshootStatus.mockResolvedValue({ operationState: "finished" });
  await service.reshoot("job_1", "s0", crypto.randomUUID());
  api.reshoot.mockResolvedValue({ operationState: "finished" });
  await service.reshoot("job_1", "s0", crypto.randomUUID());
  expect(api.reshoot).toHaveBeenCalledTimes(2);
});

it("starts a new reshoot on a new photo after reconciling the delayed previous result", async () => {
  await service.read();
  api.reshoot.mockResolvedValueOnce({ operationState: "finishing" });
  const first = crypto.randomUUID();
  await service.reshoot("job_1", "s0", first);
  const newer = job(); newer.slots[0].path = photoPath.replace("photo.jpg", "new.jpg");
  newer.readableOutputPaths = [newer.slots[0].path];
  api.watchJobs.mock.calls[0][0]([newer]);
  api.reshootStatus.mockResolvedValue({ operationState: "finished" });
  const next = crypto.randomUUID();
  await service.reshoot("job_1", "s0", next);
  expect(api.reshootStatus).toHaveBeenCalledWith(expect.objectContaining({ operationId: first }));
  expect(api.reshoot).toHaveBeenCalledTimes(2);
  expect(api.reshoot.mock.calls[1][0]).toMatchObject({ operationId: next, previousPath: newer.slots[0].path });
});

it("two tabs replacing a finished reshoot share one new operation", async () => {
  await service.read();
  api.reshoot.mockResolvedValue({ operationState: "finishing" });
  await service.reshoot("job_1", "s0", crypto.randomUUID());
  const newer = job(); newer.slots[0].path = photoPath.replace("photo.jpg", "new.jpg");
  api.watchJobs.mock.calls[0][0]([newer]);
  api.listJobs.mockResolvedValue([newer]);
  const other = new LiveStudioService(async () => api as API, namespace); await other.read();
  const checks: (() => void)[] = [];
  api.reshootStatus.mockImplementation(() => new Promise(resolve => { checks.push(() => resolve({ operationState: "finished" })); }));
  const a = service.reshoot("job_1", "s0", crypto.randomUUID());
  const b = other.reshoot("job_1", "s0", crypto.randomUUID());
  await vi.waitFor(() => expect(checks).toHaveLength(2));
  api.reshootStatus.mockResolvedValue({ operationState: "finishing" });
  checks.forEach(resolve => resolve()); await Promise.all([a, b]);
  expect(api.reshoot).toHaveBeenCalledTimes(2); // First photo, then exactly one replacement request.
});

it("an uncertain earlier reshoot cannot authorize another generation", async () => {
  await service.read(); api.reshoot.mockResolvedValue({ operationState: "finishing" });
  await service.reshoot("job_1", "s0", crypto.randomUUID());
  const newer = job(); newer.slots[0].path = photoPath.replace("photo.jpg", "new.jpg");
  api.watchJobs.mock.calls[0][0]([newer]);
  api.reshootStatus.mockRejectedValue(new Error("Connection lost"));
  await expect(service.reshoot("job_1", "s0", crypto.randomUUID())).rejects.toThrow("Connection lost");
  expect(api.reshoot).toHaveBeenCalledOnce();
});

it("preserves the server explanation when a reshoot cannot start", async () => {
  await service.read();
  api.reshoot.mockResolvedValue({ operationState: "not-started", message: "The retry window for this pack has ended." });
  await expect(service.reshoot("job_1", "s0", crypto.randomUUID())).rejects.toThrow("window for this pack has ended");
});

it("a closed reshoot offers the existing support route without promising a replacement", async () => {
  await service.read();
  api.reshoot.mockResolvedValue({ operationState: "not-started", message: "This pack is closed. Use its replacement or contact support." });
  await expect(service.reshoot("job_1", "s0", crypto.randomUUID())).rejects.toThrow(
    "Reshoots are unavailable for this shoot. You can save your available photos or contact support.");
});

it("a refund observed before fulfillment releases the old order for an intentional same-shoot purchase", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.reconcileWebCheckout.mockResolvedValue(checkout("refunded"));
  await service.payment("order_1");
  await service.startDraft("paris", "w", "casual");
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  const next = await service.checkout((await local.read()).draft!, "buyer@example.com");
  expect(next.orderId).toBe("order_2");
  expect(api.uploadReferences).toHaveBeenCalledTimes(2);
  expect(api.uploadReferences.mock.calls[1][1]).not.toBe(api.uploadReferences.mock.calls[0][1]);
  await service.payment("order_1"); // Late old receipts must not erase the new checkpoint.
  const saved = await (await openDB(`${namespace}-operations`)).getAll("attempts");
  expect(saved).toHaveLength(1); expect(saved[0].orderId).toBe("order_2");
});

it("a refund discovered while resuming creates a fresh order on the same intentional tap", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.beginWebCheckout.mockResolvedValueOnce(checkout("refunded"))
    .mockResolvedValue({ ...checkout(), orderId: "order_2" });
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  expect(await service.checkout(draft, "buyer@example.com")).toMatchObject({ orderId: "order_2", state: "open" });
  expect(api.createOrder).toHaveBeenCalledTimes(2);
});

it("passes private photo downloads and final access checks through the authorized adapter", async () => {
  const photo = projectWebJob(job(), {}).photos[0];
  await service.photoBlob("job_1", photo); await service.assertPhotos("job_1", [photo]);
  expect(api.download).toHaveBeenCalledWith("job_1", photoPath);
  expect(api.assertPhotos).toHaveBeenCalledWith("job_1", [photoPath]);
});

it("does not map per-shoot deletion to the all-photos deletion endpoint", async () => {
  await expect(service.deleteShoot()).rejects.toThrow("all your photos");
  expect(api.deleteAllPhotos).not.toHaveBeenCalled();
});

it("surfaces a denied initial gallery read rather than showing a misleading empty library", async () => {
  api.listJobs.mockRejectedValue(new Error("permission denied"));
  await expect(service.read()).rejects.toThrow("permission denied");
});


it("acknowledged uploads leave only recovery identifiers in the payment checkpoint", async () => {
  api.createOrder.mockRejectedValueOnce(new Error("order response lost"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow();
  const db = await openDB(`${namespace}-operations`);
  const saved = (await db.getAll("attempts"))[0];
  expect(saved.uploadSessionId).toBe("upload_1");
  expect(saved.draft.references).toEqual([]);
  await service.checkout(draft, "buyer@example.com");
  expect(api.uploadReferences).toHaveBeenCalledTimes(1);
});

it.each(["clearReferences", "reset", "deleteAllPhotos"] as const)("%s removes hidden checkpoint photos while preserving pending payment IDs", async method => {
  api.uploadReferences.mockRejectedValueOnce(new Error("upload interrupted"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow();
  const db = await openDB(`${namespace}-operations`);
  const saved = (await db.getAll("attempts"))[0];
  expect(saved.draft.references).toHaveLength(4);
  await db.put("attempts", { ...saved, orderId: "unresolved-order" }, saved.key);
  await service[method]();
  const after = await db.get("attempts", saved.key);
  expect(after.draft.references).toEqual([]);
  expect(after.orderId).toBe("unresolved-order");
});

it("reopening a completed purchase uses the same analytics event ID", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  await service.payment("order_1");
  const reopened = new LiveStudioService(async () => api as API, namespace);
  await reopened.payment("order_1");
  await vi.waitFor(() => expect(api.recordEvent.mock.calls.filter((c: any[]) => c[0] === "purchase_completed")).toHaveLength(2));
  const events = api.recordEvent.mock.calls.filter((c: any[]) => c[0] === "purchase_completed");
  expect(events[0][2]).toMatch(/^[a-f0-9-]{36}$/);
  expect(events[0][2]).toBe(events[1][2]);
});

it("recovers galleries from a fresh browser and preserves the checkout identity", async () => {
  const owner = `w_${"b".repeat(40)}`;
  const recovered = { ...job(), uid: owner, id: "recovered", slots: [{ ...job().slots[0], path: `outputs/${owner}/recovered/photo.jpg` }], readableOutputPaths: [`outputs/${owner}/recovered/photo.jpg`] };
  api.listJobs.mockResolvedValue([]);
  api.listWebGalleries = vi.fn().mockResolvedValue({ email: "", jobs: [], nextCursor: null });
  api.recoverGalleries = vi.fn().mockResolvedValue({ email: "buyer@example.com", jobs: [recovered], nextCursor: null });
  api.galleryPhoto = vi.fn().mockResolvedValue(new Blob(["recovered"]));
  api.assertGalleryPhotos = vi.fn().mockResolvedValue(undefined);
  await service.read();
  expect(await service.recoverGalleries(" buyer@example.com ")).toBe(1);
  const state = await service.read();
  expect(state.recoveryEmail).toBe("buyer@example.com");
  expect(state.shoots[0].reshootsLeft).toBe(3);
  await service.photoBlob("recovered", state.shoots[0].photos[0]);
  await service.assertPhotos("recovered", state.shoots[0].photos.slice(0, 1));
  expect(api.galleryPhoto).toHaveBeenCalledWith("recovered", recovered.slots[0].path);
  expect(api.assertGalleryPhotos).toHaveBeenCalled(); expect(api.download).not.toHaveBeenCalled();
  expect(api.session.uid).toBe(uid); expect(api.createOrder).not.toHaveBeenCalled();
});

it("reloads recovered galleries from the server and removes revoked access", async () => {
  api.listJobs.mockResolvedValue([]);
  api.listWebGalleries = vi.fn().mockResolvedValue({ email: "buyer@example.com", jobs: [job()], nextCursor: null });
  expect((await service.read()).shoots).toHaveLength(1);
  api.listWebGalleries.mockResolvedValue({ email: "buyer@example.com", jobs: [], nextCursor: null });
  await service.refreshGalleries();
  expect((await service.read()).shoots).toHaveLength(0);
  await expect(service.photoBlob("job_1", projectWebJob(job(), {}).photos[0])).rejects.toThrow("unavailable");
});

it("a stale gallery refresh cannot replace a newer email search", async () => {
  api.listJobs.mockResolvedValue([]);
  api.listWebGalleries = vi.fn().mockResolvedValue({ email: "", jobs: [], nextCursor: null });
  await service.read();
  let resolve!: (value: unknown) => void;
  api.listWebGalleries.mockImplementationOnce(() => new Promise(r => { resolve = r; }));
  const old = service.refreshGalleries(); await Promise.resolve();
  api.recoverGalleries = vi.fn().mockResolvedValue({ email: "new@example.com", jobs: [], nextCursor: null });
  await service.recoverGalleries("new@example.com");
  resolve({ email: "old@example.com", jobs: [job()], nextCursor: null }); await old;
  const state = await service.read(); expect(state.recoveryEmail).toBe("new@example.com"); expect(state.shoots).toHaveLength(0);
});

it.each([undefined, "functions/unavailable", "functions/deadline-exceeded", "functions/internal"])(
  "keeps recovered galleries and email after a temporary refresh failure (%s)", async code => {
    api.listJobs.mockResolvedValue([]);
    api.listWebGalleries = vi.fn().mockResolvedValue({ email: "buyer@example.com", jobs: [job()], nextCursor: null });
    const before = await service.read();
    api.listWebGalleries.mockRejectedValueOnce(Object.assign(new Error("Connection lost"), { code }));
    await expect(service.refreshGalleries()).rejects.toThrow("Connection lost");
    expect(await service.read()).toEqual(before);
    api.listWebGalleries.mockResolvedValue({ email: "buyer@example.com", jobs: [{ ...job(), reshootsLeft: 2 }], nextCursor: null });
    await service.refreshGalleries();
    expect((await service.read()).shoots[0].reshootsLeft).toBe(2);
  },
);

it.each(["functions/permission-denied", "functions/unauthenticated", "permission-denied", "unauthenticated"])(
  "removes recovered galleries when the server denies access (%s)", async code => {
    api.listJobs.mockResolvedValue([]);
    api.listWebGalleries = vi.fn().mockResolvedValue({ email: "buyer@example.com", jobs: [job()], nextCursor: null });
    await service.read();
    api.listWebGalleries.mockRejectedValueOnce(Object.assign(new Error("Access denied"), { code }));
    await expect(service.refreshGalleries()).rejects.toThrow("Access denied");
    expect((await service.read()).shoots).toHaveLength(0);
  },
);

it("a stale access failure cannot clear a newer email search", async () => {
  api.listJobs.mockResolvedValue([]);
  api.listWebGalleries = vi.fn().mockResolvedValue({ email: "old@example.com", jobs: [job()], nextCursor: null });
  await service.read();
  let reject!: (reason: unknown) => void;
  api.listWebGalleries.mockImplementationOnce(() => new Promise((_, fail) => { reject = fail; }));
  const old = service.refreshGalleries(); await Promise.resolve();
  api.recoverGalleries = vi.fn().mockResolvedValue({ email: "new@example.com", jobs: [{ ...job(), id: "new" }], nextCursor: null });
  await service.recoverGalleries("new@example.com");
  reject(Object.assign(new Error("Old access denied"), { code: "functions/permission-denied" }));
  await expect(old).rejects.toThrow("Old access denied");
  const state = await service.read();
  expect(state.recoveryEmail).toBe("new@example.com");
  expect(state.shoots.map(shoot => shoot.id)).toEqual(["new"]);
});

it("reads all recovery pages and deduplicates galleries already owned by this browser", async () => {
  api.listWebGalleries = vi.fn().mockImplementation(async (cursor?: string) => cursor
    ? { email: "buyer@example.com", jobs: [{ ...job(), id: "second" }], nextCursor: null }
    : { email: "", jobs: [], nextCursor: null });
  await service.read();
  api.recoverGalleries = vi.fn().mockResolvedValue({ email: "buyer@example.com", jobs: [job()], nextCursor: "page2" });
  await service.recoverGalleries("buyer@example.com");
  expect((await service.read()).shoots.map(s => s.id).sort()).toEqual(["job_1", "second"]);
});


it("reuses the attribution frozen with a saved checkout after a reload", async () => {
  api.beginWebCheckout.mockRejectedValueOnce(new Error("lost reply"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow("lost reply");
  const db = await openDB(`${namespace}-operations`, 1);
  const key = (await db.getAllKeys("attempts"))[0];
  const saved = await db.get("attempts", key);
  const attribution = { source: "instagram", medium: "social", campaign: "launch", content: "reel_03", code: "ig03" };
  await db.put("attempts", { ...saved, attribution }, key);
  const reloaded = new LiveStudioService(async () => api as API, namespace);
  await reloaded.checkout(draft, "buyer@example.com");
  expect(api.beginWebCheckout.mock.calls.at(-1)).toEqual(["order_1", "buyer@example.com", attribution]);
  expect(api.uploadReferences).toHaveBeenCalledTimes(1);
});

it("reuses the last purchased selfies for a new shoot without reusing its payment identity", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  await service.payment("order_1");
  const reopened = new LiveStudioService(async () => api as API, namespace);
  await reopened.startDraft("paris", "w", "chic");
  const next = (await reopened.read()).draft!;
  expect(next.references).toEqual(draft.references);
  expect(next.checkoutKey).not.toBe(draft.checkoutKey);
  expect(next.reusedSelfies).toBe(true);
  expect(next.consent).toBe(false);
  expect(next.email).toBe("buyer@example.com");
});

it("clearing saved selfies cannot be undone by a late fulfilled checkout", async () => {
  await service.checkout(draft, "buyer@example.com");
  await service.clearReferences();
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  await service.payment("order_1");
  expect((await local.read()).savedSelfies).toBeUndefined();
  await service.startDraft("paris", "w", "chic");
  expect((await local.read()).draft?.references).toEqual([]);
});

it("does not reuse selfies more than 30 days after their purchase", async () => {
  await local.completeCheckout(draft, "buyer@example.com");
  const db = await openDB(`${namespace}-drafts`);
  const state = await db.get("studio", "state");
  state.savedSelfies.savedAt = Date.now() - 31 * 86400000;
  await db.put("studio", state, "state");
  await service.startDraft("paris", "w", "chic");
  expect((await local.read()).draft?.references).toEqual([]);
});

it("closes the original unpaid checkout before editing and keeps the selfies", async () => {
  await service.checkout(draft, "typo@example.com");
  await service.editCheckout({ orderId: "order_1" });
  expect(api.cancelWebCheckout).toHaveBeenCalledExactlyOnceWith("order_1");
  const edited = (await local.read()).draft!;
  expect(edited.checkoutKey).not.toBe(draft.checkoutKey);
  expect(edited.references).toEqual(draft.references);
  expect(edited.email).toBe("typo@example.com");
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  await service.checkout(edited, "correct@example.com");
  expect(api.beginWebCheckout.mock.calls.at(-1)).toEqual(["order_2", "correct@example.com", directAttribution()]);
});

it.each(["paid", "fulfilled", "open"])("does not reopen a checkout when cancellation returns %s", async state => {
  await service.checkout(draft, "buyer@example.com");
  api.cancelWebCheckout.mockResolvedValue(checkout(state));
  await expect(service.editCheckout({ review: draft })).rejects.toThrow("payment status");
  expect((await local.read()).draft!.checkoutKey).toBe(draft.checkoutKey);
  const db = await openDB(`${namespace}-operations`);
  expect(await db.getAll("attempts")).toHaveLength(1);
});

it("a lost cancellation reply preserves the original checkout until a verified retry", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.cancelWebCheckout.mockRejectedValueOnce(new Error("connection lost"));
  await expect(service.editCheckout({ review: draft })).rejects.toThrow("connection lost");
  expect((await local.read()).draft!.checkoutKey).toBe(draft.checkoutKey);
  await service.editCheckout({ review: draft });
  expect((await local.read()).draft!.checkoutKey).not.toBe(draft.checkoutKey);
});

it.each(["glasses", "photos", "look"])("closes the earlier checkout before a replacement after changing %s", async change => {
  await service.checkout(draft, "buyer@example.com");
  if (change === "look") await service.startDraft("paris", "w", "chic");
  else if (change === "glasses") await service.updateDraft(draft, { wearsGlasses: true });
  else {
    await service.updateDraft(draft, { references: [...draft.references].reverse() });
    await service.updateDraft((await local.read()).draft!, { consent: true });
  }
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  const next = (await local.read()).draft!;
  expect(await service.checkout(next, "correct@example.com")).toMatchObject({ orderId: "order_2" });
  expect(api.cancelWebCheckout).toHaveBeenCalledExactlyOnceWith("order_1");
  expect(api.cancelWebCheckout.mock.invocationCallOrder[0]).toBeLessThan(api.createOrder.mock.invocationCallOrder[1]);
});

it.each(["paid", "fulfilled", "needs-support"])("shows the original %s purchase instead of charging for an edit", async state => {
  await service.checkout(draft, "buyer@example.com");
  await service.updateDraft(draft, { wearsGlasses: true });
  const changed = (await local.read()).draft!;
  api.cancelWebCheckout.mockResolvedValue(checkout(state));
  expect(await service.checkout(changed, "buyer@example.com")).toMatchObject({ orderId: "order_1", state });
  expect(api.createOrder).toHaveBeenCalledTimes(1);
  expect(api.beginWebCheckout).toHaveBeenCalledTimes(1);
  expect((await local.read()).draft?.wearsGlasses).toBe(true);
});

it.each(["open", "creating"])("does not redirect an edited shoot to an earlier %s checkout", async state => {
  await service.checkout(draft, "buyer@example.com");
  await service.updateDraft(draft, { wearsGlasses: true });
  api.cancelWebCheckout.mockResolvedValue(checkout(state));
  await expect(service.checkout((await local.read()).draft!, "buyer@example.com")).rejects.toThrow("earlier checkout");
  expect(api.beginWebCheckout).toHaveBeenCalledTimes(1);
});

it("keeps the prior payment checkpoint when closing it fails, then retries safely", async () => {
  await service.checkout(draft, "buyer@example.com");
  await service.updateDraft(draft, { wearsGlasses: true });
  const changed = (await local.read()).draft!;
  api.cancelWebCheckout.mockRejectedValueOnce(new Error("offline"));
  await expect(service.checkout(changed, "buyer@example.com")).rejects.toThrow("offline");
  expect(api.createOrder).toHaveBeenCalledTimes(1);
  const db = await openDB(`${namespace}-operations`);
  expect((await db.getAll("attempts"))[0].orderId).toBe("order_1");
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  await service.checkout(changed, "buyer@example.com");
  expect(api.cancelWebCheckout).toHaveBeenCalledTimes(2);
});

it("an email-gallery visit settles the paid draft and allows a fresh purchase of the same look", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.listJobs.mockResolvedValue([{ ...job(), orderId: "order_1" }]);
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  const reopened = new LiveStudioService(async () => api as API, namespace);
  const state = await reopened.read();
  expect(state.shoots).toHaveLength(1);
  expect(state.draft).toBeNull();
  expect(state.savedSelfies?.references).toEqual(draft.references);
  await reopened.startDraft("paris", "w", "casual");
  let next = (await reopened.read()).draft!;
  expect(next.checkoutKey).not.toBe(draft.checkoutKey);
  await reopened.updateDraft(next, { consent: true });
  next = (await reopened.read()).draft!;
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  expect(await reopened.checkout(next, "buyer@example.com")).toMatchObject({ orderId: "order_2", state: "open" });
  expect(api.cancelWebCheckout).not.toHaveBeenCalled();
});

it("the storefront handoff settles an earlier purchase before reusing the same look", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.listJobs.mockResolvedValue([{ ...job(), orderId: "order_1" }]);
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  const reopened = new LiveStudioService(async () => api as API, namespace);
  await reopened.startDraft("paris", "w", "casual");
  const next = (await reopened.read()).draft!;
  expect(next.checkoutKey).not.toBe(draft.checkoutKey);
  expect(next.reusedSelfies).toBe(true);
});

it("receipt lookup failure does not hide a readable gallery or discard its draft", async () => {
  await service.checkout(draft, "buyer@example.com");
  api.listJobs.mockResolvedValue([{ ...job(), orderId: "order_1" }]);
  api.reconcileWebCheckout.mockRejectedValue(new Error("temporary outage"));
  const reopened = new LiveStudioService(async () => api as API, namespace);
  const state = await reopened.read();
  expect(state.shoots).toHaveLength(1);
  expect(state.draft?.checkoutKey).toBe(draft.checkoutKey);
});

it("editing an old checkout preserves a newer draft from another tab", async () => {
  await service.checkout(draft, "old@example.com");
  await local.updateDraft(draft, { wearsGlasses: true, email: "new@example.com" });
  const changed = (await local.read()).draft;
  await expect(service.editCheckout({ orderId: "order_1" })).resolves.toBeUndefined();
  expect((await local.read()).draft).toEqual(changed);
  expect(api.cancelWebCheckout).toHaveBeenCalledExactlyOnceWith("order_1");
});

it("a failed local edit keeps the expired checkout recoverable for another attempt", async () => {
  await service.checkout(draft, "buyer@example.com");
  const reopen = vi.spyOn(LocalStudioService.prototype, "reopenCheckout").mockRejectedValueOnce(new Error("storage unavailable"));
  try {
    await expect(service.editCheckout({ orderId: "order_1" })).rejects.toThrow("storage unavailable");
    const db = await openDB(`${namespace}-operations`);
    expect((await db.getAll("attempts"))[0].orderId).toBe("order_1");
    await expect(service.editCheckout({ orderId: "order_1" })).resolves.toBeUndefined();
    expect((await local.read()).draft?.checkoutKey).not.toBe(draft.checkoutKey);
  } finally { reopen.mockRestore(); }
});

it("another tab closes a checkout whose creation response is still in flight before replacing it", async () => {
  let reply!: (value: unknown) => void;
  api.beginWebCheckout.mockImplementationOnce(() => new Promise(resolve => { reply = resolve; }));
  const old = service.checkout(draft, "buyer@example.com");
  const oldResult = expect(old).rejects.toThrow("changed");
  await vi.waitFor(() => expect(api.beginWebCheckout).toHaveBeenCalledTimes(1));
  const other = new LiveStudioService(async () => api as API, namespace);
  await other.updateDraft(draft, { wearsGlasses: true });
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  expect(await other.checkout((await local.read()).draft!, "buyer@example.com")).toMatchObject({ orderId: "order_2" });
  expect(api.cancelWebCheckout).toHaveBeenCalledExactlyOnceWith("order_1");
  reply(checkout());
  await oldResult;
  const db = await openDB(`${namespace}-operations`);
  expect((await db.getAll("attempts")).map(value => value.orderId)).toEqual(["order_2"]);
});

it("a replacement fences an old upload that finishes late before it can create payment", async () => {
  let uploaded!: (value: unknown) => void;
  api.uploadReferences.mockImplementationOnce(() => new Promise(resolve => { uploaded = resolve; }));
  const old = service.checkout(draft, "buyer@example.com");
  const oldResult = expect(old).rejects.toThrow("recovery could not be verified");
  await vi.waitFor(() => expect(api.uploadReferences).toHaveBeenCalledTimes(1));
  const other = new LiveStudioService(async () => api as API, namespace);
  await other.updateDraft(draft, { wearsGlasses: true });
  expect(await other.checkout((await local.read()).draft!, "buyer@example.com")).toMatchObject({ state: "open" });
  uploaded({ sessionId: "late_upload" });
  await oldResult;
  expect(api.createOrder).toHaveBeenCalledTimes(1);
  expect(api.beginWebCheckout).toHaveBeenCalledTimes(1);
});

it("simultaneous replacement attempts share one checkpoint and close only the prior order", async () => {
  await service.checkout(draft, "buyer@example.com");
  await service.updateDraft(draft, { wearsGlasses: true });
  const changed = (await local.read()).draft!;
  const other = new LiveStudioService(async () => api as API, namespace);
  api.createOrder.mockResolvedValue({ orderId: "order_2" });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: "order_2" });
  await Promise.all([service.checkout(changed, "buyer@example.com"), other.checkout(changed, "buyer@example.com")]);
  expect(api.cancelWebCheckout.mock.calls.every(([id]: [string]) => id === "order_1")).toBe(true);
  const db = await openDB(`${namespace}-operations`);
  expect((await db.getAll("attempts")).map(value => value.orderId)).toEqual(["order_2"]);
  const replacementUploads = api.uploadReferences.mock.calls.slice(1);
  expect(new Set(replacementUploads.map((call: any[]) => call[1])).size).toBe(1);
});

it("gallery settlement preserves a newer draft and requires its earlier payment to be resolved", async () => {
  await service.checkout(draft, "buyer@example.com");
  await local.startDraft("paris", "w", "chic");
  const newer = (await local.read()).draft;
  api.listJobs.mockResolvedValue([{ ...job(), orderId: "order_1" }]);
  api.reconcileWebCheckout.mockResolvedValue(checkout("fulfilled"));
  const reopened = new LiveStudioService(async () => api as API, namespace);
  const state = await reopened.read();
  expect(state.draft).toEqual(newer);
  expect(state.savedSelfies).toBeUndefined();
  expect(api.reconcileWebCheckout).not.toHaveBeenCalled();
  api.cancelWebCheckout.mockResolvedValue(checkout("fulfilled"));
  expect(await reopened.checkout(newer!, "buyer@example.com")).toMatchObject({ orderId: "order_1", state: "fulfilled" });
  expect(api.beginWebCheckout).toHaveBeenCalledTimes(1);
});

it("recovered missing-photo retries coalesce and refresh without spending a reshoot or sending mail", async () => {
  const recovered = { ...job(), uid: 'other-browser', generationState: 'finished', manualRetriesPerSlot: 1 };
  recovered.slots[1].status = 'retryable';
  api.listJobs.mockResolvedValue([]);
  api.listWebGalleries = vi.fn().mockResolvedValue({ email: 'buyer@example.com', jobs: [recovered], nextCursor: null });
  let finish!: () => void;
  api.retrySlot = vi.fn().mockImplementation(() => new Promise<void>(resolve => { finish = resolve; }));
  await service.read();
  const first = service.retryPhoto('job_1', 's1');
  const second = service.retryPhoto('job_1', 's1');
  expect(first).toBe(second);
  await vi.waitFor(() => expect(api.retrySlot).toHaveBeenCalledExactlyOnceWith('job_1', 's1'));
  finish(); await first;
  expect(api.listWebGalleries.mock.calls.length).toBeGreaterThan(1);
  expect((await service.read()).shoots[0].reshootsLeft).toBe(3);
  expect(api.reshoot).not.toHaveBeenCalled();
});

it("each original-browser gallery retains its own paid delivery email", async () => {
  await service.checkout(draft, 'first@example.com');
  api.listJobs.mockResolvedValue([{ ...job(), orderId: 'order_1' }]);
  expect((await service.read()).shoots[0].deliveryEmail).toBe('first@example.com');
});

it("editing an email after returning from Stripe expires the unpaid checkout before replacing it", async () => {
  await service.checkout(draft, 'old@example.com');
  api.createOrder.mockResolvedValue({ orderId: 'order_2' });
  api.beginWebCheckout.mockResolvedValue({ ...checkout(), orderId: 'order_2' });
  await expect(service.checkout(draft, 'correct@example.com')).resolves.toMatchObject({ orderId: 'order_2', state: 'open' });
  expect(api.cancelWebCheckout).toHaveBeenCalledExactlyOnceWith('order_1');
  expect(api.beginWebCheckout.mock.calls.at(-1)).toEqual(['order_2', 'correct@example.com', directAttribution()]);
  expect(api.cancelWebCheckout.mock.invocationCallOrder[0]).toBeLessThan(api.createOrder.mock.invocationCallOrder[1]);
});

it("a payment that wins an email edit opens the paid order without a new checkout", async () => {
  await service.checkout(draft, 'paid@example.com');
  api.cancelWebCheckout.mockResolvedValue(checkout('fulfilled'));
  await expect(service.checkout(draft, 'edited@example.com')).resolves.toMatchObject({ state: 'fulfilled', jobId: 'job_1' });
  expect(api.createOrder).toHaveBeenCalledTimes(1);
  expect(api.beginWebCheckout).toHaveBeenCalledTimes(1);
  expect((await local.read()).email).toBe('paid@example.com');
});
