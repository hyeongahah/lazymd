import { Code } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 인라인 코드 처리 핸들러
export const handleInlineCode = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  // 현재 선택 영역이 인라인 코드인지 확인
  const textBefore = markdownText.substring(0, start);
  const textAfter = markdownText.substring(end);
  const startIndex = textBefore.lastIndexOf('`');
  const endIndex = textAfter.indexOf('`');

  if (startIndex !== -1 && endIndex !== -1) {
    // 인라인 코드 제거
    const textWithoutCode =
      markdownText.substring(0, startIndex) +
      markdownText.substring(startIndex + 1, end) +
      markdownText.substring(end + endIndex + 1);
    setMarkdownText(textWithoutCode);

    // 커서 위치 조정
    setTimeout(() => {
      textareaRef.selectionStart = startIndex;
      textareaRef.selectionEnd = end - 1;
      textareaRef.focus();
    }, 0);
    return;
  }

  // 선택된 텍스트가 있는 경우
  if (start !== end) {
    const codeText = `\`${selectedText}\``;
    const newText =
      markdownText.substring(0, start) + codeText + markdownText.substring(end);
    setMarkdownText(newText);

    // 커서 위치 조정 (선택된 텍스트 유지)
    setTimeout(() => {
      textareaRef.selectionStart = start + 1;
      textareaRef.selectionEnd = end + 1;
      textareaRef.focus();
    }, 0);
  } else {
    // 선택된 텍스트가 없는 경우
    const codeTemplate = '`코드`';
    const newText =
      markdownText.substring(0, start) +
      codeTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // '코드' 부분을 자동으로 선택
    setTimeout(() => {
      textareaRef.selectionStart = start + 1;
      textareaRef.selectionEnd = start + 3;
      textareaRef.focus();
    }, 0);
  }
};

export function InlineCodeButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleInlineCode(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Inline Code'>
      <Code size={18} />
    </ToolbarButton>
  );
}
