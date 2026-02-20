import { test as base, type Page } from '@playwright/test';

export { expect } from '@playwright/test';

interface TestFixtures {
  authenticatedPage: Page;
}

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'admin@financeai.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');
    
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForLoadState('networkidle');
    
    await use(page);
  },
});

export default test;
