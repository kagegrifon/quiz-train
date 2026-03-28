export interface QuizOption {
  id: string;
  labelMd: string;
}

export interface Question {
  id: string;
  promptMd: string;
  options: QuizOption[];
  mode: 'single' | 'multi';
  correctOptionIds: string[];
  points: number;
  explainMd?: string;
}
