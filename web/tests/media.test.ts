import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import { downloadPhotos, preparePhotoDownload, canSharePhotos } from "../src/lib/media";
import type { Photo } from "../src/lib/types";
const photo: Photo = {
  slotId: "s0",
  sceneId: "a",
  label: "Sample",
  take: 1,
  url: "./assets/scenes/paris/w/chic/0.webp",
  favorite: false,
  revision: 0,
  readyAt: 0,
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
describe("sample download failure recovery", () => {
  it("rejects a successful HTML fallback response rather than saving it as a photo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>Not a photo</html>", {
          headers: { "Content-Type": "text/html" },
        }),
      ),
    );
    await expect(downloadPhotos([photo], "Paris")).rejects.toThrow(
      "valid preview image",
    );
  });
  it("rejects corrupt image bytes even when declared as WebP", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response("broken", { headers: { "Content-Type": "image/webp" } }),
        ),
    );
    await expect(downloadPhotos([photo], "Paris")).rejects.toThrow(
      "valid preview image",
    );
  });
  it("does not fetch after an already-cancelled request", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const ctrl = new AbortController();
    ctrl.abort();
    await expect(
      downloadPhotos([photo], "Paris", { signal: ctrl.signal }),
    ).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("times out a stalled fetch instead of leaving the download button busy forever", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) =>
            options.signal.addEventListener("abort", () =>
              reject(options.signal.reason),
            ),
          ),
      ),
    );
    const result = expect(downloadPhotos([photo], "Paris")).rejects.toThrow(
      "too long",
    );
    await vi.advanceTimersByTimeAsync(120001);
    await result;
  });
});

it("prepares individual image files for the native share sheet without saving a ZIP", async () => {
  const bytes = readFileSync("public/assets/scenes/paris/w/chic/0.webp");
  const create = vi.fn();
  vi.stubGlobal("document", { createElement: create });
  const ready = await preparePhotoDownload([photo, { ...photo, slotId: "s1" }], "Paris", {
    sample: false, loadPhoto: async () => new Blob([bytes], { type: "image/webp" }),
  });
  expect(ready.files.map(file => file.name)).toEqual(["Paris-s0.webp", "Paris-s1.webp"]);
  expect(ready.files.every(file => file.type === "image/webp" && file.size === bytes.length)).toBe(true);
  expect(create).not.toHaveBeenCalled();
  const share = vi.fn();
  vi.stubGlobal("navigator", { canShare: vi.fn(data => data.files.length <= 12), share });
  expect(canSharePhotos(ready.files)).toBe(true);
  expect(share).not.toHaveBeenCalled();
});

it("falls back when the device rejects image sharing", () => {
  vi.stubGlobal("navigator", { canShare: () => false, share: vi.fn() });
  expect(canSharePhotos()).toBe(false);
});

it("the share-sheet fallback saves a ZIP containing every requested photo", async () => {
  const bytes = readFileSync("public/assets/scenes/paris/w/chic/0.webp");
  const anchor = { href: "", download: "", click: vi.fn() };
  vi.stubGlobal("document", { createElement: () => anchor });
  let saved!: Blob;
  vi.spyOn(URL, "createObjectURL").mockImplementation(blob => { saved = blob as Blob; return "blob:download"; });
  const ready = await preparePhotoDownload(Array.from({ length: 12 }, (_, i) => ({ ...photo, slotId: `s${i}` })), "Paris", {
    sample: false, loadPhoto: async () => new Blob([bytes], { type: "image/webp" }),
  });
  ready.download();
  const files = unzipSync(new Uint8Array(await saved.arrayBuffer()));
  expect(Object.keys(files)).toHaveLength(12);
  expect(Object.keys(files).every(name => name.endsWith(".webp"))).toBe(true);
  expect(anchor.download).toBe("BeAnywhere-Paris.zip");
  expect(anchor.click).toHaveBeenCalledOnce();
});

it("bounds a stalled authorized photo request", async () => {
  vi.useFakeTimers();
  const result = expect(preparePhotoDownload([photo], "Paris", {
    loadPhoto: () => new Promise(() => {}),
  })).rejects.toThrow("timed out");
  await vi.advanceTimersByTimeAsync(30001);
  await result;
});

it("releases a stalled final check at the overall deadline and permits a fresh download", async () => {
  vi.useFakeTimers();
  const bytes = readFileSync("public/assets/scenes/paris/w/chic/0.webp");
  const loadPhoto = async () => new Blob([bytes]);
  let finish!: () => void;
  const beforeSave = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
  const result = expect(preparePhotoDownload([photo], "Paris", { loadPhoto, beforeSave })).rejects.toThrow("too long");
  await vi.waitFor(() => expect(beforeSave).toHaveBeenCalledOnce());
  await vi.advanceTimersByTimeAsync(120001);
  await result;
  expect(vi.getTimerCount()).toBe(0);
  finish(); // A late reply must not revive the expired download.
  const retry = await preparePhotoDownload([photo], "Paris", { loadPhoto, beforeSave: async () => {} });
  expect(retry.files).toHaveLength(1);
});

it.each(["photo", "final check"])("cancels immediately while the %s request is stalled", async stage => {
  vi.useFakeTimers();
  const bytes = readFileSync("public/assets/scenes/paris/w/chic/0.webp");
  const controller = new AbortController();
  const stalled = vi.fn(() => new Promise<never>(() => {}));
  const result = expect(preparePhotoDownload([photo], "Paris", {
    signal: controller.signal,
    loadPhoto: stage === "photo" ? stalled : async () => new Blob([bytes]),
    beforeSave: stage === "final check" ? stalled : undefined,
  })).rejects.toThrow("Left gallery");
  await vi.waitFor(() => expect(stalled).toHaveBeenCalledOnce());
  controller.abort(new Error("Left gallery"));
  await result;
  expect(vi.getTimerCount()).toBe(0);
});

it("does not save a downloaded image if the final shoot-access check fails", async () => {
  const bytes = readFileSync("public/assets/scenes/paris/w/chic/0.webp");
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response(bytes, { headers: { "Content-Type": "image/webp" } }),
      ),
  );
  const beforeSave = vi.fn().mockRejectedValue(new Error("Shoot was removed."));
  const create = vi.fn();
  vi.stubGlobal("document", { createElement: create });
  await expect(
    downloadPhotos([photo], "Paris", { beforeSave }),
  ).rejects.toThrow("removed");
  expect(beforeSave).toHaveBeenCalledOnce();
  expect(create).not.toHaveBeenCalled();
});
it("saves a valid selected image after the final access check succeeds", async () => {
  vi.useFakeTimers();
  const bytes = readFileSync("public/assets/scenes/paris/w/chic/0.webp");
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response(bytes, { headers: { "Content-Type": "image/webp" } }),
      ),
  );
  const anchor = { href: "", download: "", click: vi.fn() };
  vi.stubGlobal("document", { createElement: () => anchor });
  const beforeSave = vi.fn().mockResolvedValue(undefined);
  await downloadPhotos([photo], "Paris", { beforeSave });
  expect(beforeSave).toHaveBeenCalledOnce();
  expect(anchor.download).toBe("Paris-sample-s0.webp");
  expect(anchor.click).toHaveBeenCalledOnce();
  await vi.advanceTimersByTimeAsync(5001);
});
