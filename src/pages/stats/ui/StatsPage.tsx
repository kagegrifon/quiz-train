import { Button, Paper, Stack, Table, Text, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { loadAttempts } from '@/shared/lib/quiz-stats';
import styles from './StatsPage.module.css';

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function StatsPage() {
  const navigate = useNavigate();
  const attempts = loadAttempts().slice().reverse();

  if (attempts.length === 0) {
    return (
      <div className={styles.root}>
        <Stack align="center" gap="xl">
          <Title order={2}>Статистика</Title>
          <Text c="dimmed">Нет завершённых попыток</Text>
          <Button variant="default" onClick={() => navigate({ to: '/' })}>
            ← Назад
          </Button>
        </Stack>
      </div>
    );
  }

  const bestPercent = Math.max(...attempts.map((a) => a.percent));
  const avgPercent = Math.round(
    attempts.reduce((s, a) => s + a.percent, 0) / attempts.length,
  );

  return (
    <div className={styles.root}>
      <Stack gap="xl" className={styles.content}>
        <Title order={2}>Статистика</Title>

        <Paper shadow="xs" p="lg" radius="md">
          <Stack gap="xs">
            <Text>
              Попыток: <strong>{attempts.length}</strong>
            </Text>
            <Text>
              Лучший результат: <strong>{bestPercent}%</strong>
            </Text>
            <Text>
              Средний результат: <strong>{avgPercent}%</strong>
            </Text>
          </Stack>
        </Paper>

        <Paper shadow="xs" radius="md" style={{ overflow: 'hidden' }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Дата</Table.Th>
                <Table.Th>Результат</Table.Th>
                <Table.Th>Очки</Table.Th>
                <Table.Th>Время</Table.Th>
                <Table.Th>Режим</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {attempts.map((a, i) => (
                <Table.Tr key={i}>
                  <Table.Td>{formatDate(a.startedAt)}</Table.Td>
                  <Table.Td>
                    <strong>{a.percent}%</strong>
                  </Table.Td>
                  <Table.Td>
                    {a.score} / {a.maxScore}
                  </Table.Td>
                  <Table.Td>{formatDuration(a.durationSec)}</Table.Td>
                  <Table.Td>
                    {a.settingsSnapshot.revealWhen === 'afterAnswer'
                      ? 'После ответа'
                      : 'В результатах'}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        <Button variant="default" onClick={() => navigate({ to: '/' })}>
          ← Назад
        </Button>
      </Stack>
    </div>
  );
}
