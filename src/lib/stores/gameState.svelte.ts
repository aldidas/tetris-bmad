import { GameEngine, type ActivePiece, type NextPiece } from '../game/GameEngine';
import { audio } from '../game/AudioController';

/** Line-clear values, indexed by rows cleared, scaled by the level at the time of the clear. */
const LINE_SCORES = [0, 40, 100, 300, 1200];
const LINES_PER_LEVEL = 10;
const BASE_DROP_INTERVAL = 1000;
const MIN_DROP_INTERVAL = 100;

export const createGameState = () => {
  const engine = new GameEngine();

  // Reactive mirrors of the engine. The engine owns the rules; these exist so the
  // UI can observe them. Every mutation calls a `sync*` helper afterwards.
  let grid = $state<number[][]>(engine.grid);
  let activePiece = $state<ActivePiece | null>(engine.activePiece);
  let nextPiece = $state<NextPiece>(engine.nextPiece);
  let score = $state(0);
  let level = $state(1);
  let lines = $state(0);
  let isGameOver = $state(false);
  let isPaused = $state(false);
  let isMuted = $state(audio.muted);

  let dropInterval = $derived(Math.max(MIN_DROP_INTERVAL, BASE_DROP_INTERVAL - (level - 1) * 100));

  // Depends on both mirrors so it recomputes whenever the piece or board changes.
  let ghostY = $derived.by(() => {
    const board = grid;
    const piece = activePiece;
    return piece && board ? engine.ghostY() : null;
  });

  let frameId: number | null = null;
  let generation = 0;
  let lastTime = 0;
  let dropCounter = 0;

  function syncBoard() {
    grid = [...engine.grid];
  }

  function syncPiece() {
    activePiece = engine.activePiece ? { ...engine.activePiece } : null;
  }

  function syncAll() {
    syncBoard();
    syncPiece();
    nextPiece = engine.nextPiece;
  }

  /**
   * Single rAF chain per round. `generation` invalidates any frame still queued
   * from a previous round, so a stopped loop can never resurrect itself.
   */
  function startLoop() {
    stopLoop();
    const current = ++generation;
    lastTime = performance.now();
    dropCounter = 0;

    const frame = (time: number) => {
      if (current !== generation) return;
      tick(time);
      if (current !== generation) return;
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
  }

  function stopLoop() {
    generation++;
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  function tick(time: number) {
    dropCounter += time - lastTime;
    lastTime = time;
    if (dropCounter < dropInterval) return;

    dropCounter = 0;
    if (!engine.moveDown()) {
      lockAndResolve();
      return;
    }
    syncPiece();
  }

  /** Locks the piece, resolves completed rows, then brings in the next piece. */
  function lockAndResolve() {
    engine.lockPiece();

    const cleared = engine.checkLines();
    if (cleared > 0) {
      lines += cleared;
      score += LINE_SCORES[cleared] * level;
      level = Math.floor(lines / LINES_PER_LEVEL) + 1;
      audio.play('clear');
    } else {
      audio.play('drop');
    }

    dropCounter = 0;
    syncBoard();

    if (!engine.spawnPiece()) {
      endGame();
      return;
    }

    syncAll();
  }

  function endGame() {
    stopLoop();
    isGameOver = true;
    // The piece that could not be placed is not part of the board.
    activePiece = null;
    audio.stopMusic();
    audio.play('gameover');
  }

  function setPaused(paused: boolean) {
    if (paused === isPaused) return;

    isPaused = paused;
    if (paused) {
      stopLoop();
      audio.pauseMusic();
    } else {
      startLoop();
      audio.resumeMusic();
    }
  }

  return {
    get grid() { return grid },
    get activePiece() { return activePiece },
    get nextPiece() { return nextPiece },
    get ghostY() { return ghostY },
    get score() { return score },
    get level() { return level },
    get lines() { return lines },
    get isGameOver() { return isGameOver },
    get isPaused() { return isPaused },
    get isMuted() { return isMuted },

    startGame() {
      stopLoop();
      engine.reset();
      score = 0;
      level = 1;
      lines = 0;
      isGameOver = false;
      isPaused = false;
      // An empty board always accepts the first piece.
      engine.spawnPiece();
      syncAll();
      startLoop();
      audio.startMusic();
    },

    moveLeft() {
      if (isPaused || isGameOver) return;
      if (!engine.moveLeft()) return;
      syncPiece();
      audio.play('move');
    },

    moveRight() {
      if (isPaused || isGameOver) return;
      if (!engine.moveRight()) return;
      syncPiece();
      audio.play('move');
    },

    rotate() {
      if (isPaused || isGameOver) return;
      if (!engine.rotate()) return;
      syncPiece();
      audio.play('rotate');
    },

    /** One row down on demand, resetting the gravity timer. */
    softDrop() {
      if (isPaused || isGameOver) return;
      dropCounter = 0;
      if (!engine.moveDown()) {
        lockAndResolve();
        return;
      }
      syncPiece();
    },

    hardDrop() {
      if (isPaused || isGameOver) return;
      dropCounter = 0;
      while (engine.moveDown()) {
        // Fall to the landing position.
      }
      lockAndResolve();
    },

    togglePause() {
      if (isGameOver) return;
      setPaused(!isPaused);
    },

    toggleMute() {
      isMuted = audio.toggleMute();
    },
  };
};

export const gameState = createGameState();