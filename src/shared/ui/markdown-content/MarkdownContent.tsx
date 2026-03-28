import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './MarkdownContent.module.css';

interface Props {
  children: string;
  /** Рендерить блочные элементы как inline (для лейблов опций) */
  inline?: boolean;
}

const LANGUAGE_RE = /language-(\w+)/;

const inlineP: Components['p'] = ({ children }) => <span>{children}</span>;

export function MarkdownContent({ children, inline = false }: Props) {
  const components = useMemo<Components>(
    () => ({
      p: inline ? inlineP : undefined,
      code({ className, children: c, ...rest }) {
        const match = LANGUAGE_RE.exec(className ?? '');
        if (match) {
          return (
            <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
              {String(c).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        }
        return (
          <code className={styles.inlineCode} {...rest}>
            {c}
          </code>
        );
      },
    }),
    [inline],
  );

  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
