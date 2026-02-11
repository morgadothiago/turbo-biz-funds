import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastro');
    await page.waitForLoadState('networkidle');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.locator('text=Crie sua conta')).toBeVisible();
    await expect(page.locator('input[id="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors for invalid name', async ({ page }) => {
    await page.fill('input[id="name"]', 'J');
    await page.click('button:has-text("Continuar")');

    await expect(page.locator('text=mínimo 2 caracteres')).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.fill('input[id="name"]', 'João Silva');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'Teste123');
    await page.fill('input[id="confirmPassword"]', 'Teste123');
    await page.click('button:has-text("Continuar")');

    await expect(page.locator('text=email válido')).toBeVisible();
  });

  test('should show validation errors for weak password', async ({ page }) => {
    await page.fill('input[id="name"]', 'João Silva');
    await page.fill('input[type="email"]', 'joao@email.com');
    await page.fill('input[type="password"]', '123');
    await page.click('button:has-text("Continuar")');

    await expect(page.locator('text=mínimo 8 caracteres')).toBeVisible();
  });

  test('should show password requirements', async ({ page }) => {
    await expect(page.locator('text=mínimo 8 caracteres')).toBeVisible();
    await expect(page.locator('text=maiúscula')).toBeVisible();
    await expect(page.locator('text=número')).toBeVisible();
  });

  test('should navigate to step 2 with valid data', async ({ page }) => {
    await page.fill('input[id="name"]', 'João Silva');
    await page.fill('input[type="email"]', 'joao@email.com');
    await page.fill('input[type="password"]', 'Teste123');
    await page.fill('input[id="confirmPassword"]', 'Teste123');
    await page.click('button:has-text("Continuar")');

    await expect(page.locator('text=Escolha seu plano')).toBeVisible();
    await expect(page.locator('text=Gratuito')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Business')).toBeVisible();
  });

  test('should show validation error when password mismatch', async ({ page }) => {
    await page.fill('input[id="name"]', 'João Silva');
    await page.fill('input[type="email"]', 'joao@email.com');
    await page.fill('input[type="password"]', 'Teste123');
    await page.fill('input[id="confirmPassword"]', 'Different123');
    await page.click('button:has-text("Continuar")');

    await expect(page.locator('text=senhas não coincidem')).toBeVisible();
  });

  test('should select a plan', async ({ page }) => {
    await page.fill('input[id="name"]', 'João Silva');
    await page.fill('input[type="email"]', 'joao@email.com');
    await page.fill('input[type="password"]', 'Teste123');
    await page.fill('input[id="confirmPassword"]', 'Teste123');
    await page.click('button:has-text("Continuar")');
    
    await page.click('button:has-text("Pro")');
    
    await expect(page.locator('button:has-text("Pro")').first()).toHaveAttribute('data-state', 'checked');
  });

  test('should create account successfully', async ({ page }) => {
    const testEmail = `test${Date.now()}@email.com`;
    
    await page.fill('input[id="name"]', 'Usuário Teste');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'Teste123');
    await page.fill('input[id="confirmPassword"]', 'Teste123');
    await page.click('button:has-text("Continuar")');
    
    await page.click('button:has-text("Gratuito")');
    await page.click('button:has-text("Criar conta")');

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('a:has-text("Entrar")');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Bem-vindo de volta')).toBeVisible();
  });

  test('should have terms and privacy links', async ({ page }) => {
    await expect(page.locator('a:has-text("Termos")')).toBeVisible();
    await expect(page.locator('a:has-text("Privacidade")')).toBeVisible();
  });

  test('should have Google signup button', async ({ page }) => {
    await expect(page.locator('button:has-text("Google")).toBeVisible();
  });
});
