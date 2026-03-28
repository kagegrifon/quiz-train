import { Button, Paper, SegmentedControl, Stack, Table, Text, Title } from '@mantine/core';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { quizRegistry } from '@/entities/question';
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

const quizTitle = (id?: string) =>
  quizRegistry.find((q) => q.id === (id ?? 'js-basics'))?.title ?? id ?? 'js-basics';

export function StatsPage() {
  const navigate = useNavigate();
  const { quizId } = useSearch({ from: '/stats' });

  const allAttempts = loadAttempts().slice().reverse();
  const filtered = quizId
    ? allAttempts.filter((a) => (a.quizId ?? 'js-basics') === quizId)
    : allAttempts;

  const filterData = [
    { label: 'Все', value: '' },
    ...quizRegistry.map((q) => ({ label: q.title, value: q.id })),
  ];

  const handleFilterChange = (value: string) => {
    navigate({ to: '/stats', search: { quizId: value } });
  };

  if (allAttempts.length === 0) {
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

  const bestPercent = filtered.length > 0 ? Math.max(...filtered.map((a) => a.percent)) : null;
  const avgPercent =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, a) => s + a.percent, 0) / filtered.length)
      : null;

  return (
    <div className={styles.root}>
      <Stack gap="xl" className={styles.content}>
        <Title order={2}>Статистика</Title>

        <SegmentedControl
          value={quizId}
          onChange={handleFilterChange}
          data={filterData}
        />

        {filtered.length === 0 ? (
          <Text c="dimmed">Нет попыток по выбранному квизу</Text>
        ) : (
          <>
            <Paper shadow="xs" p="lg" radius="md">
              <Stack gap="xs">
                <Text>Попыток: <strong>{filtered.length}</strong></Text>
                <Text>Лучший результат: <strong>{bestPercent}%</strong></Text>
                <Text>Средний результат: <strong>{avgPercent}%</strong></Text>
              </Stack>
            </Paper>

            <Paper shadow="xs" radius="md" style={{ overflow: 'hidden' }}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Дата</Table.Th>
                    <Table.Th>Квиз</Table.Th>
                    <Table.Th>Результат</Table.Th>
                    <Table.Th>Очки</Table.Th>
                    <Table.Th>Время</Table.Th>
                    <Table.Th>Режим</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filtered.map((a, i) => (
                    <Table.Tr key={i}>
                      <Table.Td>{formatDate(a.startedAt)}</Table.Td>
                      <Table.Td>{quizTitle(a.quizId)}</Table.Td>
                      <Table.Td><strong>{a.percent}%</strong></Table.Td>
                      <Table.Td>{a.score} / {a.maxScore}</Table.Td>
                      <Table.Td>{formatDuration(a.durationSec)}</Table.Td>
                      <Table.Td>
                        {a.settingsSnapshot.revealWhen === 'afterAnswer' ? 'После ответа' : 'В результатах'}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </>
        )}

        <Button variant="default" onClick={() => navigate({ to: '/' })}>
          ← Назад
        </Button>
      </Stack>
    </div>
  );
}
