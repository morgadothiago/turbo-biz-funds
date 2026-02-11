import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"]', 'admin@financeai.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');
    
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForLoadState('networkidle');
  });

  test('should display dashboard stats', async ({ page }) => {
    await expect(page.locator('text=Saldo do Mês')).toBeVisible();
    await expect(page.locator('text=Receitas')).toBeVisible();
    await expect(page.locator('text=Despesas')).toBeVisible();
    await expect(page.locator('text=Categorias')).toBeVisible();
  });

  test('should display expense chart', async ({ page }) => {
    await expect(page.locator('[class*="recharts"]')).toBeVisible();
  });

  test('should display category expenses', async ({ page }) => {
    await expect(page.locator('text=Alimentação')).toBeVisible();
    await expect(page.locator('text=Transporte')).toBeVisible();
    await expect(page.locator('text=Lazer')).toBeVisible();
    await expect(page.locator('text=Contas')).toBeVisible();
  });

  test('should display recent transactions', async ({ page }) => {
    await expect(page.locator('text=Transações Recentes')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should display goals progress', async ({ page }) => {
    await expect(page.locator('text=Minhas Metas')).toBeVisible();
    await expect(page.locator('text=Meta 1')).toBeVisible();
    await expect(page.locator('text=Meta 2')).toBeVisible();
    await expect(page.locator('text=Meta 3')).toBeVisible();
  });

  test('should display WhatsApp CTA', async ({ page }) => {
    await expect(page.locator('text=Conecte ao WhatsApp')).toBeVisible();
    await expect(page.locator('button:has-text("Conectar")')).toBeVisible();
  });

  test('should navigate to transactions page', async ({ page }) => {
    await page.click('a:has-text("Transações")');
    
    await expect(page).toHaveURL(/.*transactions/);
  });

  test('should navigate to goals page', async ({ page }) => {
    await page.click('a:has-text("Metas")');
    
    await expect(page).toHaveURL(/.*goals/);
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.click('a:has-text("Categorias")');
    
    await expect(page).toHaveURL(/.*categories/);
  });

  test('should logout successfully', async ({ page }) => {
    await page.click('button:has-text("Sair")');
    
    await expect(page).toHaveURL(/.*login/);
  });

  test('should display user name in sidebar', async ({ page }) => {
    await expect(page.locator('text=Administrador')).toBeVisible();
  });

  test('should display correct balance value', async ({ page }) => {
    await expect(page.locator('text=R$ 3.450,00')).toBeVisible();
  });

  test('should display income value', async ({ page }) => {
    await expect(page.locator('text=R$ 5.200,00')).toBeVisible();
  });

  test('should display expense value', async ({ page }) => {
    await expect(page.locator('text=R$ 1.750,00')).toBeVisible();
  });

  test('should show positive trend indicators', async ({ page }) => {
    await expect(page.locator('[class*="text-success"]')).toBeVisible();
  });
});

test.describe('Dashboard Without Auth', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*login/);
  });

  test('should redirect to login when accessing transactions without auth', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*login/);
  });

  test('should redirect to login when accessing goals without auth', async ({ page }) => {
    await page.goto('/goals');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*login/);
  });
});
