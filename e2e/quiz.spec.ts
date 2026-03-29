import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ─── Start page ───────────────────────────────────────────────────────────────

test('start page: renders quiz cards, start and stats buttons', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Квиз' })).toBeVisible();
  await expect(page.getByText('Основы JavaScript')).toBeVisible();
  await expect(page.getByText('Основы TypeScript')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Начать квиз' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Статистика' })).toBeVisible();
});

// ─── onFinish mode ────────────────────────────────────────────────────────────

test('onFinish: score badge is hidden during quiz', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByText(/Вопрос 1 из/)).toBeVisible();
  await expect(page.getByText(/баллов/)).not.toBeVisible();
});

test('onFinish: Завершить navigates to results', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await expect(page.getByRole('heading', { name: 'Результаты' })).toBeVisible();
  await expect(page.getByText(/Набрано:/)).toBeVisible();
});

test('onFinish: results show attempts count after finish', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await expect(page.getByText('Попыток: 1')).toBeVisible();
});

// ─── Exit without saving ──────────────────────────────────────────────────────

test('exit quiz: does not save attempt', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Выйти из квиза' }).click();
  await expect(page.getByRole('button', { name: 'Начать квиз' })).toBeVisible();
  await page.getByRole('button', { name: 'Статистика' }).click();
  await expect(page.getByText('Нет завершённых попыток')).toBeVisible();
});

// ─── Stats page ───────────────────────────────────────────────────────────────

test('stats: shows attempt row after finishing quiz', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await page.getByRole('button', { name: 'Подробная статистика' }).click();
  await expect(page.getByRole('heading', { name: 'Статистика' })).toBeVisible();
  // header row + 1 data row
  await expect(page.getByRole('row')).toHaveCount(2);
});

test('stats: back button returns to start page', async ({ page }) => {
  await page.goto('/stats?quizId=');
  await page.getByRole('button', { name: '← Назад' }).click();
  await expect(page.getByRole('heading', { name: 'Квиз' })).toBeVisible();
});

// ─── afterAnswer mode ─────────────────────────────────────────────────────────

test('afterAnswer: score badge is visible during quiz', async ({ page }) => {
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.getByText('После ответа').click();
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByText(/баллов/)).toBeVisible();
});

test('afterAnswer: Ответить button appears and locks question', async ({ page }) => {
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.getByText('После ответа').click();
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  const answerBtn = page.getByRole('button', { name: 'Ответить' });
  await expect(answerBtn).toBeVisible();
  await answerBtn.click();
  await expect(answerBtn).not.toBeVisible();
  await expect(page.getByRole('radio').first()).toBeDisabled();
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test('quiz navigation: Вперёд / Назад change question index', async ({ page }) => {
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByText('Вопрос 1 из')).toBeVisible();
  await page.getByRole('button', { name: 'Вперёд' }).click();
  await expect(page.getByText('Вопрос 2 из')).toBeVisible();
  await page.getByRole('button', { name: 'Назад' }).click();
  await expect(page.getByText('Вопрос 1 из')).toBeVisible();
});
