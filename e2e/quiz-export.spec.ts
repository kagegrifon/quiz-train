import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('export: кнопка скачать есть на каждой карточке квиза', async ({ page }) => {
  const downloadButtons = page.getByRole('button', { name: 'Скачать квиз', exact: true });
  await expect(downloadButtons).toHaveCount(2); // js-basics + ts-basics
});

test('export: скачивание запускает загрузку файла с расширением .json', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Скачать квиз', exact: true }).first().click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
});

test('export: скачанный файл можно повторно импортировать без ошибок', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Скачать квиз', exact: true }).first().click(),
  ]);

  const filePath = await download.path();
  await page.locator('input[type="file"]').setInputFiles(filePath!);
  await expect(page.getByText('Ошибка загрузки')).not.toBeVisible();
});

test('export: пользовательский квиз имеет кнопки скачать и удалить', async ({ page }) => {
  // сначала загружаем пользовательский квиз
  const { fileURLToPath } = await import('url');
  const path = await import('path');
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const fixturePath = path.join(__dirname, 'fixtures', 'sample-quiz.json');

  await page.locator('input[type="file"]').setInputFiles(fixturePath);
  await expect(page.getByText('Тестовый квиз')).toBeVisible();

  // у пользовательской карточки должны быть обе кнопки
  const downloadButtons = page.getByRole('button', { name: 'Скачать квиз', exact: true });
  const deleteButtons = page.getByRole('button', { name: 'Удалить квиз', exact: true });
  await expect(downloadButtons).toHaveCount(3); // 2 встроенных + 1 пользовательский
  await expect(deleteButtons).toHaveCount(1);   // только пользовательский
});
