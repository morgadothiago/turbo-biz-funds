import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('text=Bem-vindo de volta')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should login successfully with admin credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@financeai.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Administrador')).toBeVisible();
  });

  test('should login successfully with user credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'usuario@financeai.com');
    await page.fill('input[type="password"]', 'user123');
    await page.click('button:has-text("Entrar")');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=João Silva')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Entrar")');

    await expect(page.locator('text=Email ou senha inválidos')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.click('button:has-text("Entrar")');

    await expect(page.locator('text=obrigatório')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.click('a:has-text("Crie sua conta")');

    await expect(page).toHaveURL(/\/cadastro/);
    await expect(page.locator('text=Crie sua conta')).toBeVisible();
  });

  test('should have Google login button', async ({ page }) => {
    await expect(page.locator('button:has-text("Google")')).toBeVisible();
  });

  test('should remember email on failed login attempt', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Entrar")');

    await expect(page.locator('input[type="email"]')).toHaveValue('test@email.com');
  });
});

test.describe('Login Navigation', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to dashboard when already logged in', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'admin@financeai.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
