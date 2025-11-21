<script lang="ts">
  import { gameState } from '../stores/gameState.svelte';
  import { TETROMINOES } from '../game/Tetrominoes';

  let nextPiece = $derived(gameState.nextPiece);

  function getPieceColor(type: string): string {
    return TETROMINOES[type as keyof typeof TETROMINOES]?.color || '#fff';
  }
</script>

<div class="preview-container">
  <h3>Next</h3>
  <div class="preview-box">
    {#if nextPiece}
      <div class="piece-grid">
        {#each nextPiece.shape as row}
          <div class="row">
            {#each row as cell}
              <div 
                class="cell" 
                style:background-color={cell ? getPieceColor(nextPiece.type) : 'transparent'}
              ></div>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .preview-container {
    text-align: center;
    margin-top: 2rem;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: #00ff41;
    text-transform: uppercase;
    font-size: 0.5rem;
    text-shadow: 0 0 5px #00ff41;
    font-family: 'Press Start 2P', monospace;
  }

  .preview-box {
    width: 100px;
    height: 100px;
    background: #000;
    border: 2px solid #00ff41;
    box-shadow: 
      0 0 5px #00ff41,
      inset 0 0 10px rgba(0, 255, 65, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .piece-grid {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .row {
    display: flex;
    gap: 1px;
  }

  .cell {
    width: 20px;
    height: 20px;
    border: 1px solid rgba(0, 0, 0, 0.3);
  }

  /* Add glow to non-empty cells */
  .cell:not([style*="transparent"]) {
    box-shadow: 
      0 0 5px currentColor,
      inset 0 0 3px rgba(255, 255, 255, 0.2);
  }
</style>
