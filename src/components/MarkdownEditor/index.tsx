import { useMarkdown } from '@/hooks/useMarkdown';
import { Toolbar } from '@/components/Toolbar/ToolbarButton';
import styles from './styles.module.css';

export function MarkdownEditor() {
  const { text, setText } = useMarkdown();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className={styles.editorContainer}>
      <Toolbar />
      <textarea
        className={styles.editor}
        value={text}
        onChange={handleChange}
        placeholder='Write markdown here...'
        spellCheck={false}
      />
    </div>
  );
}
