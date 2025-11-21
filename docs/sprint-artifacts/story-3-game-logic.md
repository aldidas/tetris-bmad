# Story 3: Game Logic & Rules

**Status:** In Progress
**Epic:** Tetris MVP Implementation

## Description

**As a** Player
**I want to** clear lines and level up
**So that** the game has progression and challenge.

## Acceptance Criteria

- [ ] System detects full rows and clears them.
- [ ] Remaining blocks shift down correctly after line clear.
- [ ] Score updates based on lines cleared (100/300/1200/etc).
- [ ] Level increases every 10 lines.
- [ ] Gravity speed increases with Level.
- [ ] Game Over triggers when a new piece cannot spawn.
- [ ] Restart button resets the game state completely.

## Tasks

- [x] Implement Line Clearing logic in GameEngine
- [x] Implement Scoring system in gameState
- [x] Implement Leveling system in gameState
- [x] Implement Gravity Speed curve
- [x] Verify Game Over condition
- [x] Verify Restart functionality

## Dev Agent Record

### Debug Log

- Implemented checkLines in GameEngine.ts
- Updated gameState.svelte.ts to handle scoring and leveling
- Gravity speed curve already implemented in Story 2 ($derived)
- Game Over logic confirmed in spawn()

### Completion Notes

- Game logic complete.
- Lines clear, score updates, level increases.
- Game speeds up with level.
-
