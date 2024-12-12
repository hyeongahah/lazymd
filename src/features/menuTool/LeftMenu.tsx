import React from 'react';
import styles from '@/app/page.module.css';
import { MenuButtons } from './MenuButtons';
import { LazyMdIntro } from './LazyMdIntro';

interface LeftMenuProps {
  mounted: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  markdownText: string;
  isDarkTheme: boolean;
  setMarkdownText: (text: string) => void;
  setIsDarkTheme: (isDark: boolean) => void;
  onLoad: () => void;
  onToggleTheme: () => void;
}

export const LeftMenu = ({
  mounted,
  isMenuOpen,
  setIsMenuOpen,
  markdownText,
  isDarkTheme,
  setMarkdownText,
  setIsDarkTheme,
  onLoad,
  onToggleTheme,
}: LeftMenuProps) => {
  return (
    <div className={`${styles.leftMenu} ${!isMenuOpen ? styles.closed : ''}`}>
      {mounted && (
        <button
          className={styles.toggleButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '◀' : '▶'}
        </button>
      )}
      <div className={styles.menuContent}>
        <MenuButtons
          mounted={mounted}
          markdownText={markdownText}
          isDarkTheme={isDarkTheme}
          setMarkdownText={setMarkdownText}
          onLoad={onLoad}
          onToggleTheme={onToggleTheme}
        />
        <LazyMdIntro setMarkdownText={setMarkdownText} />
      </div>
    </div>
  );
};
