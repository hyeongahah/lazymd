import React from 'react';
import { FileUpload } from './FileUpload';
import { FileDownload } from './FileDownload';
import { ThemeToggle } from './ThemeToggle';
import styles from './styles.module.css';
import { useMarkdown } from '@/hooks/useMarkdown';

export function MenuButtons() {
  const { markdownText } = useMarkdown();

  return (
    <div className={styles.menuButtons}>
      <FileUpload />
      <FileDownload text={markdownText} />
      <ThemeToggle />
    </div>
  );
}
