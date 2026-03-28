import type { AttemptRecord } from '@/shared/types/attempt';

const STORAGE_KEY = 'programmingQuizStats:v1';

export function loadAttempts(): AttemptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as AttemptRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: AttemptRecord): void {
  try {
    const attempts = loadAttempts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...attempts, attempt]));
  } catch {
    // storage unavailable or quota exceeded — skip saving
  }
}
