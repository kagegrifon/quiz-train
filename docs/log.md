# Лог решений

## 2026-03-28 — Ревью кода после FSD-рефакторинга

### Исправлено
- `LANGUAGE_RE` вынесен в константу модуля — regex не создавался заново на каждый рендер.
- `components` объект в `MarkdownContent` завёрнут в `useMemo([inline])` — ReactMarkdown не перепарсировал markdown при каждом рендере родителя.
- `inlineP` renderer вынесен как стабильная ссылка вне компонента.
- Удалён лишний `<Text component="span">` вокруг `<MarkdownContent inline>` — обёртка ничего не добавляла к стилям.
- `JSON.parse` в `ResultsPage` защищён `try/catch` — невалидный URL не ронял страницу.

### Отклонено
- `useCallback` для `handleSingleChange` / `handleMultiChange` — без `React.memo` на дочерних компонентах не даёт эффекта.
- `Set` вместо `Array.includes` для `selectedIds` — массив из 3–5 элементов, оптимизация не оправдана.
- Константы для порогов скоринга (`70`, `40`) и строк `'single'` / `'multi'` — избыточно для текущего масштаба; union-типы TypeScript уже дают типобезопасность.
- `getScorePercentage` / `getScoreColor` в `shared/lib/scoring` — однострочные вычисления, используются в одном месте, абстракция преждевременна.
- `OptionLabel` компонент — после удаления лишней обёртки дублирование исчезло само.
