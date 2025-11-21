import { test as base } from '@playwright/test';

// Extend base test with custom fixtures if needed in the future
// For now, we just export the base test and expect
export const test = base.extend({});

export { expect } from '@playwright/test';
