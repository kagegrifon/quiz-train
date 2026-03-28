# Каталог квизов (выбор квиза)

**Статус:** in progress

## Зачем

Сейчас в приложении один захардкоженный квиз по JavaScript. Добавление каталога позволяет
расширять библиотеку тем без изменения кода приложения — достаточно добавить новый файл с вопросами.

## Поведение

- Стартовая страница показывает карточки доступных квизов: название, описание, кол-во вопросов, тема.
- Пользователь выбирает квиз, затем переходит к настройкам (таймер, reveal-режим) и запускает.
- Статистика ведётся отдельно по каждому квизу (попытки привязаны к `quizId`).
- На странице статистики можно переключаться между квизами.

### Сценарий

**Дано:** пользователь открыл приложение
**Когда:** видит список квизов
**Тогда:** выбирает один из них, настраивает параметры и нажимает «Начать квиз»

**Дано:** пользователь прошёл квиз по JavaScript
**Когда:** открывает страницу статистики
**Тогда:** видит попытки только по этому квизу; может переключиться на другой

## Критерии готовности

- [ ] На стартовой странице список квизов (минимум 2 квиза для демонстрации)
- [ ] Каждая карточка: название, описание, кол-во вопросов
- [ ] Выбранный квиз передаётся в параметрах маршрута `/quiz?quizId=...`
- [ ] `QuizPage` и `ResultsPage` загружают вопросы по `quizId`
- [ ] `AttemptRecord` хранит `quizId`; статистика фильтруется по нему
- [ ] Добавление нового квиза не требует правок в компонентах — только новый файл вопросов
- [ ] E2E-тест: выбрать второй квиз, пройти, проверить что в статистике 1 попытка по нему

## Технические заметки

### Новая сущность `Quiz`

```ts
// src/entities/question/model/types.ts
interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}
```

### Реестр квизов

```ts
// src/entities/question/model/quiz-registry.ts
import { jsBasicsQuiz } from './quizzes/js-basics';
import { tsBasicsQuiz } from './quizzes/ts-basics';

export const quizRegistry: Quiz[] = [jsBasicsQuiz, tsBasicsQuiz];

export function getQuizById(id: string): Quiz | undefined {
  return quizRegistry.find((q) => q.id === id);
}
```

Текущие вопросы переезжают в `src/entities/question/model/quizzes/js-basics.ts`.

### Маршрутизация

- `/` → каталог квизов (новая роль StartPage или отдельная CatalogPage)
- `/quiz?quizId=js-basics&timerEnabled=...` — добавляется параметр `quizId`
- `/results?quizId=js-basics&...` — аналогично
- `/stats?quizId=js-basics` — фильтрация статистики по квизу (опционально: без фильтра показывать все)

### AttemptRecord

Добавить поле `quizId: string` в интерфейс. Старые записи без `quizId` считать принадлежащими `'js-basics'`.

### Влияние на существующий код

| Файл | Изменение |
|---|---|
| `entities/question/model/types.ts` | добавить `Quiz` |
| `entities/question/model/questions.ts` | переименовать → `quizzes/js-basics.ts` |
| `entities/question/index.ts` | экспортировать `quizRegistry`, `getQuizById` |
| `shared/types/attempt.ts` | добавить `quizId` |
| `app/router.tsx` | добавить `quizId` в validateSearch |
| `pages/start/ui/StartPage.tsx` | показывать карточки квизов |
| `pages/quiz/ui/QuizPage.tsx` | получать вопросы через `getQuizById(quizId)` |
| `pages/results/ui/ResultsPage.tsx` | передавать `quizId` в статистику |
| `pages/stats/ui/StatsPage.tsx` | фильтровать по `quizId` |
