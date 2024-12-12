import { useCallback } from 'react';
import { Redo2 } from 'lucide-react';

interface RedoProps {
  historyIndex: number;
  history: string[];
  setHistoryIndex: (index: number) => void;
  setMarkdownText: (text: string) => void;
}

export const Redo = ({
  historyIndex,
  history,
  setHistoryIndex,
  setMarkdownText,
}: RedoProps) => {
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMarkdownText(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  return <Redo2 size={18} onClick={handleRedo} />;
};
