// Shrinking booking photos in the browser, before they are uploaded.
//
// A customer standing over a leak photographs it with a modern phone, which
// means several megabytes each and, on an iPhone, often HEIC. Sent as they
// are, four of them exceed the serverless body limit and the whole booking is
// rejected: the lead is lost for the sake of a picture.
//
// So every photo is re-encoded to a sensible JPEG here, and anything that
// still will not fit is DROPPED rather than allowed to fail the submission.
// The photos are a convenience; the lead is the point. Browser only.

const MB = 1024 * 1024;

export interface CompressOptions {
  /** Longest edge of the output, in pixels. Never upscales. */
  maxEdge?: number;
  /** JPEG quality, 0 to 1. */
  quality?: number;
}

interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

async function decodeImage(file: File): Promise<Decoded | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // Chrome throws here for HEIC. The <img> path below succeeds on Safari,
      // where HEIC is a native format, so it is worth trying rather than
      // giving up on the whole class of file.
    }
  }

  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") return null;

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => resolve(null);
      el.src = url;
    });
    if (!img || !img.naturalWidth || !img.naturalHeight) {
      URL.revokeObjectURL(url);
      return null;
    }
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    return null;
  }
}

function baseName(name: string): string {
  const stem = name.replace(/\.[^./\\]+$/, "").trim();
  return stem || "photo";
}

/**
 * A JPEG copy of `file`, scaled so its long edge is at most `maxEdge`, or null
 * when the browser cannot decode the image at all. Null is a normal outcome,
 * not an error: HEIC outside Safari lands here, and the caller is expected to
 * skip that photo and keep the booking.
 */
export async function compressImage(
  file: File,
  { maxEdge = 1600, quality = 0.8 }: CompressOptions = {},
): Promise<File | null> {
  if (typeof document === "undefined") return null;

  const decoded = await decodeImage(file);
  if (!decoded) return null;

  try {
    // Only ever downscale. Blowing a small photo up costs bytes and adds
    // nothing a plumber can see.
    const scale = Math.min(1, maxEdge / Math.max(decoded.width, decoded.height, 1));
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(decoded.source, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
    });
    if (!blob) return null;

    return new File([blob], `${baseName(file.name)}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return null;
  } finally {
    // Always, on every path: a bitmap left open or an object URL left alive
    // holds the whole decoded image in memory, and this runs four times.
    decoded.release();
  }
}

export type PhotoSkipReason = "undecodable" | "too_large" | "over_limit";

export interface PreparedPhotos {
  files: File[];
  skipped: { name: string; reason: PhotoSkipReason }[];
}

export interface PreparePhotoOptions {
  maxFiles?: number;
  maxEach?: number;
  maxTotal?: number;
}

/**
 * Everything a booking form needs to turn a file input's contents into an
 * upload that will actually be accepted. Nothing here ever throws, and the
 * skipped list exists so the form can tell the customer which photo did not
 * make it and why, instead of silently sending three of their four.
 */
export async function prepareBookingPhotos(
  files: File[],
  { maxFiles = 4, maxEach = 1.5 * MB, maxTotal = 4 * MB }: PreparePhotoOptions = {},
): Promise<PreparedPhotos> {
  // The original name travels with the compressed file: the customer chose
  // "IMG_4417.HEIC" and would not recognise "IMG_4417.jpg" in a message about
  // the photo that was dropped.
  const kept: { file: File; originalName: string }[] = [];
  const skipped: PreparedPhotos["skipped"] = [];

  // Past the count limit before any decoding: no point spending a second per
  // photo on files that were never going to be sent.
  for (const file of files.slice(maxFiles)) {
    skipped.push({ name: file.name, reason: "over_limit" });
  }

  for (const file of files.slice(0, maxFiles)) {
    let out = await compressImage(file);
    if (!out) {
      skipped.push({ name: file.name, reason: "undecodable" });
      continue;
    }
    // Two fallbacks for the genuinely huge photo: quality first, because it
    // costs the least detail a plumber cares about, then resolution.
    if (out.size > maxEach) out = (await compressImage(file, { quality: 0.6 })) ?? out;
    if (out.size > maxEach) {
      out = (await compressImage(file, { quality: 0.6, maxEdge: 1200 })) ?? out;
    }
    if (out.size > maxEach) {
      skipped.push({ name: file.name, reason: "too_large" });
      continue;
    }
    kept.push({ file: out, originalName: file.name });
  }

  // Drop from the end until the whole upload fits. The first photo a customer
  // picks is usually the one that shows the problem.
  let total = kept.reduce((sum, k) => sum + k.file.size, 0);
  while (kept.length && total > maxTotal) {
    const dropped = kept.pop();
    if (!dropped) break;
    total -= dropped.file.size;
    skipped.push({ name: dropped.originalName, reason: "over_limit" });
  }

  return { files: kept.map((k) => k.file), skipped };
}
