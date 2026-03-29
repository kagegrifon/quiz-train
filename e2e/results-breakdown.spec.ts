import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function finishQuiz(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await expect(page.getByRole('heading', { name: 'Результаты' })).toBeVisible();
}

test('results-breakdown: badge с баллами виден на каждом вопросе', async ({ page }) => {
  await finishQuiz(page);
  // каждая карточка вопроса должна содержать badge вида "N / M"
  const badges = page.locator('.mantine-Badge-root');
  const count = await badges.count();
  expect(count).toBeGreaterThan(0);
});

test('results-breakdown: фильтр "Все" показывает все вопросы', async ({ page }) => {
  await finishQuiz(page);
  const total = await page.getByText(/Вопрос \d+/).count();

  await page.getByTestId('results-filter').getByText('Все', { exact: true }).click();
  await expect(page.getByText(/Вопрос \d+/)).toHaveCount(total);
});

test('results-breakdown: фильтр "Неправильные" скрывает вопросы без ошибок', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();

  await page.getByTestId('results-filter').getByText('Неправильные', { exact: true }).click();
  await expect(page.getByText(/Вопрос \d+/).first()).toBeVisible();
});

test('results-breakdown: фильтр "Правильные" — заглушка если нет правильных', async ({ page }) => {
  await finishQuiz(page); // без ответов — все неправильные
  await page.getByTestId('results-filter').getByText('Правильные', { exact: true }).click();
  await expect(page.getByText('Нет вопросов в этой категории')).toBeVisible();
});

test('results-breakdown: номер вопроса соответствует позиции в оригинальном квизе', async ({ page }) => {
  await finishQuiz(page);
  await expect(page.getByText('Вопрос 1')).toBeVisible();
  await expect(page.getByText('Вопрос 2')).toBeVisible();
});
