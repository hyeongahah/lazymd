import { useCallback } from 'react';
import { Underline as UnderlineIcon } from 'lucide-react';
import styles from '@/app/page.module.css';

interface UnderlineProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const Underline = ({
  markdownText,
  setMarkdownText,
}: UnderlineProps) => {
  const handleUnderline = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      alert('밑줄을 적용할 텍스트를 선택해주세요.');
      return;
    }

    const beforeText = markdownText.substring(Math.max(0, start - 3), start);
    const afterText = markdownText.substring(
      end,
      Math.min(markdownText.length, end + 4)
    );
    const selectedText = markdownText.substring(start, end);

    const isUnderline = beforeText === '<u>' && afterText === '</u>';

    let newText;
    if (isUnderline) {
      newText =
        markdownText.substring(0, start - 3) +
        selectedText +
        markdownText.substring(end + 4);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 3, end - 3);
      }, 0);
    } else {
      newText =
        markdownText.substring(0, start) +
        `<u>${selectedText}</u>` +
        markdownText.substring(end);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 3, end + 3);
      }, 0);
    }

    setMarkdownText(newText);
  }, [markdownText]);

  return <UnderlineIcon size={18} onClick={handleUnderline} />;
};
