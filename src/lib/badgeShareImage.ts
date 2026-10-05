/**
 * Generates a shareable keepsake card for any earned badge, as a PNG via
 * the Canvas API — the same hand-drawn pixel-frame technique as the Color
 * Connection "Soul" badge (src/lib/colorBadge.ts), generalized to any
 * badge's label/description instead of a specific color.
 */

interface AchievementBadgeOptions {
  label: string;
  description: string;
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

function drawAchievementBadge(canvas: HTMLCanvasElement, opts: AchievementBadgeOptions) {
  const size = 800;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#E6DAF8";
  ctx.fillRect(0, 0, size, size);

  const frameSteps = [28, 20, 12];
  frameSteps.forEach((inset, i) => {
    ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(91,71,137,0.15)";
    ctx.lineWidth = 6;
    ctx.strokeRect(inset, inset, size - inset * 2, size - inset * 2);
  });

  const cardMargin = 64;
  const cardX = cardMargin;
  const cardY = cardMargin;
  const cardW = size - cardMargin * 2;
  const cardH = size - cardMargin * 2;
  ctx.fillStyle = "#FFFDF8";
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 28);
  ctx.fill();

  const centerX = size / 2;

  ctx.font = "72px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🏅", centerX, cardY + 120);

  ctx.font = "bold 40px Georgia, serif";
  ctx.fillStyle = "#5B4B73";
  const titleLines = wrapText(ctx, opts.label.toUpperCase(), cardW - 100);
  let ty = cardY + 190;
  for (const line of titleLines) {
    ctx.fillText(line, centerX, ty);
    ty += 48;
  }

  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#7D7090";
  ctx.fillText("Happy Space ♡", centerX, ty + 16);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#9A8FB0";
  ctx.fillText(siteLabel(), centerX, ty + 42);

  ctx.font = "italic 24px Georgia, serif";
  ctx.fillStyle = "#5B4B73";
  const descLines = wrapText(ctx, opts.description, cardW - 140);
  let qy = ty + 110;
  for (const line of descLines) {
    ctx.fillText(line, centerX, qy);
    qy += 32;
  }

  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = "#5B4B73";
  ctx.fillText(opts.userName, centerX, cardY + cardH - 80);

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#7D7090";
  ctx.fillText(opts.dateLabel, centerX, cardY + cardH - 48);
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

/** Shares the badge image via the native share sheet when available
 * (mobile browsers mainly), falling back to a plain download otherwise.
 * If the user opens the share sheet and cancels it, this does nothing
 * further — it does not also trigger a download. */
export async function shareOrDownloadBadge(opts: AchievementBadgeOptions): Promise<void> {
  const canvas = document.createElement("canvas");
  drawAchievementBadge(canvas, opts);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (!blob) return;

  const fileName = `happy-space-${slugify(opts.label)}-badge.png`;
  const file = new File([blob], fileName, { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `${opts.label} — Happy Space ♡`,
        // The link goes in `text` only — passing `url` as well makes
        // WhatsApp show it twice (it renders both fields).
        text: `I earned the "${opts.label}" badge on Happy Space ♡\n${siteUrl()}`,
      });
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Any other failure (e.g. no share target chosen on some platforms) —
      // fall back to a plain download below.
    }
  }

  downloadBlob(blob, fileName);
}
