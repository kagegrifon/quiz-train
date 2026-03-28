import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './MarkdownContent.module.css';

interface Props {
  children: string;
  /** Render block-level elements inline (для лейблов опций) */
  inline?: boolean;
}

export function MarkdownContent({ children, inline = false }: Props) {
  return (
    <ReactMarkdown
      components={{
        p: inline ? ({ children: c }) => <span>{c}</span> : undefined,
        code({ className, children: c, ...rest }) {
          const match = /language-(\w+)/.exec(className || '');
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
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
