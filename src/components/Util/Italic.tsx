import { useCallback } from 'react';
import { Italic as ItalicIcon } from 'lucide-react';
import styles from '@/app/page.module.css';

interface ItalicProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const Italic = ({ markdownText, setMarkdownText }: ItalicProps) => {
  const handleItalic = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      alert('이탤릭체를 적용할 텍스트를 선택해주세요.');
      return;
    }

    const beforeText = markdownText.substring(Math.max(0, start - 1), start);
    const afterText = markdownText.substring(
      end,
      Math.min(markdownText.length, end + 1)
    );
    const selectedText = markdownText.substring(start, end);

    const isItalic = beforeText === '*' && afterText === '*';

    let newText;
    if (isItalic) {
      newText =
        markdownText.substring(0, start - 1) +
        selectedText +
        markdownText.substring(end + 1);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 1, end - 1);
      }, 0);
    } else {
      newText =
        markdownText.substring(0, start) +
        `*${selectedText}*` +
        markdownText.substring(end);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
    }

    setMarkdownText(newText);
  }, [markdownText]);

  return <ItalicIcon size={18} onClick={handleItalic} />;
};
