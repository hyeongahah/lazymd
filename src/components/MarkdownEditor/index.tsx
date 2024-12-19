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
  const [lineCount, setLineCount] = useState(1);
  const [currentLineNumber, setCurrentLineNumber] = useState(1);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { undoManager } = useUndo();
  const isComposing = useRef(false);

  useEffect(() => {
    // 텍스트 변경시 라인 수 계산
    const lines = markdownText.split('\n').length;
    setLineCount(lines);
  }, [markdownText]);

  const getCurrentLineNumber = (textarea: HTMLTextAreaElement) => {
    const text = textarea.value;
    const cursorPosition = textarea.selectionStart;
    return text.substring(0, cursorPosition).split('\n').length;
  };

  const renderLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, i) => (
      <div
        key={i + 1}
        className={`${styles.lineNumber} ${
          i + 1 === currentLineNumber ? styles.currentLine : ''
        }`}
      >
        {i + 1}
      </div>
    ));
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const lineNumbers = document.querySelector(`.${styles.lineNumbers}`);
    if (lineNumbers) {
      lineNumbers.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleCursorChange = () => {
    if (editorRef.current) {
      setCurrentLineNumber(getCurrentLineNumber(editorRef.current));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdownText(newText);
    undoManager.saveState(newText, e.target.selectionStart);
    autoSave(newText);
  };

  // 키 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing.current && e.key === 'Enter') return;
    if (e.key === 'Tab') e.preventDefault();

    handleUndoKeyPress(e.nativeEvent, editorRef.current, undoManager);

    if (e.key === 'Tab' || e.key === 'Enter') {
      const { selectionStart } = e.currentTarget;
      const currentLine = getCurrentLine(markdownText, selectionStart);

      if (
        handleOrderedList(
          currentLine,
          selectionStart,
          e.key === 'Tab',
          markdownText,
          setMarkdownText,
          editorRef.current!
        )
      ) {
        e.preventDefault();
        return;
      }

      if (
        handleUnorderedList(
          currentLine,
          selectionStart,
          e.key === 'Tab',
          markdownText,
          setMarkdownText,
          editorRef.current!
        )
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === 'Tab') {
        handleNormalIndent(
          editorRef.current!,
          markdownText,
          selectionStart,
          setMarkdownText
        );
      }
    }
  };

  // 한글 입력 관련 핸들러
  const handleCompositionStart = () => handleComposition(isComposing, true);
  const handleCompositionEnd = () => handleComposition(isComposing, false);

  return (
    <div className={styles.editorContainer}>
      <Toolbar undoManager={undoManager} textareaRef={editorRef} />
      <div className={styles.editorContent}>
        <div className={styles.lineNumbers}>{renderLineNumbers()}</div>
        <div className={styles.editorWrapper}>
          <textarea
            ref={editorRef}
            className={styles.editor}
            value={markdownText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleCursorChange}
            onClick={handleCursorChange}
            onSelect={handleCursorChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder='Write markdown here...'
            spellCheck={false}
            onScroll={handleScroll}
          />
        </div>
      </div>
    </div>
  );
}
