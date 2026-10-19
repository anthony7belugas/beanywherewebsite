import { openDB } from "idb";
import { applyReshoot, createDemoShoot, emptyState } from "../lib/domain";
import { decodeStoredState } from "../lib/stored-state";
import { packById } from "../lib/catalog";
import type {
  CheckoutReview,
  DraftGuard,
  DraftUpdate,
  StudioState,
  StudioService,
  Styling,
} from "../lib/types";

/** Only backend instantiated by the app. No Firebase, payment, analytics, or AI requests. */
export class LocalStudioService implements StudioService {
  private db: ReturnType<typeof openDB> | undefined;
  private listeners = new Set<() => void>();
  private channel: BroadcastChannel | null = null;
  constructor(private name = "beanywhere-private-studio-v1") {
    try {
      if (
        typeof window !== "undefined" &&
        typeof BroadcastChannel !== "undefined"
      ) {
        this.channel = new BroadcastChannel(name);
        this.channel.onmessage = this.notify;
      }
    } catch {
      // Storage can still work when browser policy disables cross-tab messaging.
    }
  }
  private database() {
    // Open on demand so storage failures reach the app's recovery UI.
    return (this.db ??= openDB(this.name, 1, {
      upgrade(db) {
        db.createObjectStore("studio");
      },
    }));
  }
  private notify = () => {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        /* Notifications cannot undo a committed write. */
      }
    }
  };
  private visible = () => {
    if (document.visibilityState === "visible") this.notify();
  };
  private changed() {
    this.notify();
    try {
      this.channel?.postMessage("changed");
    } catch {
      /* Focus refresh is the fallback. */
    }
  }
  async read(): Promise<StudioState> {
    return decodeStoredState(
      await (await this.database()).get("studio", "state"),
    );
  }
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    if (this.listeners.size === 1 && typeof window !== "undefined") {
      window.addEventListener("focus", this.notify);
      document.addEventListener("visibilitychange", this.visible);
    }
    return () => {
      this.listeners.delete(fn);
      if (!this.listeners.size && typeof window !== "undefined") {
        window.removeEventListener("focus", this.notify);
        document.removeEventListener("visibilitychange", this.visible);
      }
    };
  }
  private async mutate<T>(fn: (state: StudioState) => T): Promise<T> {
    const db = await this.database();
    const tx = db.transaction("studio", "readwrite");
    try {
      const state = decodeStoredState(await tx.store.get("state"));
      const result = fn(state);
      await tx.store.put(state, "state");
      await tx.done;
      this.changed();
      return result;
    } catch (error) {
      try {
        tx.abort();
        await tx.done;
      } catch {}
      throw error;
    }
  }
  async updateDraft(expected: DraftGuard, patch: DraftUpdate) {
    await this.mutate((s) => {
      if (
        !s.draft ||
        s.draft.checkoutKey !== expected.checkoutKey ||
        s.draft.referenceVersion !== expected.referenceVersion
      )
        throw new Error(
          "Your draft or selected photos changed. Please review them and try again.",
        );
      s.draft = { ...s.draft, ...patch };
      if (patch.references !== undefined) {
        // Consent belongs to the selected photos; stale preparation must never undo deletion.
        s.draft.referenceVersion++;
        s.draft.consent = false;
      }
    });
  }
  async startDraft(packId: string, styling: Styling, styleId: string) {
    await this.mutate((s) => {
      const pack = packById(packId);
      if (!pack?.styleDirections[styling]?.some((v) => v.id === styleId))
        throw new Error("This look is unavailable.");
      if (
        s.draft?.packId === packId &&
        s.draft.styling === styling &&
        s.draft.styleId === styleId
      )
        return;
      s.draft = {
        packId,
        styling,
        styleId,
        references: s.draft?.references || [],
        wearsGlasses: s.draft?.wearsGlasses || false,
        consent: s.draft?.consent || false,
        email: s.draft?.email || s.email,
        checkoutKey: crypto.randomUUID(),
        referenceVersion: 0,
      };
    });
  }
  async setStyling(styling: Styling) {
    await this.mutate((s) => {
      s.preferredStyling = styling;
    });
  }
  async checkout(review: CheckoutReview, email: string) {
    return this.mutate((s) => {
      const existing = s.shoots.find(
        (j) => j.checkoutKey === review.checkoutKey,
      );
      if (existing) return existing;
      if (
        !s.draft ||
        s.draft.checkoutKey !== review.checkoutKey ||
        s.draft.referenceVersion !== review.referenceVersion ||
        s.draft.wearsGlasses !== review.wearsGlasses
      )
        throw new Error("This checkout has changed. Review your shoot again.");
      // Validate the reviewed selection and save the email in the same transaction.
      const checked = { ...s.draft, email: email.trim() };
      const shoot = createDemoShoot(checked);
      s.shoots.unshift(shoot);
      s.email = checked.email;
      s.draft = null;
      return shoot;
    });
  }
  async setFavorite(id: string, slotId: string, favorite: boolean) {
    await this.mutate((s) => {
      const p = s.shoots
        .find((j) => j.id === id)
        ?.photos.find((p) => p.slotId === slotId);
      if (!p) throw new Error("Photo not found.");
      p.favorite = favorite;
    });
  }
  async reshoot(id: string, slotId: string, op: string) {
    await this.mutate((s) => {
      const i = s.shoots.findIndex((j) => j.id === id);
      if (i < 0) throw new Error("Shoot not found.");
      s.shoots[i] = applyReshoot(s.shoots[i], slotId, op);
    });
  }
  async deleteShoot(id: string) {
    await this.mutate((s) => {
      s.shoots = s.shoots.filter((j) => j.id !== id);
    });
  }
  async clearReferences() {
    await this.mutate((s) => {
      if (s.draft) {
        s.draft.references = [];
        s.draft.consent = false;
        s.draft.referenceVersion++;
      }
    });
  }
  async reset() {
    // Recovery must work even when the existing record cannot be decoded.
    const db = await this.database();
    const tx = db.transaction("studio", "readwrite");
    await tx.store.put(emptyState(), "state");
    await tx.done;
    this.changed();
  }
}
