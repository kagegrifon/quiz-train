import { Button, Divider, Paper, RingProgress, Stack, Text, Title } from '@mantine/core';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { getQuizById } from '@/entities/question';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import { calcScore } from '@/shared/lib/scoring';
import { loadAttempts } from '@/shared/lib/quiz-stats';
import type { RevealConfig } from '@/widgets/question-view';
import { QuestionView } from '@/widgets/question-view';
import styles from './ResultsPage.module.css';

export function ResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/results' });

  let answers: Record<string, string[]> = {};
  try {
    if (search.answers) answers = JSON.parse(search.answers as string);
  } catch {
    // невалидный URL — показываем нулевой результат
  }

  const { quizId, showCorrect, showWrong } = search;
  const questions = getQuizById(quizId)?.questions ?? [];

  const revealConfig: RevealConfig | undefined =
    showCorrect || showWrong ? { showCorrect, showWrong } : undefined;

  const { score, maxScore } = calcScore(questions, answers);
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const color = percent >= 70 ? 'green' : percent >= 40 ? 'yellow' : 'red';

  const quizAttempts = loadAttempts().filter((a) => (a.quizId ?? 'js-basics') === quizId);
  const bestPercent = quizAttempts.length > 0 ? Math.max(...quizAttempts.map((a) => a.percent)) : null;
  const avgPercent =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((s, a) => s + a.percent, 0) / quizAttempts.length)
      : null;

  return (
    <div className={styles.root}>
      <Stack gap="xl" className={styles.content}>
        <Paper shadow="xs" p="xl" radius="md">
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
            {quizAttempts.length > 0 && (
              <>
                <Divider w="100%" />
                <Stack gap="xs" align="center">
                  <Text size="sm" c="dimmed">Попыток: {quizAttempts.length}</Text>
                  <Text size="sm" c="dimmed">Лучший результат: {bestPercent}%</Text>
                  <Text size="sm" c="dimmed">Средний результат: {avgPercent}%</Text>
                </Stack>
              </>
            )}
            <Button onClick={() => navigate({ to: '/' })}>Начать заново</Button>
            {quizAttempts.length > 0 && (
              <Button variant="subtle" onClick={() => navigate({ to: '/stats', search: { quizId } })}>
                Подробная статистика
              </Button>
            )}
          </Stack>
        </Paper>

        <Title order={3}>Разбор вопросов</Title>

        {questions.map((q, i) => (
          <Paper key={q.id} shadow="xs" p="xl" radius="md">
            <Stack gap="md">
              <Text size="sm" c="dimmed">Вопрос {i + 1}</Text>
              <QuestionView
                question={q}
                selectedIds={answers[q.id] ?? []}
                onChange={() => {}}
                disabled
                revealConfig={revealConfig}
              />
              {q.explainMd && (
                <>
                  <Divider />
                  <div>
                    <Text size="sm" fw={500} mb={4}>Объяснение</Text>
                    <MarkdownContent>{q.explainMd}</MarkdownContent>
                  </div>
                </>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </div>
  );
}
