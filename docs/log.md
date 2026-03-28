# Лог решений

## 2026-03-28 — Исправление трёх багов после Sprint 4

### Исправлено
- **saveAttempt без try-catch**: `localStorage.setItem` мог бросить исключение (storage full / недоступен), что блокировало вызов `navigate` в `handleFinish`. Добавлен try-catch по аналогии с `loadAttempts`.
- **Значок очков в режиме onFinish**: `calcScore` считал очки в реальном времени, показывая правильные ответы ещё во время квиза (спойлер). Значок скрыт при `revealWhen === 'onFinish'`.
- **Страница статистики**: создана `/stats` (таблица попыток с датой, %, очками, временем, режимом). Ссылки добавлены на StartPage и ResultsPage.

## 2026-03-28 — Sprint 4: Статистика (localStorage)

### Решения
- `startedAtRef` — `useRef`, не `useState`: не вызывает ре-рендер, стабилен на всё время жизни компонента.
- `saveAttempt` вызывается только в `handleFinish` — единственная точка выхода с сохранением; «Выйти из квиза» не сохраняет попытку.
- `loadAttempts` вызывается в `ResultsPage` при рендере — данные всегда свежие после сохранения в QuizPage.
- Секция статистики отображается условно (`attempts.length > 0`) — не показывает «Попыток: 0» при первом запуске.

### Исправлено
- `revealWhen` ternary в `router.tsx` возвращал `string` вместо `'afterAnswer' | 'onFinish'` — одна ветка не имела `as const`. Добавлено `as const` на обе ветки.

## 2026-03-28 — Ревью кода после FSD-рефакторинга

### Исправлено
- `LANGUAGE_RE` вынесен в константу модуля — regex не создавался заново на каждый рендер.
- `components` объект в `MarkdownContent` завёрнут в `useMemo([inline])` — ReactMarkdown не перепарсировал markdown при каждом рендере родителя.
- `inlineP` renderer вынесен как стабильная ссылка вне компонента.
- Удалён лишний `<Text component="span">` вокруг `<MarkdownContent inline>` — обёртка ничего не добавляла к стилям.
- `JSON.parse` в `ResultsPage` защищён `try/catch` — невалидный URL не ронял страницу.

## 2026-03-28 — Sprint 3: Reveal-логика

### Решения
- `RevealConfig` — отдельный интерфейс в `QuestionView`, экспортируется через `index.ts`. Выбрано вместо переноса в `shared/types` — тип тесно связан с виджетом.
- Подсветка через CSS-классы `.optionCorrect` / `.optionWrong` на обёртке `<div>` — Mantine Radio/Checkbox не поддерживают per-item цвет, обёртка с background — наименее инвазивное решение.
- `revealConfig: undefined` = нет подсветки (вместо boolean `isRevealed`) — позволяет передавать конфиг единым объектом и отключать одним undefined.
- «Завершить» вынесен из условия `currentIndex === total - 1` — всегда видна, как требует спецификация.
- `ResultsPage` переделан из centered-карточки в полноширинный scroll — нужно место для разбора всех вопросов.

### Отклонено
- `useCallback` для `handleSingleChange` / `handleMultiChange` — без `React.memo` на дочерних компонентах не даёт эффекта.
- `Set` вместо `Array.includes` для `selectedIds` — массив из 3–5 элементов, оптимизация не оправдана.
- Константы для порогов скоринга (`70`, `40`) и строк `'single'` / `'multi'` — избыточно для текущего масштаба; union-типы TypeScript уже дают типобезопасность.
- `getScorePercentage` / `getScoreColor` в `shared/lib/scoring` — однострочные вычисления, используются в одном месте, абстракция преждевременна.
- `OptionLabel` компонент — после удаления лишней обёртки дублирование исчезло само.
