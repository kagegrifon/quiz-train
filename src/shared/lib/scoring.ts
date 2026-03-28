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
