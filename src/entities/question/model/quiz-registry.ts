import type { Quiz } from './types';
import { jsBasicsQuiz } from './quizzes/js-basics';
import { tsBasicsQuiz } from './quizzes/ts-basics';
import { loadUserQuizzes } from '@/shared/lib/user-quiz-storage';

export const quizRegistry: Quiz[] = [jsBasicsQuiz, tsBasicsQuiz];

export function getQuizById(id: string): Quiz | undefined {
  return quizRegistry.find((q) => q.id === id) ?? loadUserQuizzes().find((q) => q.id === id);
}
