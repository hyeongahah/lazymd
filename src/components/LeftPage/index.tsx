import { useEffect, useState } from 'react';
import { useMenuStore } from '@/store/menuStore';
import { useMarkdown } from '@/hooks/useMarkdown';
import styles from '@/pages/page.module.css';
import { FileUpload } from '@/features/menuTool/FileUpload';
import { FileDownload } from '@/features/menuTool/FileDownload';
import { ThemeToggle } from '@/features/menuTool/ThemeToggle';
import { LazyMdIntro } from '@/features/menuTool/LazyMdIntro';

export function LeftPage() {
  const { isOpen, toggle } = useMenuStore();
  const { markdownText } = useMarkdown();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && isMobile) {
        toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMobile, toggle]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isMobile) {
      toggle();
    }
  };

  const menuContent = (
    <div className={styles.menuContent}>
      <div className={styles.menuButtons}>
        <FileDownload text={markdownText} />
        <FileUpload />
        <ThemeToggle />
        <LazyMdIntro />
      </div>
      {isMobile && (
        <button className={styles.modalCloseButton} onClick={toggle}>
          Close
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className={`${styles.menuModal} ${isOpen ? styles.open : ''}`}
            onClick={handleOverlayClick}
          >
            <div className={styles.menuModalContent}>{menuContent}</div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`${styles.leftPage} ${!isOpen ? styles.closed : ''}`}>
      {menuContent}
    </div>
  );
}
