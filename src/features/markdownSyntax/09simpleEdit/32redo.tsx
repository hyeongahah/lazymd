import { RotateCw } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';
import { useUndoStore } from './31undo';

export function RedoButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Redo (Ctrl+Y)'>
      <RotateCw size={18} />
    </ToolbarButton>
  );
}

// Redo 관련 기능 추가
export class RedoManager {
  constructor(private setMarkdownText: (text: string) => void) {}

  public redo(textArea: HTMLTextAreaElement | null) {
    if (!textArea) return;

    const store = useUndoStore.getState();
    const { undoStack, redoStack } = store;

    if (redoStack.length === 0) return;

    // redo 스택에서 상태 복원
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();

    if (nextState) {
      this.setMarkdownText(nextState.content);
      textArea.selectionStart = nextState.cursorPosition;
      textArea.selectionEnd = nextState.cursorPosition;
      textArea.focus();

      // 복원된 상태를 undo 스택에 추가
      useUndoStore.setState({
        redoStack: newRedoStack,
        undoStack: [...undoStack, nextState],
      });
    }
  }

  public canRedo(): boolean {
    const store = useUndoStore.getState();
    return store.redoStack.length > 0;
  }
}

// Ctrl+Y 단축키 처리
export const handleRedoKeyPress = (
  e: KeyboardEvent,
  textArea: HTMLTextAreaElement | null,
  redoManager: RedoManager
) => {
  if (e.ctrlKey && e.key === 'y') {
    e.preventDefault();
    redoManager.redo(textArea);
  }
};
