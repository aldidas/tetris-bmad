<script lang="ts">
  import { gameState } from '../stores/gameState.svelte';
  import { typeColor } from '../game/Tetrominoes';

  let nextPiece = $derived(gameState.nextPiece);
</script>

<div class="preview">
  <h2>Next</h2>
  <div class="preview-box">
    <div class="piece" style:--c={typeColor(nextPiece.type)}>
      {#each nextPiece.shape as row, rowIndex (rowIndex)}
        <div class="piece-row">
          {#each row as cell, colIndex (colIndex)}
            <div class="piece-cell" class:filled={cell !== 0}></div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .preview {
    margin-top: 22px;
  }

  h2 {
    margin: 0 0 8px;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .preview-box {
    display: grid;
    place-items: center;
    min-height: 88px;
    padding: 10px;
    background: #0b0e13;
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .piece {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .piece-row {
    display: flex;
    gap: 2px;
  }

  .piece-cell {
    width: 16px;
    height: 16px;
    border-radius: 3px;
  }

  .piece-cell.filled {
    background: var(--c);
    box-shadow:
      inset 0 0 0 1px rgb(255 255 255 / 22%),
      inset 0 -3px 0 rgb(0 0 0 / 16%);
  }
</style>