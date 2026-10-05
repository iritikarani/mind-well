/**
 * Generates a personalized, downloadable "Soul" badge as a PNG using the
 * Canvas API — a shareable keepsake card for a Color Connection session.
 */

interface BadgeOptions {
  colorLabel: string;
  colorHex: string;
  textHex: string;
  userName: string;
  dateLabel: string;
  quote: string;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
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

export function drawColorBadge(canvas: HTMLCanvasElement, opts: BadgeOptions) {
  const size = 800;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Outer field in the chosen color.
  ctx.fillStyle = opts.colorHex;
  ctx.fillRect(0, 0, size, size);

  // A chunky pixel-style frame (stepped border, no image assets).
  const frameSteps = [28, 20, 12];
  frameSteps.forEach((inset, i) => {
    ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.12)";
    ctx.lineWidth = 6;
    ctx.strokeRect(inset, inset, size - inset * 2, size - inset * 2);
  });

  // Inner cream card.
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

  // Pixel heart glyph.
  ctx.font = "64px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = opts.colorHex;
  ctx.fillText("♡", centerX, cardY + 100);

  // Title: "{COLOR} SOUL"
  ctx.font = "bold 44px Georgia, serif";
  ctx.fillStyle = "#5B4B73";
  ctx.fillText(`${opts.colorLabel.toUpperCase()} SOUL`, centerX, cardY + 180);

  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#7D7090";
  ctx.fillText("Color Connection · Happy Space ♡", centerX, cardY + 215);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "rgba(93,75,115,0.65)";
  ctx.fillText(window.location.host, centerX, cardY + 242);

  // Color swatch circle.
  ctx.beginPath();
  ctx.arc(centerX, cardY + 320, 56, 0, Math.PI * 2);
  ctx.fillStyle = opts.colorHex;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();

  // Quote, wrapped.
  ctx.font = "italic 24px Georgia, serif";
  ctx.fillStyle = "#5B4B73";
  const quoteLines = wrapText(ctx, `"${opts.quote}"`, cardW - 120);
  let qy = cardY + 440;
  for (const line of quoteLines) {
    ctx.fillText(line, centerX, qy);
    qy += 32;
  }

  // Name + date footer.
  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = "#5B4B73";
  ctx.fillText(opts.userName, centerX, cardY + cardH - 80);

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#7D7090";
  ctx.fillText(opts.dateLabel, centerX, cardY + cardH - 48);
}

export async function downloadColorBadge(opts: BadgeOptions): Promise<void> {
  const canvas = document.createElement("canvas");
  drawColorBadge(canvas, opts);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `happy-space-${opts.colorLabel.toLowerCase()}-soul-badge.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
