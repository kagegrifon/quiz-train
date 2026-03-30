import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';

SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
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
      ...(inline ? { p: inlineP } : {}),
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
