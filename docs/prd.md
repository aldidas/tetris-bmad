# Tetris Svelte - Product Requirements Document

**Author:** BMad
**Date:** 2025-11-21
**Version:** 1.0

---

## Executive Summary

A simple, clean, and faithful web-based recreation of Tetris using Svelte, focusing on smooth gameplay mechanics and progression.

### What Makes This Special

A lightweight, responsive Svelte implementation that captures the classic feel with modern code quality, featuring a clear 10-level progression system.

---

## Project Classification

**Technical Type:** Web App (Svelte)
**Domain:** General
**Complexity:** Low

---

## Success Criteria

- Smooth 60fps rendering of falling blocks.
- Accurate collision detection and line clearing.
- Distinct speed differences across 10 levels.
- Responsive controls (keyboard).
- Audio feedback for key actions (rotate, drop, clear, game over).

---

## Product Scope

### MVP - Minimum Viable Product

- **Core Gameplay**: Standard 7 tetrominoes, grid system (10x20), rotation (SRS or simple), movement, hard drop.
- **Progression**: 10 Levels of increasing gravity speed. Level up based on lines cleared.
- **Scoring**: Standard scoring system (100/300/1200/etc per line count).
- **Audio**: Sound effects for rotation, movement, locking, line clear, game over.
- **UI**: Start Screen, Game Board, Next Piece Preview, Score/Level/Lines display, Game Over modal with Restart.

### Growth Features (Post-MVP)

- High Score persistence (LocalStorage).
- Mobile touch controls.
- Pause functionality.
- Ghost piece (visual guide).

### Vision (Future)

- Multiplayer battle mode.
- Global leaderboards.
- Custom themes/skins.

---

## Web App Specific Requirements

### Browser Support

- **Primary**: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest).
- **Constraint**: Must work without polyfills on modern browsers.

### Responsive Design

- **Desktop First**: Optimized for keyboard play on desktop.
- **Layout**: Centered game board, responsive container that fits within viewport height.
- **Mobile**: Basic rendering support (playable via touch controls in Post-MVP).

### Performance Targets

- **Frame Rate**: Consistent 60fps for game loop.
- **Input Latency**: < 16ms (immediate response).
- **Load Time**: < 1s (minimal assets).

### SEO Strategy

- **Meta Tags**: Proper title, description, and viewport settings.
- **Social**: Open Graph tags for sharing.

### Accessibility

- **Contrast**: High contrast between blocks and background.
- **Keyboard**: Full keyboard navigability for game controls and UI.
- **Reduced Motion**: Respect `prefers-reduced-motion` for non-gameplay animations.

---

## User Experience Principles

- **Focus**: The game board is the hero. Minimal distractions.
- **Feedback**: Instant visual and auditory feedback for every action.
- **Clarity**: Distinct colors for each tetromino type (standard guideline colors).

### Key Interactions

- **Start**: One click/key to begin.
- **Play**: Arrow keys for movement/rotation. Space for hard drop.
- **Fail**: Clear "Game Over" state with instant "Try Again" option.

---

## Functional Requirements

### Game Mechanics

- FR1: System generates random sequence of 7 standard tetrominoes (I, J, L, O, S, T, Z).
- FR2: Player can move active piece Left/Right within grid boundaries.
- FR3: Player can Rotate active piece 90 degrees clockwise.
- FR4: Player can Soft Drop (accelerate descent) and Hard Drop (instant lock).
- FR5: System detects collision with walls, floor, and locked blocks.
- FR6: System locks piece when it cannot move down further.
- FR7: System clears filled rows and shifts blocks down.
- FR8: System triggers Game Over when a new piece cannot spawn.

### Progression & Scoring

- FR9: System tracks Score, Level, and Lines Cleared.
- FR10: System increases Level every 10 lines cleared (up to Level 10).
- FR11: System increases gravity speed (tick rate) with each Level.
- FR12: System awards points based on lines cleared at once (1, 2, 3, 4) and current level.

### Audio

- FR13: System plays sound effects for: Rotate, Move, Lock, Line Clear (varied by count), Game Over.
- FR14: Player can toggle Mute on/off.

### UI/UX

- FR15: User sees Start Screen with title and controls instructions.
- FR16: User sees Game Board (10x20 grid) with active and locked blocks.
- FR17: User sees "Next Piece" preview.
- FR18: User sees real-time Score, Level, and Lines count.
- FR19: User sees Game Over modal with final score and Restart button.

---

## Non-Functional Requirements

### Performance

- NFR1: Game loop must run at consistent speed independent of frame rate.
- NFR2: No perceptible input lag.

### Reliability

- NFR3: Game state must not corrupt during rapid inputs.

---

_This PRD captures the essence of Tetris Svelte - A pure, responsive, and polished Tetris experience._

_Created through collaborative discovery between BMad and AI facilitator._
