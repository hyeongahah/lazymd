import React from 'react';
import styles from '@/pages/page.module.css';

interface FileDownloadProps {
  text: string;
}

export function FileDownload({ text }: FileDownloadProps) {
  const handleDownload = () => {
    const filename = prompt('파일 이름을 입력하세요:', 'document.md');
    if (!filename) return;

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
  };

  return (
    <button className={styles.menuButton} onClick={handleDownload}>
      <span>💾</span> Save File
    </button>
  );
}
