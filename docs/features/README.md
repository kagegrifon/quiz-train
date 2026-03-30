# Фичи

Файлы фич хранятся по папкам в соответствии со статусом:

```
docs/features/
  planned/   ← описана, ждёт очереди
  done/      ← реализована
```

Фича в разработке остаётся в `planned/` до завершения, статус меняется внутри файла, а так же в таблице этого файла.

## Шаблон файла

```markdown
# <Название фичи>

**Статус:** planned

## Зачем
## Поведение
## Критерии готовности
- [ ] E2E-тест покрывает основной сценарий
## Технические заметки
```

## Индекс

### planned

| Файл | Название |
|---|---|


### done

| Файл | Название |
|---|---|
| [color-scheme.md](done/color-scheme.md) | Переключение темы (тёмная / светлая) |
| [quiz-catalog.md](done/quiz-catalog.md) | Каталог квизов (выбор квиза) |
| [quiz-upload.md](done/quiz-upload.md) | Загрузка квиза из файла |
| [settings-page.md](done/settings-page.md) | Страница настроек и хедер навигации |
| [quiz-export.md](done/quiz-export.md) | Выгрузка квиза в файл |
| [code-quality-gates.md](done/code-quality-gates.md) | Code Quality Gates (knip, husky, lint-staged) |
| [results-breakdown.md](done/results-breakdown.md) | Детализация результатов по вопросам |
| [elapsed-timer.md](done/elapsed-timer.md) | Таймер прошедшего времени |
| [bundle-optimization.md](done/bundle-optimization.md) | Оптимизация бандла (code splitting, PrismLight, visualizer) |
