# Детализация результатов по вопросам

**Статус:** done

## Зачем

Сейчас на странице результатов виден только итоговый балл. Непонятно, за какие вопросы
сколько получено. Добавление баллов за каждый вопрос и фильтра по результату даёт
пользователю возможность сфокусироваться на ошибках.

## Поведение

### Баллы за вопрос

- На карточке каждого вопроса в разделе «Разбор вопросов» отображается Badge с баллами:
  `{earned} / {max}`.
- Цвет Badge:
  - `green` — полный балл (`earned === max`)
  - `yellow` — частичный балл (`0 < earned < max`)
  - `red` — ноль баллов (`earned === 0`)
- Badge располагается рядом с заголовком «Вопрос N».

### Фильтр вопросов

- Над списком вопросов — `SegmentedControl` с тремя вариантами:
  - **Все** — показывать все вопросы (по умолчанию)
  - **Правильные** — только вопросы с полным баллом (`earned === max`)
  - **Неправильные** — вопросы с частичным или нулевым баллом (`earned < max`)
- Фильтр — локальное состояние компонента, не сохраняется в URL.
- Если по выбранному фильтру нет вопросов — показывать текст «Нет вопросов в этой категории».

## Критерии готовности

- [ ] На каждой карточке вопроса есть Badge с `earned / max`
- [ ] Цвет Badge соответствует результату (green / yellow / red)
- [ ] SegmentedControl над списком фильтрует вопросы
- [ ] Фильтр «Неправильные» включает частичные ответы
- [ ] При отсутствии вопросов в категории показывается заглушка
- [ ] E2E-тест: ответить на часть вопросов → проверить Badge → проверить фильтры

## Технические заметки

### Функция per-question скоринга

Добавить в `shared/lib/scoring.ts`:

```ts
export function calcQuestionScore(
  question: Question,
  selected: string[],
): { earned: number; max: number } {
  const max = question.points;
  if (question.mode === 'single') {
    const earned =
      selected.length === 1 && selected[0] === question.correctOptionIds[0] ? max : 0;
    return { earned, max };
  }
  const correctSelected = selected.filter((id) =>
    question.correctOptionIds.includes(id),
  ).length;
  return {
    earned: Math.round(max * (correctSelected / question.correctOptionIds.length)),
    max,
  };
}
```

### Логика фильтра

```ts
type Filter = 'all' | 'correct' | 'incorrect';

const visibleQuestions = questions.filter((q) => {
  if (filter === 'all') return true;
  const { earned, max } = calcQuestionScore(q, answers[q.id] ?? []);
  return filter === 'correct' ? earned === max : earned < max;
});
```

### Влияние на существующий код

| Файл | Изменение |
|---|---|
| `shared/lib/scoring.ts` | добавить `calcQuestionScore` |
| `pages/results/ui/ResultsPage.tsx` | добавить Badge + SegmentedControl + фильтр |
