import { getRandomTetromino, typeValue, type TetrominoType } from './Tetrominoes';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export interface ActivePiece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
}

export interface NextPiece {
  type: TetrominoType;
  shape: number[][];
}

/** Pure game rules: no DOM, no timing, no audio. */
export class GameEngine {
  grid: number[][];
  activePiece: ActivePiece | null;
  nextPiece: NextPiece;

  constructor() {
    this.grid = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
    this.activePiece = null;
    this.nextPiece = getRandomTetromino();
  }

  /** Moves the next piece into play. Returns `false` when it cannot be placed (game over). */
  spawnPiece(): boolean {
    const { type, shape } = this.nextPiece;
    const piece: ActivePiece = {
      type,
      shape,
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0,
    };

    if (this.checkCollision(piece.x, piece.y, piece.shape)) {
      // Keep the piece so the caller can decide how to surface the game over.
      this.activePiece = piece;
      return false;
    }

    this.activePiece = piece;
    this.nextPiece = getRandomTetromino();
    return true;
  }

  /** Clears the board and re-rolls the piece queue. */
  reset() {
    this.grid = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
    this.activePiece = null;
    this.nextPiece = getRandomTetromino();
  }

  moveLeft(): boolean {
    const piece = this.activePiece;
    return piece ? this.tryMove(piece.x - 1) : false;
  }

  moveRight(): boolean {
    const piece = this.activePiece;
    return piece ? this.tryMove(piece.x + 1) : false;
  }

  /** @returns `true` when the piece moved down, `false` when it landed. */
  moveDown(): boolean {
    const piece = this.activePiece;
    if (!piece) return false;

    if (this.checkCollision(piece.x, piece.y + 1, piece.shape)) return false;
    piece.y++;
    return true;
  }

  /** @returns `true` when the piece actually rotated. */
  rotate(): boolean {
    const piece = this.activePiece;
    if (!piece) return false;

    // Transpose + reverse rows = 90° clockwise.
    const rotated = piece.shape[0].map((_, index) => piece.shape.map((row) => row[index]).reverse());

    // Wall kick: rotate in place if possible, otherwise nudge sideways.
    for (const offset of [0, -1, 1, -2, 2]) {
      if (this.checkCollision(piece.x + offset, piece.y, rotated)) continue;

      piece.x += offset;
      piece.shape = rotated;
      return true;
    }

    return false;
  }

  checkCollision(x: number, y: number, shape: number[][]): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 0) continue;

        const nextX = x + col;
        const nextY = y + row;

        if (nextX < 0 || nextX >= BOARD_WIDTH || nextY >= BOARD_HEIGHT) return true;
        // Cells above the board (negative y) are legal while spawning.
        if (nextY >= 0 && this.grid[nextY][nextX] !== 0) return true;
      }
    }
    return false;
  }

  lockPiece() {
    const piece = this.activePiece;
    if (!piece) return;

    const value = typeValue(piece.type);

    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col] === 0) continue;

        const y = piece.y + row;
        const x = piece.x + col;
        // Rows above the board are discarded rather than clipping out of range.
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          this.grid[y][x] = value;
        }
      }
    }

    this.activePiece = null;
  }

  /** Removes every completed row in place. @returns number of rows cleared. */
  checkLines(): number {
    let linesCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (!this.grid[y].every((cell) => cell !== 0)) continue;

      this.grid.splice(y, 1);
      this.grid.unshift(Array(BOARD_WIDTH).fill(0));
      linesCleared++;
      // Re-check this index: the row that was above has shifted into it.
      y++;
    }

    return linesCleared;
  }

  /** Where the active piece would land if dropped straight down. */
  ghostY(): number | null {
    const piece = this.activePiece;
    if (!piece) return null;

    let y = piece.y;
    while (!this.checkCollision(piece.x, y + 1, piece.shape)) y++;
    return y;
  }

  private tryMove(x: number): boolean {
    const piece = this.activePiece;
    if (!piece) return false;
    if (this.checkCollision(x, piece.y, piece.shape)) return false;

    piece.x = x;
    return true;
  }
}