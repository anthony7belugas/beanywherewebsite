import { expect, test } from "vitest";
import { nextPack, packs } from "../src/lib/catalog";

test("next shoot keeps its recommendation relevant and avoids the current shoot", () => {
  expect(nextPack("santorini")?.packId).toBe("paris");
  for (const pack of packs) {
    const suggested = nextPack(pack.packId, packs.map(p => p.packId));
    expect(suggested).toBeDefined();
    expect(suggested?.packId).not.toBe(pack.packId);
  }
});
test("an unpurchased setting takes priority over an already purchased suggestion", () => {
  const owned = ["santorini", "paris"];
  expect(owned).not.toContain(nextPack("santorini", owned)?.packId);
  const allButMiami = packs.map(pack => pack.packId).filter(id => id !== "miami");
  expect(nextPack("santorini", allButMiami)?.packId).toBe("miami");
});
