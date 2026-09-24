<script lang="ts">
  import { gameState } from '../stores/gameState.svelte';
  import { BOARD_HEIGHT, BOARD_WIDTH, type ActivePiece } from '../game/GameEngine';
  import { cellColor, typeValue } from '../game/Tetrominoes';

  type CellKind = 'empty' | 'locked' | 'ghost' | 'active';
  interface Cell {
    value: number;
    kind: CellKind;
  }

  /**
   * The whole board — stack, ghost and live piece — is composed into one flat
   * grid and rendered once, so cell size stays a pure CSS concern.
   */
  function paint(board: Cell[], piece: ActivePiece, x: number, y: number, kind: CellKind) {
    const value = typeValue(piece.type);

    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col] === 0) continue;

        const cellX = x + col;
        const cellY = y + row;
        if (cellX < 0 || cellX >= BOARD_WIDTH || cellY < 0 || cellY >= BOARD_HEIGHT) continue;

        const index = cellY * BOARD_WIDTH + cellX;
        // The ghost only marks empty space; it never covers the stack or the piece.
        if (kind === 'ghost' && board[index].kind !== 'empty') continue;
        board[index] = { value, kind };
      }
    }
  }

  let cells = $derived.by(() => {
    const board: Cell[] = Array.from({ length: BOARD_WIDTH * BOARD_HEIGHT }, () => ({ value: 0, kind: 'empty' as CellKind }));
    const { grid, activePiece, ghostY } = gameState;

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const value = grid[y][x];
        if (value !== 0) board[y * BOARD_WIDTH + x] = { value, kind: 'locked' };
      }
    }

    if (activePiece) {
      if (ghostY !== null) paint(board, activePiece, activePiece.x, ghostY, 'ghost');
      paint(board, activePiece, activePiece.x, activePiece.y, 'active');
    }

    return board;
  });
</script>

<div class="board" role="img" aria-label="Tetris board">
  {#each cells as cell, index (index)}
    <div class="cell {cell.kind}" style:--c={cellColor(cell.value)}></div>
  {/each}
</div>

<style>
  .board {
    --cell: 30px;
    --gap: 2px;
    display: grid;
    grid-template-columns: repeat(10, var(--cell));
    grid-template-rows: repeat(20, var(--cell));
    gap: var(--gap);
    padding: 6px;
    background: #0b0e13;
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .cell {
    border-radius: 3px;
    background: #151a22;
    box-shadow: inset 0 0 0 1px #1f2530;
  }

  .cell.locked,
  .cell.active {
    background: var(--c);
    box-shadow:
      inset 0 0 0 1px rgb(255 255 255 / 22%),
      inset 0 -4px 0 rgb(0 0 0 / 16%);
  }

  .cell.active {
    box-shadow:
      inset 0 0 0 2px rgb(255 255 255 / 55%),
      inset 0 -4px 0 rgb(0 0 0 / 16%);
  }

  .cell.ghost {
    background: rgb(255 255 255 / 4%);
    box-shadow: inset 0 0 0 2px var(--c);
  }

  /* Keep the whole board inside narrow viewports. */
  @media (max-width: 980px) {
    .board {
      --cell: min(30px, calc((100vw - 64px) / 10));
    }
  }
</style>