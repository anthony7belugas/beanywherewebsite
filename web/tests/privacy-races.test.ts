import { describe, expect, it } from "vitest";
import { LocalStudioService } from "../src/services/local";
import { packs } from "../src/lib/catalog";
import type { Draft, DraftUpdate, Reference } from "../src/lib/types";

const reference: Reference = {
  id: "private",
  name: "selfie.jpg",
  url: "data:image/jpeg;base64,private",
  width: 800,
  height: 1000,
  sample: false,
};
async function start(svc: LocalStudioService, pack = packs[0]) {
  await svc.startDraft(pack.packId, "w", pack.styleDirections.w[0].id);
  return (await svc.read()).draft!;
}
const update = (svc: LocalStudioService, snapshot: Draft, patch: DraftUpdate) =>
  svc.updateDraft(snapshot, patch);

describe("privacy and stale draft races", () => {
  it("does not restore photos when preparation finishes after removal", async () => {
    const svc = new LocalStudioService(crypto.randomUUID());
    const before = await start(svc);
    await svc.clearReferences();
    await expect(
      update(svc, before, { references: [reference] }),
    ).rejects.toThrow();
    expect((await svc.read()).draft?.references).toEqual([]);
  });
  it("does not write an old email or photos into a replacement draft", async () => {
    const svc = new LocalStudioService(crypto.randomUUID());
    const before = await start(svc);
    await svc.reset();
    await start(svc, packs[1]);
    await expect(
      update(svc, before, {
        references: [reference],
        email: "old@example.com",
      }),
    ).rejects.toThrow();
    expect((await svc.read()).draft?.email).toBe("");
  });
  it("does not overwrite newer photo edits from another tab", async () => {
    const name = crypto.randomUUID();
    const svc = new LocalStudioService(name);
    const before = await start(svc);
    const other = new LocalStudioService(name);
    await update(other, before, { references: [reference] });
    await expect(update(svc, before, { references: [] })).rejects.toThrow();
    expect((await svc.read()).draft?.references).toEqual([reference]);
  });
  it("requires fresh permission after the selected photos change", async () => {
    const svc = new LocalStudioService(crypto.randomUUID());
    const before = await start(svc);
    await update(svc, before, { consent: true });
    await update(svc, (await svc.read()).draft!, { references: [reference] });
    expect((await svc.read()).draft?.consent).toBe(false);
  });
});
