import type { QuizSettings } from '@/shared/types/quiz-settings';

const SETTINGS_KEY = 'quizDefaults:v1';

export const DEFAULT_SETTINGS: QuizSettings = {
  timerEnabled: false,
  timeLimitSec: 120,
  revealWhen: 'onFinish',
  showCorrect: true,
  showWrong: true,
};

export function loadSettings(): QuizSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: QuizSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // storage unavailable or quota exceeded — skip saving
  }
}
