# Epics & Stories

**Project:** Tetris Svelte 5
**Author:** BMad
**Date:** 2025-11-21

---

## Epic: Tetris MVP Implementation

**Status:** Planned
**Description:** Implement a fully functional, web-based Tetris clone using Svelte 5 and Vite. This epic covers the end-to-end development from project setup to a polished, playable game with audio and progression.

### User Stories

#### Story 1: Setup & Foundation

**As a** Developer
**I want to** initialize the project structure and core game engine shell
**So that** we have a solid foundation for building game mechanics.

**Acceptance Criteria:**

- [ ] Vite + Svelte 5 (TypeScript) project initialized and running.
- [ ] Project structure created (`src/lib/game`, `src/lib/stores`, `src/lib/components`).
- [ ] `GameEngine` class created (empty shell with `grid` initialization).
- [ ] `gameState.svelte.ts` created with basic `$state` for grid.
- [ ] `Board.svelte` renders a 10x20 grid based on the state.
- [ ] Basic styling applied (dark background, grid lines).

**Technical Notes:**

- Use `npm create vite@latest` with Svelte/TS.
- Ensure `svelte.config.js` / `vite.config.ts` are set for Svelte 5.
- Grid should be a 1D array of 200 integers or 2D array `[20][10]`.

---

#### Story 2: Core Gameplay Mechanics

**As a** Player
**I want to** move and rotate pieces on the board
**So that** I can play the game.

**Acceptance Criteria:**

- [ ] `Tetrominoes.ts` defines all 7 shapes and their rotation states (SRS or simple).
- [ ] System can spawn a random active piece at the top.
- [ ] Player can move piece Left/Right (with wall collision checks).
- [ ] Player can Rotate piece (with basic wall kicks/boundary checks).
- [ ] Player can Soft Drop (accelerate) and Hard Drop (instant lock).
- [ ] Gravity loop implemented (`requestAnimationFrame`) to move piece down automatically.
- [ ] Collision detection prevents pieces from moving through walls or locked blocks.

**Technical Notes:**

- Implement `move(dx, dy)` method in `GameEngine`.
- Implement `rotate()` method.
- Use `requestAnimationFrame` for the game loop.

---

#### Story 3: Game Logic & Rules

**As a** Player
**I want to** clear lines and level up
**So that** the game has progression and challenge.

**Acceptance Criteria:**

- [ ] System detects full rows and clears them.
- [ ] Remaining blocks shift down correctly after line clear.
- [ ] Score updates based on lines cleared (100/300/1200/etc).
- [ ] Level increases every 10 lines.
- [ ] Gravity speed increases with Level.
- [ ] Game Over triggers when a new piece cannot spawn.
- [ ] Restart button resets the game state completely.

**Technical Notes:**

- Implement `checkLines()` after every piece lock.
- Use the formula for gravity speed from Tech Spec.
- Update `gameState` with Score, Level, Lines.

---

#### Story 4: UI & Polish

**As a** Player
**I want to** see my score and hear sound effects
**So that** the experience feels complete and engaging.

**Acceptance Criteria:**

- [ ] Start Screen with "Press Enter to Start".
- [ ] Game Over Modal with Final Score and "Try Again".
- [ ] "Next Piece" preview displayed.
- [ ] Audio effects played for: Rotate, Move, Drop, Clear, Game Over.
- [ ] Mute toggle implemented.
- [ ] Final CSS styling (neon/retro look).
- [ ] Ghost piece (optional visual guide) implemented.

**Technical Notes:**

- Create `AudioController` to manage `Audio` instances.
- Use CSS Modules or Tailwind (if added) for styling.
- Persist High Score to `localStorage`.

---
