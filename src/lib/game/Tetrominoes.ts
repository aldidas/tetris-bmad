export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: number[][];
  color: string;
}

/**
 * Canonical type order. The index in this array defines the numeric value stored
 * in the board grid (1-based) and the cell colour lookup, so renderers and the
 * engine can never disagree about which number means which piece.
 */
export const TETROMINO_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as const;

export const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: '#4cc9f0',
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: '#4361ee',
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: '#f77f00',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#fcbf49',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#52b788',
  },
  T: {
    shape: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#b5179e',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#e5383b',
  },
};

/** Cell colours indexed by `gridValue - 1`. */
export const CELL_COLORS: readonly string[] = TETROMINO_TYPES.map((type) => TETROMINOES[type].color);

/** Grid value used to store a piece of the given type (1-based, never 0). */
export const typeValue = (type: TetrominoType): number => TETROMINO_TYPES.indexOf(type) + 1;

/** Colour for a board cell value; `0` renders as an empty cell. */
export const cellColor = (value: number): string => CELL_COLORS[value - 1] ?? CELL_COLORS[0];

/** Colour for a piece type, for previews that render before the piece is on the board. */
export const typeColor = (type: TetrominoType): string => TETROMINOES[type].color;

export const getRandomTetromino = (): { type: TetrominoType; shape: number[][] } => {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  // Deep copy the shape so rotating a live piece never mutates the definition.
  const shape = TETROMINOES[type].shape.map((row) => [...row]);
  return { type, shape };
};