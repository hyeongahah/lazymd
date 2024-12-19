import { RotateCw } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import React from 'react';
import { useUndoStore } from './31undo';

export function RedoButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick} title='Redo'>
      <RotateCw size={18} />
    </ToolbarButton>
  );
}

export class RedoManager {
  constructor(private setMarkdownText: (text: string) => void) {}

  public redo(textArea: HTMLTextAreaElement | null) {
    if (!textArea) return;

    const store = useUndoStore.getState();
    const { undoStack, redoStack, currentLine } = store;

    if (redoStack.length === 0) return;

    if (currentLine) return;

    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();

    if (nextState) {
      this.setMarkdownText(nextState.content);
      textArea.selectionStart = nextState.cursorPosition;
      textArea.selectionEnd = nextState.cursorPosition;
      textArea.focus();

      useUndoStore.setState({
        redoStack: newRedoStack,
        undoStack: [...undoStack, nextState],
        currentLine: '',
      });
    }
  }

  public canRedo(): boolean {
    const store = useUndoStore.getState();
    return store.redoStack.length > 0 && !store.currentLine;
  }
}

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
