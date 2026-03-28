import type { AttemptRecord } from '@/shared/types/attempt';

const STORAGE_KEY = 'programmingQuizStats:v1';

export function loadAttempts(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AttemptRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: AttemptRecord): void {
  const attempts = loadAttempts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...attempts, attempt]));
}
