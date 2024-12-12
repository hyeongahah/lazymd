import React from 'react';
import styles from '@/app/page.module.css';
import {
  ClearFormatting,
  Undo,
  Redo,
  HeadingDropdown,
  Bold,
  Italic,
  Strike,
  Underline,
  Highlight,
} from '@/features/mdTool';

interface ToolbarButtonProps {
  index: number;
  isCursorBold: boolean;
  isCursorItalic: boolean;
  isCursorStrike: boolean;
  isCursorUnderline: boolean;
  isCursorHighlight: boolean;
  markdownText: string;
  setMarkdownText: (text: string) => void;
  history: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
}

export const ToolbarButton = ({
  index,
  isCursorBold,
  isCursorItalic,
  isCursorStrike,
  isCursorUnderline,
  isCursorHighlight,
  markdownText,
  setMarkdownText,
  history,
  historyIndex,
  setHistoryIndex,
}: ToolbarButtonProps) => {
  const getIcon = () => {
    const props = {
      markdownText,
      setMarkdownText,
      history,
      historyIndex,
      setHistoryIndex,
    };

    switch (index) {
      case 0:
        return <Undo {...props} />;
      case 1:
        return <Redo {...props} />;
      case 2:
        return <ClearFormatting {...props} />;
      case 3:
        return <HeadingDropdown {...props} />;
      case 4:
        return <Bold {...props} />;
      case 5:
        return <Italic {...props} />;
      case 6:
        return <Strike {...props} />;
      case 7:
        return <Underline {...props} />;
      case 8:
        return <Highlight {...props} />;
      default:
        return index + 1;
    }
  };

  const getBackgroundColor = () => {
    if (
      (index === 4 && isCursorBold) ||
      (index === 5 && isCursorItalic) ||
      (index === 6 && isCursorStrike) ||
      (index === 7 && isCursorUnderline) ||
      (index === 8 && isCursorHighlight)
    ) {
      return '#1E90FF';
    }
    return 'var(--background-color)';
  };

  return (
    <div
      className={styles.toolbarButton}
      style={{
        backgroundColor: getBackgroundColor(),
        color:
          getBackgroundColor() === '#1E90FF' ? 'white' : 'var(--text-color)',
      }}
    >
      {getIcon()}
    </div>
  );
};
