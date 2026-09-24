<script lang="ts">
  import Board from './lib/components/Board.svelte';
  import PiecePreview from './lib/components/PiecePreview.svelte';
  import { gameState } from './lib/stores/gameState.svelte';

  const REPO_URL = 'https://github.com/aldidas/tetris-bmad';

  const FEATURES = [
    {
      title: 'Framework-free rules',
      body: 'Collision, rotation with wall kicks, locking and row clearing live in a pure TypeScript GameEngine — no DOM, no timers, no audio.',
    },
    {
      title: 'Svelte 5 runes',
      body: 'The engine owns the rules; $state and $derived mirrors expose the board, the falling piece and the score to the components.',
    },
    {
      title: 'Synthesised audio',
      body: 'Every effect and the Korobeiniki theme are generated with the Web Audio API, so the build ships no audio files at all.',
    },
    {
      title: 'Keyboard and touch',
      body: 'Arrow keys, Space, P and M on desktop. On touch devices a dedicated control pad appears below the board.',
    },
  ];

  const DOCS = [
    { label: 'Product brief', href: `${REPO_URL}/blob/main/docs/prd.md` },
    { label: 'Technical spec', href: `${REPO_URL}/blob/main/docs/tech-spec.md` },
    { label: 'Test design', href: `${REPO_URL}/blob/main/docs/test-design-epic-1.md` },
  ];

  // Enter is handled here too, so it is reserved only while no control has focus.
  const HANDLED_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter']);
  // Movement and soft drop are the only actions that should fire repeatedly while held.
  const REPEATABLE_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);

  let started = $state(false);
  let active = $derived(started && !gameState.isGameOver);

  function start() {
    started = true;
    gameState.startGame();
  }

  function startAndScroll() {
    start();
    document.getElementById('play')?.scrollIntoView({ block: 'start' });
  }

  function handleKeydown(event: KeyboardEvent) {
    const target = event.target;
    const onControl = target instanceof HTMLElement && target.closest('button, a[href]') !== null;

    // Stops the page scrolling while playing, without stealing Enter from a focused button.
    if (HANDLED_KEYS.has(event.code) && !(event.code === 'Enter' && onControl)) event.preventDefault();

    if (event.code === 'KeyM') {
      if (!event.repeat) gameState.toggleMute();
      return;
    }

    if (event.code === 'KeyP') {
      if (!event.repeat && active) gameState.togglePause();
      return;
    }

    if (!active) {
      if (event.code === 'Enter' && !event.repeat && !onControl) start();
      return;
    }

    if (event.repeat && !REPEATABLE_KEYS.has(event.code)) return;

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
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="page">
  <header class="hero">
    <p class="eyebrow">Svelte 5 · TypeScript · Vite</p>
    <h1>Tetris</h1>
    <p class="lede">
      A complete browser Tetris: a framework-free rules engine, Svelte 5 runes for state,
      synthesised Web Audio, and nothing but Vite to build it.
    </p>
    <div class="hero-actions">
      <button class="btn primary" onclick={startAndScroll}>Play now</button>
      <a class="btn" href={REPO_URL} target="_blank" rel="noreferrer noopener">View source on GitHub</a>
    </div>
  </header>

  <main id="play">
    <div class="game">
      <aside class="panel stats" aria-label="Game statistics">
        <div class="stat">
          <h3>Score</h3>
          <p>{gameState.score}</p>
        </div>
        <div class="stat">
          <h3>Level</h3>
          <p>{gameState.level}</p>
        </div>
        <div class="stat">
          <h3>Lines</h3>
          <p>{gameState.lines}</p>
        </div>

        <PiecePreview />

        <div class="panel-actions">
          <button class="btn small" onclick={() => gameState.togglePause()} disabled={!active}>
            {gameState.isPaused ? 'Resume' : 'Pause'}
          </button>
          <button class="btn small" onclick={() => gameState.toggleMute()}>
            {gameState.isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </aside>

      <div class="board-wrapper">
        <Board />

        {#if !started}
          <div class="overlay">
            <h2>Tetris</h2>
            <p>Arrow keys to move · Space to drop</p>
            <button class="btn primary" onclick={start}>Start game</button>
            <p class="overlay-hint">or press Enter</p>
          </div>
        {:else if gameState.isGameOver}
          <div class="overlay" role="status">
            <h2>Game over</h2>
            <p>Score {gameState.score} · {gameState.lines} lines · level {gameState.level}</p>
            <button class="btn primary" onclick={start}>Play again</button>
            <p class="overlay-hint">or press Enter</p>
          </div>
        {:else if gameState.isPaused}
          <div class="overlay" role="status">
            <h2>Paused</h2>
            <button class="btn primary" onclick={() => gameState.togglePause()}>Resume</button>
            <p class="overlay-hint">or press P</p>
          </div>
        {/if}
      </div>

      <aside class="panel controls" aria-label="Controls">
        <h3>Controls</h3>
        <ul>
          <li><span>Move</span><kbd>←</kbd><kbd>→</kbd></li>
          <li><span>Rotate</span><kbd>↑</kbd></li>
          <li><span>Soft drop</span><kbd>↓</kbd></li>
          <li><span>Hard drop</span><kbd>Space</kbd></li>
          <li><span>Pause</span><kbd>P</kbd></li>
          <li><span>Mute</span><kbd>M</kbd></li>
        </ul>
      </aside>
    </div>

    <div class="touch-controls" aria-label="Touch controls">
      <button class="btn" onclick={() => gameState.moveLeft()} aria-label="Move left">←</button>
      <button class="btn" onclick={() => gameState.moveRight()} aria-label="Move right">→</button>
      <button class="btn" onclick={() => gameState.rotate()} aria-label="Rotate">Rotate</button>
      <button class="btn" onclick={() => gameState.softDrop()} aria-label="Soft drop">↓</button>
      <button class="btn" onclick={() => gameState.hardDrop()} aria-label="Hard drop">Drop</button>
      <button class="btn" onclick={() => gameState.togglePause()} aria-label="Pause">Pause</button>
    </div>
  </main>

  <section class="about">
    <h2>About this project</h2>
    <p class="section-lede">
      The game is the reference implementation for the documentation in the repository: product brief,
      technical spec and test design all describe what you just played.
    </p>

    <div class="cards">
      {#each FEATURES as feature (feature.title)}
        <article class="card">
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </article>
      {/each}
    </div>

    <div class="run">
      <h3>Run it locally</h3>
      <pre><code>git clone {REPO_URL}.git
cd tetris-bmad
npm install
npm run dev</code></pre>
    </div>
  </section>

  <footer>
    <p>
      <a href={REPO_URL} target="_blank" rel="noreferrer noopener">github.com/aldidas/tetris-bmad</a>
    </p>
    <p class="docs">
      {#each DOCS as doc, index (doc.href)}
        {#if index > 0}<span aria-hidden="true">·</span>{/if}
        <a href={doc.href} target="_blank" rel="noreferrer noopener">{doc.label}</a>
      {/each}
    </p>
    <p class="meta">Built with Svelte 5 and Vite · Deployed on Cloudflare Pages</p>
  </footer>
</div>

<style>
  .page {
    width: 100%;
    max-width: 1160px;
    margin: 0 auto;
    padding: 56px 24px 48px;
  }

  /* ---------- Hero ---------- */

  .hero {
    max-width: 60ch;
    margin-bottom: 48px;
  }

  .eyebrow {
    margin: 0 0 12px;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  h1 {
    margin: 0 0 16px;
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .lede {
    margin: 0 0 28px;
    font-size: 1.0625rem;
    color: var(--text-dim);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  /* ---------- Buttons ---------- */

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 10px 18px;
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text);
    text-decoration: none;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
  }

  .btn:hover {
    background: #262e3a;
    border-color: #3b4657;
  }

  .btn.primary {
    color: var(--accent-ink);
    background: var(--accent);
    border-color: var(--accent);
  }

  .btn.primary:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  .btn.small {
    min-height: 36px;
    padding: 6px 12px;
    font-size: 0.875rem;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  /* ---------- Game ---------- */

  #play {
    scroll-margin-top: 24px;
  }

  .game {
    display: grid;
    grid-template-columns: 210px auto 210px;
    justify-content: center;
    align-items: start;
    gap: 24px;
  }

  .panel {
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .stat + .stat {
    margin-top: 18px;
  }

  .stat h3,
  .panel.controls h3 {
    margin: 0 0 6px;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .stat p {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 1.75rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
  }

  .panel-actions {
    display: grid;
    gap: 8px;
    margin-top: 22px;
  }

  .board-wrapper {
    position: relative;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 12px;
    padding: 24px;
    text-align: center;
    background: rgb(11 14 19 / 80%);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .overlay h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 650;
  }

  .overlay p {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--text-dim);
  }

  .overlay-hint {
    font-size: 0.875rem;
  }

  .panel.controls ul {
    display: grid;
    gap: 12px;
    margin: 16px 0 0;
    padding: 0;
    list-style: none;
  }

  .panel.controls li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .panel.controls li span {
    font-size: 0.9375rem;
  }

  kbd {
    padding: 3px 7px;
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--text);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-bottom-width: 2px;
    border-radius: 5px;
  }

  /* ---------- Touch controls ---------- */

  .touch-controls {
    display: none;
  }

  /* Coarse pointers and small screens have no keyboard, so they get a control pad. */
  @media (pointer: coarse), (max-width: 700px) {
    .touch-controls {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      width: 100%;
      max-width: 420px;
      margin: 20px auto 0;
    }

    .touch-controls .btn {
      min-height: 52px;
      font-size: 1rem;
      touch-action: manipulation;
      user-select: none;
    }
  }

  /* ---------- About ---------- */

  .about {
    margin-top: 72px;
  }

  .about h2 {
    margin: 0 0 12px;
    font-size: 1.5rem;
    font-weight: 650;
    letter-spacing: -0.01em;
  }

  .section-lede {
    max-width: 68ch;
    margin: 0 0 28px;
    font-size: 1.0625rem;
    color: var(--text-dim);
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .card {
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .card h3 {
    margin: 0 0 8px;
    font-size: 1rem;
    font-weight: 650;
  }

  .card p {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--text-dim);
  }

  .run {
    margin-top: 28px;
  }

  .run h3 {
    margin: 0 0 10px;
    font-size: 1rem;
    font-weight: 650;
  }

  pre {
    margin: 0;
    padding: 16px 18px;
    overflow-x: auto;
    background: #0b0e13;
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.7;
  }

  /* ---------- Footer ---------- */

  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 24px;
    margin-top: 64px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    font-size: 0.9375rem;
  }

  footer p {
    margin: 0;
    color: var(--text-dim);
  }

  .docs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  footer .meta {
    font-size: 0.875rem;
  }

  /* ---------- Narrow screens ---------- */

  @media (max-width: 980px) {
    .page {
      padding: 40px 16px;
    }

    .game {
      grid-template-columns: 1fr;
      justify-items: center;
    }

    .board-wrapper {
      order: 1;
    }

    .panel.stats {
      order: 2;
    }

    .panel.controls {
      order: 3;
    }

    .panel {
      width: 100%;
      max-width: 480px;
    }

    .panel.controls ul {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>