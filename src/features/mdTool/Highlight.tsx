import { useCallback } from 'react';
import { Pen } from 'lucide-react';
import styles from '@/app/page.module.css';

interface HighlightProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const Highlight = ({
  markdownText,
  setMarkdownText,
}: HighlightProps) => {
  const handleHighlight = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      alert('하이라이트를 적용할 텍스트를 선택해주세요.');
      return;
    }

    const beforeText = markdownText.substring(Math.max(0, start - 6), start);
    const afterText = markdownText.substring(
      end,
      Math.min(markdownText.length, end + 7)
    );
    const selectedText = markdownText.substring(start, end);

    const isHighlight = beforeText === '<mark>' && afterText === '</mark>';

    let newText;
    if (isHighlight) {
      newText =
        markdownText.substring(0, start - 6) +
        selectedText +
        markdownText.substring(end + 7);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 6, end - 6);
      }, 0);
    } else {
      newText =
        markdownText.substring(0, start) +
        `<mark>${selectedText}</mark>` +
        markdownText.substring(end);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 6, end + 6);
      }, 0);
    }

    setMarkdownText(newText);
  }, [markdownText]);

  return <Pen size={18} onClick={handleHighlight} />;
};
