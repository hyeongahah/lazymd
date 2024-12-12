import { useCallback } from 'react';
import { FileX } from 'lucide-react';
import styles from '@/app/page.module.css';
import { FormatProps } from '@/components/Util/types';

export const ClearFormatting = ({
  markdownText,
  setMarkdownText,
}: FormatProps) => {
  const handleClearFormatting = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      alert('서식을 제거할 텍스트를 선택해주세요.');
      return;
    }

    const selectedText = markdownText.substring(start, end);
    // 모든 마크다운 서식 제거
    const cleanText = selectedText
      .replace(/\*\*([^*]+)\*\*/g, '$1') // 볼드체
      .replace(/\*([^*]+)\*/g, '$1') // 이탤릭체
      .replace(/~~([^~]+)~~/g, '$1') // 취소선
      .replace(/<u>([^<]+)<\/u>/g, '$1') // 밑줄
      .replace(/<mark>([^<]+)<\/mark>/g, '$1'); // 하이라이트

    const newText =
      markdownText.substring(0, start) +
      cleanText +
      markdownText.substring(end);

    setMarkdownText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + cleanText.length);
    }, 0);
  }, [markdownText]);

  return <FileX size={18} onClick={handleClearFormatting} />;
};
