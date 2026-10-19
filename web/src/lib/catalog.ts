import rawCatalog from "./catalog.json";
import type { Pack, Styling } from "./types";
export const packs = rawCatalog as Pack[];
export const packById = (id: string) => packs.find((p) => p.packId === id);
// One relevant suggestion, preferring a setting the customer hasn't bought yet.
export function nextPack(currentId: string, ownedIds: string[] = []) {
  const pair: Record<string, string> = { santorini: "paris", paris: "santorini", miami: "nightout", nightout: "everyday", everyday: "paris", alpine: "santorini" };
  const others = packs.filter(pack => pack.packId !== currentId);
  const candidates = others.filter(pack => !ownedIds.includes(pack.packId));
  return candidates.find(pack => pack.packId === pair[currentId]) || candidates[0] || others.find(pack => pack.packId === pair[currentId]) || others[0];
}
export const cover = (id: string, styling: Styling = "w") =>
  `./assets/covers/${id}-${styling}.webp`;
export const sceneImage = (
  pack: Pack,
  styling: Styling,
  styleId: string,
  index: number,
) => `./assets/scenes/${pack.packId}/${styling}/${styleId}/${index}.webp`;
export const category = (id: string) =>
  ["paris", "santorini", "miami", "alpine"].includes(id)
    ? "Escapes"
    : "Everyday & evenings";
export const location = (id: string) =>
  ({
    paris: "FRANCE",
    santorini: "GREECE",
    miami: "FLORIDA",
    alpine: "THE MOUNTAINS",
    nightout: "AFTER HOURS",
    everyday: "WHEREVER YOU ARE",
  })[id] || "";
