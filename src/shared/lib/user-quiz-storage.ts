import type { Quiz } from '@/shared/types/quiz';

const STORAGE_KEY = 'userQuizzes:v1';

export function loadUserQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Quiz[]) : [];
  } catch {
    return [];
  }
}

export function saveUserQuiz(quiz: Quiz): void {
  try {
    const quizzes = loadUserQuizzes();
    const idx = quizzes.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) {
      quizzes[idx] = quiz;
    } else {
      quizzes.push(quiz);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    // storage unavailable or quota exceeded — skip saving
  }
}

export function deleteUserQuiz(id: string): void {
  try {
    const quizzes = loadUserQuizzes().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    // ignore
  }
}
