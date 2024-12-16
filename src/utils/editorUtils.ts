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

export const getCurrentLine = (
  text: string,
  cursorPosition: number
): string => {
  return text.substring(0, cursorPosition).split('\n').pop() || '';
};

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

export const handleComposition = (
  isComposing: React.MutableRefObject<boolean>,
  value: boolean
) => {
  isComposing.current = value;
};
