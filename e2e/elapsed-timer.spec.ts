import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('elapsed timer: shown when timerEnabled=false', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByTestId('elapsed-timer')).toBeVisible();
  await expect(page.getByTestId('elapsed-timer')).toHaveText('00:00');
});

test('elapsed timer: increments after a second', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByTestId('elapsed-timer')).toBeVisible();
  await page.waitForTimeout(1500);
  const text = await page.getByTestId('elapsed-timer').textContent();
  expect(text).not.toBe('00:00');
});

test('elapsed timer: hidden when timerEnabled=true', async ({ page }) => {
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.getByRole('switch', { name: 'Включить таймер' }).check();
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByTestId('elapsed-timer')).not.toBeVisible();
});
