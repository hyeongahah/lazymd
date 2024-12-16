import { Italic } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// Italic 파싱 함수
export const parseItalic = (text: string) => {
  if (text.startsWith('*') && text.endsWith('*') && !text.startsWith('**')) {
    return {
      type: 'element',
      tagName: 'em',
      properties: {},
      children: [
        {
          type: 'text',
          value: text.slice(1, -1),
        },
      ],
    };
  }
  return null;
};

// 현재 선택 영역이 이탤릭체인지 확인하는 함수
const isItalicText = (
  text: string,
  start: number,
  end: number
): { isItalic: boolean; italicStart: number; italicEnd: number } => {
  // 현재 위치에서 앞뒤로 텍스트를 검사
  let textBefore = text.substring(0, start);
  let textAfter = text.substring(end);

  // 가장 가까운 * 위치 찾기
  let startIndex = textBefore.lastIndexOf('*');
  let endIndex = textAfter.indexOf('*');

  if (startIndex !== -1 && endIndex !== -1) {
    // 실제 이탤릭 텍스트의 시작과 끝 위치
    const italicStart = startIndex;
    const italicEnd = end + endIndex + 1;

    // 현재 선택 영역이 이탤릭 마커 안에 있는지 확인
    return {
      isItalic: true,
      italicStart,
      italicEnd,
    };
  }

  return { isItalic: false, italicStart: -1, italicEnd: -1 };
};

// Italic 처리 핸들러
export const handleItalic = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  // 현재 선택 영역이 이탤릭체인지 확인
  const { isItalic, italicStart, italicEnd } = isItalicText(
    markdownText,
    start,
    end
  );

  if (isItalic) {
    // 이탤릭체 제거
    const textWithoutItalic =
      markdownText.substring(0, italicStart) +
      markdownText.substring(italicStart + 1, italicEnd - 1) +
      markdownText.substring(italicEnd);
    setMarkdownText(textWithoutItalic);

    // 커서 위치 조정
    setTimeout(() => {
      textareaRef.selectionStart = italicStart;
      textareaRef.selectionEnd = italicEnd - 2; // * 마커 길이만큼 뺌
      textareaRef.focus();
    }, 0);
    return;
  }

  // 선택된 텍스트가 있는 경우
  if (start !== end) {
    const italicText = `*${selectedText}*`;
    const newText =
      markdownText.substring(0, start) +
      italicText +
      markdownText.substring(end);
    setMarkdownText(newText);

    // 커서 위치 조정 (선택된 텍스트 유지)
    setTimeout(() => {
      textareaRef.selectionStart = start + 1;
      textareaRef.selectionEnd = end + 1;
      textareaRef.focus();
    }, 0);
  } else {
    // 선택된 텍스트가 없는 경우
    const italicTemplate = '*기울임체*';
    const newText =
      markdownText.substring(0, start) +
      italicTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // '기울임체' 부분을 자동으로 선택
    setTimeout(() => {
      textareaRef.selectionStart = start + 1;
      textareaRef.selectionEnd = start + 5; // '기울임체' 길이만큼 선택
      textareaRef.focus();
    }, 0);
  }
};

// Italic 버튼 컴포넌트
export function ItalicButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleItalic(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Italic'>
      <Italic size={18} />
    </ToolbarButton>
  );
}
