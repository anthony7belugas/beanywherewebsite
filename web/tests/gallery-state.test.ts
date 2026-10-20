import { expect, it } from "vitest";
import { galleryState } from "../src/lib/gallery-state";
import { projectWebJob } from "../src/services/live";
import type { NativeJobProjection } from "../integration/firebase-adapter";

const now = 2_000_000;
function job(): NativeJobProjection & { id: string } {
  return { id: "paid", uid: "owner", packId: "paris", styling: "w", styleId: "casual",
    clientVisible: true, status: "done", generationState: "finished", reshootsLeft: 3,
    retryWindowEndsAtMs: now + 1000, deliveryClosedAt: {}, readableOutputPaths: ["photo.jpg"],
    slots: [{ slotId: "s0", sceneId: "eiffel", take: 1, path: "photo.jpg", status: "done" }] };
}

it.each(["owner", "recovered"])("shows an active %s reshoot as work in progress, not a failed delivery", kind => {
  const source = job();
  source.slots[0] = { ...source.slots[0], status: "developing", path: undefined,
    ...(kind === "owner" ? { claimId: "operation", prevPath: "photo.jpg" } : { reshooting: true }) };
  const shoot = projectWebJob(source, {});
  expect(shoot.photos[0].reshooting).toBe(true);
  expect(shoot.photos[0].readyAt).toBe(Infinity);
  expect(galleryState(shoot, now)).toMatchObject({ reshooting: 1, stopped: false });
  expect(galleryState(shoot, now).reshootUnavailable).toContain("Wait for it to finish");
});

it("allows a completed shoot to reshoot, then closes the controls at its deadline without hiding downloads", () => {
  const shoot = projectWebJob(job(), {});
  expect(galleryState(shoot, now).reshootUnavailable).toBe("");
  expect(galleryState(shoot, now).reshootSummary).toBe("3 reshoots left");
  expect(galleryState(shoot, now).reshootDeadline).not.toBe("");
  expect(galleryState(shoot, now + 1001).reshootUnavailable).toContain("window has ended");
  expect(galleryState(shoot, now + 1001).reshootSummary).toBe("Reshoot window ended");
  expect(galleryState(shoot, now + 1001).reshootDeadline).toBe("");
  expect(shoot.photos[0].readyAt).toBe(0);
});

it.each([
  { patch: { generationState: "paused" }, summary: "Reshoots paused" },
  { patch: { emailRequestState: "sending" }, summary: "Reshoots available after email delivery" },
  { patch: { reshootsLeft: 0 }, summary: "No reshoots left" },
  { patch: { status: "failed" }, summary: "Reshoots unavailable" },
])("does not advertise usable reshoots when $summary", ({ patch, summary }) => {
  const shoot = projectWebJob({ ...job(), ...patch }, {});
  const state = galleryState(shoot, now);
  expect(state.reshootSummary).toBe(summary);
  expect(state.reshootDeadline).toBe("");
});

it("uses singular reshoot copy and tolerates a missing deadline", () => {
  const shoot = projectWebJob({ ...job(), reshootsLeft: 1, retryWindowEndsAtMs: undefined }, {});
  expect(galleryState(shoot, now)).toMatchObject({ reshootSummary: "1 reshoot left", reshootDeadline: "" });
});

it.each(["failed", "partial", "generation-limit", "manual-review", "refunded"])("disables reshoots for %s shoots", reason => {
  const source = job();
  if (reason === "partial") source.slots.push({ slotId: "s1", sceneId: "eiffel", take: 2, status: "closed" });
  else if (reason === "generation-limit") source.reshootsClosedReason = reason;
  else if (reason === "manual-review") source.generationState = reason;
  else source.status = reason;
  expect(galleryState(projectWebJob(source, {}), now).reshootUnavailable).toContain("unavailable");
});

it("recovered gallery closure and deadline survive projection", () => {
  const source = { ...job(), deliveryClosedAt: undefined, deliveryClosed: true, emailRequestState: "sending" };
  const shoot = projectWebJob(source, {});
  expect(shoot.deliveryClosed).toBe(true);
  expect(shoot.retryWindowEndsAtMs).toBe(now + 1000);
  expect(galleryState(shoot, now).reshootUnavailable).toContain("attached to your email");
  expect(galleryState({ ...shoot, emailRequestState: "sent" }, now).reshootUnavailable).toBe("");
});

import { photoRetryState } from "../src/lib/gallery-state";

function missingShoot() {
  const source = job();
  source.deliveryClosedAt = undefined;
  source.manualRetriesPerSlot = 1;
  source.slots[0] = { ...source.slots[0], status: "retryable", path: undefined, manualAttempts: 0 };
  return projectWebJob(source, {});
}

it("a missing photo gets a free retry even with zero reshoots left", () => {
  const shoot = { ...missingShoot(), reshootsLeft: 0 };
  expect(photoRetryState(shoot, shoot.photos[0], now).available).toBe(true);
});

it.each([
  { generationState: "running" }, { generationState: "retry-waiting" }, { generationState: "paused" },
  { generationState: "manual-review" }, { status: "failed" }, { status: "refunded" },
  { retryWindowEndsAtMs: now - 1 }, { automaticWorkPending: true }, { deliveryClosed: true },
  { retriesClosedReason: "generation-limit" }, { generationLimitReached: true }, { manualRetriesPerSlot: 0 },
])("does not offer a retry while unavailable: %j", patch => {
  const shoot = { ...missingShoot(), ...patch };
  expect(photoRetryState(shoot, shoot.photos[0], now).available).toBe(false);
});

it("a claimed retry stays busy, and an exhausted retry has a final non-spinning state", () => {
  const shoot = missingShoot();
  const photo = shoot.photos[0];
  expect(photoRetryState(shoot, { ...photo, retrying: true, hasActiveClaim: true }, now))
    .toMatchObject({ available: false, working: true, label: "Retrying…" });
  expect(photoRetryState(shoot, { ...photo, manualAttempts: 1 }, now))
    .toMatchObject({ available: false, working: false, label: "Couldn’t finish this photo" });
});
