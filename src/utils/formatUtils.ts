interface FormatOptions {
  markdownText: string;
  selectionStart: number;
  selectionEnd: number;
}

export const formatText = {
  bold: ({
    markdownText,
    selectionStart,
    selectionEnd,
  }: FormatOptions): string => {
    const before = markdownText.slice(0, selectionStart);
    const selection = markdownText.slice(selectionStart, selectionEnd);
    const after = markdownText.slice(selectionEnd);
    return `${before}**${selection}**${after}`;
  },
  italic: ({
    markdownText,
    selectionStart,
    selectionEnd,
  }: FormatOptions): string => {
    const before = markdownText.slice(0, selectionStart);
    const selection = markdownText.slice(selectionStart, selectionEnd);
    const after = markdownText.slice(selectionEnd);
    return `${before}*${selection}*${after}`;
  },
};

export const clearFormatting = (text: string): string => {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/~~/g, '')
    .replace(/<u>|<\/u>/g, '')
    .replace(/<mark>|<\/mark>/g, '');
};
