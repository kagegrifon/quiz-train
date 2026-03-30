import {
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  RingProgress,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { getQuizById } from "@/entities/question";
import { MarkdownContent } from "@/shared/ui/markdown-content";
import { calcScore, calcQuestionScore } from "@/shared/lib/scoring";
import { formatTime } from "@/shared/lib/use-countdown";
import { loadAttempts } from "@/shared/lib/quiz-stats";
import type { RevealConfig } from "@/widgets/question-view";
import { QuestionView } from "@/widgets/question-view";
import styles from "./ResultsPage.module.css";

type Filter = "all" | "correct" | "incorrect";

export function ResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/results" });
  const [filter, setFilter] = useState<Filter>("all");

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
  const color = percent >= 70 ? "green" : percent >= 40 ? "yellow" : "red";

  const quizAttempts = loadAttempts().filter(
    (a) => (a.quizId ?? "js-basics") === quizId,
  );
  const lastAttempt = quizAttempts.at(-1);
  const bestPercent =
    quizAttempts.length > 0
      ? Math.max(...quizAttempts.map((a) => a.percent))
      : null;
  const avgPercent =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((s, a) => s + a.percent, 0) / quizAttempts.length,
        )
      : null;

  const visibleQuestions = questions.filter((q) => {
    if (filter === "all") return true;
    const { earned, max } = calcQuestionScore(q, answers[q.id] ?? []);
    return filter === "correct" ? earned === max : earned < max;
  });

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
              Набрано: <strong>{score}</strong> из <strong>{maxScore}</strong>{" "}
              баллов
            </Text>
            {lastAttempt && (
              <Text size="sm" c="dimmed">
                Продолжительность теста: {formatTime(lastAttempt.durationSec)}
              </Text>
            )}
            {quizAttempts.length > 0 && (
              <>
                <Divider w="100%" />
                <Stack gap="xs" align="center">
                  <Text size="sm" c="dimmed">
                    Попыток: {quizAttempts.length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Лучший результат: {bestPercent}%
                  </Text>
                  <Text size="sm" c="dimmed">
                    Средний результат: {avgPercent}%
                  </Text>
                </Stack>
              </>
            )}
            <Button onClick={() => navigate({ to: "/" })}>Начать заново</Button>
            {quizAttempts.length > 0 && (
              <Button
                variant="subtle"
                onClick={() => navigate({ to: "/stats", search: { quizId } })}
              >
                Подробная статистика
              </Button>
            )}
          </Stack>
        </Paper>

        <Stack gap="md">
          <Title order={3}>Разбор вопросов</Title>
          <div data-testid="results-filter">
            <SegmentedControl
              value={filter}
              onChange={(v) => setFilter(v as Filter)}
              data={[
                { label: "Все", value: "all" },
                { label: "Правильные", value: "correct" },
                { label: "Неправильные", value: "incorrect" },
              ]}
            />
          </div>
        </Stack>

        {visibleQuestions.length === 0 ? (
          <Text c="dimmed">Нет вопросов в этой категории</Text>
        ) : (
          visibleQuestions.map((q) => {
            const { earned, max } = calcQuestionScore(q, answers[q.id] ?? []);
            const badgeColor =
              earned === max ? "green" : earned > 0 ? "yellow" : "red";
            const questionIndex = questions.indexOf(q);
            return (
              <Paper
                key={q.id}
                shadow="xs"
                p="xl"
                radius="md"
                data-testid={`question-card-${questionIndex}`}
              >
                <Stack gap="md">
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">
                      Вопрос {questionIndex + 1}
                    </Text>
                    <Badge color={badgeColor} variant="light" size="sm">
                      {earned} / {max}
                    </Badge>
                  </Group>
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
                        <Text size="sm" fw={500} mb={4}>
                          Объяснение
                        </Text>
                        <MarkdownContent>{q.explainMd}</MarkdownContent>
                      </div>
                    </>
                  )}
                </Stack>
              </Paper>
            );
          })
        )}
      </Stack>
    </div>
  );
}
