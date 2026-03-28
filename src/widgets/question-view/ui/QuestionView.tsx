import { Checkbox, Radio, Stack } from '@mantine/core';
import type { Question } from '@/entities/question';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import styles from './QuestionView.module.css';

export interface RevealConfig {
  showCorrect: boolean;
  showWrong: boolean;
}

type OptionStatus = 'correct' | 'wrong' | 'default';

function getOptionStatus(
  optId: string,
  correctIds: string[],
  selectedIds: string[],
  config: RevealConfig,
): OptionStatus {
  const isCorrect = correctIds.includes(optId);
  const isSelected = selectedIds.includes(optId);
  if (config.showCorrect && isCorrect) return 'correct';
  if (config.showWrong && isSelected && !isCorrect) return 'wrong';
  return 'default';
}

interface Props {
  question: Question;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  revealConfig?: RevealConfig;
}

export function QuestionView({ question, selectedIds, onChange, disabled, revealConfig }: Props) {
  const handleSingleChange = (id: string) => {
    if (!disabled) onChange([id]);
  };

  const handleMultiChange = (id: string, checked: boolean) => {
    if (disabled) return;
    onChange(
      checked
        ? [...selectedIds, id]
        : selectedIds.filter((s) => s !== id),
    );
  };

  const optionClass = (optId: string) => {
    if (!revealConfig) return styles.option;
    const status = getOptionStatus(optId, question.correctOptionIds, selectedIds, revealConfig);
    if (status === 'correct') return `${styles.option} ${styles.optionCorrect}`;
    if (status === 'wrong') return `${styles.option} ${styles.optionWrong}`;
    return styles.option;
  };

  return (
    <div className={styles.root}>
      <div className={styles.prompt}>
        <MarkdownContent>{question.promptMd}</MarkdownContent>
      </div>

      <Stack gap="sm" className={styles.options}>
        {question.mode === 'single' ? (
          <Radio.Group value={selectedIds[0] ?? ''} onChange={handleSingleChange}>
            <Stack gap="xs">
              {question.options.map((opt) => (
                <div key={opt.id} className={optionClass(opt.id)}>
                  <Radio
                    value={opt.id}
                    disabled={disabled}
                    label={<MarkdownContent inline>{opt.labelMd}</MarkdownContent>}
                  />
                </div>
              ))}
            </Stack>
          </Radio.Group>
        ) : (
          <Stack gap="xs">
            {question.options.map((opt) => (
              <div key={opt.id} className={optionClass(opt.id)}>
                <Checkbox
                  checked={selectedIds.includes(opt.id)}
                  disabled={disabled}
                  onChange={(e) => handleMultiChange(opt.id, e.currentTarget.checked)}
                  label={<MarkdownContent inline>{opt.labelMd}</MarkdownContent>}
                />
              </div>
            ))}
          </Stack>
        )}
      </Stack>
    </div>
  );
}
