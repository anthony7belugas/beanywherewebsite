import { afterEach, expect, it, vi } from 'vitest';
import { prepareReference } from '../src/lib/media';
const convert = vi.hoisted(() => vi.fn());
vi.mock('heic-to/csp', () => ({ heicTo: convert }));
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); convert.mockReset(); });
function browser(decodes: () => Promise<void>) {
  const canvas = { width: 0, height: 0, getContext: () => ({ fillRect() {}, drawImage() {}, fillStyle: '' }),
    toDataURL: () => `data:image/jpeg;base64,${btoa('x'.repeat(2048))}` };
  vi.stubGlobal('Image', class { src = ''; naturalWidth = 1000; naturalHeight = 1500; decode = decodes; });
  vi.stubGlobal('document', { createElement: () => canvas });
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:${crypto.randomUUID()}`);
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  return canvas;
}
it('uses native HEIC decoding when supported and always returns the bounded JPEG required by checkout', async () => {
  const canvas = browser(async () => {});
  const result = await prepareReference(new File(['image'], 'iphone.HEIC', { type: 'image/heic' }));
  expect(convert).not.toHaveBeenCalled();
  expect(result.url).toMatch(/^data:image\/jpeg;base64,/);
  expect(result).toMatchObject({ name: 'iphone.HEIC', width: 933, height: 1400, sample: false });
  expect(canvas.height).toBe(1400); expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
});
it('converts locally only when native decoding fails and releases both temporary URLs', async () => {
  browser(vi.fn().mockRejectedValueOnce(new Error('unsupported')).mockResolvedValue(undefined));
  convert.mockResolvedValue(new Blob(['converted'], { type: 'image/jpeg' }));
  const file = new File(['image'], 'iphone.heic', { type: 'image/heic' });
  const result = await prepareReference(file);
  expect(convert).toHaveBeenCalledWith({ blob: file, type: 'image/jpeg', quality: 0.92 });
  expect(result.url).toMatch(/^data:image\/jpeg;base64,/);
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
});
it('fails clearly and recovers the UI from a converter that never replies', async () => {
  vi.useFakeTimers(); browser(async () => { throw new Error('unsupported'); });
  convert.mockImplementation(() => new Promise(() => {}));
  const result = expect(prepareReference(new File(['image'], 'iphone.heic'))).rejects.toThrow('could not be prepared');
  await vi.waitFor(() => expect(convert).toHaveBeenCalledTimes(1));
  await vi.advanceTimersByTimeAsync(45001); await result;
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
});
it('does not run HEIC conversion for a corrupt JPEG or accept an oversized upload', async () => {
  browser(async () => { throw new Error('corrupt'); });
  await expect(prepareReference(new File(['bad'], 'bad.jpg', { type: 'image/jpeg' }))).rejects.toThrow('could not be opened');
  expect(convert).not.toHaveBeenCalled();
  const large = new File(['x'], 'large.heic'); Object.defineProperty(large, 'size', { value: 21 * 1024 * 1024 });
  await expect(prepareReference(large)).rejects.toThrow('smaller than 20 MB');
});
