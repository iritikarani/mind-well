export interface Cell {
  row: number;
  col: number;
}

export interface Placement {
  word: string;
  cells: Cell[];
}

export interface WordSearchGrid {
  size: number;
  letters: string[][];
  placements: Placement[];
}

const DIRECTIONS: Cell[] = [
  { row: 0, col: 1 },
  { row: 0, col: -1 },
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: -1 },
  { row: -1, col: 1 },
  { row: -1, col: -1 },
];

function randomLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

export function generateGrid(size: number, words: string[]): WordSearchGrid {
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const placements: Placement[] = [];

  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    const placed = tryPlaceWord(grid, size, word);
    if (placed) placements.push({ word, cells: placed });
  }

  const letters: string[][] = grid.map((row) => row.map((cell) => cell ?? randomLetter()));

  return { size, letters, placements };
}

function tryPlaceWord(grid: (string | null)[][], size: number, word: string): Cell[] | null {
  const attempts = 150;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    const endRow = row + dir.row * (word.length - 1);
    const endCol = col + dir.col * (word.length - 1);
    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

    const cells: Cell[] = [];
    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.row * i;
      const c = col + dir.col * i;
      const existing = grid[r][c];
      if (existing !== null && existing !== word[i]) {
        fits = false;
        break;
      }
      cells.push({ row: r, col: c });
    }

    if (fits) {
      cells.forEach((cell, i) => {
        grid[cell.row][cell.col] = word[i];
      });
      return cells;
    }
  }

  return null;
}

/** Returns the straight-line path between two cells (inclusive), or null if not a straight line. */
export function lineBetween(start: Cell, end: Cell): Cell[] | null {
  const dr = end.row - start.row;
  const dc = end.col - start.col;
  if (dr === 0 && dc === 0) return null;

  const isStraight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
  if (!isStraight) return null;

  const length = Math.max(Math.abs(dr), Math.abs(dc));
  const stepRow = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepCol = dc === 0 ? 0 : dc / Math.abs(dc);

  const cells: Cell[] = [];
  for (let i = 0; i <= length; i++) {
    cells.push({ row: start.row + stepRow * i, col: start.col + stepCol * i });
  }
  return cells;
}
