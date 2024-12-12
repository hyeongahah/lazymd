import React, { useCallback } from 'react';
import styles from '@/app/page.module.css';
import { Download } from 'lucide-react';

interface FileDownloadProps {
  markdownText: string;
}

export const FileDownload = ({ markdownText }: FileDownloadProps) => {
  const handleFileDownload = useCallback(() => {
    const filename = prompt('파일 이름을 입력하세요 (.md)', 'markdown.md');
    if (!filename) return;

    const finalFilename = filename.endsWith('.md')
      ? filename
      : `${filename}.md`;

    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdownText]);

  return (
    <button className={styles.menuButton} onClick={handleFileDownload}>
      <Download size={18} />
      파일로 저장
    </button>
  );
};
