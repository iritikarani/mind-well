// Renders src/app/icon.svg to the PNG sizes installable web apps need.
import sharp from "sharp";
import fs from "node:fs/promises";

const svg = await fs.readFile("src/app/icon.svg");
await fs.mkdir("public/icons", { recursive: true });

for (const size of [192, 512]) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(`public/icons/icon-${size}.png`);
}

// "Maskable" icons get cropped to a circle/squircle by the OS, so the art
// must sit inside the central safe zone: lavender fill + art at 70%.
const art = await sharp(svg, { density: 384 }).resize(358, 358).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#E6DAF8" } })
  .composite([{ input: art, gravity: "center" }])
  .png()
  .toFile("public/icons/maskable-512.png");

console.log("icons written");
