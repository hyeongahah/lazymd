import { Highlighter } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 현재 선택 영역이 하이라이트인지 확인하는 함수
const isHighlightText = (
  text: string,
  start: number,
  end: number
): { isHighlight: boolean; highlightStart: number; highlightEnd: number } => {
  let textBefore = text.substring(0, start);
  let textAfter = text.substring(end);

  let startIndex = textBefore.lastIndexOf('==');
  let endIndex = textAfter.indexOf('==');

  if (startIndex !== -1 && endIndex !== -1) {
    const highlightStart = startIndex;
    const highlightEnd = end + endIndex + 2; // == 길이 포함

    return {
      isHighlight: true,
      highlightStart,
      highlightEnd,
    };
  }

  return { isHighlight: false, highlightStart: -1, highlightEnd: -1 };
};

// 하이라이트 처리 핸들러
export const handleHighlight = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  const { isHighlight, highlightStart, highlightEnd } = isHighlightText(
    markdownText,
    start,
    end
  );

  if (isHighlight) {
    // 하이라이트 제거
    const textWithoutHighlight =
      markdownText.substring(0, highlightStart) +
      markdownText.substring(highlightStart + 2, highlightEnd - 2) +
      markdownText.substring(highlightEnd);
    setMarkdownText(textWithoutHighlight);

    setTimeout(() => {
      textareaRef.selectionStart = highlightStart;
      textareaRef.selectionEnd = highlightEnd - 4; // == == 길이만큼 뺌
      textareaRef.focus();
    }, 0);
    return;
  }

  if (start !== end) {
    // 선택된 텍스트에 하이라이트 적용
    const highlightText = `==${selectedText}==`;
    const newText =
      markdownText.substring(0, start) +
      highlightText +
      markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      textareaRef.selectionStart = start + 2;
      textareaRef.selectionEnd = end + 2;
      textareaRef.focus();
    }, 0);
  } else {
    // 기본 템플릿 삽입
    const highlightTemplate = '==형광펜테스트==';
    const newText =
      markdownText.substring(0, start) +
      highlightTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      textareaRef.selectionStart = start + 2;
      textareaRef.selectionEnd = start + 8;
      textareaRef.focus();
    }, 0);
  }
};

export function HighlightButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleHighlight(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Highlight'>
      <Highlighter size={18} />
    </ToolbarButton>
  );
}
