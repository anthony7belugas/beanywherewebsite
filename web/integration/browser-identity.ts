import { openDB } from "idb";

const SECRET_KEY = "browser-secret-v1";
const SECRET = /^[a-f0-9]{64}$/;

/** IndexedDB transactions serialize first use in multiple tabs. This store is separate from
 * drafts: clearing selfies or demo data must never silently abandon a paid web identity. */
export async function browserIdentity(databaseName = "beanywhere-web-identity-v1") {
  const db = await openDB(databaseName, 1, {
    upgrade(database) { database.createObjectStore("identity"); },
  });
  try {
    const tx = db.transaction("identity", "readwrite");
    const existing: unknown = await tx.store.get(SECRET_KEY);
    if (existing !== undefined) {
      await tx.done;
      if (typeof existing !== "string" || !SECRET.test(existing)) {
        throw new Error("Your saved sign-in needs recovery. Do not clear browser storage if you have a paid shoot.");
      }
      return existing;
    }
    const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)),
      byte => byte.toString(16).padStart(2, "0")).join("");
    await tx.store.add(secret, SECRET_KEY);
    await tx.done;
    return secret;
  } finally { db.close(); }
}
