# Tetris — Svelte 5

A complete browser Tetris: a framework-free rules engine in TypeScript, Svelte 5 runes for state, synthesised Web Audio for sound, and Vite as the only build dependency.

- **Live demo (Cloudflare Pages)**: https://tetris-bmad.pages.dev
- **Repository**: https://github.com/aldidas/tetris-bmad

## Features

- All seven tetrominoes with rotation and wall kicks (offsets `0, ±1, ±2`).
- Gravity that speeds up every 10 lines, plus soft drop and hard drop.
- Ghost piece showing the landing position, and a next-piece preview.
- Line clearing, Nintendo-style scoring (40/100/300/1200 × level) and level progression.
- Game over detection when a piece cannot be spawned.
- Start, pause and game-over overlays; the game is playable without a keyboard on touch devices.
- Sound effects and the Korobeiniki theme generated entirely with the Web Audio API — no audio files.

## Getting started

```bash
npm install
npm run dev
```

| Script            | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                              |
| `npm run build`   | Production build into `dist/`                         |
| `npm run preview` | Serve the production build locally                    |
| `npm run check`   | `svelte-check` plus `tsc` for the TypeScript config   |
| `npm run test:e2e`| Playwright end-to-end suite (starts its own dev server) |
| `npm run deploy`  | Build and publish `dist/` to Cloudflare Pages         |

## Controls

| Action    | Keyboard       |
| --------- | -------------- |
| Move      | `←` `→`        |
| Rotate    | `↑`            |
| Soft drop | `↓`            |
| Hard drop | `Space`        |
| Pause     | `P`            |
| Mute      | `M`            |
| Start     | `Enter`        |

Movement and soft drop repeat while held; rotation, hard drop, pause and mute ignore OS key repeat, so holding a key cannot dump pieces or flicker the pause state. On touch devices (or viewports narrower than 700px) an on-screen control pad appears below the board.

## Architecture

```
src/
├── lib/
│   ├── components/
│   │   ├── Board.svelte         # Composes stack + ghost + live piece into one grid
│   │   └── PiecePreview.svelte  # Next-piece preview
│   ├── game/
│   │   ├── GameEngine.ts        # Pure rules: collision, rotation, locking, clears
│   │   ├── Tetrominoes.ts       # Shapes, colours, and the type ↔ grid-value mapping
│   │   └── AudioController.ts   # Web Audio effects and music lifecycle
│   └── stores/
│       └── gameState.svelte.ts  # Runes mirrors of the engine + game loop
├── App.svelte                   # Showcase shell, game UI, input handling
└── main.ts
```

`GameEngine` has no dependency on Svelte, the DOM, timers or audio. `gameState` owns the single `requestAnimationFrame` chain, mirrors the engine into `$state` after every mutation, and applies scoring. The board is rendered by composing the locked stack, the ghost and the live piece into one flat grid, so cell size is purely a CSS concern.

Tetromino type ↔ grid value ↔ colour is defined once in `Tetrominoes.ts` (`typeValue`, `cellColor`, `typeColor`), so the engine and the renderers cannot disagree.

## Testing

```bash
npx playwright install   # first run only
npm run test:e2e
```

The suite covers starting a game, pause/resume, held-key repeat suppression, and hard-drop locking.

```bash
npx playwright test --project=chromium
```

## Deployment

The site is a static Vite build published to Cloudflare Pages. `wrangler.jsonc` pins the project name and the build output directory, and `public/_headers` adds security headers plus long-lived caching for fingerprinted assets.

```bash
npm run deploy
```

The project (`tetris-bmad`) was created once with `npx wrangler pages project create tetris-bmad --production-branch main --force`; publisher deployments at https://tetris-bmad.pages.dev come from the `main` branch.

## Documentation

- [Product brief](docs/prd.md)
- [Technical spec](docs/tech-spec.md)
- [Test design](docs/test-design-epic-1.md)
- [Epics](docs/epics.md)
- [Walkthrough](walkthrough.md)

## Known limitations

- No hold piece and no high-score persistence.
- Wall kicks are the simple bounded offsets above, not the full SRS table.
- The board grid is decorative for assistive technology; score, level and lines are exposed as text.