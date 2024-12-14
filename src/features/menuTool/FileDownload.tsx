import { useCallback, useState } from 'react';
import styles from '@/pages/page.module.css';

interface FileDownloadProps {
  text: string;
}

export const FileDownload = ({ text }: FileDownloadProps) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const handleDownload = useCallback(() => {
    const filename = prompt('Enter file name:', 'LazyMD.md');

    if (!filename) return; // 취소하거나 빈 값인 경우

    // 파일명에 .md 확장자가 없으면 추가
    const finalFilename = filename.endsWith('.md')
      ? filename
      : `${filename}.md`;

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    a.click();
    URL.revokeObjectURL(url);
  }, [text]);

  return (
    <button className={styles.menuButton} onClick={handleDownload}>
      <span>💾</span> Save File
    </button>
  );
};
