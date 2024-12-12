import { useCallback } from 'react';
import { FileX } from 'lucide-react';
import styles from '@/app/page.module.css';

interface ClearFormattingProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
}

export const ClearFormatting = ({
  markdownText,
  setMarkdownText,
}: ClearFormattingProps) => {
  const handleClearFormatting = useCallback(() => {
    const textarea = document.querySelector(
      `.${styles.editor}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    // 기존의 clearFormatting 로직...
  }, [markdownText]);

  return <FileX size={18} onClick={handleClearFormatting} />;
};
