import { packById } from './catalog';
import type { Styling } from './types';

/** Public pages may choose a catalog recipe, never a price, payment, identity, or job. */
export function storefrontEntry(search: string, path: string) {
  const query = new URLSearchParams(search);
  if (path !== '/upload' || query.has('checkout')) return null;
  const pack = packById(query.get('start') || '');
  const styling = query.get('styling');
  const styleId = query.get('look');
  if (!pack || (styling !== 'w' && styling !== 'm') ||
      !pack.styleDirections[styling].some(look => look.id === styleId)) return null;
  return { packId: pack.packId, styling: styling as Styling, styleId: styleId! };
}

export function withoutStorefrontEntry(search: string) {
  const query = new URLSearchParams(search);
  for (const key of ['start', 'styling', 'look']) query.delete(key);
  const remaining = query.toString();
  return remaining ? `?${remaining}` : '';
}
