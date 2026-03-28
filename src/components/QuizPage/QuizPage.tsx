import { Button, Group, Paper, Progress, Text } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { questions } from '../../data/questions';
import { QuestionView } from '../QuestionView/QuestionView';
import styles from './QuizPage.module.css';

export function QuizPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  // answers: questionId -> selectedOptionIds
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const selectedIds = answers[question.id] ?? [];

  const handleChange = (ids: string[]) => {
    setAnswers((prev) => ({ ...prev, [question.id]: ids }));
  };

  const handleFinish = () => {
    navigate({ to: '/results', search: { answers: JSON.stringify(answers) } });
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size="sm" c="dimmed">
          Вопрос {currentIndex + 1} из {total}
        </Text>
        <Progress value={progress} size="sm" className={styles.progress} />
      </div>

      <Paper shadow="xs" p="xl" radius="md" className={styles.card}>
        <QuestionView
          question={question}
          selectedIds={selectedIds}
          onChange={handleChange}
        />
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
          {currentIndex < total - 1 ? (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>
              Вперёд
            </Button>
          ) : (
            <Button color="green" onClick={handleFinish}>
              Завершить
            </Button>
          )}
        </Group>
        <Button variant="subtle" color="red" onClick={() => navigate({ to: '/' })}>
          Выйти из квиза
        </Button>
      </Group>
    </div>
  );
}
