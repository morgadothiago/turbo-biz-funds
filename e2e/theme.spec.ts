import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have theme toggle button', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle dark mode when clicked', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });

    // Initial state (light or system)
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Click to enable dark mode
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Click again to disable dark mode
    await themeToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });

    // Enable dark mode
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reload page
    await page.reload();

    // Theme should persist
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('Landing Page Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with animations', async ({ page }) => {
    await expect(page.getByText(/organize pelo whatsapp/i)).toBeVisible();
    await expect(page.getByText(/chega de planilhas/i)).toBeVisible();
  });

  test('should have call-to-action buttons', async ({ page }) => {
    const comeceAgoraButton = page.getByRole('link', { name: /comece agora/i });
    await expect(comeceAgoraButton).toBeVisible();
    await expect(comeceAgoraButton).toHaveAttribute('href', '/cadastro');

    const verComoFuncionaButton = page.getByRole('button', { name: /ver como funciona/i });
    await expect(verComoFuncionaButton).toBeVisible();
  });

  test('should navigate to signup from hero CTA', async ({ page }) => {
    await page.getByRole('link', { name: /comece agora/i }).click();
    await expect(page).toHaveURL(/.*cadastro/);
  });

  test('should display pricing section', async ({ page }) => {
    await page.getByRole('link', { name: /preços/i }).click();
    await expect(page).toHaveURL(/.*#planos/);
    await expect(page.getByText(/r\$ 9,90/i)).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.getByRole('link', { name: /dúvidas/i }).click();
    await expect(page).toHaveURL(/.*#faq/);
  });

  test('should display testimonials', async ({ page }) => {
    await expect(page.getByText(/depoimentos/i)).toBeVisible();
    await expect(page.getByText(/avaliação/i)).toBeVisible();
  });

  test('should have mobile responsive menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile menu button should be visible
    const menuButton = page.getByRole('button', { name: /toggle menu/i });
    await expect(menuButton).toBeVisible();

    // Click menu button
    await menuButton.click();

    // Navigation links should be visible
    await expect(page.getByText(/como funciona/i)).toBeVisible();
    await expect(page.getByText(/depoimentos/i)).toBeVisible();
    await expect(page.getByText(/preços/i)).toBeVisible();
  });
});

test.describe('Theme Toggle on Different Pages', () => {
  test('should work on login page', async ({ page }) => {
    await page.goto('/login');
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should work on signup page', async ({ page }) => {
    await page.goto('/cadastro');
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(5);
  });

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/');

    const buttons = page.getByRole('button');
    await expect(buttons.first()).toHaveAttribute('aria-label', /toggle theme/i);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to focus on theme toggle
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A']).toContain(focusedElement);
  });
});
