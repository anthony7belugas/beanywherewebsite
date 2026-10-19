/** Only catalog IDs and fixed event fields leave the browser. Never pass a URL, email or reference. */
import { packById } from "../src/lib/catalog";
import type { Draft, StudioState } from "../src/lib/types";
export function studioRouteEvent(path: string, state: StudioState): { name: string; params: Record<string, string | number | boolean> } | null {
  const viewed = path.startsWith('/shoot/') ? packById(path.split('/')[2]) : undefined;
  const draft: Draft | null = state.draft;
  if (viewed) return { name: 'pack_opened', params: { packId: viewed.packId, styling: state.preferredStyling } };
  if (path === '/checkout' && draft) return { name: 'checkout_viewed', params: { packId: draft.packId, styling: draft.styling, styleId: draft.styleId } };
  if (path === '/upload' && draft) return { name: 'upload_screen_viewed', params: { packId: draft.packId, styling: draft.styling } };
  if (path === '/library') return { name: 'library_viewed', params: {} };
  if (path === '/') return { name: 'screen_view', params: { screen: 'web_studio' } };
  return null;
}
