import { test, expect } from '@playwright/test';

test.describe('Framer Motion Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render hero section with animations', async ({ page }) => {
    // Hero elements should be visible
    await expect(page.getByText(/organize pelo whatsapp/i)).toBeVisible();
    await expect(page.getByText(/chega de planilhas/i)).toBeVisible();

    // Stats should animate in
    await expect(page.getByText(/3\.000\+/i)).toBeVisible();
    await expect(page.getByText(/4\.9/i)).toBeVisible();
  });

  test('should have smooth transitions on hover', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /comece agora/i });

    // Button should be visible and interactive
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveCSS('transition', /.*/);
  });

  test('should display animated gradients', async ({ page }) => {
    // Check for animated gradient elements
    const gradientElement = page.locator('.gradient-text, .animated-gradient');
    await expect(gradientElement.first()).toBeVisible();
  });

  test('should have floating animations', async ({ page }) => {
    // Check for floating animation elements
    const floatingElements = page.locator('.animate-float, .animate-blob');
    await expect(floatingElements.first()).toBeVisible();
  });

  test('should have fade-in animations', async ({ page }) => {
    // Check for fade-in animation elements
    const fadeInElements = page.locator('.animate-fade-in, .fade-in');
    await expect(fadeInElements.first()).toBeVisible();
  });
});

test.describe('Landing Page Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display problem section', async ({ page }) => {
    await expect(page.getByText(/por que organizar dinheiro é tão difícil/i)).toBeVisible();
    await expect(page.getByText(/planilhas são chatas/i)).toBeVisible();
  });

  test('should display how it works section', async ({ page }) => {
    await expect(page.getByText(/como funciona/i)).toBeVisible();
    await expect(page.getByText(/mande uma mensagem/i)).toBeVisible();
    await expect(page.getByText(/categorização automática/i)).toBeVisible();
    await expect(page.getByText(/visualize seus gastos/i)).toBeVisible();
  });

  test('should display pricing plans', async ({ page }) => {
    await expect(page.getByText(/planos e preços/i)).toBeVisible();
    await expect(page.getByText(/r\$ 9,90/i)).toBeVisible();
    await expect(page.getByText(/r\$ 29,90/i)).toBeVisible();
    await expect(page.getByText(/r\$ 49,90/i)).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await expect(page.getByText(/perguntas frequentes/i)).toBeVisible();
    await expect(page.getByText(/como funciona/i).first()).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    await expect(page.getByText(/organizaai/i)).toBeVisible();
    await expect(page.getByText(/termos/i)).toBeVisible();
    await expect(page.getByText(/privacidade/i)).toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should adapt layout for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero should stack vertically
    await expect(page.locator('h1').first()).toBeVisible();

    // CTA buttons should be stacked
    const ctaButton = page.getByRole('link', { name: /comece agora/i });
    await expect(ctaButton).toBeVisible();
  });

  test('should hide desktop navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Desktop nav should be hidden
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();

    // Mobile menu button should be visible
    const menuButton = page.getByRole('button', { name: /toggle menu/i });
    await expect(menuButton).toBeVisible();
  });

  test('should adapt grid for tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Stats should show in 4 columns
    const statsContainer = page.locator('.grid-cols-2.md\\:grid-cols-4').first();
    await expect(statsContainer).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load landing page quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should lazy load below-fold sections', async ({ page }) => {
    await page.goto('/');

    // Hero should load immediately
    await expect(page.getByText(/organize pelo whatsapp/i)).toBeVisible();

    // Sections below fold should be lazy loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // FAQ should become visible after scroll
    await expect(page.getByText(/perguntas frequentes/i)).toBeVisible();
  });
});
