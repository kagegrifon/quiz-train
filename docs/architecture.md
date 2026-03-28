# Архитектура — Feature-Sliced Design (FSD)

Проект следует методологии [FSD](https://feature-sliced.design/).

## Слои (сверху вниз)

| Слой | Директория | Что находится |
|---|---|---|
| app | `src/app/` | Роутер, провайдеры, глобальные стили |
| pages | `src/pages/` | Полные страницы: start, quiz, results |
| widgets | `src/widgets/` | Сложные UI-блоки: question-view |
| features | `src/features/` | Пользовательские действия (Sprint 2+) |
| entities | `src/entities/` | Бизнес-сущности: question |
| shared | `src/shared/` | Переиспользуемое: ui, lib, types |

## Правила импортов

- Каждый слой может импортировать **только из слоёв ниже** себя.
- Внутри слоя слайсы **не импортируют друг друга**.
- Каждый слайс экспортирует только через **публичный API** (`index.ts`).
- Алиас `@/` указывает на `src/` — используется вместо относительных путей.

## Структура слайса

```
src/<layer>/<slice>/
  ui/          ← React-компоненты и CSS Modules
  model/       ← типы, данные, логика состояния
  index.ts     ← публичный API (единственная точка входа)
```

## Текущие слайсы

### entities/question
- `model/types.ts` — `Question`, `QuizOption`
- `model/questions.ts` — тестовые данные

### widgets/question-view
- Рендерит вопрос (markdown + подсветка кода)
- Управляет выбором ответов (radio / checkbox)

### shared/lib/scoring
- `calcScore(questions, answers)` — расчёт очков (single/multi)

### shared/ui/markdown-content
- `MarkdownContent` — универсальный рендерер markdown с подсветкой кода

### shared/types/quiz-settings
- `QuizSettings` — настройки квиза (таймер, reveal-режим)
