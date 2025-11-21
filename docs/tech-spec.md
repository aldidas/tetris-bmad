# Tetris Svelte 5 - Technical Specification

**Author:** BMad
**Date:** 2025-11-21
**Project Level:** Greenfield
**Change Type:** New Feature (Full App)
**Development Context:** Vite + Svelte 5 (Runes)

---

## Context

### Available Documents

- **PRD**: `docs/prd.md` (Complete)
- **Project Type**: Greenfield Web App
- **Tech Stack**: Vite, Svelte 5, TypeScript

### Project Stack

- **Framework**: Svelte 5 (Runes syntax)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS Modules or Scoped CSS (Svelte default)
- **State Management**: Svelte 5 Runes (`$state`, `$derived`)
- **Testing**: Vitest + Testing Library

### Existing Codebase Structure

_Greenfield project - new codebase._

---

## The Change

### Problem Statement

We need to build a faithful, performant, and clean recreation of Tetris to serve as a "simple" yet polished web application. It must demonstrate modern Svelte 5 capabilities (runes) while delivering a 60fps smooth gaming experience.

### Proposed Solution

Implement a single-page application using Svelte 5.

- **Game Loop**: `requestAnimationFrame` driven loop for smooth rendering.
- **State**: Use `$state` for the board grid, active piece, and game status.
- **Rendering**: HTML/CSS grid for the board (sufficient for Tetris complexity, easier to style than Canvas).
- **Audio**: Simple `Audio` API wrapper.

### Scope

**In Scope:**

- Full game loop (Start, Pause, Game Over).
- Core mechanics (Move, Rotate, Drop, Collision, Line Clear).
- Progression system (Levels 1-10, Speed increase).
- Audio effects.
- UI (Score, Next Piece, Controls).

**Out of Scope:**

- Multiplayer.
- Backend/Database (High scores will be local only).
- Mobile touch controls (Post-MVP).

---

## Implementation Details

### Source Tree Changes

#### [NEW] Project Structure

- `src/main.ts` - Entry point
- `src/App.svelte` - Root component
- `src/lib/game/GameEngine.ts` - Core game logic class (Pure TS)
- `src/lib/game/Tetrominoes.ts` - Piece definitions and rotation logic
- `src/lib/game/AudioController.ts` - Sound manager
- `src/lib/components/Board.svelte` - Grid renderer
- `src/lib/components/PiecePreview.svelte` - Next piece display
- `src/lib/components/ScoreBoard.svelte` - Stats display
- `src/lib/components/Controls.svelte` - Mobile controls (placeholder/structure)
- `src/lib/stores/gameState.svelte.ts` - Global reactive state (Svelte 5 rune file)

### Technical Approach

1.  **Game Engine (`GameEngine.ts`)**:

    - Decoupled from UI.
    - Manages the 2D grid array (`number[][]` or `string[][]`).
    - Handles collision detection.
    - Exposes methods: `moveLeft()`, `moveRight()`, `rotate()`, `softDrop()`, `hardDrop()`.
    - Emits events or updates a reactive state object.

2.  **State Management (`gameState.svelte.ts`)**:

    - Use a `.svelte.ts` file to export a global state object created with `$state`.
    - Properties: `grid`, `activePiece`, `score`, `level`, `lines`, `isGameOver`, `isPaused`.
    - Use `$derived` for computed values (e.g., `dropInterval` based on `level`).

3.  **Rendering**:

    - `Board.svelte` iterates over the `grid` state.
    - Use CSS Grid for the 10x20 layout.
    - Cells are simple `div`s with classes corresponding to tetromino types (e.g., `.cell.T`, `.cell.I`).

4.  **Loop**:
    - `requestAnimationFrame` handles the gravity timer.
    - `lastTime` vs `currentTime` delta check to trigger "tick" (downward movement).

### Existing Patterns to Follow

_Greenfield - Standard Svelte 5 patterns._

- Use `$state` instead of `writable` stores.
- Use `$effect` for side effects (audio triggers).
- Use `$props` for component props.

### Integration Points

- **Browser Audio API**: For sound effects.
- **LocalStorage**: For persisting high scores.
- **Keyboard Events**: Global event listener for controls.

---

## Development Context

### Dependencies

**Framework/Libraries:**

- `svelte@next` (Svelte 5)
- `vite`
- `typescript`
- `vitest` (for unit logic testing)

