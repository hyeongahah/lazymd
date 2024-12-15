import { useMarkdown } from '@/hooks/useMarkdown';
import { Toolbar } from '@/components/Toolbar/ToolbarButton';
import { useRef } from 'react';
import styles from './styles.module.css';

export function MarkdownEditor() {
  const { markdownText, setMarkdownText } = useMarkdown();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const newValue =
        markdownText.substring(0, selectionStart) +
        '  ' + // 2칸 공백
        markdownText.substring(selectionEnd);

      setMarkdownText(newValue);

      // 커서 위치 조정
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <Toolbar />
      <textarea
        ref={textareaRef}
        className={styles.editor}
        value={markdownText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder='Write markdown here...'
        spellCheck={false}
      />
    </div>
  );
}
