import { useState } from 'react';
import { useMarkdown } from '@/hooks/useMarkdown';
import styles from '@/pages/page.module.css';
import { FileUpload } from './FileUpload';
import { FileDownload } from './FileDownload';
import { MenuButtons } from './MenuButtons';
import { LazyMdIntro } from './LazyMdIntro';

export function LeftMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { markdownText } = useMarkdown();

  return (
    <div className={`${styles.leftPage} ${!isMenuOpen ? styles.closed : ''}`}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
      >
        <span className={styles.toggleIcon}>{isMenuOpen ? '◀' : '▶'}</span>
        {isMenuOpen && <span className={styles.toggleText}>메뉴 닫기</span>}
      </button>
      <div className={styles.menuContent}>
        <div className={styles.menuButtons}>
          <FileUpload />
          <FileDownload text={markdownText} />
          <MenuButtons />
          <LazyMdIntro />
        </div>
      </div>
    </div>
  );
}
