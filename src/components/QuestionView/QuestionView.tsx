import { Checkbox, Radio, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Question } from '../../types/quiz';
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
    if (checked) {
      onChange([...selectedIds, id]);
    } else {
      onChange(selectedIds.filter((s) => s !== id));
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.prompt}>
        <ReactMarkdown
          components={{
            code({ className, children, ...rest }) {
              const match = /language-(\w+)/.exec(className || '');
              const isBlock = match !== null;
              if (isBlock) {
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
              return (
                <code className={styles.inlineCode} {...rest}>
                  {children}
                </code>
              );
            },
          }}
        >
          {question.promptMd}
        </ReactMarkdown>
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
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <span>{children}</span>,
                          code: ({ children }) => (
                            <code className={styles.inlineCode}>{children}</code>
                          ),
                        }}
                      >
                        {opt.labelMd}
                      </ReactMarkdown>
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
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      code: ({ children }) => (
                        <code className={styles.inlineCode}>{children}</code>
                      ),
                    }}
                  >
                    {opt.labelMd}
                  </ReactMarkdown>
                </Text>
              }
            />
          ))
        )}
      </Stack>
    </div>
  );
}
