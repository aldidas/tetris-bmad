export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: number[][];
  color: string;
}

export const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: '#00ffff', // Cyan neon
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: '#0080ff', // Electric blue
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: '#ff8000', // Neon orange
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#ffff00', // Bright yellow
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00ff00', // Neon green
  },
  T: {
    shape: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#ff00ff', // Magenta/Purple
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#ff0000', // Bright red
  },
};

export const getRandomTetromino = (): { type: TetrominoType; shape: number[][] } => {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];
  // Return a deep copy of the shape to avoid mutating the definition
  const shape = TETROMINOES[type].shape.map(row => [...row]);
  return { type, shape };
};
