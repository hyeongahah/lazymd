import { Bold } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 현재 선택 영역이 볼드체인지 확인하는 함수
const isBoldText = (
  text: string,
  start: number,
  end: number
): { isBold: boolean; boldStart: number; boldEnd: number } => {
  // 현재 위치에서 앞뒤로 텍스트를 검사
  let textBefore = text.substring(0, start);
  let textAfter = text.substring(end);

  // 가장 가까운 ** 위치 찾기
  let startIndex = textBefore.lastIndexOf('**');
  let endIndex = textAfter.indexOf('**');

  if (startIndex !== -1 && endIndex !== -1) {
    // 실제 볼드 텍스트의 시작과 끝 위치
    const boldStart = startIndex;
    const boldEnd = end + endIndex + 2;

    // 현재 선택 영역이 볼드 마커 안에 있는지 확인
    return {
      isBold: true,
      boldStart,
      boldEnd,
    };
  }

  return { isBold: false, boldStart: -1, boldEnd: -1 };
};

// Bold 처리 핸들러
export const handleBold = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  // 현재 선택 영역이 볼드체인지 확인
  const { isBold, boldStart, boldEnd } = isBoldText(markdownText, start, end);

  if (isBold) {
    // 볼드체 제거
    const textWithoutBold =
      markdownText.substring(0, boldStart) +
      markdownText.substring(boldStart + 2, boldEnd - 2) +
      markdownText.substring(boldEnd);
    setMarkdownText(textWithoutBold);

    // 커서 위치 조정
    setTimeout(() => {
      textareaRef.selectionStart = boldStart;
      textareaRef.selectionEnd = boldEnd - 4; // ** 마커 길이만큼 뺌
      textareaRef.focus();
    }, 0);
    return;
  }

  // 선택된 텍스트가 있는 경우
  if (start !== end) {
    const boldText = `**${selectedText}**`;
    const newText =
      markdownText.substring(0, start) + boldText + markdownText.substring(end);
    setMarkdownText(newText);

    // 커서 위치 조정 (선택된 텍스트 유지)
    setTimeout(() => {
      textareaRef.selectionStart = start + 2;
      textareaRef.selectionEnd = end + 2;
      textareaRef.focus();
    }, 0);
  } else {
    // 선택된 텍스트가 없는 경우
    const boldTemplate = '**굵은테스트**';
    const newText =
      markdownText.substring(0, start) +
      boldTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // '굵은테스트' 부분을 자동으로 선택
    setTimeout(() => {
      textareaRef.selectionStart = start + 2;
      textareaRef.selectionEnd = start + 7; // '굵은테스트' 길이만큼 선택
      textareaRef.focus();
    }, 0);
  }
};

// Bold 버튼 컴포넌트
export function BoldButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleBold(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Bold'>
      <Bold size={18} />
    </ToolbarButton>
  );
}
