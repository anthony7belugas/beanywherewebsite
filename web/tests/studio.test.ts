import { describe, it, expect, vi } from "vitest";
import { LocalStudioService } from "../src/services/local";
import { packs, sceneImage } from "../src/lib/catalog";
import {
  validateDraft,
  createDemoShoot,
  applyReshoot,
} from "../src/lib/domain";
import {
  authorizedOutput,
  readableJob,
  type NativeJobProjection,
} from "../integration/firebase-adapter";
import type { Draft } from "../src/lib/types";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
const draft = (): Draft => ({
  packId: "paris",
  styling: "w",
  styleId: packs.find((p) => p.packId === "paris")!.styleDirections.w[0].id,
  wearsGlasses: false,
  consent: true,
  email: "preview@example.com",
  checkoutKey: crypto.randomUUID(),
  referenceVersion: 0,
  references: Array.from({ length: 4 }, (_, i) => ({
    id: `ref${i}`,
    name: `Photo ${i}`,
    url: `data:image/jpeg;base64,${i}`,
    width: 800,
    height: 1000,
    sample: true,
  })),
});
async function prepared(name = crypto.randomUUID()) {
  const svc = new LocalStudioService(name);
  const d = draft();
  await svc.startDraft(d.packId, d.styling, d.styleId);
  const current = (await svc.read()).draft!;
  await svc.updateDraft(current, { references: d.references, email: d.email });
  await svc.updateDraft((await svc.read()).draft!, { consent: true });
  Object.assign(d, (await svc.read()).draft!);
  return { svc, d, name };
}
describe("local checkout and privacy", () => {
  it("requires a valid pack, distinct references, consent and valid email", () => {
    const d = draft();
    expect(validateDraft(d)).toBeNull();
    expect(validateDraft({ ...d, references: [] })).toMatch("4–6");
    expect(validateDraft({ ...d, email: "bad" })).toMatch("email");
    expect(validateDraft({ ...d, consent: false })).toMatch("permission");
    expect(validateDraft({ ...d, styleId: "missing" })).toMatch("look");
    expect(
      validateDraft({ ...d, references: Array(4).fill(d.references[0]) }),
    ).toMatch("different");
  });
  it("deduplicates concurrent checkout and loses no paid-equivalent state across reload", async () => {
    const { svc, d, name } = await prepared();
    const second = new LocalStudioService(name);
    const [a, b] = await Promise.all([
      svc.checkout(d, d.email),
      second.checkout(d, d.email),
    ]);
    expect(a.id).toBe(b.id);
    const state = await new LocalStudioService(name).read();
    expect(state.shoots).toHaveLength(1);
    expect(state.shoots[0].photos).toHaveLength(12);
    expect(state.draft).toBeNull();
    expect(state.email).toBe(d.email);
    expect(JSON.stringify(state)).not.toContain("data:image");
  });
  it("rejects stale checkouts and preserves selected references", async () => {
    const { svc, d } = await prepared();
    await expect(
      svc.checkout({ ...d, checkoutKey: "stale" }, d.email),
    ).rejects.toThrow("changed");
    expect((await svc.read()).draft?.references).toHaveLength(4);
    expect((await svc.read()).shoots).toHaveLength(0);
    await svc.checkout(d, d.email);
  });
  it("persists favorites, deletes one shoot, and wipes all private local fields", async () => {
    const { svc, d } = await prepared();
    const j = await svc.checkout(d, d.email);
    await svc.setFavorite(j.id, "s0", true);
    expect((await svc.read()).shoots[0].photos[0].favorite).toBe(true);
    await svc.deleteShoot(j.id);
    expect((await svc.read()).shoots).toHaveLength(0);
    await svc.startDraft(d.packId, d.styling, d.styleId);
    const current = (await svc.read()).draft!;
    await svc.updateDraft(current, {
      references: d.references,
      email: d.email,
    });
    await svc.updateDraft((await svc.read()).draft!, { consent: true });
    Object.assign(d, (await svc.read()).draft!);
    await svc.clearReferences();
    expect((await svc.read()).draft?.references).toEqual([]);
    expect((await svc.read()).draft?.consent).toBe(false);
    await svc.reset();
    expect((await svc.read()).email).toBe("");
    expect((await svc.read()).draft).toBeNull();
  });
  it("recovers generation progress from absolute time and enforces three idempotent reshoots", () => {
    let j = createDemoShoot(draft(), 0);
    expect(j.photos.filter((p) => p.readyAt < 10000)).toHaveLength(12);
    j = applyReshoot(j, "s0", "op1", 10000);
    expect(j.reshootsLeft).toBe(2);
    expect(applyReshoot(j, "s0", "op1", 10000)).toEqual(j);
    expect(() => applyReshoot(j, "s0", "op2", 10001)).toThrow("finish");
    j = applyReshoot(j, "s1", "op2", 10000);
    j = applyReshoot(j, "s2", "op3", 10000);
    expect(j.reshootsLeft).toBe(0);
    expect(() => applyReshoot(j, "s3", "op4", 15000)).toThrow("three");
  });
  it("serializes reshoot races across service instances", async () => {
    const { svc, d, name } = await prepared();
    const j = await svc.checkout(d, d.email);
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 30000);
    try {
      const other = new LocalStudioService(name);
      await Promise.all([
        svc.reshoot(j.id, "s0", "same-op"),
        other.reshoot(j.id, "s0", "same-op"),
      ]);
      expect((await svc.read()).shoots[0].reshootsLeft).toBe(2);
    } finally {
      vi.restoreAllMocks();
    }
  });
});
describe("catalog and integration boundary", () => {
  it("has all six packs and 144 matching scene assets without private prompts", () => {
    expect(packs).toHaveLength(6);
    for (const p of packs) {
      expect(p.scenes).toHaveLength(6);
      expect(JSON.stringify(p)).not.toMatch(
        /face-lock|outfits|noGlasses|realism/,
      );
      for (const g of ["w", "m"] as const) {
        expect(
          existsSync(resolve("public/assets/covers", `${p.packId}-${g}.webp`)),
        ).toBe(true);
        for (const s of p.styleDirections[g])
          for (let i = 0; i < 6; i++)
            expect(
              existsSync(resolve("public", sceneImage(p, g, s.id, i))),
            ).toBe(true);
      }
    }
  });
  it("never exposes another user’s, deleted, refunded, hidden, or unlisted output", () => {
    const path = "outputs/u/j/photo.jpg";
    const job: NativeJobProjection = {
      uid: "u",
      packId: "paris",
      styling: "w",
      styleId: "casual",
      clientVisible: true,
      status: "done",
      reshootsLeft: 3,
      readableOutputPaths: [path],
      slots: [{ slotId: "s0", sceneId: "a", take: 1, status: "done", path }],
    };
    expect(authorizedOutput(job, "u", path, "j")).toBe(true);
    expect(authorizedOutput(job, "other", path, "j")).toBe(false);
    expect(
      authorizedOutput({ ...job, readableOutputPaths: [] }, "u", path, "j"),
    ).toBe(false);
    expect(readableJob({ ...job, deletedByUser: true }, "u")).toBe(false);
    expect(readableJob({ ...job, refundOutputAccessRevoked: true }, "u")).toBe(
      false,
    );
    expect(readableJob({ ...job, clientVisible: false }, "u")).toBe(false);
  });
});
