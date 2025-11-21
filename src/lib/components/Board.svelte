<script lang="ts">
  import { gameState } from '../stores/gameState.svelte';
  import { TETROMINOES } from '../game/Tetrominoes';

  // Derived grid from state
  let grid = $derived(gameState.grid);
  let activePiece = $derived(gameState.activePiece);

  // Calculate Ghost Piece Position
  let ghostY = $derived.by(() => {
    if (!activePiece) return null;
    let y = activePiece.y;
    // Simulate dropping until collision
    while (true) {
      // Check next position (y + 1)
      let collision = false;
      for (let row = 0; row < activePiece.shape.length; row++) {
        for (let col = 0; col < activePiece.shape[row].length; col++) {
          if (activePiece.shape[row][col] !== 0) {
            let nextY = y + 1 + row;
            let nextX = activePiece.x + col;
            
            if (nextY >= 20 || (nextY >= 0 && grid[nextY][nextX] !== 0)) {
              collision = true;
              break;
            }
          }
        }
        if (collision) break;
      }
      
      if (collision) break;
      y++;
    }
    return y;
  });

  // Helper to determine cell color
  function getCellColor(value: number): string {
    if (value === 0) return 'transparent';
    // Map numeric value to color (MVP: 1-7 map to specific colors)
    const colors = Object.values(TETROMINOES).map(t => t.color);
    return colors[value - 1] || '#fff';
  }

  function getPieceColor(type: string): string {
    return TETROMINOES[type as keyof typeof TETROMINOES]?.color || '#fff';
  }
</script>

<div class="board">
  {#each grid as row, y}
    <div class="row">
      {#each row as cell, x}
        <div class="cell" style:background-color={getCellColor(cell)}></div>
      {/each}
    </div>
  {/each}

  <!-- Render Ghost Piece -->
  {#if activePiece && ghostY !== null}
    <div 
      class="active-piece ghost-piece"
      style:left="{activePiece.x * 31}px"
      style:top="{ghostY * 31}px"
    >
      {#each activePiece.shape as row}
        <div class="piece-row">
          {#each row as cell}
            <div 
              class="piece-cell" 
              class:ghost-cell={cell !== 0}
            ></div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Render Active Piece Overlay -->
  {#if activePiece}
    <div 
      class="active-piece"
      style:left="{activePiece.x * 31}px"
      style:top="{activePiece.y * 31}px"
    >
      {#each activePiece.shape as row, r}
        <div class="piece-row">
          {#each row as cell, c}
            <div 
              class="piece-cell" 
              style:background-color={cell ? getPieceColor(activePiece.type) : 'transparent'}
              class:empty={cell === 0}
            ></div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .board {
    position: relative; /* For absolute positioning of active piece */
    display: grid;
    grid-template-rows: repeat(20, 30px); /* Fixed size rows */
    gap: 1px;
    background: #0a0a0a; /* Darker background */
    border: 2px solid #111;
    width: fit-content; /* Let grid determine width */
    height: fit-content; /* Let grid determine height */
  }

  .row {
    display: grid;
    grid-template-columns: repeat(10, 30px); /* Fixed size columns */
    gap: 1px;
  }

  .cell {
    /* Remove fixed width/height - let grid handle it */
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0, 255, 65, 0.1); /* Subtle grid lines */
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
    transition: box-shadow 0.1s;
  }

  /* Add glow to non-empty cells */
  .cell:not([style*="transparent"]) {
    box-shadow: 
      0 0 5px currentColor,
      inset 0 0 5px rgba(255, 255, 255, 0.2);
  }

  .active-piece {
    position: absolute;
    pointer-events: none;
    display: flex;
    flex-direction: column;
  }

  .piece-row {
    display: flex;
  }

  .piece-cell {
    width: 30px; /* Match grid cell size */
    height: 30px; /* Match grid cell size */
    border: 1px solid rgba(0, 0, 0, 0.3);
  }

  /* Add glow to piece cells */
  .piece-cell:not(.empty) {
    box-shadow: 
      0 0 8px currentColor,
      inset 0 0 5px rgba(255, 255, 255, 0.3);
  }
  
  .piece-cell.empty {
      background: transparent !important;
  }

  .ghost-piece {
    opacity: 0.25;
    z-index: 1;
  }

  .ghost-cell {
    border: 2px solid #fff;
    background: transparent;
    box-sizing: border-box;
    width: 30px; /* Match cell size */
    height: 30px; /* Match cell size */
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }
</style>
