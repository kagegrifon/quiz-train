# Статистика (localStorage)

**Ключ:** `programmingQuizStats:v1`

## Формат записи

```ts
interface AttemptRecord {
  startedAt: string;        // ISO
  finishedAt: string;       // ISO
  durationSec: number;
  score: number;
  maxScore: number;
  percent: number;
  settingsSnapshot: {
    timerEnabled: boolean;
    timeLimitSec?: number;
    revealWhen: "onFinish" | "afterAnswer";
    showCorrect: boolean;
    showWrong: boolean;
  };
}
```

## ResultsPage показывает
- Количество попыток
- Лучший результат
- Средний % (по всем попыткам или последним N — на выбор при реализации)
