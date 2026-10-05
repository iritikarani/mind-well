import { format } from "date-fns";

export type MonthEntries = Record<string, { slot: number; text: string }[]>;

type RGB = readonly [number, number, number];

const COLORS = {
  bgTop: [243, 236, 252] as RGB,
  bgBottom: [255, 246, 234] as RGB,
  surface: [255, 253, 248] as RGB,
  lavender: [230, 218, 248] as RGB,
  purple: [123, 91, 199] as RGB,
  purpleText: [74, 58, 115] as RGB,
  blushStrong: [255, 171, 212] as RGB,
  blushText: [138, 59, 99] as RGB,
  butterText: [138, 106, 43] as RGB,
  mintText: [47, 122, 76] as RGB,
  heading: [91, 75, 115] as RGB,
  muted: [125, 112, 144] as RGB,
};

const BULLET_COLORS: RGB[] = [COLORS.blushText, COLORS.butterText, COLORS.mintText];

/** Tiny 7x7 pixel-heart, drawn as literal squares to match the site's
 * handcrafted pixel-art motif instead of a vector glyph or emoji. */
const PIXEL_HEART_GRID = [
  ".##.##.",
  "#######",
  "#######",
  "#######",
  ".#####.",
  "..###..",
  "...#...",
];

function paintPixelHeart(doc: Doc, originX: number, originY: number, cell: number, color: RGB) {
  doc.setFillColor(...color);
  PIXEL_HEART_GRID.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch !== "#") return;
      doc.rect(originX + x * cell, originY + y * cell, cell, cell, "F");
    });
  });
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = PAGE_H - 12;

const CARD_PAD_X = 7;
const CARD_PAD_TOP = 9;
const CARD_PAD_BOTTOM = 7;
const DATE_ROW_H = 9;
const ENTRY_LINE_H = 4.8;
const ENTRY_GAP = 3.2;
const CARD_GAP = 6;
const BULLET_INDENT = 6;
const TEXT_WIDTH = CONTENT_W - CARD_PAD_X * 2 - BULLET_INDENT;

async function loadFontBase64(path: string): Promise<string> {
  const buffer = await fetch(path).then((r) => r.arrayBuffer());
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

// jsPDF's own type defs don't export a clean instance type for us to import,
// so the drawing helpers below just take `any` and rely on the call sites
// (all within this file) to pass a real jsPDF document.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = any;

function paintBackground(doc: Doc) {
  const bands = 40;
  const bandH = PAGE_H / bands;
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1);
    const rgb = COLORS.bgTop.map((c, idx) => Math.round(c + (COLORS.bgBottom[idx] - c) * t));
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.rect(0, bandH * i, PAGE_W, bandH + 0.6, "F");
  }
}

function paintFooter(doc: Doc) {
  doc.setFont("Nunito", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text("HAPPY SPACE ♡ — a small pixelated world for your mental health", PAGE_W / 2, FOOTER_Y, {
    align: "center",
  });
}

function paintHeader(doc: Doc, monthLabel: string): number {
  const top = 16;
  const bannerH = 30;

  doc.setFillColor(...COLORS.lavender);
  doc.roundedRect(MARGIN, top, CONTENT_W, bannerH, 5, 5, "F");

  paintPixelHeart(doc, MARGIN + CONTENT_W - 17, top + 7, 1.6, COLORS.purple);

  doc.setFont("Quicksand", "normal");
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.purpleText);
  doc.text("HAPPY SPACE ♡", MARGIN + 8, top + 12);

  doc.setFontSize(13);
  doc.setTextColor(...COLORS.blushText);
  doc.text(`3 Things — ${monthLabel}`, MARGIN + 8, top + 21);

  doc.setFont("Nunito", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  doc.text("A few small things, saved one day at a time.", MARGIN + 8, top + bannerH + 9);

  return top + bannerH + 18;
}

function measureCard(doc: Doc, texts: string[]): { height: number; wrapped: string[][] } {
  doc.setFont("Nunito", "normal");
  doc.setFontSize(11);

  const wrapped = texts.map((t) => doc.splitTextToSize(t, TEXT_WIDTH) as string[]);
  const entriesHeight =
    wrapped.reduce((sum, lines) => sum + lines.length * ENTRY_LINE_H + ENTRY_GAP, 0) - ENTRY_GAP;
  const height = CARD_PAD_TOP + DATE_ROW_H + entriesHeight + CARD_PAD_BOTTOM;

  return { height, wrapped };
}

function drawCard(doc: Doc, y: number, height: number, dateLabel: string, wrapped: string[][]) {
  doc.setFillColor(...COLORS.surface);
  doc.setDrawColor(...COLORS.blushStrong);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, height, 4, 4, "FD");

  doc.setFont("Quicksand", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.blushText);
  doc.text(dateLabel, MARGIN + CARD_PAD_X, y + CARD_PAD_TOP + 3.5);

  let cursorY = y + CARD_PAD_TOP + DATE_ROW_H;
  doc.setFont("Nunito", "normal");
  doc.setFontSize(11);

  wrapped.forEach((lines, i) => {
    doc.setFillColor(...BULLET_COLORS[i % BULLET_COLORS.length]);
    doc.circle(MARGIN + CARD_PAD_X + 1.2, cursorY - 1.5, 1.1, "F");

    doc.setTextColor(...COLORS.heading);
    doc.text(lines, MARGIN + CARD_PAD_X + BULLET_INDENT, cursorY);
    cursorY += lines.length * ENTRY_LINE_H + ENTRY_GAP;
  });
}

export async function generateThreeThingsPdf(
  monthLabel: string,
  monthKey: string,
  entries: MonthEntries,
): Promise<void> {
  const doc = await buildThreeThingsDoc(monthLabel, entries);
  doc.save(`mind-well-three-things-${monthKey}.pdf`);
}

// Split out from `generateThreeThingsPdf` so the document itself (a plain
// jsPDF instance) can be built and inspected without triggering the browser
// download side effect of `doc.save()`.
export async function buildThreeThingsDoc(monthLabel: string, entries: MonthEntries) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const [nunitoBase64, quicksandBase64] = await Promise.all([
    loadFontBase64("/fonts/Nunito.ttf"),
    loadFontBase64("/fonts/Quicksand.ttf"),
  ]);
  doc.addFileToVFS("Nunito.ttf", nunitoBase64);
  doc.addFont("Nunito.ttf", "Nunito", "normal");
  doc.addFileToVFS("Quicksand.ttf", quicksandBase64);
  doc.addFont("Quicksand.ttf", "Quicksand", "normal");

  paintBackground(doc);
  paintFooter(doc);
  let y = paintHeader(doc, monthLabel);

  const dates = Object.keys(entries)
    .filter((d) => entries[d].length > 0)
    .sort();

  if (dates.length === 0) {
    doc.setFont("Quicksand", "normal");
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.heading);
    doc.text("No entries this month yet.", PAGE_W / 2, y + 20, { align: "center" });

    doc.setFont("Nunito", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.muted);
    doc.text("Come back and jot down a few small things whenever you're ready.", PAGE_W / 2, y + 28, {
      align: "center",
    });
  } else {
    for (const dateStr of dates) {
      const texts = entries[dateStr]
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map((e) => e.text);
      const dateLabel = format(new Date(dateStr), "EEEE, MMMM d");
      const { height, wrapped } = measureCard(doc, texts);

      if (y + height > FOOTER_Y - 10) {
        doc.addPage();
        paintBackground(doc);
        paintFooter(doc);
        y = 20;
      }

      drawCard(doc, y, height, dateLabel, wrapped);
      y += height + CARD_GAP;
    }
  }

  return doc;
}
