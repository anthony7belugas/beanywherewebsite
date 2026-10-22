import { expect, it, vi } from 'vitest';
const { callable, invoke } = vi.hoisted(() => ({ callable: vi.fn(), invoke: vi.fn() }));
vi.mock('firebase/functions', () => ({ httpsCallable: callable }));
import { studioCallable } from '../integration/studio-callable';
import type { Functions } from 'firebase/functions';

it('reuses the shared endpoint for preparation and payment without retrying mutations on error', async () => {
  const functions = {} as Functions;
  callable.mockReturnValue(invoke);
  invoke.mockRejectedValue(new Error('reply lost'));
  const call = studioCallable(functions, 'createWebCheckout', 95000);
  await expect(call({ orderId: 'saved_order' })).rejects.toThrow('reply lost');
  expect(callable).toHaveBeenLastCalledWith(functions, 'webStudio', { timeout: 95000 });
  expect(invoke).toHaveBeenCalledExactlyOnceWith({ operation: 'createWebCheckout', input: { orderId: 'saved_order' } });
});

it('keeps heavy photo processing isolated on its original endpoint', () => {
  const functions = {} as Functions;
  studioCallable(functions, 'finalizeReferenceUploadSession', 120000);
  expect(callable).toHaveBeenLastCalledWith(functions, 'finalizeReferenceUploadSession', { timeout: 120000 });
});
