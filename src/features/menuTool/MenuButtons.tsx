import React from 'react';
import styles from '@/app/page.module.css';
import { Sun, Moon } from 'lucide-react';
import { FileDownload } from './FileDownload';
import { FileUpload } from './FileUpload';

interface MenuButtonsProps {
  mounted: boolean;
  markdownText: string;
  isDarkTheme: boolean;
  setMarkdownText: (text: string) => void;
  onToggleTheme: () => void;
}

export const MenuButtons = ({
  mounted,
  markdownText,
  isDarkTheme,
  setMarkdownText,
  onToggleTheme,
}: MenuButtonsProps) => {
  if (!mounted) return null;

  return (
    <div className={styles.menuButtons}>
      <FileDownload markdownText={markdownText} />
      <FileUpload setMarkdownText={setMarkdownText} />
      <button className={styles.menuButton} onClick={onToggleTheme}>
        {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
        {isDarkTheme ? '라이트 모드' : '다크 모드'}
      </button>
    </div>
  );
};
