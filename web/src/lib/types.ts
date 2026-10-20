export type Styling = "w" | "m";
export type Pack = {
  packId: string;
  title: string;
  tagline: string;
  productId: string;
  sort: number;
  stripVersion: number;
  scenes: { sceneId: string; label: string }[];
  styleDirections: Record<
    Styling,
    { id: string; label: string; blurb: string }[]
  >;
};
export type Reference = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  sample: boolean;
};
export type Draft = {
  packId: string;
  styling: Styling;
  styleId: string;
  references: Reference[];
  wearsGlasses: boolean;
  consent: boolean;
  email: string;
  checkoutKey: string;
  referenceVersion: number;
  reusedSelfies?: boolean;
};
export type DraftGuard = Pick<Draft, "checkoutKey" | "referenceVersion">;
export type CheckoutReview = DraftGuard & Pick<Draft, "wearsGlasses">;
export type DraftUpdate = Partial<
  Pick<Draft, "references" | "wearsGlasses" | "consent" | "email">
>;
export type Photo = {
  slotId: string;
  sceneId: string;
  label: string;
  take: number;
  url: string;
  favorite: boolean;
  revision: number;
  readyAt: number;
  path?: string;
  status?: string;
  reshooting?: boolean;
  retrying?: boolean;
  hasActiveClaim?: boolean;
  manualAttempts?: number;
};
export type Shoot = {
  id: string;
  packId: string;
  styling: Styling;
  styleId: string;
  createdAt: number;
  photos: Photo[];
  reshootsLeft: number;
  checkoutKey: string;
  operationIds: string[];
  sample: boolean;
  status?: string;
  generationState?: string;
  retryWindowEndsAtMs?: number;
  deliveryClosed?: boolean;
  reshootsClosedReason?: string;
  emailRequestState?: string;
  emailDeliveryOutcomeUnknown?: boolean;
  deliveryEmail?: string;
  manualRetriesPerSlot?: number;
  retriesClosedReason?: string;
  generationLimitReached?: boolean;
  automaticWorkPending?: boolean;
};
export type CheckoutResult = Shoot | { kind: "payment"; orderId: string; url: string | null; jobId: string | null; state: string };
export type StudioState = {
  version: 1;
  draft: Draft | null;
  shoots: Shoot[];
  preferredStyling: Styling;
  email: string;
  recoveryEmail?: string;
  savedSelfies?: { references: Reference[]; wearsGlasses: boolean; savedAt: number };
};
export interface StudioService {
  readonly mode: "demo" | "live";
  read(): Promise<StudioState>;
  track?(name: string, params: Record<string, string | number | boolean>): void;
  subscribe(listener: () => void): () => void;
  updateDraft(expected: DraftGuard, patch: DraftUpdate): Promise<void>;
  startDraft(packId: string, styling: Styling, styleId: string): Promise<void>;
  setStyling(styling: Styling): Promise<void>;
  checkout(review: CheckoutReview, email: string): Promise<CheckoutResult>;
  payment?(orderId: string): Promise<Extract<CheckoutResult, { kind: "payment" }>>;
  editCheckout?(input: { orderId?: string; review?: CheckoutReview }): Promise<void>;
  photoBlob?(shootId: string, photo: Photo): Promise<Blob>;
  assertPhotos?(shootId: string, photos: Photo[]): Promise<void>;
  deleteAllPhotos?(): Promise<void>;
  recoverGalleries?(email: string): Promise<number>;
  refreshGalleries?(): Promise<void>;
  retryPhoto?(shootId: string, slotId: string): Promise<void>;
  setFavorite(
    shootId: string,
    slotId: string,
    favorite: boolean,
  ): Promise<void>;
  reshoot(shootId: string, slotId: string, operationId: string): Promise<void>;
  deleteShoot(id: string): Promise<void>;
  clearReferences(): Promise<void>;
  reset(): Promise<void>;
}
