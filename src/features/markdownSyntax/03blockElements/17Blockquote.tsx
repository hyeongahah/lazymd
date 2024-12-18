import { Quote } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';

interface BlockquoteButtonProps {
  onClick: () => void;
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setMarkdownText: (text: string) => void;
}

export function BlockquoteButton({
  onClick,
  textareaRef,
  setMarkdownText,
}: BlockquoteButtonProps) {
  const handleBlockquote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    // 선택된 텍스트가 있는 경우
    if (selectedText) {
      const lines = selectedText.split('\n');
      const quotedLines = lines.map((line) => `> ${line}`).join('\n');
      const newText =
        text.substring(0, start) + quotedLines + text.substring(end);
      setMarkdownText(newText);

      // 커서 위치 조정
      setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + quotedLines.length;
        textarea.focus();
      }, 0);
    } else {
      // 선택된 텍스트가 없는 경우
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = text.indexOf('\n', start);
      const currentLine = text.substring(
        lineStart,
        lineEnd === -1 ? text.length : lineEnd
      );
      const quotedLine = `> ${currentLine}`;

      const newText =
        text.substring(0, lineStart) +
        quotedLine +
        text.substring(lineEnd === -1 ? text.length : lineEnd);
      setMarkdownText(newText);

      // 커서 위치 조정
      setTimeout(() => {
        textarea.selectionStart = lineStart + quotedLine.length;
        textarea.selectionEnd = lineStart + quotedLine.length;
        textarea.focus();
      }, 0);
    }
  };

  return (
    <ToolbarButton onClick={handleBlockquote} title='Blockquote'>
      <Quote size={18} />
    </ToolbarButton>
  );
}
