# Tetris Svelte 5 - Walkthrough

## Overview

This project successfully implemented a web-based Tetris game using **Svelte 5** and **Vite**. The application features a fully functional game loop, state management using Svelte Runes, and a polished UI with retro aesthetics.

## Features Implemented

### Core Gameplay

- **Tetrominoes**: All 7 standard shapes (I, J, L, O, S, T, Z) with distinct colors.
- **Movement**: Left, Right, Soft Drop, Hard Drop.
- **Rotation**: Basic rotation system with wall kicks.
- **Gravity**: Automatic piece falling with increasing speed.
- **Collision Detection**: Prevents pieces from moving through walls or other blocks.

### Game Logic

- **Line Clearing**: Full rows are detected, cleared, and blocks shift down.
- **Scoring**: Nintendo-style scoring system (40/100/300/1200 points).
- **Leveling**: Level increases every 10 lines, speeding up gravity.
- **Game Over**: Detects when the stack reaches the top.

### UI & Polish

- **Ghost Piece**: Visual guide showing where the piece will land.
- **Next Piece**: Preview of the upcoming tetromino.
- **Audio**: Sound effects for movement, rotation, clearing, and game over.
- **Screens**: Start Screen and Game Over Modal.
- **Stats**: Real-time display of Score, Level, and Lines.
- **Controls**: Keyboard controls (Arrows + Space) with Pause (P) and Mute (M).

## Technical Stack

- **Framework**: Svelte 5 (Runes: `$state`, `$derived`, `$effect`)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS (Grid, Flexbox)

## Verification Results

### Automated Tests

- _Unit tests were planned but manual verification was prioritized for MVP._

### Manual Verification

| Feature        | Status  | Notes                                                                         |
| :------------- | :------ | :---------------------------------------------------------------------------- |
| **Spawning**   | ✅ Pass | Random pieces spawn correctly at top center.                                  |
| **Movement**   | ✅ Pass | Left/Right moves work and stop at walls.                                      |
| **Rotation**   | ✅ Pass | Pieces rotate 90 degrees.                                                     |
| **Locking**    | ✅ Pass | Pieces lock when hitting bottom/stack.                                        |
| **Line Clear** | ✅ Pass | Rows vanish, score updates, blocks fall.                                      |
| **Game Over**  | ✅ Pass | Game ends when spawn is blocked.                                              |
| **Restart**    | ✅ Pass | Game resets fully on "Try Again".                                             |
| **Audio**      | ✅ Pass | Sounds play on actions (muted by default in some browsers until interaction). |

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Board.svelte       # Main game grid & active piece
│   │   └── PiecePreview.svelte # Next piece display
│   ├── game/
│   │   ├── AudioController.ts # Sound management
│   │   ├── GameEngine.ts      # Core logic (pure TS)
│   │   └── Tetrominoes.ts     # Shape definitions
│   └── stores/
│       └── gameState.svelte.ts # Svelte 5 state manager
├── App.svelte                 # Root component & UI layout
└── main.ts                    # Entry point
```

## Future Improvements

- **High Scores**: Persist scores to `localStorage`.
- **Hold Piece**: Ability to hold a piece for later.
- **Wall Kicks**: Implement full SRS (Super Rotation System).
- **Mobile Controls**: Touch support for mobile devices.
