import { Link } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 인라인 링크 처리 핸들러
export const handleInlineLink = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  // 현재 선택 영역이 이미 링크인지 확인
  const textBefore = markdownText.substring(0, start);
  const textAfter = markdownText.substring(end);
  const linkRegex = /\[(.*?)\]\((.*?)\)/;
  const isLink = linkRegex.test(selectedText);

  if (isLink) {
    // 링크 제거하고 텍스트만 남기기
    const linkText = selectedText.match(linkRegex)![1];
    const newText =
      markdownText.substring(0, start) + linkText + markdownText.substring(end);
    setMarkdownText(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textareaRef.selectionStart = start;
      textareaRef.selectionEnd = start + linkText.length;
      textareaRef.focus();
    }, 0);
    return;
  }

  // 선택된 텍스트가 있는 경우
  if (start !== end) {
    const linkTemplate = `[${selectedText}](url)`;
    const newText =
      markdownText.substring(0, start) +
      linkTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // url 부분을 자동으로 선택
    const urlStart = start + selectedText.length + 2; // [text]( 다음 위치
    const urlEnd = urlStart + 3; // url의 길이
    setTimeout(() => {
      textareaRef.selectionStart = urlStart;
      textareaRef.selectionEnd = urlEnd;
      textareaRef.focus();
    }, 0);
  } else {
    // 선택된 텍스트가 없는 경우
    const linkTemplate = '[텍스트](url)';
    const newText =
      markdownText.substring(0, start) +
      linkTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // '텍스트' 부분을 자동으로 선택
    setTimeout(() => {
      textareaRef.selectionStart = start + 1;
      textareaRef.selectionEnd = start + 4;
      textareaRef.focus();
    }, 0);
  }
};

export function InlineLinkButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleInlineLink(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Inline Link'>
      <Link size={18} />
    </ToolbarButton>
  );
}
