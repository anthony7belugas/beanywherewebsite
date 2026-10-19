import { expect, test } from 'vitest';
import { storefrontEntry, withoutStorefrontEntry } from '../src/lib/storefront-entry';
import { LocalStudioService } from '../src/services/local';

test('a public shoot selection cannot replace a payment return or choose a foreign catalog recipe', () => {
  const recipe = '?start=santorini&styling=m&look=classic';
  expect(storefrontEntry(recipe, '/upload')).toEqual({ packId:'santorini', styling:'m', styleId:'classic' });
  expect(storefrontEntry(`${recipe}&checkout=order_paid`, '/upload')).toBeNull();
  expect(storefrontEntry(recipe, '/payment')).toBeNull();
  expect(storefrontEntry(recipe, '/gallery/paid-job')).toBeNull();
  expect(storefrontEntry('?start=santorini&styling=m&look=resort', '/upload')).toBeNull();
  expect(storefrontEntry('?start=made-up&styling=m&look=classic', '/upload')).toBeNull();
  expect(storefrontEntry('?start=santorini&styling=admin&look=classic', '/upload')).toBeNull();
});

test('reopening the same public shoot preserves selected photos and the checkout retry key', async () => {
  const service = new LocalStudioService(`entry-${crypto.randomUUID()}`);
  const chosen = storefrontEntry('?start=santorini&styling=m&look=classic', '/upload')!;
  await service.startDraft(chosen.packId, chosen.styling, chosen.styleId);
  const initial = (await service.read()).draft!;
  await service.updateDraft(initial, { references:[{id:'reference',name:'selfie.jpg',url:'data:image/jpeg;base64,YWJj',width:800,height:1200,sample:false}] });
  const before = (await service.read()).draft!;
  await service.startDraft(chosen.packId, chosen.styling, chosen.styleId);
  expect((await service.read()).draft).toEqual(before);
  expect((await service.read()).shoots).toEqual([]);
});

test('entry cleanup preserves an existing payment recovery parameter', () => {
  expect(withoutStorefrontEntry('?start=paris&styling=w&look=casual&checkout=order_paid')).toBe('?checkout=order_paid');
});
