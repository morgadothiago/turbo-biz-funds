import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/login|entrar/i);
    await expect(page.getByText(/bem-vindo de volta/i)).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('should login successfully with admin credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('admin@financeai.com');
    await page.getByLabel('Senha').fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.getByText(/dashboard|painel/i)).toBeVisible();
  });

  test('should login successfully with user credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('usuario@financeai.com');
    await page.getByLabel('Senha').fill('user123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/minhas finanças|dashboard/i)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid@email.com');
    await page.getByLabel('Senha').fill('wrongpassword');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    await expect(page.getByText(/email ou senha inválidos/i)).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByText(/criar conta grátis/i).click();
    await expect(page).toHaveURL(/.*cadastro/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /entrar/i }).click();
    
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Senha');
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });
});

test.describe('Navigation', () => {
  test('should navigate from landing to login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /entrar/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show 404 for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByText(/404|página não encontrada/i)).toBeVisible();
  });
});
