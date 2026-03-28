# Модель данных

## Вопрос (внутренний формат)

```ts
interface Question {
  id: string;
  promptMd: string;             // markdown, допускаются code fences
  options: { id: string; labelMd: string }[];
  mode: "single" | "multi";
  correctOptionIds: string[];   // для single — один элемент
  points: number;
  explainMd?: string;
}
```

## Маппинг в react-quiz-kit

- `mode: "single" | "multi"` → `type: "multiple-choice"`
- `correctAnswer`: строка для single, массив для multi
