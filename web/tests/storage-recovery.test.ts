import { describe, expect, it } from "vitest";
import { openDB } from "idb";
import { LocalStudioService } from "../src/services/local";
import { emptyState } from "../src/lib/domain";
import { packs, sceneImage } from "../src/lib/catalog";
import { InvalidStoredStateError } from "../src/lib/stored-state";

async function stored(raw: unknown) {
  const name = crypto.randomUUID();
  const db = await openDB(name, 1, {
    upgrade(db) {
      db.createObjectStore("studio");
    },
  });
  await db.put("studio", raw, "state");
  return { db, service: new LocalStudioService(name) };
}
describe("saved studio recovery", () => {
  it.each([
    null,
    false,
    { ...emptyState(), version: 2 },
    { ...emptyState(), shoots: [{}] },
    { ...emptyState(), draft: { packId: "missing" } },
  ])(
    "rejects incompatible saved data without overwriting it: %j",
    async (raw) => {
      const { service, db } = await stored(raw);
      await expect(service.read()).rejects.toBeInstanceOf(
        InvalidStoredStateError,
      );
      await expect(service.setStyling("m")).rejects.toBeInstanceOf(
        InvalidStoredStateError,
      );
      expect(await db.get("studio", "state")).toEqual(raw);
    },
  );
  it("can reset a malformed record even though normal reads reject it", async () => {
    const { service } = await stored({ draft: "broken" });
    await service.reset();
    expect(await service.read()).toEqual(emptyState());
  });
  it("preserves an older valid draft while adding its missing edit revision", async () => {
    const pack = packs[0],
      styleId = pack.styleDirections.w[0].id;
    const draft = {
      packId: pack.packId,
      styling: "w",
      styleId,
      references: [
        {
          id: "sample",
          name: "Sample",
          url: sceneImage(pack, "w", styleId, 0),
          width: 720,
          height: 1080,
          sample: true,
        },
      ],
      consent: false,
      wearsGlasses: true,
      email: "kept@example.com",
      checkoutKey: "kept-key",
    };
    const { service, db } = await stored({ ...emptyState(), draft });
    const state = await service.read();
    expect(state.draft).toEqual({ ...draft, referenceVersion: 0 });
    expect((await db.get("studio", "state")).draft).toEqual(draft);
    await service.updateDraft(state.draft!, { consent: true });
    expect((await service.read()).draft?.references).toEqual(draft.references);
  });
});
