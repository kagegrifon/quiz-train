import type { Question } from '@/entities/question';

export function calcScore(
  questions: Question[],
  answers: Record<string, string[]>,
): { score: number; maxScore: number } {
  let score = 0;
  let maxScore = 0;

  for (const q of questions) {
    maxScore += q.points;
    const selected = answers[q.id] ?? [];

    if (q.mode === 'single') {
      if (selected.length === 1 && selected[0] === q.correctOptionIds[0]) {
        score += q.points;
      }
    } else {
      const correctSelected = selected.filter((id) =>
        q.correctOptionIds.includes(id),
      ).length;
      score += q.points * (correctSelected / q.correctOptionIds.length);
    }
  }

  return { score: Math.round(score), maxScore };
}

export function calcQuestionScore(
  question: Question,
  selected: string[],
): { earned: number; max: number } {
  const max = question.points;
  if (question.mode === 'single') {
    const earned =
      selected.length === 1 && selected[0] === question.correctOptionIds[0] ? max : 0;
    return { earned, max };
  }
  const correctSelected = selected.filter((id) =>
    question.correctOptionIds.includes(id),
  ).length;
  return {
    earned: Math.round(max * (correctSelected / question.correctOptionIds.length)),
    max,
  };
}
