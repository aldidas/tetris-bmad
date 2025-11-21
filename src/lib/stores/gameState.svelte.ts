import { GameEngine } from '../game/GameEngine';
import { audio } from '../game/AudioController';

export const createGameState = () => {
  let engine = new GameEngine();
  
  // Svelte 5 Runes state
  let grid = $state(engine.grid);
  let activePiece = $state(engine.activePiece);
  let nextPiece = $state(engine.nextPiece);
  let score = $state(0);
  let level = $state(1);
  let lines = $state(0);
  let isGameOver = $state(false);
  let isPaused = $state(false);

  let loopId: number | null = null;
  let lastTime = 0;
  let dropCounter = 0;
  let dropInterval = $derived(Math.max(100, 1000 - (level - 1) * 100)); // Simple speed curve

  function loop(time: number = 0) {
    if (isPaused || isGameOver) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      drop();
      dropCounter = 0; // Reset counter after drop
    }

    loopId = requestAnimationFrame(loop);
  }

  function drop() {
    if (!engine.moveDown()) {
      engine.lockPiece();
      
      const cleared = engine.checkLines();
      if (cleared > 0) {
        lines += cleared;
        
        // Scoring (Standard Nintendo system)
        // 1 line: 40 * (level + 1)
        // 2 lines: 100 * (level + 1)
        // 3 lines: 300 * (level + 1)
        // 4 lines: 1200 * (level + 1)
        const points = [0, 40, 100, 300, 1200];
        score += points[cleared] * level;

        // Level up every 10 lines
        level = Math.floor(lines / 10) + 1;
        audio.play('clear');
      } else {
        audio.play('drop');
      }

      grid = [...engine.grid]; // Trigger update
      spawn();
    }
    activePiece = engine.activePiece ? { ...engine.activePiece } : null;
  }


  function spawn() {
    if (!engine.spawnPiece()) {
      isGameOver = true;
      audio.stopMusic(); // Stop background music
      audio.play('gameover');
      if (loopId) cancelAnimationFrame(loopId);
    }
    activePiece = engine.activePiece ? { ...engine.activePiece } : null;
    nextPiece = { ...engine.nextPiece };
  }

  return {
    get grid() { return grid },
    get activePiece() { return activePiece },
    get nextPiece() { return nextPiece },
    get score() { return score },
    get level() { return level },
    get lines() { return lines },
    get isGameOver() { return isGameOver },
    get isPaused() { return isPaused },
    
    // Actions
    startGame() {
      engine = new GameEngine();
      grid = engine.grid;
      score = 0;
      level = 1;
      lines = 0;
      isGameOver = false;
      isPaused = false;
      
      spawn();
      lastTime = 0;
      dropCounter = 0;
      loop();
      audio.startMusic(); // Start background music
    },

    moveLeft() { 
      if (isPaused || isGameOver) return;
      engine.moveLeft(); 
      activePiece = { ...engine.activePiece! }; 
      audio.play('move');
    },
    moveRight() { 
      if (isPaused || isGameOver) return;
      engine.moveRight(); 
      activePiece = { ...engine.activePiece! }; 
      audio.play('move');
    },
    rotate() { 
      if (isPaused || isGameOver) return;
      engine.rotate(); 
      activePiece = { ...engine.activePiece! }; 
      audio.play('rotate');
    },
    softDrop() { 
      if (isPaused || isGameOver) return;
      drop(); 
      // No sound for soft drop usually, or very quiet
    },
    hardDrop() {
        if (isPaused || isGameOver) return;
        while(engine.moveDown()) {} // Drop until hit
        engine.lockPiece();
        
        // Check lines immediately for hard drop
        const cleared = engine.checkLines();
        if (cleared > 0) {
            lines += cleared;
            const points = [0, 40, 100, 300, 1200];
            score += points[cleared] * level;
            level = Math.floor(lines / 10) + 1;
            audio.play('clear');
        } else {
            audio.play('drop');
        }

        grid = [...engine.grid];
        spawn();
    },
    togglePause() {
        isPaused = !isPaused;
        if (!isPaused) {
            lastTime = performance.now();
            loop(lastTime);
        } else if (loopId) {
            cancelAnimationFrame(loopId);
        }
    },
    toggleMute() {
        return audio.toggleMute();
    }
  };
};

// Singleton instance
export const gameState = createGameState();
