import { test, expect } from '../support/fixtures';

/** One tetromino is always four cells; the first drop of a round never clears a row. */
const PIECE_CELLS = 4;

test.describe('Tetris', () => {
  test('loads the showcase page and starts a game', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Tetris/);
    await expect(page.getByRole('img', { name: 'Tetris board' })).toBeVisible();

    await page.getByRole('button', { name: 'Start game' }).click();

    await expect(page.getByRole('button', { name: 'Start game' })).toBeHidden();
    await expect(page.locator('.cell.active')).toHaveCount(PIECE_CELLS);
    await expect(page.locator('.cell.ghost')).toHaveCount(PIECE_CELLS);
  });

  test('pauses and resumes with the keyboard', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start game' }).click();

    await page.keyboard.press('p');
    await expect(page.getByRole('status').getByRole('heading', { name: 'Paused' })).toBeVisible();

    await page.keyboard.press('p');
    await expect(page.getByRole('status')).toBeHidden();
  });

  test('holds the piece while a paused key is repeated', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start game' }).click();

    await page.keyboard.press('p');
    // A held key emits keydown events with `repeat: true`; they must not toggle pause again.
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyP', repeat: true, bubbles: true }));
      }
    });

    await expect(page.getByRole('status').getByRole('heading', { name: 'Paused' })).toBeVisible();
  });

  test('locks a piece on hard drop and ignores repeated drop keys', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start game' }).click();

    await page.keyboard.press('Space');
    await expect(page.locator('.cell.locked')).toHaveCount(PIECE_CELLS);

    // Holding Space must not dump further pieces onto the board.
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', repeat: true, bubbles: true }));
      }
    });

    await expect(page.locator('.cell.locked')).toHaveCount(PIECE_CELLS);
  });
});