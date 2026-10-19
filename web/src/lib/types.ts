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
  sample: true;
};
export type StudioState = {
  version: 1;
  draft: Draft | null;
  shoots: Shoot[];
  preferredStyling: Styling;
  email: string;
};
export interface StudioService {
  read(): Promise<StudioState>;
  subscribe(listener: () => void): () => void;
  updateDraft(expected: DraftGuard, patch: DraftUpdate): Promise<void>;
  startDraft(packId: string, styling: Styling, styleId: string): Promise<void>;
  setStyling(styling: Styling): Promise<void>;
  checkout(review: CheckoutReview, email: string): Promise<Shoot>;
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
