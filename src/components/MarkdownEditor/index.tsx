import { useMarkdown } from '@/hooks/useMarkdown';
import { Toolbar } from '@/components/Toolbar/ToolbarButton';
import { useRef, useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useUndo } from '@/features/markdownSyntax/09simpleEdit/31undo';
import { getCurrentLine } from '@/utils/editorUtils';
import { handleNormalIndent, handleComposition } from '@/utils/editorUtils';
import { handleUndoKeyPress } from '@/features/markdownSyntax/09simpleEdit/31undo';
import {
  handleHeaders,
  handleUnorderedList,
  handleOrderedList,
  handleTaskList,
} from '@/features/markdownSyntax';
import { autoSave, loadAutoSavedContent } from '@/utils/autoSaveUtils';

export function MarkdownEditor() {
  const { markdownText, setMarkdownText } = useMarkdown();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { undoManager } = useUndo();
  const isComposing = useRef(false);
  const [currentLine, setCurrentLine] = useState(1);

  // 컴포넌트 마운트 시 저장된 내용 불러오기
  useEffect(() => {
    const savedContent = loadAutoSavedContent();
    if (savedContent) {
      setMarkdownText(savedContent);
    }
  }, []);

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

      // 반 텍스트 들여쓰기 처리
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

    // 자동 저장 트리거
    autoSave(newText);
  };

  // 한글 입력 관련 핸들러
  const handleCompositionStart = () => handleComposition(isComposing, true);
  const handleCompositionEnd = () => handleComposition(isComposing, false);

  // 커서 위치 변경 감지 핸들러 추가
  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const currentLineNumber = textBeforeCursor.split('\n').length;
    setCurrentLine(currentLineNumber);
  };

  return (
    <div className={styles.editorContainer}>
      <Toolbar undoManager={undoManager} textareaRef={textareaRef} />
      <div className={styles.editorContent}>
        <div className={styles.lineNumbers}>
          {markdownText.split('\n').map((_, index) => (
            <div
              key={index}
              className={`${styles.lineNumber} ${
                currentLine === index + 1 ? styles.active : ''
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className={styles.editorWrapper}>
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
            onSelect={handleCursorChange} // 커서 변경 감지
            onClick={handleCursorChange} // 클릭으로 인한 커서 변경 감지
            onKeyUp={handleCursorChange} // 키보드로 인한 커서 변경 감지
          />
        </div>
      </div>
    </div>
  );
}
