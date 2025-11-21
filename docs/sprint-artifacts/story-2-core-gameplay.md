# Story 2: Core Gameplay Mechanics

**Status:** In Progress
**Epic:** Tetris MVP Implementation

## Description

**As a** Player
**I want to** move and rotate pieces on the board
**So that** I can play the game.

## Acceptance Criteria

- [ ] `Tetrominoes.ts` defines all 7 shapes and their rotation states.
- [ ] System can spawn a random active piece at the top.
- [ ] Player can move piece Left/Right (with wall collision checks).
- [ ] Player can Rotate piece (with basic wall kicks/boundary checks).
- [ ] Player can Soft Drop (accelerate) and Hard Drop (instant lock).
- [ ] Gravity loop implemented (`requestAnimationFrame`) to move piece down automatically.
- [ ] Collision detection prevents pieces from moving through walls or locked blocks.

## Tasks

- [x] Implement Tetromino definitions (shapes, colors)
- [x] Implement Spawn logic in GameEngine
- [x] Implement Movement (Left/Right) with collision
- [x] Implement Rotation logic
- [x] Implement Drop (Soft/Hard)
- [x] Implement Gravity Loop
- [x] Bind Keyboard Controls

## Dev Agent Record

### Debug Log

- Implemented Tetrominoes.ts
- Implemented GameEngine core logic (spawn, move, rotate, collision)
- Updated gameState with loop and controls
- Updated Board to render active piece
- Bound keyboard events in App.svelte

### Completion Notes

- Core gameplay mechanics implemented.
- Pieces spawn, move, rotate, and lock.
- Gravity loop works.
-
