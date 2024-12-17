import { Underline } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 언더라인 처리 핸들러
export const handleUnderline = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  // 현재 선택 영역이 이미 언더라인인지 확인
  const textBefore = markdownText.substring(0, start);
  const textAfter = markdownText.substring(end);
  const underlineRegex = /<u>(.*?)<\/u>/;
  const isUnderline = underlineRegex.test(selectedText);

  if (isUnderline) {
    // 언더라인 제거
    const plainText = selectedText.replace(/<\/?u>/g, '');
    const newText =
      markdownText.substring(0, start) +
      plainText +
      markdownText.substring(end);
    setMarkdownText(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textareaRef.selectionStart = start;
      textareaRef.selectionEnd = start + plainText.length;
      textareaRef.focus();
    }, 0);
    return;
  }

  // 선택된 텍스트가 있는 경우
  if (start !== end) {
    const underlineText = `<u>${selectedText}</u>`;
    const newText =
      markdownText.substring(0, start) +
      underlineText +
      markdownText.substring(end);
    setMarkdownText(newText);

    // 선택 영역 유지
    setTimeout(() => {
      textareaRef.selectionStart = start;
      textareaRef.selectionEnd = end + 7; // <u></u> 태그 길이만큼 조정
      textareaRef.focus();
    }, 0);
  } else {
    // 선택된 텍스트가 없는 경우
    const underlineTemplate = '<u>텍스트</u>';
    const newText =
      markdownText.substring(0, start) +
      underlineTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // '텍스트' 부분을 자동으로 선택
    setTimeout(() => {
      textareaRef.selectionStart = start + 3;
      textareaRef.selectionEnd = start + 6;
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
