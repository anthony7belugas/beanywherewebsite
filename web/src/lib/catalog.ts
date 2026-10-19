import rawCatalog from "./catalog.json";
import type { Pack, Styling } from "./types";
export const packs = rawCatalog as Pack[];
export const packById = (id: string) => packs.find((p) => p.packId === id);
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
