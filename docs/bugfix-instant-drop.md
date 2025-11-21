# Bug Fix: Instant Drop Issue

**Date**: 2025-11-21  
**Severity**: Critical (Game Breaking)  
**Status**: ✅ Fixed

---

## Issue Description

After starting the game, all Tetris pieces were dropping instantly to the bottom of the board, making the game unplayable.

## Root Cause

In `src/lib/stores/gameState.svelte.ts`, the `dropCounter` variable was accumulating time but was never reset after triggering a drop. This caused the following loop:

1. `dropCounter` accumulates deltaTime each frame
2. When `dropCounter > dropInterval`, a drop is triggered
3. **Bug**: `dropCounter` was never reset to 0
4. On the next frame, `dropCounter` is still > `dropInterval`
5. Another drop is triggered immediately
6. Loop continues, causing pieces to drop every single frame

## Fix

Added `dropCounter = 0;` after the drop is triggered in the game loop:

```typescript
function loop(time: number = 0) {
  if (isPaused || isGameOver) return;

  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    drop();
    dropCounter = 0; // ← FIX: Reset counter after drop
  }

  loopId = requestAnimationFrame(loop);
}
```

## Verification

✅ Tested in browser - pieces now drop at correct intervals  
✅ Level progression works - speed increases appropriately  
✅ Game is playable

## Prevention

This type of bug could have been caught with:

- **Unit test** for the game loop timing logic
- **E2E test** verifying piece drop speed
- **Code review** checking accumulator patterns

---

**Related Files**:

- `src/lib/stores/gameState.svelte.ts` (line 31)

**Video Recording**:
![Game working correctly](file:///Users/aldidas/.gemini/antigravity/brain/8c48a46c-90ec-4545-bcd9-9970d66c55ba/verify_game_fix_1763723423366.webp)
