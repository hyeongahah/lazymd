import { useMarkdown } from '@/hooks/useMarkdown';
import { Toolbar } from '@/components/Toolbar/ToolbarButton';
import { useRef } from 'react';
import styles from './styles.module.css';
import { useUndo } from '@/features/markdownSyntax/09simpleEdit/31undo';

export function MarkdownEditor() {
  const { markdownText, setMarkdownText } = useMarkdown();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { undoManager } = useUndo();
  const isComposing = useRef(false);

  const updateCursorPosition = (position: number) => {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          position;
      }
    });
  };

  const getListMarker = (level: number, index: number = 1): string => {
    switch (level) {
      case 0: // 최상위: 숫자
        return `${index}. `;
      case 1: // 1단계 하위: 로마 대문자
        return `${toRomanUpper(index)}. `;
      case 2: // 2단계 하위: 알파벳 대문자
        return `${String.fromCharCode(64 + index)}. `;
      case 3: // 3단계 하위: 로마 소문자
        return `${toRomanLower(index)}. `;
      case 4: // 4단계 하위: 알파벳 소문자
        return `${String.fromCharCode(96 + index)}. `;
      default:
        return `${index}. `;
    }
  };

  // 로마 숫자 변환 함수
  const toRomanUpper = (num: number): string => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return roman[num - 1] || String(num);
  };

  const toRomanLower = (num: number): string => {
    return toRomanUpper(num).toLowerCase();
  };

  // 순서 있는 리스트 핸들러
  const handleOrderedList = (
    currentLine: string,
    selectionStart: number,
    isTab: boolean
  ) => {
    const orderedMatch = currentLine.match(
      /^(\s*)([0-9]+|[IVXLCDM]+|[A-Z]|[a-z])\.\s*(.*)$/
    );
    if (!orderedMatch) return false;

    const [, indent, marker, text] = orderedMatch;
    const indentLevel = indent.length / 2;

    if (isTab) {
      // 탭 키 처리: 들여쓰기 및 마커 스타일 변경
      const newIndent = '  '.repeat(indentLevel + 1);
      const newMarker = getListMarker(indentLevel + 1, 1);

      const lineStart = selectionStart - currentLine.length;
      const newValue =
        markdownText.substring(0, lineStart) +
        newIndent +
        newMarker +
        text +
        markdownText.substring(selectionStart);

      setMarkdownText(newValue);
      updateCursorPosition(
        lineStart + newIndent.length + newMarker.length + text.length
      );
    } else {
      // 엔터 키 처리
      if (!text.trim()) {
        // 빈 항목이면 리스트 종료
        const lineStart = selectionStart - currentLine.length;
        const newValue = markdownText.slice(0, lineStart) + '\n';
        setMarkdownText(newValue);
        updateCursorPosition(lineStart + 1);
      } else {
        // 다음 항목 추가 (현재 레벨의 마커 스타일 유지)
        const nextMarker = getListMarker(indentLevel, getNextIndex(marker));
        const insertion = `\n${indent}${nextMarker}`;
        const newValue =
          markdownText.slice(0, selectionStart) +
          insertion +
          markdownText.slice(selectionStart);

        setMarkdownText(newValue);
        updateCursorPosition(selectionStart + insertion.length);
      }
    }
    return true;
  };

  // 현재 마커의 다음 인덱스를 계산하는 함수
  const getNextIndex = (marker: string): number => {
    if (/^\d+$/.test(marker)) {
      return parseInt(marker) + 1;
    }
    if (/^[IVXLCDM]+$/.test(marker)) {
      const romanNums = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
      ];
      const currentIndex = romanNums.indexOf(marker);
      return currentIndex + 2; // 1-based index
    }
    if (/^[A-Z]$/.test(marker)) {
      return marker.charCodeAt(0) - 64 + 1;
    }
    if (/^[a-z]$/.test(marker)) {
      return marker.charCodeAt(0) - 96 + 1;
    }
    return 1;
  };

  // 순서 없는 리스트 핸들러
  const handleUnorderedList = (
    currentLine: string,
    selectionStart: number,
    isTab: boolean
  ) => {
    const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s*(.*)$/);
    if (!unorderedMatch) return false;

    const [, indent, marker, text] = unorderedMatch;

    if (isTab) {
      // 탭 키 처리: 들여쓰기만
      const newIndent = indent + '  ';
      const lineStart = selectionStart - currentLine.length;
      const newValue =
        markdownText.substring(0, lineStart) +
        newIndent +
        marker +
        ' ' +
        text +
        markdownText.substring(selectionStart);

      setMarkdownText(newValue);
      updateCursorPosition(
        lineStart + newIndent.length + marker.length + 1 + text.length
      );
    } else {
      // 엔터 키 처리
      if (!text.trim()) {
        // 빈 항목이면 리스트 종료
        const lineStart = selectionStart - currentLine.length;
        const newValue = markdownText.substring(0, lineStart) + '\n';
        setMarkdownText(newValue);
        updateCursorPosition(lineStart + 1);
      } else {
        // 같은 마커로 계속
        const insertion = `\n${indent}${marker} `;
        const newValue =
          markdownText.substring(0, selectionStart) +
          insertion +
          markdownText.substring(selectionStart);

        setMarkdownText(newValue);
        updateCursorPosition(selectionStart + insertion.length);
      }
    }
    return true;
  };

  // 키 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing.current && e.key === 'Enter') {
      return;
    }

    // 탭 키의 기본 동작을 먼저 막음
    if (e.key === 'Tab') {
      e.preventDefault();
    }

    if (e.key === 'Tab' || e.key === 'Enter') {
      const { selectionStart } = e.currentTarget;
      const currentLine =
        markdownText.substring(0, selectionStart).split('\n').pop() || '';

      // 순서 있는 리스트 처리 시도
      if (handleOrderedList(currentLine, selectionStart, e.key === 'Tab'))
        return;

      // 순서 없는 리스트 처리 시도
      if (handleUnorderedList(currentLine, selectionStart, e.key === 'Tab'))
        return;

      // 리스트가 아닌 경우의 처리
      if (e.key === 'Enter') {
        return; // 엔터는 기본 동작 허용
      } else if (e.key === 'Tab') {
        // 일반 텍스트에서 탭 키를 누르면 2칸 들여쓰기
        const newValue =
          markdownText.substring(0, selectionStart) +
          '  ' +
          markdownText.substring(selectionStart);

        setMarkdownText(newValue);
        updateCursorPosition(selectionStart + 2);
      }
    }

    // Ctrl + Z: Undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoManager.undo(textareaRef.current);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdownText(newText);
    undoManager.saveState(newText, e.target.selectionStart);
  };

  // 한글 입력 시작
  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  // 한글 입력 완료
  const handleCompositionEnd = () => {
    isComposing.current = false;
  };

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
