import { useCallback } from 'react';
import { Undo2 } from 'lucide-react';

interface UndoProps {
  historyIndex: number;
  history: string[];
  setHistoryIndex: (index: number) => void;
  setMarkdownText: (text: string) => void;
}

export const Undo = ({
  historyIndex,
  history,
  setHistoryIndex,
  setMarkdownText,
}: UndoProps) => {
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMarkdownText(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  return <Undo2 size={18} onClick={handleUndo} />;
};
