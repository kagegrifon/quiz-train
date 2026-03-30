import { Badge, Button, Group, Paper, Progress, Text } from '@mantine/core';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { getQuizById } from '@/entities/question';
import { calcScore } from '@/shared/lib/scoring';
import { saveAttempt } from '@/shared/lib/quiz-stats';
import { formatTime, useCountdown, useStopwatch } from '@/shared/lib/use-countdown';
import type { RevealConfig } from '@/widgets/question-view';
import { QuestionView } from '@/widgets/question-view';
import styles from './QuizPage.module.css';

export function QuizPage() {
  const navigate = useNavigate();
  const { quizId, timerEnabled, timeLimitSec, revealWhen, showCorrect, showWrong } = useSearch({ from: '/quiz' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [lockedIds, setLockedIds] = useState<string[]>([]);
  const startedAtRef = useRef(new Date().toISOString());

  const questions = getQuizById(quizId)?.questions ?? [];
  const question = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const selectedIds = answers[question?.id ?? ''] ?? [];
  const isLocked = lockedIds.includes(question?.id ?? '');

  const { score, maxScore } = calcScore(questions, answers);
  const revealConfig: RevealConfig = { showCorrect, showWrong };

  const handleFinish = () => {
    const finishedAt = new Date().toISOString();
    const durationSec = Math.round(
      (new Date(finishedAt).getTime() - new Date(startedAtRef.current).getTime()) / 1000,
    );
    const { score: finalScore, maxScore: finalMax } = calcScore(questions, answers);
    const percent = finalMax > 0 ? Math.round((finalScore / finalMax) * 100) : 0;

    saveAttempt({
      quizId,
      startedAt: startedAtRef.current,
      finishedAt,
      durationSec,
      score: finalScore,
      maxScore: finalMax,
      percent,
      settingsSnapshot: { timerEnabled, timeLimitSec, revealWhen, showCorrect, showWrong },
    });

    navigate({ to: '/results', search: { quizId, answers: JSON.stringify(answers), revealWhen, showCorrect, showWrong } });
  };

  const remaining = useCountdown(timeLimitSec, timerEnabled, handleFinish);
  const timerUrgent = timerEnabled && remaining <= 10;
  const elapsed = useStopwatch(!timerEnabled);

  const handleChange = (ids: string[]) => {
    setAnswers((prev) => ({ ...prev, [question.id]: ids }));
  };

  const handleAnswer = () => {
    const newLocked = [...lockedIds, question.id];
    setLockedIds(newLocked);
    if (newLocked.length === total) handleFinish();
  };

  if (!question) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Вопрос {currentIndex + 1} из {total}
          </Text>
          <Group gap="xs">
            {revealWhen === 'afterAnswer' && (
              <Badge variant="light" color="blue">
                {score} / {maxScore} баллов
              </Badge>
            )}
            {timerEnabled && (
              <Badge variant="light" color={timerUrgent ? 'red' : 'gray'}>
                {formatTime(remaining)}
              </Badge>
            )}
            {!timerEnabled && (
              <Badge variant="light" color="gray" data-testid="elapsed-timer">
                {formatTime(elapsed)}
              </Badge>
            )}
          </Group>
        </Group>
        <Progress value={progress} size="sm" className={styles.progress} />
      </div>

      <Paper shadow="xs" p="xl" radius="md" className={styles.card}>
        <QuestionView
          question={question}
          selectedIds={selectedIds}
          onChange={handleChange}
          disabled={isLocked}
          revealConfig={revealWhen === 'afterAnswer' && isLocked ? revealConfig : undefined}
        />
        {revealWhen === 'afterAnswer' && !isLocked && (
          <Button mt="md" onClick={handleAnswer}>
            Ответить
          </Button>
        )}
      </Paper>

      <Group justify="space-between" className={styles.footer}>
        <Group gap="sm">
          <Button
            variant="default"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
          >
            Назад
          </Button>
          {currentIndex < total - 1 && (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>Вперёд</Button>
          )}
          <Button color="green" onClick={handleFinish}>
            Завершить
          </Button>
        </Group>
        <Button variant="subtle" color="red" onClick={() => navigate({ to: '/' })}>
          Выйти из квиза
        </Button>
      </Group>
    </div>
  );
}
