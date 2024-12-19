/**
 * 에디터 관련 유틸리티 함수들을 모아둔 모듈
 * @module editorUtils
 */

/**
 * 마크다운 에디터의 실행 취소 상태를 관리하는 클래스
 * @class UndoManager
 */
export class UndoManager {
  private undoStack: { text: string; cursorPosition: number }[] = [];
  private redoStack: { text: string; cursorPosition: number }[] = [];
  private currentState: { text: string; cursorPosition: number } | null = null;

  /**
   * 현재 상태를 저장하고 실행 취소 스택에 추가
   * @param {string} text - 현재 에디터의 텍스트
   * @param {number} cursorPosition - 현재 커서 위치
   */
  saveState(text: string, cursorPosition: number) {
    if (this.currentState) {
      this.undoStack.push(this.currentState);
    }
    this.currentState = { text, cursorPosition };
    this.redoStack = [];
  }

  /**
   * 이전 상태로 되돌리기
   * @returns {{ text: string; cursorPosition: number } | null} 이전 상태 또는 null
   */
  undo(): { text: string; cursorPosition: number } | null {
    if (this.undoStack.length === 0) return null;
    const previousState = this.undoStack.pop()!;
    if (this.currentState) {
      this.redoStack.push(this.currentState);
    }
    this.currentState = previousState;
    return previousState;
  }

  /**
   * 되돌린 상태를 다시 실행
   * @returns {{ text: string; cursorPosition: number } | null} 다음 상태 또는 null
   */
  redo(): { text: string; cursorPosition: number } | null {
    if (this.redoStack.length === 0) return null;
    const nextState = this.redoStack.pop()!;
    if (this.currentState) {
      this.undoStack.push(this.currentState);
    }
    this.currentState = nextState;
    return nextState;
  }

  /**
   * 실행 취소 가능 여부 확인
   * @returns {boolean} 실행 취소 가능 여부
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * 다시 실행 가능 여부 확인
   * @returns {boolean} 다시 실행 가능 여부
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}

/**
 * 텍스트 에디터의 커서 위치를 지정된 위치로 업데이트
 * @param {HTMLTextAreaElement} textArea - 텍스트 에디터 요소
 * @param {number} position - 설정할 커서 위치
 */
export const updateCursorPosition = (
  textArea: HTMLTextAreaElement,
  position: number
) => {
  requestAnimationFrame(() => {
    if (textArea) {
      textArea.selectionStart = textArea.selectionEnd = position;
    }
  });
};

/**
 * 현재 커서 위치가 있는 라인의 텍스트를 가져오기
 * @param {string} text - 전체 텍스트
 * @param {number} cursorPosition - 현재 커서 위치
 * @returns {string} 현재 라인의 텍스트
 */
export const getCurrentLine = (
  text: string,
  cursorPosition: number
): string => {
  return text.substring(0, cursorPosition).split('\n').pop() || '';
};

/**
 * 일반 들여쓰기(2칸 공백)를 처리
 * @param {HTMLTextAreaElement} textArea - 텍스트 에디터 요소
 * @param {string} markdownText - 현재 마크다운 텍스트
 * @param {number} selectionStart - 현재 커서 위치
 * @param {function} setMarkdownText - 마크다운 텍스트 업데이트 함수
 */
export const handleNormalIndent = (
  textArea: HTMLTextAreaElement,
  markdownText: string,
  selectionStart: number,
  setMarkdownText: (text: string) => void
) => {
  const newValue =
    markdownText.substring(0, selectionStart) +
    '  ' +
    markdownText.substring(selectionStart);

  setMarkdownText(newValue);
  updateCursorPosition(textArea, selectionStart + 2);
};

/**
 * IME(입력기) 조합 상태를 관리 (한글 입력 등을 위한 처리)
 * @param {React.MutableRefObject<boolean>} isComposing - 조합 상태 ref
 * @param {boolean} value - 설정할 조합 상태 값
 */
export const handleComposition = (
  isComposing: React.MutableRefObject<boolean>,
  value: boolean
) => {
  isComposing.current = value;
};
