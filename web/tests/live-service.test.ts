import { beforeEach, expect, it, vi } from "vitest";
import { openDB } from "idb";
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
  expect(api.beginWebCheckout).toHaveBeenCalledExactlyOnceWith("order_1", "buyer@example.com");
  expect((await local.read()).draft).not.toBeNull();
});

it("a lost checkout response retries the same saved order without uploading or creating another", async () => {
  api.beginWebCheckout.mockRejectedValueOnce(new Error("lost response"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow("lost response");
  await service.checkout(draft, "buyer@example.com");
  expect(api.uploadReferences).toHaveBeenCalledTimes(1);
  expect(api.createOrder).toHaveBeenCalledTimes(1);
  expect(api.beginWebCheckout.mock.calls).toEqual([["order_1", "buyer@example.com"], ["order_1", "buyer@example.com"]]);
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

it("does not replace the email of an unresolved payment attempt", async () => {
  api.beginWebCheckout.mockRejectedValueOnce(new Error("unknown"));
  await expect(service.checkout(draft, "buyer@example.com")).rejects.toThrow();
  await expect(service.checkout(draft, "different@example.com")).rejects.toThrow("original delivery email");
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
  expect(api.beginWebCheckout.mock.calls.at(-1)).toEqual(["order_2", "buyer@example.com"]);
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
