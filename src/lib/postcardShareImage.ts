/**
 * Generates a shareable keepsake image for a World Puzzle postcard — a
 * flip animation can't itself be shared, so this combines both sides
 * (the monument photo and the handwritten-style note) into one landscape
 * image, the way a real postcard photographs front-and-back side by side.
 * Same Canvas + Web Share pattern as the badge cards (badgeShareImage.ts).
 */

interface PostcardShareOptions {
  imageUrl: string;
  name: string;
  country: string;
  note: string;
  quote: string;
  userName: string;
  dateLabel: string;
}

/** The domain to print on the card and the full link to attach to the
 * share — read from the page itself (not hardcoded) so it's always right
 * even on a preview deployment or a future custom domain. */
function siteLabel(): string {
  return window.location.host;
}

function siteUrl(): string {
  return window.location.origin;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();
}

async function drawPostcard(canvas: HTMLCanvasElement, opts: PostcardShareOptions) {
  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const half = width / 2;

  ctx.fillStyle = "#FFFDF8";
  ctx.fillRect(0, 0, width, height);

  const img = await loadImage(opts.imageUrl);
  drawCover(ctx, img, 0, 0, half, height);

  // Back half.
  ctx.fillStyle = "#E6DAF8";
  ctx.fillRect(half, 0, half, height);

  ctx.strokeStyle = "rgba(91,71,137,0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(half + half / 2, 56);
  ctx.lineTo(half + half / 2, height - 140);
  ctx.stroke();
  ctx.setLineDash([]);

  const leftColX = half + 48;
  const leftColW = half / 2 - 72;
  const rightColX = half + half / 2 + 24;

  ctx.textAlign = "left";
  ctx.fillStyle = "#5B4B73";
  ctx.font = "bold 36px Georgia, serif";
  const nameLines = wrapText(ctx, opts.name, leftColW);
  let ny = 100;
  for (const line of nameLines) {
    ctx.fillText(line, leftColX, ny);
    ny += 42;
  }

  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#7D7090";
  ctx.fillText(opts.country, leftColX, ny + 8);

  ctx.font = "italic 20px Georgia, serif";
  ctx.fillStyle = "#5B4B73";
  const noteLines = wrapText(ctx, opts.note, leftColW);
  let qy = ny + 56;
  for (const line of noteLines) {
    ctx.fillText(line, leftColX, qy);
    qy += 28;
  }

  ctx.font = "italic 16px Georgia, serif";
  ctx.fillStyle = "#7D7090";
  const quoteLines = wrapText(ctx, `"${opts.quote}"`, leftColW);
  qy += 16;
  for (const line of quoteLines) {
    ctx.fillText(line, leftColX, qy);
    qy += 24;
  }

  ctx.textAlign = "left";
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#5B4B73";
  ctx.fillText("Happy Space ♡", rightColX, 100);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#9A8FB0";
  ctx.fillText(siteLabel(), rightColX, 126);

  ctx.font = "bold 22px sans-serif";
  ctx.fillText(opts.userName, rightColX, height - 110);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#7D7090";
  ctx.fillText(opts.dateLabel, rightColX, height - 82);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Shares the postcard image via the native share sheet when available,
 * falling back to a plain download otherwise. If the user opens the share
 * sheet and cancels it, this does nothing further. */
export async function shareOrDownloadPostcard(opts: PostcardShareOptions): Promise<void> {
  const canvas = document.createElement("canvas");
  await drawPostcard(canvas, opts);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (!blob) return;

  const fileName = `happy-space-${slugify(opts.name)}-postcard.png`;
  const file = new File([blob], fileName, { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `${opts.name} — Happy Space ♡`,
        // The link is appended to `text` too, not just passed as `url` —
        // several share targets (WhatsApp included) drop `url` entirely
        // once a file is attached and only surface `text`.
        text: `A postcard from ${opts.name}, ${opts.country} — collected on Happy Space ♡\n${siteUrl()}`,
        url: siteUrl(),
      });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Any other failure — fall back to a plain download below.
    }
  }

  downloadBlob(blob, fileName);
}
