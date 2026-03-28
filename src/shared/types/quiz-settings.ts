export interface QuizSettings {
  timerEnabled: boolean;
  timeLimitSec: number;
  revealWhen: 'onFinish' | 'afterAnswer';
  showCorrect: boolean;
  showWrong: boolean;
}
