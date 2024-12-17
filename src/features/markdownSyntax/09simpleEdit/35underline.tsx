import { Underline } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 현재 선택 영역이 밑줄인지 확인하는 함수
const isUnderlineText = (
  text: string,
  start: number,
  end: number
): { isUnderline: boolean; underlineStart: number; underlineEnd: number } => {
  let textBefore = text.substring(0, start);
  let textAfter = text.substring(end);

  let startIndex = textBefore.lastIndexOf('<u>');
  let endIndex = textAfter.indexOf('</u>');

  if (startIndex !== -1 && endIndex !== -1) {
    const underlineStart = startIndex;
    const underlineEnd = end + endIndex + 4; // </u> 길이 포함

    return {
      isUnderline: true,
      underlineStart,
      underlineEnd,
    };
  }

  return { isUnderline: false, underlineStart: -1, underlineEnd: -1 };
};

// 밑줄 처리 핸들러
export const handleUnderline = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  const { isUnderline, underlineStart, underlineEnd } = isUnderlineText(
    markdownText,
    start,
    end
  );

  if (isUnderline) {
    // 밑줄 제거
    const textWithoutUnderline =
      markdownText.substring(0, underlineStart) +
      markdownText.substring(underlineStart + 3, underlineEnd - 4) +
      markdownText.substring(underlineEnd);
    setMarkdownText(textWithoutUnderline);

    setTimeout(() => {
      textareaRef.selectionStart = underlineStart;
      textareaRef.selectionEnd = underlineEnd - 7; // <u></u> 길이만큼 뺌
      textareaRef.focus();
    }, 0);
    return;
  }

  if (start !== end) {
    // 선택된 텍스트에 밑줄 적용
    const underlineText = `<u>${selectedText}</u>`;
    const newText =
      markdownText.substring(0, start) +
      underlineText +
      markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      textareaRef.selectionStart = start + 3;
      textareaRef.selectionEnd = end + 3;
      textareaRef.focus();
    }, 0);
  } else {
    // 기본 템플릿 삽입
    const underlineTemplate = '<u>밑줄테스트</u>';
    const newText =
      markdownText.substring(0, start) +
      underlineTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      textareaRef.selectionStart = start + 3;
      textareaRef.selectionEnd = start + 8;
      textareaRef.focus();
    }, 0);
  }
};

export function UnderlineButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleUnderline(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Underline'>
      <Underline size={18} />
    </ToolbarButton>
  );
}
