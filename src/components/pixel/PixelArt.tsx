/**
 * Small handcrafted pixel-art sprites, drawn as literal pixel grids (not
 * photos, not AI stock art, not blurred gradient blobs). Each grid is a
 * row-major string array where "." is transparent and any other character
 * is a palette key resolved to a fill color. Rendered with crisp edges so
 * they stay blocky at any scale.
 */

export interface PixelSpriteProps {
  size?: number;
  className?: string;
  title?: string;
}

function renderGrid(grid: string[], palette: Record<string, string>) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const cells: { x: number; y: number; fill: string }[] = [];
  grid.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      const fill = palette[ch];
      if (fill) cells.push({ x, y, fill });
    });
  });
  return { rows, cols, cells };
}

function Sprite({
  grid,
  palette,
  size = 24,
  className,
  title,
}: PixelSpriteProps & { grid: string[]; palette: Record<string, string> }) {
  const { rows, cols, cells } = renderGrid(grid, palette);
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={1} height={1} fill={c.fill} />
      ))}
    </svg>
  );
}

const HEART_GRID = [
  ".##.##.",
  "#######",
  "#######",
  "#######",
  ".#####.",
  "..###..",
  "...#...",
];

export function PixelHeart({
  color = "#FF9DC2",
  shade = "#E8699D",
  ...props
}: PixelSpriteProps & { color?: string; shade?: string }) {
  return (
    <Sprite
      grid={HEART_GRID}
      palette={{ "#": color, "@": shade }}
      {...props}
    />
  );
}

const CLOUD_GRID = [
  "..####...",
  ".######..",
  "#########",
  "#########",
  ".#######.",
];

export function PixelCloud({
  color = "#FFFFFF",
  ...props
}: PixelSpriteProps & { color?: string }) {
  return <Sprite grid={CLOUD_GRID} palette={{ "#": color }} {...props} />;
}

const STAR_GRID = ["..#..", "..#..", "#####", "..#..", "..#.."];

export function PixelStar({
  color = "#FFD988",
  ...props
}: PixelSpriteProps & { color?: string }) {
  return <Sprite grid={STAR_GRID} palette={{ "#": color }} {...props} />;
}

const FLOWER_GRID = [".#.#.", "#####", "##@##", "#####", "..#.."];

export function PixelFlower({
  petal = "#FFC4E3",
  center = "#FFE28A",
  ...props
}: PixelSpriteProps & { petal?: string; center?: string }) {
  return (
    <Sprite
      grid={FLOWER_GRID}
      palette={{ "#": petal, "@": center }}
      {...props}
    />
  );
}

const BOOK_GRID = [
  "########",
  "#......#",
  "#.####.#",
  "#.####.#",
  "#......#",
  "########",
];

export function PixelBook({
  cover = "#C7B6F0",
  page = "#FFF8EC",
  ...props
}: PixelSpriteProps & { cover?: string; page?: string }) {
  return (
    <Sprite
      grid={BOOK_GRID}
      palette={{ "#": cover, ".": page }}
      {...props}
    />
  );
}

const CAT_GRID = [
  "#.....#.",
  "##...##.",
  "#######.",
  "#.@.@##.",
  "#..V.##.",
  "#######.",
  ".#.#.#..",
];

export function PixelCat({
  color = "#C7B6F0",
  eye = "#6B5B73",
  ...props
}: PixelSpriteProps & { color?: string; eye?: string }) {
  return (
    <Sprite
      grid={CAT_GRID}
      palette={{ "#": color, "@": eye, V: "#E8699D" }}
      {...props}
    />
  );
}
