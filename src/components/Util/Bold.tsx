import { useCallback } from 'react';
import { Bold as BoldIcon } from 'lucide-react';
import styles from '@/app/page.module.css';

interface BoldProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const Bold = ({ markdownText, setMarkdownText }: BoldProps) => {
  const handleBold = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      alert('볼드체를 적용할 텍스트를 선택해주세요.');
      return;
    }

    const beforeText = markdownText.substring(Math.max(0, start - 2), start);
    const afterText = markdownText.substring(
      end,
      Math.min(markdownText.length, end + 2)
    );
    const selectedText = markdownText.substring(start, end);

    const isBold = beforeText === '**' && afterText === '**';

    let newText;
    if (isBold) {
      newText =
        markdownText.substring(0, start - 2) +
        selectedText +
        markdownText.substring(end + 2);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 2, end - 2);
      }, 0);
    } else {
      newText =
        markdownText.substring(0, start) +
        `**${selectedText}**` +
        markdownText.substring(end);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, end + 2);
      }, 0);
    }

    setMarkdownText(newText);
  }, [markdownText]);

  return <BoldIcon size={18} onClick={handleBold} />;
};
