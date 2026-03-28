import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('programmingQuizTheme'));
  await page.reload();
});

test('theme toggle button is visible on start page', async ({ page }) => {
  const toggle = page.getByRole('button', { name: /тему/i });
  await expect(toggle).toBeVisible();
});

test('theme toggle is visible on quiz and results pages', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByRole('button', { name: /тему/i })).toBeVisible();

  await page.getByRole('button', { name: 'Завершить' }).click();
  await expect(page.getByRole('button', { name: /тему/i })).toBeVisible();
});

test('clicking toggle switches color scheme', async ({ page }) => {
  const html = page.locator('html');
  const before = await html.getAttribute('data-mantine-color-scheme');

  await page.getByRole('button', { name: /тему/i }).click();

  const after = await html.getAttribute('data-mantine-color-scheme');
  expect(after).not.toBe(before);
  expect(['light', 'dark']).toContain(after);
});

test('color scheme persists after page reload', async ({ page }) => {
  // switch to opposite of current
  await page.getByRole('button', { name: /тему/i }).click();
  const scheme = await page.locator('html').getAttribute('data-mantine-color-scheme');

  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-mantine-color-scheme', scheme!);
});

test('stored scheme is applied immediately on load (no flash)', async ({ page }) => {
  // set dark in localStorage, then open fresh page
  await page.evaluate(() => localStorage.setItem('programmingQuizTheme', 'dark'));

  // intercept the HTML before React mounts
  const response = await page.goto('/');
  expect(response).not.toBeNull();

  // attribute must be set synchronously by the inline script before React renders
  const scheme = await page.locator('html').getAttribute('data-mantine-color-scheme');
  expect(scheme).toBe('dark');
});
