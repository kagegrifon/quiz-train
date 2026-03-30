# Таймер прошедшего времени

**Статус:** done

## Зачем

Без обратного таймера пользователь не видит сколько времени тратит на квиз.
Отображение elapsed-времени позволяет самостоятельно контролировать темп,
а итоговое значение согласуется с `durationSec` на странице результатов и в статистике.

## Поведение

- Когда `timerEnabled = false`: в шапке квиза появляется Badge с временем, прошедшим с момента старта.
  Формат: `MM:SS` (тот же `formatTime`, что использует countdown). Цвет: `gray`, без анимации urgency.
- Когда `timerEnabled = true`: поведение не меняется — показывается countdown, elapsed не отображается.
- Badge появляется на том же месте, где сейчас показывается countdown (правый блок шапки).

## Критерии готовности

- [ ] При `timerEnabled = false` в шапке квиза виден Badge с elapsed-временем
- [ ] Время увеличивается каждую секунду
- [ ] При `timerEnabled = true` elapsed не показывается, countdown работает как раньше
- [ ] E2E-тест: запустить квиз без таймера → подождать → убедиться что elapsed > 0

## Технические заметки

### Хук useStopwatch

Добавить в `shared/lib/use-countdown.ts` рядом с `useCountdown` и `formatTime`:

```ts
export function useStopwatch(enabled: boolean): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [enabled]);

  return elapsed;
}
```

`enabled` = `!timerEnabled` — хук активен только когда countdown выключен.

### Изменения в QuizPage

```tsx
const elapsed = useStopwatch(!timerEnabled);

// В шапке, рядом с countdown badge:
{!timerEnabled && (
  <Badge variant="light" color="gray" data-testid="elapsed-timer">
    {formatTime(elapsed)}
  </Badge>
)}
```

### Влияние на существующий код

| Файл | Изменение |
|---|---|
| `shared/lib/use-countdown.ts` | добавить `useStopwatch` |
| `pages/quiz/ui/QuizPage.tsx` | показывать elapsed badge когда `!timerEnabled` |
