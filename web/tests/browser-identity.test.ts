import { expect, it } from "vitest";
import { openDB, deleteDB } from "idb";
import { browserIdentity } from "../integration/browser-identity";

it("concurrent tabs reuse one 256-bit browser identity across reloads", async () => {
  const database = `identity-test-${crypto.randomUUID()}`;
  try {
    const identities = await Promise.all(Array.from({ length: 8 }, () => browserIdentity(database)));
    expect(new Set(identities).size).toBe(1);
    expect(identities[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(await browserIdentity(database)).toBe(identities[0]);
  } finally { await deleteDB(database); }
});

it("does not silently replace a damaged saved identity and abandon paid photos", async () => {
  const database = `identity-test-${crypto.randomUUID()}`;
  const db = await openDB(database, 1, { upgrade(value) { value.createObjectStore("identity"); } });
  await db.put("identity", "damaged", "browser-secret-v1");
  db.close();
  try {
    await expect(browserIdentity(database)).rejects.toThrow("needs recovery");
    const verify = await openDB(database, 1);
    expect(await verify.get("identity", "browser-secret-v1")).toBe("damaged");
    verify.close();
  } finally { await deleteDB(database); }
});
