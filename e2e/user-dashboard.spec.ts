import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before accessing dashboard
    await page.goto('/login');
    await page.getByLabel('Email').fill('usuario@financeai.com');
    await page.getByLabel('Senha').fill('user123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*dashboard/);
  });

  test('should display dashboard with user stats', async ({ page }) => {
    await expect(page.getByText(/olá,/i)).toBeVisible();
    await expect(page.getByText(/saldo do mês/i)).toBeVisible();
    await expect(page.getByText(/receitas/i)).toBeVisible();
    await expect(page.getByText(/despesas/i)).toBeVisible();
  });

  test('should display financial summary cards', async ({ page }) => {
    await expect(page.getByText(/r\$ 3\.450,00/i)).toBeVisible();
    await expect(page.getByText(/r\$ 5\.200,00/i)).toBeVisible();
    await expect(page.getByText(/r\$ 1\.750,00/i)).toBeVisible();
  });

  test('should navigate to transactions page', async ({ page }) => {
    await page.getByText(/transações/i).click();
    await expect(page).toHaveURL(/.*transacoes/);
    await expect(page.getByText(/histórico de transações/i)).toBeVisible();
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.getByText(/categorias/i).click();
    await expect(page).toHaveURL(/.*categorias/);
    await expect(page.getByText(/suas categorias/i)).toBeVisible();
  });

  test('should navigate to goals page', async ({ page }) => {
    await page.getByText(/metas/i).click();
    await expect(page).toHaveURL(/.*metas/);
    await expect(page.getByText(/metas financeiras/i)).toBeVisible();
  });

  test('should navigate to cards page', async ({ page }) => {
    await page.getByText(/cartões/i).click();
    await expect(page).toHaveURL(/.*cartoes/);
    await expect(page.getByText(/cartões de crédito/i)).toBeVisible();
  });

  test('should display charts', async ({ page }) => {
    await expect(page.getByText(/gastos do mês/i)).toBeVisible();
    await expect(page.getByText(/gastos por categoria/i)).toBeVisible();
  });

  test('should display recent transactions', async ({ page }) => {
    await expect(page.getByText(/últimas transações/i)).toBeVisible();
    await expect(page.getByText(/supermercado extra/i)).toBeVisible();
  });

  test('should display goals section', async ({ page }) => {
    await expect(page.getByText(/minhas metas/i)).toBeVisible();
    await expect(page.getByText(/reserva de emergência/i)).toBeVisible();
  });

  test('should show WhatsApp CTA', async ({ page }) => {
    await expect(page.getByText(/registre pelo whatsapp/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /conectar whatsapp/i })).toBeVisible();
  });
});

test.describe('User Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('usuario@financeai.com');
    await page.getByLabel('Senha').fill('user123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*dashboard/);
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Check all menu items are visible
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Transações')).toBeVisible();
    await expect(page.getByText('Categorias')).toBeVisible();
    await expect(page.getByText('Metas')).toBeVisible();
    await expect(page.getByText('Cartões')).toBeVisible();
    await expect(page.getByText('WhatsApp')).toBeVisible();
    await expect(page.getByText('Configurações')).toBeVisible();
  });

  test('should highlight active menu item', async ({ page }) => {
    await page.getByText('Transações').click();
    const transactionsMenu = page.getByText('Transações');
    await expect(transactionsMenu).toHaveClass(/bg-\[#25D366\]\/15/);
  });

  test('should navigate to WhatsApp integration page', async ({ page }) => {
    await page.getByText(/whatsapp/i).click();
    await expect(page).toHaveURL(/.*whatsapp/);
    await expect(page.getByText(/whatsapp conectado/i)).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.getByText(/configurações/i).click();
    await expect(page).toHaveURL(/.*configuracoes/);
    await expect(page.getByText(/perfil/i)).toBeVisible();
  });
});

test.describe('Transactions Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('usuario@financeai.com');
    await page.getByLabel('Senha').fill('user123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/.*dashboard/);
    await page.getByText(/transações/i).click();
    await page.waitForURL(/.*transacoes/);
  });

  test('should display transactions list', async ({ page }) => {
    await expect(page.getByText(/histórico de transações/i)).toBeVisible();
    await expect(page.getByText(/supermercado extra/i)).toBeVisible();
    await expect(page.getByText(/salário/i)).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    await expect(page.getByPlaceholder(/buscar transações/i)).toBeVisible();
  });

  test('should have filters button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /filtros/i })).toBeVisible();
  });

  test('should display transaction amounts correctly', async ({ page }) => {
    await expect(page.getByText(/-r\$ 245\.50/i)).toBeVisible();
    await expect(page.getByText(/\+r\$ 5200\.00/i)).toBeVisible();
  });
});
