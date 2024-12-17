import { Strikethrough } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 취소선 파싱 함수
export const parseStrikethrough = (text: string) => {
  if (text.includes('~~')) {
    return {
      type: 'element',
      tagName: 'del',
      properties: {},
      children: [
        {
          type: 'text',
          value: text.replace(/~~/g, ''),
        },
      ],
    };
  }
  return null;
};

// 현재 선택 영역이 취소선인지 확인하는 함수
const isStrikethroughText = (
  text: string,
  start: number,
  end: number
): { isStrike: boolean; strikeStart: number; strikeEnd: number } => {
  let textBefore = text.substring(0, start);
  let textAfter = text.substring(end);

  let startIndex = textBefore.lastIndexOf('~~');
  let endIndex = textAfter.indexOf('~~');

  if (startIndex !== -1 && endIndex !== -1) {
    const strikeStart = startIndex;
    const strikeEnd = end + endIndex + 2;

    return {
      isStrike: true,
      strikeStart,
      strikeEnd,
    };
  }

  return { isStrike: false, strikeStart: -1, strikeEnd: -1 };
};

// 취소선 처리 핸들러
export const handleStrikethrough = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  const { isStrike, strikeStart, strikeEnd } = isStrikethroughText(
    markdownText,
    start,
    end
  );

  if (isStrike) {
    const textWithoutStrike =
      markdownText.substring(0, strikeStart) +
      markdownText.substring(strikeStart + 2, strikeEnd - 2) +
      markdownText.substring(strikeEnd);
    setMarkdownText(textWithoutStrike);

    setTimeout(() => {
      textareaRef.selectionStart = strikeStart;
      textareaRef.selectionEnd = strikeEnd - 4;
      textareaRef.focus();
    }, 0);
    return;
  }

  if (start !== end) {
    const strikeText = `~~${selectedText}~~`;
    const newText =
      markdownText.substring(0, start) +
      strikeText +
      markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      textareaRef.selectionStart = start + 2;
      textareaRef.selectionEnd = end + 2;
      textareaRef.focus();
    }, 0);
  } else {
    const strikeTemplate = '~~취소선테스트~~';
    const newText =
      markdownText.substring(0, start) +
      strikeTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      textareaRef.selectionStart = start + 2;
      textareaRef.selectionEnd = start + 8;
      textareaRef.focus();
    }, 0);
  }
};

export function StrikethroughButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleStrikethrough(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Strikethrough'>
      <Strikethrough size={18} />
    </ToolbarButton>
  );
}
