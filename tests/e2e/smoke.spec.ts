import { test, expect } from '../support/fixtures';

test.describe('Smoke Test', () => {
  test('should load the game', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/temp-tetris/i);
    
    // Wait for the app root div to be present
    await expect(page.locator('#app')).toBeVisible();
    
    // Note: The actual game starts on 'Enter' press, so initial load shows start screen
    // This test just verifies the page loads without errors
  });
});
