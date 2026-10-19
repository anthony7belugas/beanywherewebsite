import { packById, sceneImage } from "./catalog";
import type { Draft, Shoot, StudioState } from "./types";
export const emptyState = (): StudioState => ({
  version: 1,
  draft: null,
  shoots: [],
  preferredStyling: "w",
  email: "",
});
export function validateDraft(draft: Draft | null): string | null {
  if (!draft) return "Choose a photoshoot first.";
  const pack = packById(draft.packId);
  if (
    !pack ||
    !pack.styleDirections[draft.styling]?.some((s) => s.id === draft.styleId)
  )
    return "Choose an available look.";
  if (draft.references.length < 4 || draft.references.length > 6)
    return "Add 4–6 clear photos before continuing.";
  if (
    new Set(draft.references.map((r) => r.id)).size !== draft.references.length
  )
    return "Choose different reference photos.";
  if (!draft.consent)
    return "Please confirm the photo permission and age requirements.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) ||
    draft.email.length > 254
  )
    return "Enter a valid email address.";
  return null;
}
export function createDemoShoot(draft: Draft, now = Date.now()): Shoot {
  const error = validateDraft(draft);
  if (error) throw new Error(error);
  const pack = packById(draft.packId)!;
  return {
    id: crypto.randomUUID(),
    packId: draft.packId,
    styling: draft.styling,
    styleId: draft.styleId,
    createdAt: now,
    reshootsLeft: 3,
    checkoutKey: draft.checkoutKey,
    operationIds: [],
    sample: true,
    photos: Array.from({ length: 12 }, (_, i) => ({
      slotId: `s${i}`,
      sceneId: pack.scenes[Math.floor(i / 2)].sceneId,
      label: pack.scenes[Math.floor(i / 2)].label,
      take: (i % 2) + 1,
      url: sceneImage(pack, draft.styling, draft.styleId, Math.floor(i / 2)),
      favorite: false,
      revision: 0,
      readyAt: now + 1400 + i * 400,
    })),
  };
}
export function applyReshoot(
  shoot: Shoot,
  slotId: string,
  operationId: string,
  now = Date.now(),
): Shoot {
  if (shoot.operationIds.includes(operationId)) return shoot;
  const photo = shoot.photos.find((p) => p.slotId === slotId);
  if (!photo || photo.readyAt > now)
    throw new Error("Wait for this photo to finish.");
  if (shoot.reshootsLeft <= 0)
    throw new Error("All three reshoots have been used.");
  return {
    ...shoot,
    reshootsLeft: shoot.reshootsLeft - 1,
    operationIds: [...shoot.operationIds, operationId],
    photos: shoot.photos.map((p) =>
      p.slotId === slotId
        ? { ...p, revision: p.revision + 1, readyAt: now + 2200 }
        : p,
    ),
  };
}
