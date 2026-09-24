# Tetris Test Suite

This directory contains the E2E test suite for the Tetris Svelte 5 application using Playwright.

---

## Setup Instructions

### Prerequisites

- Node.js 20.14.0 (use `nvm install` to install from `.nvmrc`)
- npm 10.7.0+

### Installation

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Install Playwright browsers** (first time only):

   ```bash
   npx playwright install
   ```

3. **Copy environment configuration**:
   ```bash
   cp .env.example .env
   ```

---

## Running Tests

### Local Execution

**Run all tests (headless)**:

```bash
npm run test:e2e
```

**Run tests in headed mode** (see browser):

```bash
npx playwright test --headed
```

**Run tests in UI mode** (interactive):

```bash
npx playwright test --ui
```

**Run specific test file**:

```bash
npx playwright test tests/e2e/smoke.spec.ts
```

**Run tests in a specific browser**:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug Mode

**Debug with Playwright Inspector**:

```bash
npx playwright test --debug
```

**View test report** (after running tests):

```bash
npx playwright show-report test-results/html
```

**View traces** (after a test failure):

```bash
npx playwright show-trace test-results/.../trace.zip
```

---

## Architecture Overview

### Directory Structure

```
tests/
├── e2e/                      # E2E test files
│   └── smoke.spec.ts         # Smoke test example
├── support/                  # Test infrastructure
│   ├── fixtures/             # Custom Playwright fixtures
│   │   └── index.ts          # Base fixture export
│   └── helpers/              # Utility functions
└── README.md                 # This file
```

### Fixture Pattern

Tests use Playwright's fixture pattern for setup/teardown. The base fixture is defined in `tests/support/fixtures/index.ts`:

```typescript
import { test, expect } from "../support/fixtures";

test("example", async ({ page }) => {
  await page.goto("/");
  // Test logic here
});
```

### Test Organization

- **E2E tests**: Full user journeys (game flow, controls, scoring)
- **Component tests**: (Future) Individual Svelte component testing with Vitest
- **Unit tests**: (Future) GameEngine, collision detection, line clearing

---

## Best Practices

### Selector Strategy

**Recommended**: Use semantic selectors or `data-testid` attributes.

```typescript
// Good
await page.locator('[data-testid="game-board"]').click();
await page.locator('button[aria-label="Start Game"]').click();

// Avoid
await page.locator(".grid-row > div:nth-child(3)").click(); // Brittle
```

### Test Isolation

Each test should be independent. Avoid relying on state from previous tests.

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Reset game state if needed
});
```

### Assertions

Use explicit assertions with meaningful messages:

```typescript
await expect(page.locator('[data-testid="score"]')).toHaveText("100");
```

### Performance

- Keep tests fast (<10s per test)
- Use `page.waitForSelector()` instead of `page.waitForTimeout()`
- Avoid unnecessary navigation

---

## CI Integration

Tests run automatically in CI/CD with the following configuration:

- **Retries**: 2 retries on failure (CI only)
- **Workers**: 1 worker in CI (sequential execution)
- **Artifacts**: Screenshots, videos, and traces retained on failure only
- **Reporters**: HTML report + JUnit XML for CI systems

---

## Test Levels

Based on the [Test Levels Framework](../.bmad/bmm/testarch/knowledge/test-levels-framework.md):

| Level           | Purpose                | Examples                           | Speed  |
| --------------- | ---------------------- | ---------------------------------- | ------ |
| **E2E**         | Critical user journeys | Game loop, scoring, game over      | Slow   |
| **Integration** | Component interactions | GameEngine + gameState             | Medium |
| **Unit**        | Pure logic             | Collision detection, line clearing | Fast   |

**Current focus**: E2E tests for critical game flow.

---

## Knowledge Base References

- **Fixture Architecture**: `.bmad/bmm/testarch/knowledge/fixture-architecture.md`
- **Test Quality**: `.bmad/bmm/testarch/knowledge/test-quality.md`
- **Playwright Config**: `.bmad/bmm/testarch/knowledge/playwright-config.md`
- **Test Levels Framework**: `.bmad/bmm/testarch/knowledge/test-levels-framework.md`

---

## Troubleshooting

### Issue: Playwright browsers not installed

**Solution**:

```bash
npx playwright install
```

### Issue: Tests fail with "baseURL is not defined"

**Solution**: Ensure `.env` file exists with `BASE_URL=http://localhost:5173`.

### Issue: Dev server not running

**Solution**: The suite is self-contained — `playwright.config.ts` starts `vite` on port 5173 before the
first test (`reuseExistingServer` reuses a server you already have running outside CI).

### Issue: Tests time out

**Solution**: Increase timeouts in `playwright.config.ts` or check if selectors are correct.

---

## Next Steps

1. **Run Test Design workflow**: `*test-design` to plan comprehensive test coverage
2. **Add Unit Tests**: Set up Vitest for `GameEngine.ts` logic
3. **Implement P0 Tests**: Based on `docs/test-design-epic-1.md`

---

**Last Updated**: 2025-11-21  
**Framework**: Playwright v1.56.1  
**Node.js**: v20.14.0