**Internal Modules:**

- `GameEngine`: The brain.
- `GameState`: The heart (data).

### Configuration Changes

- `vite.config.ts`: Standard Svelte setup.
- `tsconfig.json`: Ensure strict mode.

### Existing Conventions (Brownfield)

_N/A - Greenfield_

### Test Framework & Standards

- **Vitest**: Fast unit testing for `GameEngine` logic (collision, rotation, line clearing).
- **Testing Library**: Component testing if needed (mostly logic focus).

---

## Implementation Stack

- **Runtime**: Node.js (Dev), Browser (Prod)
- **Framework**: Svelte 5
- **Language**: TypeScript
- **Build**: Vite

---

## Technical Details

- **Grid Representation**: 1D array of length 200 (10x20) or 2D array `[20][10]`. 2D is easier to reason about for line clearing.
- **Rotation System**: Super Rotation System (SRS) is complex. MVP will use simple center-point rotation with basic wall kicks (if it hits wall, try moving 1 space away).
- **Gravity**: Formula: `(0.8 - ((Level - 1) * 0.007))^(Level - 1)` seconds per row (approximate standard). Or simplified: `1000ms - (Level * 100ms)`.
- **Input Handling**:
  - `ArrowLeft`/`ArrowRight`: Move
  - `ArrowUp`: Rotate
  - `ArrowDown`: Soft Drop
  - `Space`: Hard Drop

---

## Development Setup

```bash
npm create vite@latest tetris-svelte -- --template svelte-ts
cd tetris-svelte
npm install
npm install svelte@next # Upgrade to Svelte 5 preview if not default
npm run dev
```

---

## Implementation Guide

### Setup Steps

1.  Initialize Vite project with Svelte/TS.
2.  Configure Svelte 5 (check `package.json` version).
3.  Set up `src/lib` structure.
4.  Add assets (sound files, favicon).

### Implementation Steps

**Phase 1: Foundation**

1.  Create `GameEngine` class with empty grid.
2.  Implement `gameState.svelte.ts` with basic runes.
3.  Create `Board.svelte` to render the empty grid.

**Phase 2: Core Mechanics**

1.  Implement `Tetrominoes.ts` (shapes and colors).
2.  Implement `spawnPiece()` and `render()` logic.
3.  Implement `move()` and `rotate()` with boundary checks.
4.  Implement Gravity Loop (`requestAnimationFrame`).

**Phase 3: Game Logic**

1.  Implement Collision Detection (walls, floor, pile).
2.  Implement Locking and Line Clearing.
3.  Implement Scoring and Leveling up.

**Phase 4: Polish**

1.  Add `AudioController`.
2.  Add Start/Game Over screens.
3.  Style with CSS (retro or modern look).

### Testing Strategy

- **Unit Tests**: Heavily test `GameEngine.ts`.
  - `test('clears lines correctly')`
  - `test('detects collision')`
  - `test('rotates without clipping')`
- **Manual**: Play testing for "feel" (input lag, speed).

### Acceptance Criteria

1.  Game runs at 60fps without stutter.
2.  All 7 pieces spawn randomly.
3.  Lines clear correctly and score updates.
4.  Game speeds up at each level.
5.  Game Over triggers correctly when grid is full.
6.  Restart resets everything cleanly.

---

## Developer Resources

### File Paths Reference

- `src/lib/game/GameEngine.ts`
- `src/lib/stores/gameState.svelte.ts`
- `src/lib/components/Board.svelte`

### Key Code Locations

- `GameEngine.update()`: Main tick function.
- `gameState.grid`: The source of truth for rendering.

### Documentation to Update

- `README.md`: Instructions to run and play.

---

## UX/UI Considerations

- **Visuals**: Dark background (`#1a1a1a`), bright neon blocks.
- **Feedback**:
  - Flash effect on line clear.
  - Ghost piece to show where block will land.
- **Controls**: Prevent default scrolling when using arrow keys.

---

## Testing Approach

- **Vitest**: `npm test`
- **Coverage**: Focus on `GameEngine` logic (80%+). UI testing is secondary.

---

## Deployment Strategy

### Deployment Steps

1.  Build: `npm run build`
2.  Deploy `dist/` folder to Vercel/Netlify/GitHub Pages.

### Monitoring

- Console logs for errors in dev.
- Analytics (optional) for game starts/completions.
