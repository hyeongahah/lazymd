import { Link } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// URL 링크 처리 핸들러
export const handleURLLink = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  // 현재 선택 영역이 이미 URL 링크인지 확인
  const urlRegex = /^<(https?:\/\/[^\s>]+)>$/;
  const isURL = urlRegex.test(selectedText);

  if (isURL) {
    // URL 링크다운 제거하고 URL만 남기기
    const url = selectedText.match(urlRegex)![1];
    const newText =
      markdownText.substring(0, start) + url + markdownText.substring(end);
    setMarkdownText(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textareaRef.selectionStart = start;
      textareaRef.selectionEnd = start + url.length;
      textareaRef.focus();
    }, 0);
    return;
  }

  // 선택된 텍스트가 있는 경우
  if (start !== end) {
    // URL 형식인지 확인
    const isValidURL = /^https?:\/\/[^\s]+$/.test(selectedText);
    if (isValidURL) {
      // URL이 선택된 경우 <URL> 형식으로 변환
      const urlTemplate = `<${selectedText}>`;
      const newText =
        markdownText.substring(0, start) +
        urlTemplate +
        markdownText.substring(end);
      setMarkdownText(newText);

      // 전체 URL 선택
      setTimeout(() => {
        textareaRef.selectionStart = start;
        textareaRef.selectionEnd = start + urlTemplate.length;
        textareaRef.focus();
      }, 0);
    } else {
      // 일반 텍스트가 선택된 경우 URL 입력을 위한 템플릿
      const urlTemplate = '<URL>';
      const newText =
        markdownText.substring(0, start) +
        urlTemplate +
        markdownText.substring(end);
      setMarkdownText(newText);

      // URL 부분 선택
      setTimeout(() => {
        textareaRef.selectionStart = start + 1;
        textareaRef.selectionEnd = start + 4;
        textareaRef.focus();
      }, 0);
    }
  } else {
    // 선택된 텍스트가 없는 경우
    const urlTemplate = '<URL>';
    const newText =
      markdownText.substring(0, start) +
      urlTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // URL 부분 선택
    setTimeout(() => {
      textareaRef.selectionStart = start + 1;
      textareaRef.selectionEnd = start + 4;
      textareaRef.focus();
    }, 0);
  }
};

export function URLLinkButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleURLLink(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Insert URL Link'>
      <Link size={18} />
    </ToolbarButton>
  );
}
