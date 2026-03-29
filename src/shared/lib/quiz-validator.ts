import { hashString } from './hash';
import type { Quiz, Question, QuizOption } from '@/shared/types/quiz';

export function parseAndValidateQuiz(raw: unknown): Quiz {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('Файл не содержит JSON-объект');
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.title !== 'string' || obj.title.trim() === '') {
    throw new Error('Отсутствует или пустое поле title');
  }

  if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
    throw new Error('Поле questions должно быть непустым массивом');
  }

  const questions: Question[] = (obj.questions as unknown[]).map((q, i) => {
    const n = i + 1;

    if (typeof q !== 'object' || q === null) {
      throw new Error(`Вопрос ${n}: ожидается объект`);
    }

    const qObj = q as Record<string, unknown>;

    if (typeof qObj.promptMd !== 'string' || qObj.promptMd.trim() === '') {
      throw new Error(`Вопрос ${n}: отсутствует поле promptMd`);
    }

    if (qObj.mode !== 'single' && qObj.mode !== 'multi') {
      throw new Error(`Вопрос ${n}: недопустимое значение mode (ожидается "single" или "multi")`);
    }

    if (!Array.isArray(qObj.options) || qObj.options.length === 0) {
      throw new Error(`Вопрос ${n}: отсутствует поле options`);
    }

    const options: QuizOption[] = (qObj.options as unknown[]).map((opt, j) => {
      if (typeof opt !== 'object' || opt === null) {
        throw new Error(`Вопрос ${n}, вариант ${j + 1}: ожидается объект`);
      }
      const o = opt as Record<string, unknown>;
      if (typeof o.id !== 'string' || o.id.trim() === '') {
        throw new Error(`Вопрос ${n}, вариант ${j + 1}: отсутствует поле id`);
      }
      if (typeof o.labelMd !== 'string') {
        throw new Error(`Вопрос ${n}, вариант ${j + 1}: отсутствует поле labelMd`);
      }
      return { id: o.id, labelMd: o.labelMd };
    });

    if (!Array.isArray(qObj.correctOptionIds) || qObj.correctOptionIds.length === 0) {
      throw new Error(`Вопрос ${n}: отсутствует поле correctOptionIds`);
    }

    const optionIds = new Set(options.map((o) => o.id));
    for (const cid of qObj.correctOptionIds as unknown[]) {
      if (typeof cid !== 'string' || !optionIds.has(cid)) {
        throw new Error(`Вопрос ${n}: correctOptionIds содержит несуществующий id "${String(cid)}"`);
      }
    }

    return {
      id: typeof qObj.id === 'string' && qObj.id.trim() !== '' ? qObj.id : `q${n}`,
      promptMd: qObj.promptMd,
      mode: qObj.mode as 'single' | 'multi',
      options,
      correctOptionIds: qObj.correctOptionIds as string[],
      points: typeof qObj.points === 'number' && qObj.points > 0 ? qObj.points : 1,
      ...(typeof qObj.explainMd === 'string' ? { explainMd: qObj.explainMd } : {}),
    };
  });

  const title = obj.title as string;
  const description = typeof obj.description === 'string' ? obj.description : '';

  // ID derived from content (title + questions structure), not from file
  const contentKey = title + JSON.stringify(
    questions.map((q) => ({ promptMd: q.promptMd, options: q.options, correctOptionIds: q.correctOptionIds })),
  );
  const id = `user-${hashString(contentKey)}`;

  return { id, title, description, questions };
}
