import { describe, expect, it } from "vitest";
import { LocalStudioService } from "../src/services/local";
import { packs, sceneImage } from "../src/lib/catalog";

async function prepared(name = crypto.randomUUID()) {
  const service = new LocalStudioService(name);
  const pack = packs[0];
  const styleId = pack.styleDirections.w[0].id;
  await service.startDraft(pack.packId, "w", styleId);
  await service.updateDraft((await service.read()).draft!, {
    references: Array.from({ length: 4 }, (_, i) => ({
      id: `reference-${i}`,
      name: `Demo ${i}`,
      width: 720,
      height: 1080,
      url: sceneImage(pack, "w", styleId, i),
      sample: true,
    })),
    email: "review@example.com",
  });
  await service.updateDraft((await service.read()).draft!, { consent: true });
  return { service, name, draft: (await service.read()).draft! };
}

describe("checkout review and committed writes", () => {
  it("rejects checkout if another tab replaces and approves different references after review", async () => {
    const { service, name, draft } = await prepared();
    const other = new LocalStudioService(name);
    await other.updateDraft(draft, {
      references: draft.references.slice().reverse(),
    });
    await other.updateDraft((await other.read()).draft!, { consent: true });
    await expect(service.checkout(draft, draft.email)).rejects.toThrow(
      "changed",
    );
    expect((await service.read()).shoots).toHaveLength(0);
  });
  it("does not report a committed checkout as failed when an update listener throws", async () => {
    const { service, draft } = await prepared();
    service.subscribe(() => {
      throw new Error("subscriber failed");
    });
    await expect(service.checkout(draft, draft.email)).resolves.toMatchObject({
      checkoutKey: draft.checkoutKey,
    });
    expect((await service.read()).shoots).toHaveLength(1);
  });
});

it("keeps the same favorite choice made simultaneously in two tabs", async () => {
  const { service, name, draft } = await prepared();
  const shoot = await service.checkout(draft, draft.email);
  const other = new LocalStudioService(name);
  await Promise.all([
    service.setFavorite(shoot.id, "s0", true),
    other.setFavorite(shoot.id, "s0", true),
  ]);
  expect((await service.read()).shoots[0].photos[0].favorite).toBe(true);
});

it("rejects a changed glasses preference and a revoked permission at checkout", async () => {
  const { service, draft } = await prepared();
  await service.updateDraft(draft, { wearsGlasses: true });
  await expect(service.checkout(draft, draft.email)).rejects.toThrow("changed");
  const current = (await service.read()).draft!;
  await service.updateDraft(current, { consent: false });
  await expect(service.checkout(current, current.email)).rejects.toThrow(
    "permission",
  );
  expect((await service.read()).shoots).toHaveLength(0);
});

it("saves checkout email atomically and returns the original result on retries", async () => {
  const { service, name, draft } = await prepared();
  const other = new LocalStudioService(name);
  const [a, b] = await Promise.all([
    service.checkout(draft, " new@example.com "),
    other.checkout(draft, "second@example.com"),
  ]);
  expect(a.id).toBe(b.id);
  const state = await service.read();
  expect(state.shoots).toHaveLength(1);
  expect(state.email).toBe("new@example.com");
  expect(state.draft).toBeNull();
});

it("does not persist an invalid checkout email or discard selected photos", async () => {
  const { service, draft } = await prepared();
  await expect(service.checkout(draft, "invalid")).rejects.toThrow("email");
  expect((await service.read()).draft).toEqual(draft);
  expect((await service.read()).shoots).toHaveLength(0);
});
