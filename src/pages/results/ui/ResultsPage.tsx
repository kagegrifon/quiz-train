import { Button, Paper, RingProgress, Stack, Text, Title } from '@mantine/core';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { questions } from '@/entities/question';
import { calcScore } from '@/shared/lib/scoring';
import styles from './ResultsPage.module.css';

export function ResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/results' });
  const answers: Record<string, string[]> = search.answers
    ? JSON.parse(search.answers as string)
    : {};

  const { score, maxScore } = calcScore(questions, answers);
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const color = percent >= 70 ? 'green' : percent >= 40 ? 'yellow' : 'red';

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
            sections={[{ value: percent, color }]}
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
