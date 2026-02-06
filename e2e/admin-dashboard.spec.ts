import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@financeai.com');
    await page.getByLabel('Senha').fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*admin/);
  });

  test('should display admin dashboard', async ({ page }) => {
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByText(/painel admin/i)).toBeVisible();
  });

  test('should display admin stats cards', async ({ page }) => {
    await expect(page.getByText(/receita mensal/i)).toBeVisible();
    await expect(page.getByText(/total de clientes/i)).toBeVisible();
    await expect(page.getByText(/clientes ativos/i)).toBeVisible();
    await expect(page.getByText(/taxa de conversão/i)).toBeVisible();
  });

  test('should display revenue chart', async ({ page }) => {
    await expect(page.getByText(/evolução da receita/i)).toBeVisible();
    await expect(page.getByText(/mrr dos últimos 6 meses/i)).toBeVisible();
  });

  test('should display plan distribution', async ({ page }) => {
    await expect(page.getByText(/distribuição de planos/i)).toBeVisible();
    await expect(page.getByText(/free/i)).toBeVisible();
    await expect(page.getByText(/pro/i)).toBeVisible();
    await expect(page.getByText(/business/i)).toBeVisible();
  });

  test('should display recent clients', async ({ page }) => {
    await expect(page.getByText(/clientes recentes/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /ver todos/i })).toBeVisible();
  });

  test('should navigate to clients page', async ({ page }) => {
    await page.getByText(/clientes/i).click();
    await expect(page).toHaveURL(/.*clientes/);
    await expect(page.getByText(/gestão de clientes/i)).toBeVisible();
  });

  test('should navigate to plans page', async ({ page }) => {
    await page.getByText(/planos/i).click();
    await expect(page).toHaveURL(/.*planos/);
    await expect(page.getByText(/gestão de planos/i)).toBeVisible();
  });

  test('should have admin sidebar with correct items', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Clientes')).toBeVisible();
    await expect(page.getByText('Planos')).toBeVisible();
    await expect(page.getByText('Notificações')).toBeVisible();
    await expect(page.getByText('Configurações')).toBeVisible();
    await expect(page.getByText('Suporte')).toBeVisible();
  });

  test('should show admin user info', async ({ page }) => {
    await expect(page.getByText(/admin/i)).toBeVisible();
    await expect(page.getByText(/admin@financeai.com/i)).toBeVisible();
  });
});

test.describe('Admin Clients Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@financeai.com');
    await page.getByLabel('Senha').fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*admin/);
    await page.getByText(/clientes/i).click();
    await page.waitForURL(/.*clientes/);
  });

  test('should display clients management page', async ({ page }) => {
    await expect(page.getByText(/gestão de clientes/i)).toBeVisible();
    await expect(page.getByText(/gerencie todos os clientes/i)).toBeVisible();
  });

  test('should display client statistics', async ({ page }) => {
    await expect(page.getByText(/total de usuários/i)).toBeVisible();
    await expect(page.getByText(/usuários ativos/i)).toBeVisible();
  });

  test('should have search and filter functionality', async ({ page }) => {
    await expect(page.getByPlaceholder(/buscar por nome ou email/i)).toBeVisible();
    await expect(page.getByText(/todos os planos/i)).toBeVisible();
    await expect(page.getByText(/todos os status/i)).toBeVisible();
  });

  test('should display clients table', async ({ page }) => {
    await expect(page.getByText(/usuário/i)).toBeVisible();
    await expect(page.getByText(/plano/i)).toBeVisible();
    await expect(page.getByText(/status/i)).toBeVisible();
  });
});

test.describe('Admin Plans Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@financeai.com');
    await page.getByLabel('Senha').fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*admin/);
    await page.getByText(/planos/i).click();
    await page.waitForURL(/.*planos/);
  });

  test('should display plans management page', async ({ page }) => {
    await expect(page.getByText(/gestão de planos/i)).toBeVisible();
    await expect(page.getByText(/gerencie os planos/i)).toBeVisible();
  });

  test('should display plan cards', async ({ page }) => {
    await expect(page.getByText(/free/i)).toBeVisible();
    await expect(page.getByText(/pro/i)).toBeVisible();
    await expect(page.getByText(/business/i)).toBeVisible();
  });

  test('should display plan statistics', async ({ page }) => {
    await expect(page.getByText(/assinantes/i)).toBeVisible();
    await expect(page.getByText(/mrr/i)).toBeVisible();
  });

  test('should have create plan button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /novo plano/i })).toBeVisible();
  });
});

test.describe('Admin Access Control', () => {
  test('should not allow regular user to access admin panel', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.getByLabel('Email').fill('usuario@financeai.com');
    await page.getByLabel('Senha').fill('user123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*dashboard/);
    
    // Try to access admin
    await page.goto('/admin');
    
    // Should be redirected to user dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should redirect logged admin from login to admin panel', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@financeai.com');
    await page.getByLabel('Senha').fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*admin/);
    
    // Try to access login again
    await page.goto('/login');
    
    // Should be redirected to admin
    await expect(page).toHaveURL(/.*admin/);
  });
});
