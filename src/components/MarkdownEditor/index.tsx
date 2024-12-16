import { useMarkdown } from '@/hooks/useMarkdown';
import { Toolbar } from '@/components/Toolbar/ToolbarButton';
import { useRef } from 'react';
import styles from './styles.module.css';
import { useUndo } from '@/features/markdownSyntax/09simpleEdit/31undo';
import { handleUnorderedList } from '@/features/markdownSyntax/01basicSyntax/07UnorderedList';
import { handleOrderedList } from '@/features/markdownSyntax/01basicSyntax/08OrderedList';
import { getCurrentLine } from '@/utils/editorUtils';
import { handleNormalIndent, handleComposition } from '@/utils/editorUtils';
import { handleUndoKeyPress } from '@/features/markdownSyntax/09simpleEdit/31undo';

export function MarkdownEditor() {
  const { markdownText, setMarkdownText } = useMarkdown();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { undoManager } = useUndo();
  const isComposing = useRef(false);

  // 키 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing.current && e.key === 'Enter') return;
    if (e.key === 'Tab') e.preventDefault();

    // Undo 단축키 처리
    handleUndoKeyPress(e.nativeEvent, textareaRef.current, undoManager);

    if (e.key === 'Tab' || e.key === 'Enter') {
      const { selectionStart } = e.currentTarget;
      const currentLine = getCurrentLine(markdownText, selectionStart);

      // 순서 있는 리스트 처리 시도
      if (
        handleOrderedList(
          currentLine,
          selectionStart,
          e.key === 'Tab',
          markdownText,
          setMarkdownText,
          textareaRef.current!
        )
      )
        return;

      // 순서 없는 리스트 처리 시도
      if (
        handleUnorderedList(
          currentLine,
          selectionStart,
          e.key === 'Tab',
          markdownText,
          setMarkdownText,
          textareaRef.current!
        )
      )
        return;

      // 일반 텍스트 들여쓰기 처리
      if (e.key === 'Tab') {
        handleNormalIndent(
          textareaRef.current!,
          markdownText,
          selectionStart,
          setMarkdownText
        );
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdownText(newText);
    undoManager.saveState(newText, e.target.selectionStart);
  };

  // 한글 입력 관련 핸들러
  const handleCompositionStart = () => handleComposition(isComposing, true);
  const handleCompositionEnd = () => handleComposition(isComposing, false);

  return (
    <div className={styles.editorContainer}>
      <Toolbar undoManager={undoManager} textareaRef={textareaRef} />
      <textarea
        ref={textareaRef}
        className={styles.editor}
        value={markdownText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder='Write markdown here...'
        spellCheck={false}
      />
    </div>
  );
}
