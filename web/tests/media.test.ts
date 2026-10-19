import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { downloadPhotos } from "../src/lib/media";
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
    await vi.advanceTimersByTimeAsync(30001);
    await result;
  });
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
