/**
 * Compresses an image file by scaling its dimensions and converting it to WebP format.
 * SVGs and GIFs are bypassed automatically to preserve vector scaling and animation loops.
 */
export async function compressImage(
  file: File,
  maxDim = 1600,
  quality = 0.82
): Promise<{ blob: Blob; ext: string; contentType: string }> {
  // SVGs and GIFs are uploaded exactly as-is to preserve vector scaling and animation loops
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    const ext = file.name.split(".").pop() || (file.type === "image/svg+xml" ? "svg" : "gif");
    return { blob: file, ext, contentType: file.type };
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    const ext = file.name.split(".").pop() || "jpg";
    return { blob: file, ext, contentType: file.type };
  }

  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    bitmap.close();
    const ext = file.name.split(".").pop() || "jpg";
    return { blob: file, ext, contentType: file.type };
  }

  // Preserve white background for transparent PNG files converted to JPEG/WebP
  if (file.type === "image/png" || file.type === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }

  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas conversion to Blob failed"))),
      "image/webp",
      quality
    )
  );

  // Fall back to original file if compression somehow makes it larger
  if (blob.size >= file.size) {
    const ext = file.name.split(".").pop() || "jpg";
    return { blob: file, ext, contentType: file.type };
  }

  return { blob, ext: "webp", contentType: "image/webp" };
}
