import { Button, Divider, NumberInput, Paper, SegmentedControl, Stack, Switch, Text, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { questions } from '@/entities/question';
import styles from './StartPage.module.css';

export function StartPage() {
  const navigate = useNavigate();
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLimitSec, setTimeLimitSec] = useState<number>(120);
  const [revealWhen, setRevealWhen] = useState<'onFinish' | 'afterAnswer'>('onFinish');
  const [showCorrect, setShowCorrect] = useState(true);
  const [showWrong, setShowWrong] = useState(true);

  const handleStart = () => {
    navigate({ to: '/quiz', search: { timerEnabled, timeLimitSec, revealWhen, showCorrect, showWrong } });
  };

  return (
    <div className={styles.root}>
      <Stack align="center" gap="xl" w={380}>
        <Stack align="center" gap="xs">
          <Title order={1}>Квиз: Основы JavaScript</Title>
          <Text c="dimmed" size="lg" ta="center">
            {questions.length} вопросов · Проверь свои знания
          </Text>
        </Stack>

        <Paper withBorder p="lg" radius="md" w="100%">
          <Stack gap="md">
            <Switch
              label="Включить таймер"
              checked={timerEnabled}
              onChange={(e) => setTimerEnabled(e.currentTarget.checked)}
            />
            {timerEnabled && (
              <NumberInput
                label="Время на квиз (секунды)"
                value={timeLimitSec}
                onChange={(v) => setTimeLimitSec(Number(v))}
                min={10}
                max={600}
                step={10}
              />
            )}

            <Divider />

            <Text size="sm" fw={500}>Показывать ответы</Text>
            <SegmentedControl
              value={revealWhen}
              onChange={(v) => setRevealWhen(v as 'onFinish' | 'afterAnswer')}
              data={[
                { label: 'Только в результатах', value: 'onFinish' },
                { label: 'После ответа', value: 'afterAnswer' },
              ]}
            />
            <Switch
              label="Показывать правильные"
              checked={showCorrect}
              onChange={(e) => setShowCorrect(e.currentTarget.checked)}
            />
            <Switch
              label="Показывать неправильные"
              checked={showWrong}
              onChange={(e) => setShowWrong(e.currentTarget.checked)}
            />
          </Stack>
        </Paper>

        <Button size="lg" fullWidth onClick={handleStart}>
          Начать квиз
        </Button>
        <Button variant="subtle" fullWidth onClick={() => navigate({ to: '/stats' })}>
          Статистика
        </Button>
      </Stack>
    </div>
  );
}
