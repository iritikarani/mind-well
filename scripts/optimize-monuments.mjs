// Recompresses public/monuments/*.jpg (max 960px wide, progressive mozjpeg)
// and writes 240px thumbnails to public/monuments/thumbs/ for places that
// show many photos at once (the room wall). Safe to re-run.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/monuments");
const thumbDir = path.join(dir, "thumbs");
await fs.mkdir(thumbDir, { recursive: true });

const files = (await fs.readdir(dir)).filter((f) => f.toLowerCase().endsWith(".jpg"));
let before = 0;
let after = 0;
let thumbs = 0;

for (const file of files) {
  const full = path.join(dir, file);
  const input = await fs.readFile(full);
  before += input.length;

  const main = await sharp(input)
    .rotate()
    .resize({ width: 960, withoutEnlargement: true })
    .jpeg({ quality: 74, progressive: true, mozjpeg: true })
    .toBuffer();
  // Never make a photo bigger than it already was.
  const out = main.length < input.length ? main : input;
  await fs.writeFile(full, out);
  after += out.length;

  const thumb = await sharp(input)
    .rotate()
    .resize({ width: 240, height: 240, fit: "cover", position: "attention" })
    .jpeg({ quality: 62, progressive: true, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(path.join(thumbDir, file), thumb);
  thumbs += thumb.length;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
console.log(`${files.length} photos: ${mb(before)} -> ${mb(after)}; thumbnails ${mb(thumbs)}`);
