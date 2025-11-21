import { TETROMINOES, getRandomTetromino, type TetrominoType } from './Tetrominoes';

export class GameEngine {
  grid: number[][];
  activePiece: {
    type: TetrominoType;
    shape: number[][];
    x: number;
    y: number;
  } | null;
  nextPiece: {
    type: TetrominoType;
    shape: number[][];
  };

  constructor() {
    this.grid = Array.from({ length: 20 }, () => Array(10).fill(0));
    this.activePiece = null;
    this.nextPiece = getRandomTetromino();
  }

  spawnPiece() {
    const { type, shape } = this.nextPiece;
    this.activePiece = {
      type,
      shape,
      x: Math.floor((10 - shape[0].length) / 2), // Center horizontally
      y: 0,
    };
    this.nextPiece = getRandomTetromino();

    // Check for immediate collision (Game Over condition)
    if (this.checkCollision(this.activePiece.x, this.activePiece.y, this.activePiece.shape)) {
      // Game Over logic will be handled by the consumer (gameState)
      return false; 
    }
    return true;
  }

  moveLeft() {
    if (!this.activePiece) return;
    if (!this.checkCollision(this.activePiece.x - 1, this.activePiece.y, this.activePiece.shape)) {
      this.activePiece.x--;
    }
  }

  moveRight() {
    if (!this.activePiece) return;
    if (!this.checkCollision(this.activePiece.x + 1, this.activePiece.y, this.activePiece.shape)) {
      this.activePiece.x++;
    }
  }

  moveDown(): boolean {
    if (!this.activePiece) return false;
    if (!this.checkCollision(this.activePiece.x, this.activePiece.y + 1, this.activePiece.shape)) {
      this.activePiece.y++;
      return true; // Moved successfully
    }
    return false; // Hit something
  }

  rotate() {
    if (!this.activePiece) return;
    
    const originalShape = this.activePiece.shape;
    const newShape = originalShape[0].map((_, index) =>
      originalShape.map(row => row[index]).reverse()
    );

    // Basic wall kick: try current pos, then left, then right
    if (!this.checkCollision(this.activePiece.x, this.activePiece.y, newShape)) {
      this.activePiece.shape = newShape;
    } else if (!this.checkCollision(this.activePiece.x - 1, this.activePiece.y, newShape)) {
      this.activePiece.x--;
      this.activePiece.shape = newShape;
    } else if (!this.checkCollision(this.activePiece.x + 1, this.activePiece.y, newShape)) {
      this.activePiece.x++;
      this.activePiece.shape = newShape;
    }
  }

  checkCollision(x: number, y: number, shape: number[][]): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col;
          const newY = y + row;

          // Wall/Floor checks
          if (newX < 0 || newX >= 10 || newY >= 20) return true;

          // Locked block check (ignore if above board, e.g. spawning)
          if (newY >= 0 && this.grid[newY][newX] !== 0) return true;
        }
      }
    }
    return false;
  }

  lockPiece() {
    if (!this.activePiece) return;

    const { x, y, shape, type } = this.activePiece;
    const typeMap: Record<TetrominoType, number> = { I: 1, J: 2, L: 3, O: 4, S: 5, T: 6, Z: 7 };
    const value = typeMap[type];

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          if (y + row >= 0) {
            this.grid[y + row][x + col] = value;
          }
        }
      }
    }
    this.activePiece = null;
  }

  checkLines(): number {
    let linesCleared = 0;
    
    // Iterate from bottom up
    for (let y = 19; y >= 0; y--) {
      if (this.grid[y].every(cell => cell !== 0)) {
        // Remove this row
        this.grid.splice(y, 1);
        // Add new empty row at top
        this.grid.unshift(Array(10).fill(0));
        // Since we removed the current row and shifted everything down, 
        // we need to check this index again (it now contains the row that was above)
        y++; 
        linesCleared++;
      }
    }
    return linesCleared;
  }
}
