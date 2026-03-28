import { Button, Paper, RingProgress, Stack, Text, Title } from '@mantine/core';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { questions } from '../../data/questions';
import styles from './ResultsPage.module.css';

function calcScore(answers: Record<string, string[]>): { score: number; maxScore: number } {
  let score = 0;
  let maxScore = 0;

  for (const q of questions) {
    maxScore += q.points;
    const selected = answers[q.id] ?? [];

    if (q.mode === 'single') {
      if (selected.length === 1 && selected[0] === q.correctOptionIds[0]) {
        score += q.points;
      }
    } else {
      const correctSelected = selected.filter((id) => q.correctOptionIds.includes(id)).length;
      score += q.points * (correctSelected / q.correctOptionIds.length);
    }
  }

  return { score: Math.round(score), maxScore };
}

export function ResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/results' });
  const answers: Record<string, string[]> = search.answers
    ? JSON.parse(search.answers as string)
    : {};

  const { score, maxScore } = calcScore(answers);
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className={styles.root}>
      <Paper shadow="xs" p="xl" radius="md" className={styles.card}>
        <Stack align="center" gap="xl">
          <Title order={2}>Результаты</Title>
          <RingProgress
            size={160}
            thickness={16}
            label={
              <Text ta="center" fw={700} size="xl">
                {percent}%
              </Text>
            }
            sections={[{ value: percent, color: percent >= 70 ? 'green' : percent >= 40 ? 'yellow' : 'red' }]}
          />
          <Text size="lg">
            Набрано: <strong>{score}</strong> из <strong>{maxScore}</strong> баллов
          </Text>
          <Button onClick={() => navigate({ to: '/' })}>Начать заново</Button>
        </Stack>
      </Paper>
    </div>
  );
}
