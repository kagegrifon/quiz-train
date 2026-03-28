import { Checkbox, Radio, Stack, Text } from '@mantine/core';
import type { Question } from '@/entities/question';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import styles from './QuestionView.module.css';

interface Props {
  question: Question;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function QuestionView({ question, selectedIds, onChange, disabled }: Props) {
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

  return (
    <div className={styles.root}>
      <div className={styles.prompt}>
        <MarkdownContent>{question.promptMd}</MarkdownContent>
      </div>

      <Stack gap="sm" className={styles.options}>
        {question.mode === 'single' ? (
          <Radio.Group value={selectedIds[0] ?? ''} onChange={handleSingleChange}>
            <Stack gap="sm">
              {question.options.map((opt) => (
                <Radio
                  key={opt.id}
                  value={opt.id}
                  disabled={disabled}
                  label={
                    <Text component="span">
                      <MarkdownContent inline>{opt.labelMd}</MarkdownContent>
                    </Text>
                  }
                />
              ))}
            </Stack>
          </Radio.Group>
        ) : (
          question.options.map((opt) => (
            <Checkbox
              key={opt.id}
              checked={selectedIds.includes(opt.id)}
              disabled={disabled}
              onChange={(e) => handleMultiChange(opt.id, e.currentTarget.checked)}
              label={
                <Text component="span">
                  <MarkdownContent inline>{opt.labelMd}</MarkdownContent>
                </Text>
              }
            />
          ))
        )}
      </Stack>
    </div>
  );
}
