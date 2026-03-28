import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('catalog: first quiz selected by default', async ({ page }) => {
  // JS card should have a highlighted border (selected state)
  const jsCard = page.getByText('Основы JavaScript').locator('..');
  await expect(jsCard).toBeVisible();
  // clicking start without changing selection starts js-basics
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.url()).toContain('quizId=js-basics');
});

test('catalog: selecting TypeScript quiz starts ts-basics', async ({ page }) => {
  await page.getByText('Основы TypeScript').click();
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.url()).toContain('quizId=ts-basics');
  await expect(page.getByText('Вопрос 1 из 6')).toBeVisible();
});

test('catalog: attempts are counted per quiz', async ({ page }) => {
  // finish JS quiz
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await expect(page.getByText('Попыток: 1')).toBeVisible();
  await page.getByRole('button', { name: 'Начать заново' }).click();

  // finish TS quiz
  await page.getByText('Основы TypeScript').click();
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  // TS quiz shows 1 attempt (not 2)
  await expect(page.getByText('Попыток: 1')).toBeVisible();
});

test('catalog: stats page shows quiz column and filter', async ({ page }) => {
  // finish JS quiz
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await page.getByRole('button', { name: 'Подробная статистика' }).click();

  // should show quiz filter with "Все", JS, TS options
  const filter = page.getByRole('radiogroup');
  await expect(filter.getByText('Все')).toBeVisible();
  await expect(filter.getByText('Основы JavaScript')).toBeVisible();
  await expect(filter.getByText('Основы TypeScript')).toBeVisible();

  // table has quiz column with JS quiz name
  await expect(page.getByRole('cell', { name: 'Основы JavaScript' })).toBeVisible();
});

test('catalog: stats filter by quiz shows only that quiz attempts', async ({ page }) => {
  // finish JS quiz
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await page.getByRole('button', { name: 'Начать заново' }).click();

  // finish TS quiz
  await page.getByText('Основы TypeScript').click();
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await page.getByRole('button', { name: 'Начать заново' }).click();

  // go to stats, filter by TS
  await page.getByRole('button', { name: 'Статистика' }).click();
  await page.getByText('Основы TypeScript').first().click();

  // only 1 row (the TS attempt)
  await expect(page.getByRole('row')).toHaveCount(2); // header + 1 data row
  await expect(page.getByRole('cell', { name: 'Основы TypeScript' })).toBeVisible();
});
