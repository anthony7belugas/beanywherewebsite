import { zipSync, strToU8 } from "fflate";
import type { Photo, Reference } from "./types";
export async function prepareReference(file: File): Promise<Reference> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error(
      `${file.name}: choose a JPG, PNG, or WebP. Export HEIC photos as JPG first.`,
    );
  if (file.size > 20 * 1024 * 1024)
    throw new Error(`${file.name}: use a photo smaller than 20 MB.`);
  const bytes = await file.arrayBuffer();
  const id = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
  )
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    try {
      await image.decode();
    } catch {
      throw new Error(
        `${file.name}: this photo could not be opened. Export a fresh JPG and try again.`,
      );
    }
    if (Math.min(image.naturalWidth, image.naturalHeight) < 256)
      throw new Error(
        `${file.name}: choose a larger photo, at least 256 pixels on each side.`,
      );
    const scale = Math.min(
      1,
      1400 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    if (Math.min(canvas.width, canvas.height) < 256)
      throw new Error(
        `${file.name}: choose a photo with a less extreme shape so both sides stay at least 256 pixels after preparation.`,
      );
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare this photo.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const prepared = canvas.toDataURL("image/jpeg", 0.88);
    const bytesPrepared = atob(prepared.split(",")[1] || "").length;
    if (
      !prepared.startsWith("data:image/jpeg;") ||
      bytesPrepared < 1024 ||
      bytesPrepared >= 8 * 1024 * 1024
    )
      throw new Error(
        `${file.name}: this photo could not be prepared for a shoot. Try a different, detailed photo.`,
      );
    return {
      id,
      name: file.name,
      url: prepared,
      width: canvas.width,
      height: canvas.height,
      sample: false,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
export async function downloadPhotos(
  photos: Photo[],
  title: string,
  options: { signal?: AbortSignal; beforeSave?: () => Promise<void> } = {},
) {
  if (!photos.length) throw new Error("Select a finished photo first.");
  const controller = new AbortController();
  const abort = () => controller.abort(options.signal?.reason);
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) abort();
  const timer = setTimeout(
    () =>
      controller.abort(
        new Error(
          "The download took too long. Try again while the local preview is running.",
        ),
      ),
    30000,
  );
  const active = () => {
    if (controller.signal.aborted) throw controller.signal.reason;
  };
  try {
    active();
    const files: Record<string, Uint8Array> = {};
    for (const p of photos) {
      const response = await fetch(p.url, { signal: controller.signal });
      if (!response.ok)
        throw new Error("A preview image could not be downloaded. Try again.");
      if (
        response.headers.get("content-type")?.split(";")[0].trim() !==
        "image/webp"
      )
        throw new Error(
          "The server did not return a valid preview image. Restart the local preview and try again.",
        );
      const bytes = new Uint8Array(await response.arrayBuffer());
      active();
      if (
        bytes.length < 12 ||
        bytes.length > 20 * 1024 * 1024 ||
        String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" ||
        String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP"
      )
        throw new Error(
          "The server did not return a valid preview image. Try again.",
        );
      files[`${title}-sample-${p.slotId}.webp`] = bytes;
    }
    await options.beforeSave?.();
    active();
    if (photos.length === 1) {
      saveBlob(
        new Blob([Object.values(files)[0] as BlobPart], { type: "image/webp" }),
        Object.keys(files)[0],
      );
      return;
    }
    files["ABOUT-THESE-SAMPLES.txt"] = strToU8(
      "BeAnywhere private draft. These are existing marketing preview images, repeated across the 12-photo demo. They were not generated from your uploaded selfies. No payment was taken.",
    );
    saveBlob(
      new Blob([zipSync(files) as BlobPart], { type: "application/zip" }),
      `BeAnywhere-${title}-samples.zip`,
    );
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason;
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}
