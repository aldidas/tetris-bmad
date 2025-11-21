<script lang="ts">
  import Board from './lib/components/Board.svelte';
  import PiecePreview from './lib/components/PiecePreview.svelte';
  import { gameState } from './lib/stores/gameState.svelte';

  let gameStarted = $state(false);

  function handleKeydown(event: KeyboardEvent) {
    // Prevent default scrolling for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
      event.preventDefault();
    }

    if (!gameStarted || gameState.isGameOver) {
        if (event.code === 'Enter') {
            gameStarted = true;
            gameState.startGame();
        }
        return;
    }

    switch (event.code) {
      case 'ArrowLeft':
        gameState.moveLeft();
        break;
      case 'ArrowRight':
        gameState.moveRight();
        break;
      case 'ArrowUp':
        gameState.rotate();
        break;
      case 'ArrowDown':
        gameState.softDrop();
        break;
      case 'Space':
        gameState.hardDrop();
        break;
      case 'KeyP':
        gameState.togglePause();
        break;
      case 'KeyM':
        gameState.toggleMute();
        break;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<main>
  <h1>Tetris Svelte 5</h1>
  
  <div class="game-container">
    <div class="stats">
      <div class="stat-box">
        <h3>Score</h3>
        <p>{gameState.score}</p>
      </div>
      <div class="stat-box">
        <h3>Level</h3>
        <p>{gameState.level}</p>
      </div>
      <div class="stat-box">
        <h3>Lines</h3>
        <p>{gameState.lines}</p>
      </div>
      
      <PiecePreview />

      <div class="controls-hint">
        <p>M: Mute</p>
        <p>P: Pause</p>
      </div>
    </div>

    <div class="board-wrapper">
      <Board />
      
      {#if !gameStarted}
        <div class="overlay">
          <h2>TETRIS</h2>
          <p>Press ENTER to Start</p>
        </div>
      {/if}

      {#if gameStarted && gameState.isGameOver}
        <div class="overlay game-over">
          <h2>GAME OVER</h2>
          <p>Score: {gameState.score}</p>
          <button onclick={() => gameState.startGame()}>Try Again</button>
        </div>
      {/if}

      {#if gameStarted && gameState.isPaused}
        <div class="overlay paused">
          <h2>PAUSED</h2>
        </div>
      {/if}
    </div>

    <div class="controls">
      <h3>Controls</h3>
      <ul>
        <li><span>← →</span> Move</li>
        <li><span>↑</span> Rotate</li>
        <li><span>↓</span> Soft Drop</li>
        <li><span>Space</span> Hard Drop</li>
      </ul>
    </div>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #0a0a0a;
    color: #00ff41;
    font-family: 'Press Start 2P', monospace;
    position: relative;
    overflow: hidden;
  }

  /* CRT Scanline Effect */
  main::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 100;
  }

  /* CRT Screen Glow */
  main::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
    pointer-events: none;
    z-index: 99;
  }

  h1 {
    margin-bottom: 2rem;
    font-size: 1.8rem;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #ff00ff;
    text-shadow: 
      0 0 5px #ff00ff,
      0 0 10px #ff00ff,
      0 0 20px #ff00ff,
      0 0 40px #ff00ff;
    animation: flicker 3s infinite;
    z-index: 1;
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.95; }
    51% { opacity: 1; }
    52% { opacity: 0.97; }
  }

  .game-container {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
    z-index: 1;
  }

  .stats, .controls {
    width: 180px;
    padding: 1rem;
    background: #000;
    border: 3px solid #00ff41;
    box-shadow: 
      0 0 10px #00ff41,
      inset 0 0 10px rgba(0, 255, 65, 0.1);
  }

  .stat-box {
    margin-bottom: 1.5rem;
  }

  .stat-box h3 {
    margin: 0 0 0.5rem 0;
    color: #00ff41;
    font-size: 0.5rem;
    text-transform: uppercase;
    text-shadow: 0 0 5px #00ff41;
  }

  .stat-box p {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    color: #ffff00;
    text-shadow: 0 0 5px #ffff00;
  }

  .board-wrapper {
    position: relative;
    border: 4px solid #00ff41;
    box-shadow: 
      0 0 20px #00ff41,
      inset 0 0 20px rgba(0, 255, 65, 0.1);
    background: #000;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border: 2px solid #ff00ff;
  }

  .overlay h2 {
    font-size: 1.5rem;
    color: #00ffff;
    margin-bottom: 1rem;
    text-shadow: 
      0 0 10px #00ffff,
      0 0 20px #00ffff;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .overlay p {
    font-size: 0.6rem;
    color: #00ff41;
    text-shadow: 0 0 5px #00ff41;
  }

  .game-over h2 {
    color: #ff0000;
    text-shadow: 
      0 0 10px #ff0000,
      0 0 20px #ff0000;
  }

  .paused h2 {
    color: #ffff00;
    text-shadow: 
      0 0 10px #ffff00,
      0 0 20px #ffff00;
  }

  button {
    padding: 0.8rem 2rem;
    background: #000;
    color: #ff00ff;
    border: 2px solid #ff00ff;
    cursor: pointer;
    font-family: 'Press Start 2P', monospace;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.6rem;
    transition: all 0.2s;
    box-shadow: 0 0 10px #ff00ff;
  }

  button:hover {
    background: #ff00ff;
    color: #000;
    box-shadow: 0 0 20px #ff00ff;
    transform: scale(1.05);
  }

  .controls h3 {
    margin-top: 0;
    border-bottom: 2px solid #00ff41;
    padding-bottom: 0.5rem;
    font-size: 0.6rem;
    color: #00ff41;
    text-shadow: 0 0 5px #00ff41;
  }

  .controls ul {
    list-style: none;
    padding: 0;
  }

  .controls li {
    margin-bottom: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.45rem;
    color: #00ff41;
  }

  .controls span {
    background: #000;
    padding: 0.3rem 0.5rem;
    font-family: 'Press Start 2P', monospace;
    border: 2px solid #ffff00;
    color: #ffff00;
    box-shadow: 0 0 5px #ffff00;
  }

  .controls-hint {
    margin-top: 2rem;
    font-size: 0.4rem;
    color: #00ff41;
    text-align: center;
    text-shadow: 0 0 5px #00ff41;
  }

  .controls-hint p {
    margin: 0.3rem 0;
  }
</style>
