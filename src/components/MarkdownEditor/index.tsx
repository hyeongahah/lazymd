import { useMarkdown } from '@/hooks/useMarkdown';
import { Toolbar } from '@/components/Toolbar/ToolbarButton';
import styles from './styles.module.css';

export function MarkdownEditor() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  return (
    <div className={styles.editorContainer}>
      <Toolbar />
      <textarea
        className={styles.editor}
        value={markdownText}
        onChange={handleChange}
        placeholder='Write markdown here...'
        spellCheck={false}
      />
    </div>
  );
}
