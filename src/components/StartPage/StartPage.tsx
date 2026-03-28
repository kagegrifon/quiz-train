import { Button, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { questions } from '../../data/questions';
import styles from './StartPage.module.css';

export function StartPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <Stack align="center" gap="xl">
        <Title order={1}>Квиз: Основы JavaScript</Title>
        <Text c="dimmed" size="lg" ta="center">
          {questions.length} вопросов · Проверь свои знания
        </Text>
        <Button size="lg" onClick={() => navigate({ to: '/quiz' })}>
          Начать квиз
        </Button>
      </Stack>
    </div>
  );
}
