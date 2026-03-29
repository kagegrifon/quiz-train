import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const VALID_FIXTURE = path.join(__dirname, 'fixtures', 'sample-quiz.json');
const INVALID_FIXTURE = path.join(__dirname, 'fixtures', 'invalid-quiz.json');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('upload: загрузить файл → квиз в каталоге → пройти → удалить → квиз исчез', async ({ page }) => {
  // 1. Загружаем файл через скрытый input
  await page.locator('input[type="file"]').setInputFiles(VALID_FIXTURE);

  // 2. Квиз появился в каталоге с бейджем
  await expect(page.getByText('Тестовый квиз')).toBeVisible();
  await expect(page.getByText('Пользовательский')).toBeVisible();

  // 3. Запускаем и проходим квиз
  await page.getByText('Тестовый квиз').click();
  await page.getByRole('button', { name: 'Начать квиз' }).click();
  await expect(page.getByText('Вопрос 1 из 2')).toBeVisible();
  await page.getByRole('button', { name: 'Завершить' }).click();
  await expect(page.getByRole('heading', { name: 'Результаты' })).toBeVisible();
  await expect(page.getByText('Попыток: 1')).toBeVisible();

  // 4. Возвращаемся в каталог
  await page.getByRole('button', { name: 'Начать заново' }).click();

  // 5. Удаляем квиз
  await page.getByTestId('quiz-delete').click();
  await expect(page.getByText('Тестовый квиз')).not.toBeVisible();
});

test('upload: повторная загрузка того же файла не создаёт дубль', async ({ page }) => {
  await page.locator('input[type="file"]').setInputFiles(VALID_FIXTURE);
  await expect(page.getByText('Тестовый квиз')).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles(VALID_FIXTURE);
  await expect(page.getByText('Тестовый квиз')).toHaveCount(1);
});

test('upload: невалидный файл показывает ошибку', async ({ page }) => {
  await page.locator('input[type="file"]').setInputFiles(INVALID_FIXTURE);
  await expect(page.getByText('Ошибка загрузки')).toBeVisible();
  await expect(page.getByText('Тестовый квиз')).not.toBeVisible();
});

test('upload: квиз сохраняется после перезагрузки страницы', async ({ page }) => {
  await page.locator('input[type="file"]').setInputFiles(VALID_FIXTURE);
  await expect(page.getByText('Тестовый квиз')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Тестовый квиз')).toBeVisible();
  await expect(page.getByText('Пользовательский')).toBeVisible();
});
