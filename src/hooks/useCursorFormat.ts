import { useState, useCallback } from 'react';
import { checkFormatAtCursor } from '@/components/Util/textUtils';

export const useCursorFormat = (markdownText: string) => {
  const [cursorFormats, setCursorFormats] = useState({
    isBold: false,
    isItalic: false,
    isStrike: false,
    isUnderline: false,
    isHighlight: false,
  });

  const handleCursorChange = useCallback(
    (cursorPosition: number) => {
      setCursorFormats(checkFormatAtCursor(markdownText, cursorPosition));
    },
    [markdownText]
  );

  return { cursorFormats, handleCursorChange };
};
