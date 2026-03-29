import { ActionIcon, Alert, Badge, Button, Group, SimpleGrid, Stack, Text, Title, UnstyledButton, Paper } from '@mantine/core';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { quizRegistry } from '@/entities/question';
import type { Quiz } from '@/entities/question';
import { loadUserQuizzes, saveUserQuiz, deleteUserQuiz } from '@/shared/lib/user-quiz-storage';
import { parseAndValidateQuiz } from '@/shared/lib/quiz-validator';
import { loadSettings } from '@/shared/lib/quiz-settings-storage';
import type { QuizSettings } from '@/shared/types/quiz-settings';
import styles from './StartPage.module.css';

function formatSettingsSummary(s: QuizSettings): string {
  const timer = s.timerEnabled
    ? `Таймер: ${Math.floor(s.timeLimitSec / 60)} мин`
    : 'Таймер: выкл';
  const reveal = s.revealWhen === 'afterAnswer' ? 'после ответа' : 'в результатах';
  return `${timer} · Ответы: ${reveal}`;
}

export function StartPage() {
  const navigate = useNavigate();
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>(() => loadUserQuizzes());
  const [selectedQuizId, setSelectedQuizId] = useState(quizRegistry[0].id);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const allQuizzes = [...quizRegistry, ...userQuizzes];
  const userQuizIds = new Set(userQuizzes.map((q) => q.id));

  const handleStart = () => {
    const { timerEnabled, timeLimitSec, revealWhen, showCorrect, showWrong } = loadSettings();
    navigate({ to: '/quiz', search: { quizId: selectedQuizId, timerEnabled, timeLimitSec, revealWhen, showCorrect, showWrong } });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        const quiz = parseAndValidateQuiz(raw);
        saveUserQuiz(quiz);
        const updated = loadUserQuizzes();
        setUserQuizzes(updated);
        setSelectedQuizId(quiz.id);
        setUploadError(null);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      }
      e.target.value = '';
    };
    reader.onerror = () => {
      setUploadError('Не удалось прочитать файл');
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleDelete = (quizId: string) => {
    deleteUserQuiz(quizId);
    const updated = loadUserQuizzes();
    setUserQuizzes(updated);
    if (selectedQuizId === quizId) {
      setSelectedQuizId(quizRegistry[0].id);
    }
  };

  return (
    <div className={styles.root}>
      <Stack align="center" gap="xl" w={420}>
        <Stack align="center" gap="xs">
          <Title order={1}>Квиз</Title>
          <Text c="dimmed" size="lg" ta="center">Выбери тему и проверь свои знания</Text>
        </Stack>

        <SimpleGrid cols={2} w="100%">
          {allQuizzes.map((quiz) => {
            const isSelected = quiz.id === selectedQuizId;
            const isUserQuiz = userQuizIds.has(quiz.id);
            return (
              <UnstyledButton key={quiz.id} onClick={() => setSelectedQuizId(quiz.id)}>
                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  h="100%"
                  style={{
                    borderColor: isSelected ? 'var(--mantine-color-blue-filled)' : undefined,
                    borderWidth: isSelected ? 2 : 1,
                  }}
                >
                  <Stack gap="xs">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Text fw={600} size="sm">{quiz.title}</Text>
                      {isUserQuiz && (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          aria-label="Удалить квиз"
                          onClick={(e) => { e.stopPropagation(); handleDelete(quiz.id); }}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      )}
                    </Group>
                    {isUserQuiz && (
                      <Badge size="xs" variant="light" color="violet">Пользовательский</Badge>
                    )}
                    <Text size="xs" c="dimmed">{quiz.description}</Text>
                    <Text size="xs">{quiz.questions.length} вопросов</Text>
                  </Stack>
                </Paper>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          variant="light"
          fullWidth
          leftSection={<IconUpload size={16} />}
          onClick={() => fileInputRef.current?.click()}
        >
          Загрузить квиз из файла
        </Button>
        {uploadError && (
          <Alert color="red" title="Ошибка загрузки" w="100%" withCloseButton onClose={() => setUploadError(null)}>
            {uploadError}
          </Alert>
        )}

        <Stack gap="xs" w="100%">
          <Button size="lg" fullWidth onClick={handleStart}>
            Начать квиз
          </Button>
          <Text size="xs" c="dimmed" ta="center">
            {formatSettingsSummary(loadSettings())}
          </Text>
        </Stack>
      </Stack>
    </div>
  );
}
