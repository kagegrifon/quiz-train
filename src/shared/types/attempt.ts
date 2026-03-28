export interface AttemptRecord {
  quizId: string;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  score: number;
  maxScore: number;
  percent: number;
  settingsSnapshot: {
    timerEnabled: boolean;
    timeLimitSec: number;
    revealWhen: 'onFinish' | 'afterAnswer';
    showCorrect: boolean;
    showWrong: boolean;
  };
}
