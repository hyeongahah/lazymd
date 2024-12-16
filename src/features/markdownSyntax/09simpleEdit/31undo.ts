import { create } from 'zustand';
import { useMarkdown } from '@/hooks/useMarkdown';

interface UndoState {
  content: string;
  cursorPosition: number;
}

interface UndoStore {
  undoStack: UndoState[];
  currentLine: string; // 현재 작성 중인 줄
  pushState: (state: UndoState) => void;
  setCurrentLine: (line: string) => void;
}

const useUndoStore = create<UndoStore>((set) => ({
  undoStack: [{ content: '', cursorPosition: 0 }],
  currentLine: '',
  pushState: (state) =>
    set((store) => {
      // 엔터키가 눌렸을 때만 스택에 저장
      if (state.content.endsWith('\n')) {
        return {
          undoStack: [...store.undoStack, state],
          currentLine: '',
        };
      }
      // 엔터키가 아닌 경우 현재 줄 업데이트
      return {
        ...store,
        currentLine: state.content,
      };
    }),
  setCurrentLine: (line) => set({ currentLine: line }),
}));

export class UndoManager {
  constructor(private setMarkdownText: (text: string) => void) {}

  public saveState(content: string, cursorPosition: number) {
    const store = useUndoStore.getState();

    // 현재 줄과 이전 줄들을 구분
    const lines = content.split('\n');
    const currentLine = lines[lines.length - 1];
    const previousLines = lines.slice(0, -1).join('\n');

    // 엔터키가 눌렸을 때
    if (content.endsWith('\n')) {
      store.pushState({ content, cursorPosition });
    } else {
      // 현재 작성 중인 줄 업데이트
      store.setCurrentLine(currentLine);
    }
  }

  public undo(textArea: HTMLTextAreaElement | null) {
    if (!textArea) return;

    const store = useUndoStore.getState();
    const { undoStack, currentLine } = store;

    // 스택이 비어있으면 리턴
    if (undoStack.length <= 1) return;

    // 현재 작성 중인 줄이 있으면 그 줄부터 제거
    if (currentLine) {
      const lines = textArea.value.split('\n');
      const content = lines.slice(0, -1).join('\n') + '\n';
      this.setMarkdownText(content);
      store.setCurrentLine('');
      return;
    }

    // 이전 상태로 복원
    const newStack = [...undoStack];
    newStack.pop(); // 현재 상태 제거
    const previousState = newStack[newStack.length - 1];

    if (previousState) {
      this.setMarkdownText(previousState.content);
      textArea.selectionStart = previousState.cursorPosition;
      textArea.selectionEnd = previousState.cursorPosition;
      textArea.focus();

      useUndoStore.setState({ undoStack: newStack });
    }
  }

  public canUndo(): boolean {
    const store = useUndoStore.getState();
    return store.undoStack.length > 1 || !!store.currentLine;
  }
}

export const useUndo = () => {
  const { setMarkdownText } = useMarkdown();
  const undoManager = new UndoManager(setMarkdownText);
  return { undoManager };
};
