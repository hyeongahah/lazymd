import { Image } from 'lucide-react';
import { ToolbarButton } from '@/components/Toolbar/ToolbarButton';
import { useMarkdown } from '@/hooks/useMarkdown';

// 인라인 이미지 처리 핸들러
export const handleInlineImage = (
  textareaRef: HTMLTextAreaElement,
  markdownText: string,
  setMarkdownText: (text: string) => void
) => {
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;
  const selectedText = markdownText.substring(start, end);

  // 현재 선택 영역이 이미 이미지인지 확인
  const imageRegex = /^!\[(.*?)\]\((.*?)\)$/;
  const isImage = imageRegex.test(selectedText);

  if (isImage) {
    // 이미지 마크다운 제거하고 alt 텍스트만 남기기
    const altText = selectedText.match(imageRegex)![1];
    const newText =
      markdownText.substring(0, start) + altText + markdownText.substring(end);
    setMarkdownText(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textareaRef.selectionStart = start;
      textareaRef.selectionEnd = start + altText.length;
      textareaRef.focus();
    }, 0);
    return;
  }

  // 선택된 텍스트가 있는 경우
  if (start !== end) {
    // URL 형식인지 확인
    const isValidURL = /^https?:\/\/[^\s]+$/.test(selectedText);
    if (isValidURL) {
      // URL이 선택된 경우 이미지 설명 입력을 위한 템플릿
      const imageTemplate = `![이미지 설명](${selectedText})`;
      const newText =
        markdownText.substring(0, start) +
        imageTemplate +
        markdownText.substring(end);
      setMarkdownText(newText);

      // 이미지 설명 부분 선택
      setTimeout(() => {
        textareaRef.selectionStart = start + 2;
        textareaRef.selectionEnd = start + 7;
        textareaRef.focus();
      }, 0);
    } else {
      // 일반 텍스트가 선택된 경우 URL 입력을 위한 템플릿
      const imageTemplate = `![${selectedText}](이미지URL)`;
      const newText =
        markdownText.substring(0, start) +
        imageTemplate +
        markdownText.substring(end);
      setMarkdownText(newText);

      // URL 부분 선택
      setTimeout(() => {
        textareaRef.selectionStart = start + selectedText.length + 3;
        textareaRef.selectionEnd = start + selectedText.length + 9;
        textareaRef.focus();
      }, 0);
    }
  } else {
    // 선택된 텍스트가 없는 경우
    const imageTemplate = '![이미지 설명](이미지URL)';
    const newText =
      markdownText.substring(0, start) +
      imageTemplate +
      markdownText.substring(end);
    setMarkdownText(newText);

    // 이미지 설명 부분 선택
    setTimeout(() => {
      textareaRef.selectionStart = start + 2;
      textareaRef.selectionEnd = start + 7;
      textareaRef.focus();
    }, 0);
  }
};

export function InlineImageButton() {
  const { markdownText, setMarkdownText } = useMarkdown();

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      handleInlineImage(textarea, markdownText, setMarkdownText);
    }
  };

  return (
    <ToolbarButton onClick={handleClick} title='Insert Image'>
      <Image size={18} />
    </ToolbarButton>
  );
}
