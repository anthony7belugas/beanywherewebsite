import { zipSync, strToU8 } from "fflate";
import type { Photo, Reference } from "./types";
async function photoStep<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Photo preparation timed out.")), milliseconds);
    })]);
  } finally { if (timer) clearTimeout(timer); }
}
export async function prepareReference(file: File): Promise<Reference> {
  const heic = ["image/heic", "image/heif"].includes(file.type.toLowerCase()) || /\.hei[cf]$/i.test(file.name);
  const knownImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type.toLowerCase())
    || (!file.type && /\.(jpe?g|png|webp)$/i.test(file.name));
  if (!knownImage && !heic)
    throw new Error(
      `${file.name}: choose a JPG, PNG, WebP, or iPhone HEIC photo.`,
    );
  if (file.size > 20 * 1024 * 1024)
    throw new Error(`${file.name}: use a photo smaller than 20 MB.`);
  const bytes = await file.arrayBuffer();
  const id = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
  )
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
  let url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    try {
      await photoStep(image.decode(), 20000);
    } catch {
      if (!heic) throw new Error(`${file.name}: this photo could not be opened. Try another photo.`);
      // Safari opens HEIC directly; other browsers load the converter only when needed.
      try {
        const jpeg = await photoStep(import("heic-to/csp").then(({ heicTo }) =>
          heicTo({ blob: file, type: "image/jpeg", quality: 0.92 })), 45000);
        URL.revokeObjectURL(url);
        url = URL.createObjectURL(jpeg);
        image.src = url;
        await photoStep(image.decode(), 20000);
      } catch {
        throw new Error(`${file.name}: this iPhone photo could not be prepared. Try another photo, or save a JPG copy.`);
      }
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
  options: { signal?: AbortSignal; beforeSave?: () => Promise<void>; sample?: boolean;
    loadPhoto?: (photo: Photo) => Promise<Blob> } = {},
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
          "The download took too long. Check your connection and try again.",
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
    let contentType = "image/webp";
    for (const p of photos) {
      if (options.loadPhoto) {
        const blob = await options.loadPhoto(p);
        const bytes = new Uint8Array(await blob.arrayBuffer());
        active();
        const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
        const png = bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
        const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
          String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
        if (bytes.length < 12 || bytes.length > 20 * 1024 * 1024 || !(jpeg || png || webp)) {
          throw new Error("This photo could not be downloaded. Please try again.");
        }
        contentType = jpeg ? "image/jpeg" : png ? "image/png" : "image/webp";
        files[`${title}-${p.slotId}.${jpeg ? "jpg" : png ? "png" : "webp"}`] = bytes;
        continue;
      }
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
        new Blob([Object.values(files)[0] as BlobPart], { type: contentType }),
        Object.keys(files)[0],
      );
      return;
    }
    if (options.sample !== false) files["ABOUT-THESE-SAMPLES.txt"] = strToU8(
      "BeAnywhere private draft. These are existing marketing preview images, repeated across the 12-photo demo. They were not generated from your uploaded selfies. No payment was taken.",
    );
    saveBlob(
      new Blob([zipSync(files) as BlobPart], { type: "application/zip" }),
      `BeAnywhere-${title}${options.sample === false ? "" : "-samples"}.zip`,
    );
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason;
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}
