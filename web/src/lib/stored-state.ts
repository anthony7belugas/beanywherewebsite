import { packs, packById, sceneImage } from "./catalog";
import { emptyState } from "./domain";
import type { StudioState, Styling } from "./types";

export class InvalidStoredStateError extends Error {
  constructor() {
    super(
      "The saved studio is incomplete or uses an unsupported format. Your saved data has not been changed. You can retry, or reset this local studio.",
    );
    this.name = "InvalidStoredStateError";
  }
}
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string";
const id = (v: unknown): v is string =>
  text(v) && v.length > 0 && v.length <= 256;
const integer = (v: unknown): v is number =>
  Number.isSafeInteger(v) && Number(v) >= 0;
const styling = (v: unknown): v is Styling => v === "w" || v === "m";
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const unique = (items: Record<string, unknown>[], key: string) =>
  new Set(items.map((item) => item[key])).size === items.length;
const samplePaths = new Set(
  packs.flatMap((p) =>
    (["w", "m"] as const).flatMap((g) =>
      p.styleDirections[g].flatMap((s) =>
        p.scenes.map((_, i) => sceneImage(p, g, s.id, i)),
      ),
    ),
  ),
);
function look(v: Record<string, unknown>) {
  return (
    text(v.packId) &&
    styling(v.styling) &&
    text(v.styleId) &&
    !!packById(v.packId)?.styleDirections[v.styling].some(
      (s) => s.id === v.styleId,
    )
  );
}
function reference(v: unknown): v is Record<string, unknown> {
  return (
    record(v) &&
    id(v.id) &&
    text(v.name) &&
    typeof v.sample === "boolean" &&
    finite(v.width) &&
    v.width > 0 &&
    finite(v.height) &&
    v.height > 0 &&
    text(v.url) &&
    (samplePaths.has(v.url) || v.url.startsWith("data:image/jpeg;base64,"))
  );
}
function draft(v: unknown) {
  return (
    record(v) &&
    look(v) &&
    id(v.checkoutKey) &&
    text(v.email) &&
    typeof v.consent === "boolean" &&
    typeof v.wearsGlasses === "boolean" &&
    (v.referenceVersion === undefined || integer(v.referenceVersion)) &&
    Array.isArray(v.references) &&
    v.references.length <= 6 &&
    v.references.every(reference) &&
    unique(v.references, "id")
  );
}
function photo(v: unknown): v is Record<string, unknown> {
  return (
    record(v) &&
    id(v.slotId) &&
    id(v.sceneId) &&
    text(v.label) &&
    (v.take === 1 || v.take === 2) &&
    typeof v.favorite === "boolean" &&
    integer(v.revision) &&
    finite(v.readyAt) &&
    text(v.url) &&
    samplePaths.has(v.url)
  );
}
function shoot(v: unknown): v is Record<string, unknown> {
  return (
    record(v) &&
    look(v) &&
    id(v.id) &&
    id(v.checkoutKey) &&
    v.sample === true &&
    finite(v.createdAt) &&
    integer(v.reshootsLeft) &&
    v.reshootsLeft <= 3 &&
    Array.isArray(v.operationIds) &&
    v.operationIds.every(id) &&
    Array.isArray(v.photos) &&
    v.photos.length === 12 &&
    v.photos.every(photo) &&
    unique(v.photos, "slotId")
  );
}
/** Validate before rendering; preserve incompatible data until an explicit reset. */
export function decodeStoredState(raw: unknown): StudioState {
  if (raw === undefined) return emptyState();
  if (
    !record(raw) ||
    raw.version !== 1 ||
    !styling(raw.preferredStyling) ||
    !text(raw.email) ||
    (raw.draft !== null && !draft(raw.draft)) ||
    !Array.isArray(raw.shoots) ||
    !raw.shoots.every(shoot) ||
    !unique(raw.shoots, "id") ||
    !unique(raw.shoots, "checkoutKey")
  )
    throw new InvalidStoredStateError();
  const state = raw as unknown as StudioState;
  if (state.draft) state.draft.referenceVersion ??= 0;
  return state;
}
