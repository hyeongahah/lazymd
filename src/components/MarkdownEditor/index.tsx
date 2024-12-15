import { useMarkdown } from '@/hooks/useMarkdown';
import { Toolbar } from '@/components/Toolbar/ToolbarButton';
import { useRef } from 'react';
import styles from './styles.module.css';

export function MarkdownEditor() {
  const { markdownText, setMarkdownText } = useMarkdown();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const newValue =
        markdownText.substring(0, selectionStart) +
        '  ' +
        markdownText.substring(selectionEnd);

      setMarkdownText(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      const { selectionStart } = e.currentTarget;
      const currentLine =
        markdownText.substring(0, selectionStart).split('\n').pop() || '';

      // 순서 있는 리스트 매칭
      const orderedMatch = currentLine.match(/^(\d+)\.\s*(.*)$/);
      if (orderedMatch) {
        e.preventDefault();
        const [, num, text] = orderedMatch;

        // 빈 항목이면 리스트 종료
        if (!text.trim()) {
          const newValue =
            markdownText.substring(0, selectionStart - currentLine.length) +
            '\n' +
            markdownText.substring(selectionStart);
          setMarkdownText(newValue);
          return;
        }

        // 텍스트가 있는 경우에만 다음 번호 추가
        const nextNum = parseInt(num) + 1;
        const insertion = `\n${nextNum}. `;
        const newValue =
          markdownText.substring(0, selectionStart) +
          insertion +
          markdownText.substring(selectionStart);

        setMarkdownText(newValue);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd =
                selectionStart + insertion.length;
          }
        }, 0);
        return;
      }

      // 순서 없는 리스트 매칭
      const unorderedMatch = currentLine.match(/^([-*+])\s*(.*)$/);
      if (unorderedMatch) {
        e.preventDefault();
        const [, marker, text] = unorderedMatch;

        // 현재 줄이 마커만 있거나 빈 텍스트인 경우
        if (!text || !text.trim()) {
          // 리스트 종료 및 새 줄로 이동
          const newValue =
            markdownText.substring(0, selectionStart - currentLine.length) +
            '\n';
          setMarkdownText(newValue);

          // 커서 위치 즉시 업데이트
          requestAnimationFrame(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart =
                textareaRef.current.selectionEnd =
                  selectionStart - currentLine.length + 1;
            }
          });
          return;
        }

        // 텍스트가 있는 경우 새로운 리스트 항목 추가
        const insertion = `\n${marker} `;
        const newValue =
          markdownText.substring(0, selectionStart) +
          insertion +
          markdownText.substring(selectionStart);

        setMarkdownText(newValue);

        // 커서 위치 업데이트
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd =
                selectionStart + insertion.length;
          }
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
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
